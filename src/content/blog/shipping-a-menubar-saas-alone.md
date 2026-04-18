---
title: "Shipping a menubar SaaS alone: lessons from MRRTracker's launch"
description: "I built a macOS menubar app, launched it on Product Hunt, and hit #4 of the day. Here's what actually happened, what I'd do differently, and what I learned about building products solo."
date: 2025-11-02
tags: ["saas", "macos", "product"]
---

In September 2025 I shipped MRRTracker, a macOS menubar app that shows your MRR in real time. Stripe, Paddle, Lemon Squeezy. It hit #4 on Product Hunt on launch day. I built the whole thing alone over about six weeks, in the gaps between client work.

This is not a success story. Or maybe it is, depending on your definition. I learned a lot. Some of it was about Swift. Most of it was about everything else.

## Why a menubar app

I track MRR for a couple of side projects. I was checking the Stripe dashboard multiple times a day, which is embarrassing to admit but also extremely common among indie founders. I figured: what if the number was just there, in the menu bar, updating itself?

I looked for existing tools. There were a few, but they were either web dashboards (which defeats the purpose), or they hadn't been updated in years, or they only supported Stripe. I wanted Paddle and Lemon Squeezy too.

So I built it. The pitch was simple: "Your MRR, in your menu bar, always up to date." That clarity helped a lot later on, because I never had to explain what it does.

## The tech

Swift and SwiftUI. No Electron. No web views. Native macOS, because menubar apps need to be light. If it uses 200MB of RAM to show a number, something is wrong.

The architecture is straightforward:

- A background service polls each payment provider's API on an interval (configurable, defaults to every 5 minutes)
- The responses get normalized into a common format (each provider returns MRR differently, which was more annoying than expected)
- The menubar item shows the total, and clicking it opens a dropdown with per-provider breakdowns and a sparkline chart

The hardest technical problem was Paddle's API. Their v2 API doesn't have a direct MRR endpoint. You have to pull subscription data and calculate it yourself, handling trials, paused subscriptions, and different billing intervals. That calculation took more time than the entire Stripe integration.

Lemon Squeezy's API was the cleanest. Stripe's was the most documented. Paddle's was the most frustrating. This seems to be a universal experience based on the DMs I got after launch.

## What I'd do differently: build in public earlier

I built MRRTracker in silence for five weeks, then posted about it one week before launch. That was a mistake. The people who shipped successful Product Hunt launches told me to start posting about it from day one. Screenshots. Progress updates. Polls about which features to prioritize.

I didn't do this because I felt like the product wasn't ready to show. That was ego, not strategy. A half finished menubar app with a Stripe integration is interesting enough to get feedback on. And the feedback would have shaped the product.

The people who engaged with my pre-launch posts became my most enthusiastic upvoters on launch day. If I'd started posting six weeks earlier, I'd have had a larger group of them.

## Product Hunt: what actually happened

Launch day was November 2, a Sunday. I'd read that weekends are bad for Product Hunt launches, but I also read that the competition is lower, so you have a better chance of ranking. Both things turned out to be true.

I woke up at 5am to post. The first hour was slow. Then around 8am Pacific time the upvotes started coming. By noon I was at #4 and it felt like the whole thing was happening to someone else.

Here's the thing nobody tells you about Product Hunt: the traffic spike lasts exactly one day. I got about 3,000 visits on launch day. The next day it dropped to 200. By the end of the week it was at 50.

The upvotes and the ranking are a signal, not a distribution channel. They get you noticed. They don't get you customers. The customers came from the blog post I wrote about building it, from the tweets that people shared organically, and from being listed on a couple of "best menubar apps" roundup posts that found me because of the PH ranking.

## Pricing

I spent way too long thinking about pricing. Free tier vs paid only. Monthly vs yearly vs lifetime. In the end I went with a simple model: free for one provider, paid for multiple providers and extra features.

The thing I got right: lifetime pricing as an option alongside monthly. Indie developers (my core audience) hate subscriptions for small tools. A $29 lifetime license converts way better than $5/month, even though the math says monthly is more valuable over time. For a solo product, I'd rather have the cash now and the goodwill.

## The solo founder stuff

Building alone is fast. You don't discuss. You don't align. You just build. This is great for the first version.

Building alone is also lonely. When something breaks at midnight, there's nobody to tag. When you're stuck on a SwiftUI layout bug for two days, there's nobody to pair with. When you ship a feature and nobody notices, there's nobody to celebrate with.

I handled this by being active in a few indie maker communities. Posting updates, asking for feedback, celebrating other people's launches. It's not the same as having a cofounder, but it helps.

The biggest risk of building alone is scope. Nobody stops you from adding features. The to do list grows forever. I had to consciously kill features that would have been nice. Charts? V2. iOS companion app? V2. Windows version? Never, probably.

Shipping the smallest useful thing and then iterating is advice everyone gives and nobody follows on the first try. I didn't follow it either. I shipped with the sparkline chart, which took a week to build and which maybe 10% of users actually look at. That week could have been spent on the Paddle integration, which 40% of users asked about on launch day.

## What I learned

1. **The product is the easy part.** Six weeks of coding. Six months of marketing, support, and iteration. The ratio surprised me.

2. **Launch is the beginning.** I treated Product Hunt as the finish line. It's the starting gun.

3. **Charge money from day one.** I briefly considered launching free and charging later. Glad I didn't. Paying customers give better feedback than free users. They also complain more, but the complaints are useful.

4. **SwiftUI is good enough for menubar apps.** Not for complex desktop apps (I hit real limitations). But for something that's basically a dropdown with some text and a chart? It's fine.

5. **Solo doesn't mean alone.** I shipped every line of code myself. But the product wouldn't exist without the indie makers who gave feedback, the beta testers who found bugs, and the people who shared the launch tweet.

MRRTracker is still running. It still makes money. It's not life changing money. But it's a product I built, that people pay for, that solves a real problem. For a side project built in six weeks, I'll take it.
