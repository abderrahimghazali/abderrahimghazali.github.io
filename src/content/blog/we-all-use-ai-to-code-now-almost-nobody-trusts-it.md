---
title: "We All Use AI to Code Now. Almost Nobody Trusts It."
description: "84% of developers use AI coding tools daily. Only 29% trust the output. I've been thinking about what that gap means — for the code we ship, the bugs we inherit, and the skills we're quietly losing."
date: 2026-04-13
tags: ["ai", "development", "opinion"]
image: "/blog/ai-trust-gap-cover.svg"
imageAlt: "84% adoption, 29% trust — the AI coding paradox"
---

Here's a stat that's been stuck in my head all week: **84% of developers now use AI coding tools daily. Only 29% trust what they ship.**

That's from Stack Overflow's latest survey, and it's gotten worse — trust was at 40% last year. We're adopting faster while trusting less. I can't think of another tool in the history of software where that's happened.

I use Claude Code and Cursor every day. I'd estimate 30-40% of the code in my recent projects touched an AI tool at some point. I'm writing this post partly to work through my own conflicted feelings about that.

## The number that actually scared me

CodeRabbit published their [State of AI vs Human Code Generation](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report) report a few months back. They analyzed 470 GitHub pull requests — 320 AI-co-authored, 150 human-only.

AI-generated PRs had **1.7x more issues** than human-written ones. Not just style nits. Logic errors, security flaws, performance problems. The breakdown:

| Category | AI vs Human |
|----------|-------------|
| Logic & correctness errors | 1.75x more |
| Code quality & maintainability | 1.64x more |
| Security findings | 1.57x more |
| Performance issues | 1.42x more |
| XSS vulnerabilities | 2.74x more |
| Excessive I/O operations | ~8x more |

That last one — 8x more excessive I/O — makes sense when you think about it. AI defaults to the obvious pattern. The obvious pattern is usually not the efficient one.

Meanwhile, PRs per developer are up 20% year-over-year. But incidents per PR are up 23.5%. We're shipping more code and more bugs, at the same time.

![AI coding trust gap — 84% adoption vs 29% trust, with key statistics from CodeRabbit and METR studies](/blog/ai-trust-gap-stats.svg)

## The METR study nobody wants to talk about

In mid-2025, a nonprofit called METR ran what I think is the most important AI productivity study to date. They recruited 16 experienced open-source developers — people with an average of 5 years on their specific repos — and ran a randomized controlled trial across 246 tasks.

The result: **developers were 19% slower with AI tools than without them.**

But here's the part that really got me. Before the study, developers predicted AI would make them 24% faster. After the study — after being objectively measured as slower — they still believed they were 20% faster.

We're not just using tools we don't trust. We're bad at knowing whether they're helping.

I've felt this myself. I'll spend 20 minutes prompting Claude to generate a function, reviewing the output, asking for fixes, testing it, finding an edge case, re-prompting... and at the end I'll think "that was fast." Meanwhile I probably could have written it from scratch in 10 minutes. The conversational flow of AI tools creates an illusion of speed that the actual clock doesn't support.

To be fair, the METR study was on large, mature codebases — 10+ years old, 1M+ lines of code. AI probably does help more on greenfield projects or small scripts. But most of us don't work on greenfield projects. Most of us maintain existing systems.

## Vibe coding and the knowledge gap

Andrej Karpathy coined "vibe coding" in early 2025 and it stuck because it describes something real. You describe what you want, AI generates it, you run it, you iterate. You don't necessarily understand every line.

For experienced developers, this is a calculated trade-off. I know enough to catch when the generated code is wrong — most of the time. I know what questions to ask. I know what to test.

For junior developers, I'm less sure. A recent survey found that **40% of junior developers admit to deploying AI-generated code they don't fully understand.** That's not a tool problem. That's a training problem. These are developers building their mental models of how software works, and they're outsourcing the part where the learning happens.

I've been mentoring a junior dev at work, and I've noticed he reaches for Copilot before he reaches for the docs. When something breaks, his first instinct is to paste the error back into the AI, not to read the stack trace. He's productive — his PR count is great — but when we pair on something complex, the gaps show.

I don't know what to do about this yet. Telling junior developers not to use AI tools in 2026 is like telling them not to use Google in 2010. It's not realistic. But we need to figure out what "learning to code" means when the AI handles the boilerplate.

## What I've actually changed in my workflow

I'm not quitting AI tools. They're useful and they're not going away. But I've adjusted how I use them based on what I've learned over the past year:

**I don't let AI write code I need to deeply understand.** If it's core business logic, auth flows, or anything security-critical, I write it myself. AI handles boilerplate, test scaffolds, migrations, documentation drafts. The stuff where a bug is annoying, not catastrophic.

**I review AI output like I'd review a junior developer's PR.** Line by line, with suspicion. Especially around error handling, edge cases, and anything touching I/O. The CodeRabbit data on excessive I/O and security issues is real — I've caught both in my own projects.

**I time myself honestly.** I started tracking whether the AI-assisted path actually saved time compared to writing it myself. About half the time, it does. The other half, I would've been faster going direct. The pattern: AI wins on repetitive tasks and loses on anything requiring deep context about my specific codebase.

**I still read the docs.** This is the one I have to actively resist. It's so easy to ask the AI instead of reading the documentation. But every time I read the actual docs, I learn something the AI wouldn't have told me — edge cases, deprecation warnings, design decisions that explain why the API works a certain way.

## Where this goes

The market is betting big on AI coding — $12.8 billion in 2026, up from $5.1 billion in 2024. Every IDE has an AI assistant. Every company is measuring "AI adoption" as a KPI.

But I think 2026 is going to be remembered as the year we started asking harder questions about quality. The easy narrative — "AI makes developers 10x more productive" — is colliding with data that says it makes experienced developers slower and ships more bugs.

I think the tools will get better. The models are improving fast. But I also think we're building habits now that will take years to correct. The junior developers who learned to code by vibing are going to hit a wall when they need to debug something the AI can't explain. The teams shipping 20% more PRs with 23.5% more incidents are going to spend 2027 paying down that debt.

The 84% adoption number isn't going down. The 29% trust number shouldn't go up until the tools earn it.

---

*If you're interested in the research behind this post, the [METR study](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) and [CodeRabbit report](https://www.coderabbit.ai/whitepapers/state-of-AI-vs-human-code-generation-report) are both worth reading in full.*

**Sources:**
- [Stack Overflow Developer Survey — AI Trust Gap](https://stackoverflow.blog/2026/02/18/closing-the-developer-ai-trust-gap/)
- [CodeRabbit — State of AI vs Human Code Generation](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report)
- [METR — Measuring AI Impact on Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
- [Fortune — In the Age of Vibe Coding, Trust Is the Real Bottleneck](https://fortune.com/2026/04/02/in-the-age-of-vibe-coding-trust-is-the-real-bottleneck/)
- [84% of Developers Use AI Tools — Only 29% Trust What They Ship](https://blog.stackademic.com/84-of-developers-use-ai-coding-tools-in-april-2026-only-29-trust-what-they-ship-d0cb7ec9320a)
- [JetBrains — Which AI Coding Tools Do Developers Actually Use?](https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/)
