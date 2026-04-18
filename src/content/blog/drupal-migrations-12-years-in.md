---
title: "Drupal migrations, 12 years in: the rules I wish I had at the start"
description: "I've been migrating content into Drupal since 2014. These are the hard won rules I follow now. Most of them I learned by breaking something in production."
date: 2026-02-04
tags: ["drupal", "engineering"]
---

I ran my first Drupal migration in 2014. It was a WordPress to Drupal 7 move for a small NGO, maybe two thousand nodes, a handful of content types. I wrote the migration in a weekend and felt like a genius.

Then we ran it in production and half the body fields came through with broken entity references. The other half had inline images pointing at paths that didn't exist anymore. The client's content editor spent two weeks fixing things by hand.

That was the first migration. I've done dozens since. Some of them were small like that one. Some were monsters: twelve years of editorial content across three databases, fourteen content types, with the newsroom publishing into the legacy system right up until cutover day.

Here are the rules I follow now. Most of them I learned the hard way.

## 1. Map the content model before you write a single plugin

I used to open the source database, look at the tables, and start writing migration plugins. Big mistake. You end up making structural decisions inside your migration code that should have been made in the content architecture phase.

Now I spend at least a full day mapping source to destination. On paper. A spreadsheet works. Every field in the source gets mapped to a field in Drupal, or it gets explicitly marked as "not migrating." No grey areas.

This also forces conversations with the client early. "You have 14 content types. Do you actually need 14? Can we merge these three?" Those conversations are ten times harder to have after you've written migration plugins for all of them.

## 2. Migrate IDs, not just content

Early on I let Drupal auto generate entity IDs during migration. Everything worked fine until we needed to run the migration a second time to pick up changes from the source system. You can't do incremental updates if you can't match source records to destination records.

Now every migration preserves the source ID, either as the Drupal entity ID (if the number ranges don't collide) or in a dedicated field. The migrate module tracks this mapping automatically through its map tables, but I've been burned enough times to always have a human readable fallback.

## 3. Run it ten times before you run it once

A migration you've only run once is a migration you don't understand. I run mine at least ten times during development. Each run on a fresh database. Each run teaches you something. Fields you forgot to map. Data that looked clean in the export but has encoding issues in practice. Taxonomy terms that exist in the source but got deleted from the destination vocab.

By the tenth run you know every edge case. You know which source records are garbage. You know exactly how long it takes. No surprises on cutover day.

## 4. Let the newsroom keep publishing

On larger migrations the source system doesn't stop just because you're building its replacement. Editors keep publishing. Content keeps changing. If your migration can only run once, you'll always be chasing a moving target.

The pattern I use now: run a full migration early. Then run incremental updates on a schedule (nightly, or more often if the content velocity is high). The migrate module supports this through its `--update` flag and high water marks. On the last engagement we had a cron job pulling diffs from the legacy CMS every four hours, right up until the DNS switch.

This also gives editors a preview of how their content looks in the new system while they're still working in the old one. That feedback loop is worth more than any spec document.

## 5. Never trust the source data

Every source database lies to you. Character encodings are wrong. Dates are in formats the documentation doesn't mention. Rich text fields have inline HTML that references assets on servers that no longer exist. Taxonomy terms have trailing whitespace that makes them look like duplicates.

I write a validation pass that runs before the actual migration. It scans every source record and flags anything that doesn't match the expected format. The output is a CSV that the client's team reviews. They fix what they can in the source system, and we handle the rest in process plugins.

This takes time up front. It saves ten times more time later.

## 6. Process plugins are the migration

When I was starting out I put all my transformation logic in the migration YAML files, chaining a dozen process plugins together in ways that were hard to read and impossible to debug.

Now I write custom process plugins for anything non trivial. Each one does one thing. Each one has a test. The YAML stays clean and readable, and when something breaks you can pinpoint exactly which transformation is at fault.

The most useful custom plugins I keep reusing: one that normalizes rich text (strips inline styles, converts absolute URLs to relative, fixes encoding), one that resolves entity references by source ID, and one that handles media migration (downloads the file, creates a media entity, returns the reference).

## 7. Plan for rollback

Every migration should be reversible. Not in theory. In practice. If you run the migration and something is wrong, you should be able to nuke the migrated content and run it again without affecting anything that was already in the destination system.

This means keeping migrated content tagged (the migrate module's map tables do this, but I also add a boolean field to migrated entities as a safety net). It means having a rollback script that's tested. It means not letting the migration modify existing content unless that's explicitly part of the plan.

On one engagement we ran the full migration, launched, and then discovered that a subset of media files had been transcoded incorrectly. Because we had rollback scripts, we were able to delete just those media entities and re-run that specific migration. Took twenty minutes instead of a weekend.

## 8. Document the cutover

The actual cutover, the day you switch from old system to new, should be a checklist. Not a plan. Not a narrative. A numbered list of commands to run, in order, with expected durations.

Mine usually look like this:

1. Put source system in read only mode
2. Run final incremental migration (expected: 12 minutes)
3. Verify record counts match expected totals
4. Run validation report, confirm zero critical flags
5. Clear all caches on destination
6. Switch DNS
7. Verify site is live
8. Remove read only mode from source (keep as archive)

Every step has an owner. Every step has a "what if this fails" contingency. The whole team rehearses it at least once on staging before we do it for real.

Boring? Absolutely. It's also the only way I've found to make cutover day uneventful, which is exactly what you want it to be.

## The meta rule

The thread running through all of this: migrations are not a technical problem. They're a data quality problem wrapped in a communication problem wrapped in a timing problem. The code is the easy part. Getting the source data clean, getting stakeholders aligned on the content model, and making sure editors can keep working throughout the process: that's where migrations succeed or fail.

Twelve years in, I'm still learning this.
