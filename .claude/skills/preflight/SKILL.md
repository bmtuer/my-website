---
name: preflight
description: Pre-flight check before starting non-trivial work. Surfaces architectural concerns, loads the relevant rule modules, and confirms the user has the right context loaded. Use when starting work on a new plan or returning to a plan after a break.
---

# /preflight

Pre-work check. Catches architectural violations and missing context before they become rework.

## What you do

### Step 1 — Identify what's about to be worked

Ask the user (chat message):

> "What are you about to work on? (Plan filename, or paste the description.)"

Wait for the user's answer.

### Step 2 — Load the relevant context

Based on the answer, read:

- The plan file itself (if they named one).
- `CLAUDE.md` — the Hard rules section and the Working lifecycle section.
- `docs/architecture.md` — relevant principles.
- `docs/systems/*.md` — the system doc(s) for the area being touched, if they exist.
- `.claude/rules/*.md` — the rule module(s) for the surface(s) being touched.
- Recent commits in the relevant area (`git log --oneline -10 -- {path}`).

Don't dump file contents at the user. Internalize the context yourself.

### Step 3 — Surface concerns

Based on what you read, present a brief preflight checklist:

> "**Preflight for [work item]:**
>
> **Context loaded:**
> - Plan: {plan file}
> - Rules: {rule files read}
> - Systems: {system docs read}
>
> **Concerns / questions before starting:**
> - [Architectural concerns that occurred to you]
> - [Things in the plan that conflict with rules or principles]
> - [Open decisions in the plan that should be resolved before coding]
>
> **What I'd touch:**
> - [Anticipated file paths]
>
> **Sound right? Anything I'm missing?**"

Be honest. If you have no concerns, say so — don't manufacture concerns to look thorough. If the plan looks coherent and the rules don't conflict, just say "Looks coherent. Ready when you are."

### Step 4 — Iterate or proceed

If the user redirects or surfaces something you missed, adjust your understanding. If they say "go," start the work.

## Hard rules

- Never skip reading the rules and system docs — that's the whole point.
- Never invent concerns. Real preflight catches real issues; fake preflight is just ceremony.
- Be concise. The point is to load context, not to write a report.
- If the plan is missing acceptance criteria or has obvious holes, flag them before starting.
