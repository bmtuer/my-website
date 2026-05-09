---
name: new-plan
description: Scaffold a new plan file in plans/active/ from docs/plan-template.md. Use when the user is starting non-trivial work that warrants a plan file. Interviews briefly to populate the plan's frontmatter (problem, acceptance criteria, change areas) before writing.
---

# /new-plan

Scaffolds a new plan file at `plans/active/YYYY-MM-DD-{slug}.md` from the project's `docs/plan-template.md`.

## What you do

### Step 1 — Brief interview

Ask the user (chat message, conversational):

> "Quick interview before I scaffold the plan:
>
> 1. **What's the slug?** (3-5 words, lowercase-with-dashes — used in the filename)
> 2. **What's the problem?** (1-3 sentences — what are we solving?)
> 3. **Sprint backlog item** — is this in `docs/sprint-backlog.md` already? Roadmap item? (paste the line or say 'add it')"

Wait for the user's answers. Don't proceed without all three.

### Step 2 — Optional follow-ups

If the user's answers leave acceptance criteria unclear, ask:

> "What does 'done' look like? Give me 2-4 testable acceptance criteria."

If unclear which surfaces will be touched, ask:

> "Which surfaces will this touch? (Server, client, data, migrations, etc.)"

Skip these if the user's initial answers already covered the ground.

### Step 3 — Read the template

Read `docs/plan-template.md` from the project. This is the canonical template — use its structure exactly.

### Step 4 — Compose the plan

Substitute the user's answers into the template:
- **Title:** Replace `[Feature Name]` with the human-readable name (derived from slug).
- **Status:** Mark "Drafting" as checked.
- **Problem:** Verbatim from user.
- **Acceptance criteria:** Verbatim from user (formatted as checklist).
- **Changes by area:** Pre-populate the section headers for surfaces the user named; leave bullet content blank for them to fill.
- **Rollback / Deferred / System doc impact / Links:** Leave structure, blank content.
- **Session log → Session 1:** Set date to today (YYYY-MM-DD); leave Goal/Shipped/etc. for `/session-end` to populate.

### Step 5 — Write the file

Path: `plans/active/{TODAY}-{slug}.md` where `{TODAY}` is `YYYY-MM-DD`.

Refuse to overwrite an existing file. If the path already exists, ask the user how to proceed (rename slug? overwrite? abort?).

### Step 6 — Confirm

Send a one-line confirmation:

> "Scaffolded `plans/active/{TODAY}-{slug}.md`. Open it, fill in the rest, then start work."

Optionally remind: "Add this to `docs/sprint-backlog.md` under Active if you haven't already."

## Hard rules

- Never overwrite an existing plan file.
- Never invent acceptance criteria — get them from the user.
- Date format is always `YYYY-MM-DD`. Slug is always lowercase-with-dashes.
