---
title: "The evals-first loop: how I stop agents from regressing silently"
description: "Most teams ship LLM features like regular features and wonder why the demo stops working in week three. This is the loop I use instead."
date: 2026-03-18
tags: ["ai", "engineering", "rag"]
---

The demo went well. The stakeholder nodded. Someone said "shipping" out loud. Three weeks later, a support agent forwarded me a screenshot where our retrieval system had confidently answered a question about a product we discontinued in 2022.

That's the thing about agents: they don't fail loudly. They fail politely, and at scale.

After the fourth or fifth time living that cycle, I stopped writing agents like features and started writing them like numerical code. The rule is simple: no retrieval change, no prompt change, no model swap ships without a measurable delta against a fixed dataset. I call it evals-first, though there's nothing novel about it. It's just the discipline that research teams have had forever, ported into product engineering.

## Build the dataset before you build the thing

The mistake I used to make was writing the retriever first and the evals second. You end up with a dataset that's shaped by what your system happens to be good at. A mirror, not a ruler.

Now I do it backwards.

Before I write a line of retrieval code, I sit with whoever owns the domain. A support lead, an editor, a clinician. Together we write forty to sixty labelled examples. Real questions. Real expected behaviour. A mix of the easy, the hard, the adversarial, and the genuinely ambiguous.

Fewer than forty and your signal is noise. More than a hundred and you stop reading them.

Each row has:

- **input**: the natural language query, exactly as a user would phrase it
- **expected_refs**: which canonical documents should appear in the top-k
- **must_not_refs**: documents that would be wrong, often more diagnostic than the positives
- **rubric**: free text description of what a good answer would contain
- **tags**: category, difficulty, whether it's adversarial, so you can slice the scoreboard later

The `must_not_refs` field is the one that pays for itself ten times over. It's where you encode the failure modes the domain expert has seen before. The discontinued SKUs. The superseded clinical guidelines. The PR disasters waiting to happen.

## Scoring that actually survives contact with reality

I'm suspicious of any eval that collapses into a single number. One number hides everything that matters: whether you regressed on the adversarial slice, whether your easy cases are still easy, whether your latency just doubled.

Every eval run produces a table, not a score. Rows are slices (tags crossed with difficulty). Columns are metrics. Humans read it in fifteen seconds and know whether to ship.

For retrieval the columns are the usual suspects: recall@k, precision@k, mean reciprocal rank. For generation I lean on a judge model for rubric adherence, but I always pair it with at least one deterministic check. Contains this string. Is valid JSON. Cites a document that actually exists. Deterministic checks keep the judge honest.

## The harness, in as few lines as possible

The harness is deliberately boring. A Python script, a YAML config, a folder of case files. No framework. I have opinions about why:

1. Frameworks bake in assumptions about what an eval is. Domains vary too much.
2. The harness needs to be legible to a non-engineer who wants to add a case.
3. It has to run in under sixty seconds locally. Anything longer and people stop running it.

```python
# evals/run.py
from pathlib import Path
import yaml, json, time

cases = [yaml.safe_load(p.read_text()) for p in Path("cases").glob("*.yml")]

results = []
for case in cases:
    t0 = time.time()
    out = retriever.query(case["input"], k=8)
    results.append({
        "id": case["id"],
        "tags": case["tags"],
        "recall": score_recall(out, case),
        "forbidden_hit": any(r.id in case["must_not_refs"] for r in out),
        "latency_ms": int((time.time() - t0) * 1000),
    })

print_table(group_by(results, "tags.category"))
```

That's the whole harness. Everything interesting lives in `cases/` and in the scoring functions, which are three or four lines each.

## In CI, finally

Once the harness is stable for a week, it goes into CI as a required check. Not a gate on a single number. A gate on regression. The rule: no slice can drop more than two percentage points vs. the baseline without a human approving it. That's it. You'd be amazed how many "small" prompt edits this catches.

What makes this work is that the baseline is stored as a JSON artifact in the repo. Every change produces a diff you can read like a code review: "adversarial/deprecated-SKU recall@5 dropped from 0.91 to 0.78, +42ms latency." You ship it, or you don't, but the argument is concrete.

## What it cost, what it bought

Building out the dataset properly took roughly four working days on the last engagement. Two with the domain expert, two cleaning and labelling. The harness took an afternoon. The CI wire up took an hour. Call it a week of one person's time on a project that will run for years.

In return: the first time we swapped the embedding model, we saw the adversarial slice crater in the PR. The second time, we caught a prompt tweak that quietly broke JSON output for 12% of cases. Neither would have been visible to a human reviewer reading the diff. Both would have shipped to production, and both would have been discovered by the support team three weeks later. Politely. At scale.

The loop is small. The loop is boring. It is the single highest leverage thing I do on any agent project. Everything else (the agent graph, the retrieval strategy, the prompt library) is downstream of "can I measure whether this change made things better."

If you're shipping LLM features and you don't have this yet, build the dataset tomorrow. Skip the harness. Skip the CI. Just write forty cases. The rest will follow.
