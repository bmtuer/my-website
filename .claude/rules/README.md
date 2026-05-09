# `.claude/rules/` — Per-surface rule modules

Rules that are **not auto-loaded.** Claude reads them deliberately when entering the relevant area.

## Convention

- One file per surface. `server.md`, `client.md`, `data.md`, `migrations.md`, `tests.md`, etc. Whatever your top-level surfaces are.
- Each rule file is short, scannable, and specific to that surface — not general engineering advice.
- Loaded via `@.claude/rules/{surface}.md` reference in CLAUDE.md, or read directly with the Read tool.
- Append-only by default. When a new convention emerges, add it. Don't churn the file.

## What goes in a rule file

- **Patterns to follow** in this surface (e.g., "all migrations forward-only by default; risky migrations get a sibling .down.sql").
- **Patterns to avoid** in this surface (e.g., "don't write directly to the database from the client").
- **Conventions specific to this area** (file naming, import order, test colocation).
- **Pointers to relevant code** when something is the canonical example (e.g., "follow the pattern in `server/middleware/auth.js`").

## What does NOT go here

- **Project-wide rules.** Those live in CLAUDE.md → Hard rules.
- **Architectural rationale.** That lives in `docs/architecture.md`.
- **Per-feature plans or system docs.** Those live in `plans/` and `docs/systems/`.

## Cross-surface tasks

When a task spans surfaces (e.g., a new endpoint plus a client-side call site), Claude should load all relevant rule files before coding either side.
