# `docs/systems/` — Living references for shipped systems

This folder holds the **truth layer** for what exists today. Each file documents one system / area / feature in its current shipped state.

## Convention

- **One file per system.** `combat.md`, `auth.md`, `inventory.md`, etc. Whatever the project's natural seams are.
- **Created or updated when work ships**, not before. A system doc describes what is, not what's planned.
- **Code is ground truth; docs can drift.** When in doubt, read the code. System docs are best-effort summaries; they get out of date between updates.
- **Updated as part of the work that changes the system.** Don't ship a feature and "doc it later." The doc update is part of shipping.

## What goes in a system doc

- **Where the code lives** — file paths to the relevant modules / endpoints / components.
- **How it works today** — the actual current behavior, not the design intent.
- **Invariants** — things that must always be true (and why).
- **Known gaps / tech debt** — flagged for future work.
- **Schema** (if it has one) — current shape, not historical.

## What does NOT go here

- **Design intent / "why we built it this way" rationale.** That lives in `plans/shipped/` (the plan file is the historical record) and `docs/architecture.md` (the long-lived architectural principles).
- **Roadmapped future state.** That lives in `docs/roadmap.md`.
- **Brainstorms or PRDs.** Those live in `docs/design/` if you have one.

## Example structure for a system file

```markdown
# System Name

## What it does
One paragraph. Plain language.

## Where the code lives
- `path/to/main/module.js`
- `path/to/related/component.jsx`
- Schema: `path/to/migration.sql`

## How it works today
The actual current flow, step by step. Update when the flow changes.

## Invariants
- Things that must always be true.

## Known gaps
- Stuff flagged for future work.
```

Keep it short. A system doc that bloats past ~300 lines probably wants to split.
