---
name: review-diff
description: Critical self-review of the current diff. Catches issues before commit. Reads pending changes, evaluates against project rules and architecture, and surfaces concerns or improvements. Use after finishing a chunk of work and before committing.
---

# /review-diff

Self-review of the pending diff. Catches issues before they hit git history.

## What you do

### Step 1 — Read the diff

Run `git status` and `git diff` (and `git diff --staged` if there's anything staged). Read all of it.

If there's no diff, say so and stop.

### Step 2 — Load relevant context

Based on what files changed:

- Re-read `CLAUDE.md`'s Hard rules section and What NOT to do list.
- Read `.claude/rules/*.md` for any surface touched by the diff.
- Read `docs/systems/*.md` for any system the diff modifies.
- Read the plan file in `plans/active/` if one is governing this work.

### Step 3 — Evaluate the diff critically

Go through the diff and ask:

- **Does it match the plan's acceptance criteria?** If a plan exists, is the work doing what was scoped, or has it drifted?
- **Does it violate any Hard rules?** Cross-reference CLAUDE.md.
- **Does it repeat any What NOT to do trap?** Cross-reference the trap list.
- **Does it follow the surface's rule conventions?** Cross-reference `.claude/rules/`.
- **Does it introduce tech debt that should be flagged?** Comments like `// TODO`, hardcoded values, missing error handling, hacks.
- **Does it leave the system doc inconsistent with the new behavior?** If yes, the doc update is part of the work.
- **Are there obvious bugs?** Off-by-one, null checks, race conditions, leaked resources.
- **Is anything unused, half-finished, or orphaned?** Imports that aren't used, files that aren't wired up, functions that are never called.
- **Does the commit message match what changed?** (If the user has staged changes with a message.)

### Step 4 — Report

Send a structured report:

> "**Review of pending diff:**
>
> **Files changed:** {count} files, ~{N} lines added / {N} removed.
>
> **Aligns with plan?** {yes / no / drifted — explain}
>
> **Rule violations:** {none / list with file:line}
>
> **Trap repeats:** {none / list with rationale}
>
> **Concerns:**
> - {Specific issues, with file:line citations}
>
> **Suggestions:**
> - {Improvements, with rationale}
>
> **Doc updates needed before commit:**
> - {System docs / rules / CLAUDE.md sections that should update with this commit}
>
> **Looks ready to commit?** {yes / no — and what to fix first}"

If the diff is clean, say so. Don't manufacture concerns to look thorough.

### Step 5 — Optional fix-up

If the user wants, apply the suggested fixes directly. Otherwise, hand back to them.

## Hard rules

- **Be honest.** A clean diff gets a clean review. Don't invent issues.
- **Be specific.** "Concern" entries must cite file:line. Vague concerns are noise.
- **Trust framework guarantees.** Don't flag things the language / framework already handles (e.g., "what if this is null?" when the type system says it can't be).
- **Doc-update reminders are first-class.** A diff that changes behavior without updating the system doc is incomplete, not "ready."
