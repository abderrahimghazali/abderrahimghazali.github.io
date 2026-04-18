---
title: "n8n for engineers: when a workflow graph beats a cron job"
description: "I was skeptical about visual workflow tools. Then I replaced a mess of cron jobs and glue scripts with n8n and never looked back. Here's when it makes sense and when it doesn't."
date: 2025-12-12
tags: ["automation", "engineering"]
---

I'll be honest: the first time someone showed me n8n, I closed the tab. A visual workflow builder with drag and drop nodes? That's for people who don't write code. I write code. I have cron jobs. I have shell scripts. I have a perfectly good `Makefile` that nobody else on the team understands, and that's fine because I'm the one who maintains it.

Then I joined an engagement where the ops team had forty separate processes running on a combination of cron, Zapier, a Google Sheet with IMPORTDATA formulas, and someone's personal Gmail filter. Half of them were broken. Nobody knew which ones were critical. When something failed, the failure mode was "someone notices three days later."

I rebuilt the whole thing in n8n over two weeks. It's been running for a year. I've become a convert, but a specific kind of convert. n8n is the right tool in very specific situations, and using it outside those situations is a mistake.

## When a workflow graph wins

The core insight is this: some processes are better described as graphs than as code. Specifically, processes where:

**The flow has branches.** An incoming webhook triggers different actions depending on the payload. A document gets routed to different reviewers based on its type. An email gets a different response depending on whether the sender is in the CRM. You can write this as a chain of if/else statements, but a visual graph where you can see all the branches at once is genuinely easier to reason about.

**Non-engineers need to understand it.** This was the big one for me. On the government project, the process owners were policy people, not developers. They needed to be able to look at the automation and say "yes, this matches our process" or "no, the approval step is missing." Showing them a Python script was useless. Showing them a workflow graph with named nodes got instant feedback.

**The process changes frequently.** When the business logic changes every few weeks (new approval steps, different routing rules, a new integration), editing a visual workflow is faster than editing code, deploying, and hoping you didn't break the other ten things in the same repo.

**You need an audit trail.** n8n logs every execution with full input/output data for each node. When the auditors came knocking on the government project, we could show them exactly what happened to every record, at every step, with timestamps. Building equivalent logging into custom code is possible but it's a week of work minimum.

## When code wins

n8n is not a replacement for writing software. I've seen teams try to build entire applications inside workflow tools and it always ends badly. Specifically:

**Anything with complex data transformations.** n8n has a code node where you can write JavaScript, and I use it constantly. But if your workflow is twenty code nodes strung together with one or two branching steps, you don't have a workflow. You have a poorly structured script with a pretty UI on top of it. Just write the script.

**High throughput.** n8n processes workflows sequentially by default. You can scale it, but if you're processing thousands of records per minute, you're better off with a proper queue (Redis, SQS, whatever) and worker processes. I use n8n to trigger the queue and monitor the results, but not to do the heavy lifting.

**Anything that needs version control.** This is n8n's biggest weakness. Workflows are stored as JSON in a database. You can export them, commit them to git, diff them. But diffing JSON blobs is painful compared to diffing code. On the government project we set up a nightly export to git as a safety net, but code review of workflow changes was always awkward.

## The setup I actually use

I run n8n on Docker, behind a reverse proxy, with Postgres as the backend. The key configuration decisions:

**Separate environments.** Dev, staging, production. Workflows get built in dev, tested in staging, promoted to production manually. No auto-deploy. On the government project a workflow change that looked fine in dev would have sent real emails to real citizens if we'd auto-deployed. Manual promotion is slower and safer.

**Webhook security.** Every incoming webhook gets validated. At minimum, a shared secret in a header. For anything sensitive, proper HMAC signature verification. The default n8n webhook endpoint accepts anything from anyone and this is fine for development but terrifying in production.

**Error workflows.** n8n lets you set a workflow that triggers when another workflow fails. I have one that sends a Slack message with the error details and a link to the failed execution. Simple, but it means failures are visible within seconds instead of days.

**The code node as escape hatch.** About a third of my workflow nodes are code nodes. This is fine. The visual graph handles the routing and orchestration. The code nodes handle the data transformation. Each one is small, focused, and has a comment explaining what it does.

## A real example

On the government project, the citizen-facing service accepts applications through a web form. The workflow:

1. Webhook receives form submission
2. Validate required fields (reject with error if missing)
3. Check if applicant exists in the CRM
4. Branch: new applicant goes through identity verification, existing applicant skips it
5. Create case record in the case management system
6. Route to the correct regional team based on postcode
7. Send confirmation email to the applicant
8. Log everything to the audit trail

That's eight steps. In code it would be maybe 200 lines, plus error handling, plus logging, plus the integration code for four different systems. In n8n it's a workflow that fits on one screen, where the policy team can look at it and say "yes, step 6 needs to change, the regional boundaries moved."

When the boundaries did move (twice), the change took ten minutes. That's the value proposition.

## The honest take

n8n didn't make me stop writing code. It made me stop writing glue code. The cron jobs that curl an API, transform the response, and POST it somewhere else. The scripts that poll a mailbox and route messages. The integration logic that sits between systems and slowly rots because nobody wants to maintain it.

That stuff lives in n8n now, where it's visible, logged, and editable by people who aren't me. The actual software (the APIs, the data models, the business logic that's complex enough to need tests) still lives in code. The split feels right.

If you're an engineer who's skeptical about visual workflow tools: I get it. I was too. Try rebuilding one of your uglier cron jobs in n8n and see if it clicks.
