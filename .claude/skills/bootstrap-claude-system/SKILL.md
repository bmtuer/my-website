---
name: bootstrap-claude-system
description: One-shot scaffold for a doc-driven Claude Code workflow. Scans the project, interviews the user, then writes CLAUDE.md + docs/ + plans/ + .claude/rules/ + four generic slash commands (/new-plan, /session-end, /preflight, /review-diff). Use when the user wants to set up a fresh project with this system, or retrofit an existing one.
---

# Bootstrap Claude System

You are running the bootstrap for the Claude System. Your job is to scaffold a doc-driven AI-assisted development workflow into the user's project.

This skill has four phases. Run them in order. Do not skip phases. Do not batch them.

---

## Phase 1 — Scan the project (silent, ~30 seconds)

Before asking the user anything, gather what you can from the project itself. Use the tools available (Read, Glob, Grep, Bash for `git log`).

**What to collect:**

- **Stack indicators** — Read whichever of these exist: `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `Gemfile`, `composer.json`, `pom.xml`, `requirements.txt`. Note dependencies that suggest framework / role (e.g. `react` → frontend, `express` → server, `supabase` → backend-as-a-service, `electron` → desktop app).
- **Top-level directory listing** — Run `ls` (or Glob `*`) at the project root. Note directories like `src/`, `server/`, `client/`, `app/`, `lib/`, `data/`, `docs/`, `scripts/`, `tests/`, `migrations/`, `.github/`, `public/`, `assets/`, etc.
- **README** — If `README.md` exists, read the first ~50 lines. Note the project's stated purpose if any.
- **Recent activity** — Run `git log --oneline -20` if it's a git repo. Note what's been actively touched.
- **Existing conventions** — Check whether `docs/`, `plans/`, `.claude/`, or `CLAUDE.md` already exist. If yes, this is a **retrofit case** — you must NOT overwrite blindly later.
- **Source sample** — Pick 2-4 representative source files from key directories (e.g. one from `src/`, one from `server/`) and skim them to infer architecture patterns. Do this lightly — you're inferring shape, not auditing code.

**What to produce internally** (don't show the user yet):

- A one-line project description guess.
- A proposed workstream list (3-6 items, derived from directory structure + stack).
- A proposed surface / rule-module list (mapping to top-level dirs that need their own working conventions).
- A retrofit-vs-greenfield determination.
- Notes on existing conventions that should be respected.

**Stay silent during this phase.** Don't narrate the scan. The user will see your tool calls; don't add commentary.

---

## Phase 2 — Interview (5–10 questions, propose-then-confirm)

Now present what you found and ask for confirmation/correction.

**Tone:** brief, concrete, propose-then-ask. Do not ask cold open-ended questions when you have a scan-derived proposal to offer. The user reacts faster to a concrete proposal than to a blank field.

**Use the AskUserQuestion tool** for the structured questions. For the project description (which is freeform prose) use a regular chat message.

**The questions, in order:**

### Q1: Project description (chat message, not AskUserQuestion)

Open with a short summary of what you found, then propose a one-line description for CLAUDE.md.

Example:
> "Looks like this is a [React + Express + Supabase] project with surfaces in `src/`, `server/`, and `data/`. Recent commits suggest active work on [whatever git log shows].
>
> Proposed one-liner for CLAUDE.md: *'[Project Name] is a [type of project] built with [stack].'*
>
> Sound right, or want to redirect?"

Wait for the user's answer. Adopt their version (or yours if they confirm).

### Q2: Workstreams (AskUserQuestion, single-select with "edit list" path)

Present the proposed workstreams as a confirm-or-redirect question. Workstreams are how the user will tag roadmap items — they should map roughly to "areas of work" (e.g., Frontend, Backend, Data, Infra, Docs).

For a typical web app, propose something like: `Frontend, Backend, Data, Infra, Docs`. For a CLI tool, maybe `Core, CLI, Docs, Build`. Use the scan to pick something specific.

Ask: "These are the proposed workstreams. Adopt as-is, or do you want to edit?"

Options: "Adopt as proposed", "Let me edit the list".

If they pick "edit," ask in chat for the list they want.

### Q3: Surfaces / rule modules (AskUserQuestion, same shape as Q2)

Surfaces are areas of code with their own working conventions — Claude loads the matching `.claude/rules/{surface}.md` file when working in that area.

For each top-level dir that warrants its own rules (e.g., `server/`, `src/renderer/`, `data/`, `migrations/`, `tests/`), propose a surface. Don't propose more than ~6.

Ask: "These are the proposed rule modules. Each becomes a `.claude/rules/{name}.md` file Claude reads when working in that area. Adopt as-is, or edit?"

Same options as Q2.

### Q4: Hard rules (chat message, optional)

Ask in chat:
> "Are there any hard rules / non-negotiables you already know about? (E.g., 'never commit secrets', 'all migrations forward-only', 'state authority lives on the server, not the client'.)
>
> Skip if none yet — you can add them as you learn. The CLAUDE.md will have an empty 'Hard rules' section either way."

If the user provides rules, capture them verbatim. If they say skip / none / "I'll add later," scaffold the section with a `<!-- Add hard rules as you learn them -->` placeholder.

### Q5: Known traps (chat message, optional)

Ask in chat:
> "Anything you've already learned the hard way that future-you should be warned about? (Append-only list of 'don't do X, here's why' entries.)
>
> Skip if none yet."

Same handling as Q4 — verbatim if provided, placeholder if skipped.

### Q6: Slash commands (AskUserQuestion, multi-select)

Ask: "Which slash commands should I scaffold? They reference the docs structure I'm about to create."

Multi-select options:
- `/new-plan` — scaffolds a new plan file in `plans/active/` from the template (recommended)
- `/session-end` — updates the current active plan's session log
- `/preflight` — pre-work check; surfaces architectural concerns and loads relevant rules
- `/review-diff` — self-review of pending changes before commit

Default: all four selected.

### Q7: Retrofit confirmation (only if scan detected existing conventions)

If your scan found existing `docs/`, `plans/`, `.claude/`, or `CLAUDE.md`, ask in chat:
> "I found existing [list what you found]. How should I handle this?"

Present the situation specifically. Possible answers depending on what exists:
- "Integrate alongside what's there" (write new files only where slots are empty)
- "Replace [specific file] entirely" (overwrite with template)
- "Skip this — I'll integrate manually later" (don't write that file at all)

Handle each case based on what they say. **Never overwrite existing files without explicit confirmation.**

### Q8: Final confirmation (chat message)

Before scaffolding, summarize everything you're about to do:

> "About to scaffold:
> - CLAUDE.md (with description: '...', workstreams: [...], rules sections empty/filled per your answers)
> - docs/roadmap.md, docs/sprint-backlog.md, docs/architecture.md, docs/plan-template.md
> - docs/systems/README.md
> - plans/active/, plans/shipped/ (with .gitkeep)
> - .claude/rules/README.md + stub files for: [list]
> - .claude/skills/{slash-command-name}/SKILL.md for: [list]
>
> Proceed?"

Wait for go-ahead. If yes, move to Phase 3. If no, ask what to change and re-confirm.

---

## Phase 3 — Scaffold the files (silent, sequential writes)

For each file you're creating, read the corresponding template from this skill's `templates/` directory, substitute placeholders with the user's answers, and write to the target path.

**Templates live at:** `.claude/skills/bootstrap-claude-system/templates/`

**Substitutions to make in each template:**

- `{{PROJECT_DESCRIPTION}}` — the one-liner from Q1
- `{{WORKSTREAMS_LIST}}` (in roadmap.md template) — bullet list of `- [Name](#anchor) — one-line description` per workstream
- `{{WORKSTREAMS}}` (in CLAUDE.md template) — same list, simpler format. After the list, append one section header per workstream (`## {Name}\n\n### P0 — Foundation within milestone\n\n*(None.)*\n\n### P1 — Core deliverables within milestone\n\n*(None.)*\n\n### P2 — Round-out within milestone\n\n*(None.)*\n\n### P3 — Optional / decision-gated\n\n*(None.)*\n\n---\n`).
- `{{SURFACES}}` — the surface list from Q3, formatted as `- \`{name}.md\` — when editing \`{path}/**\`` per line
- `{{HARD_RULES}}` — verbatim user input from Q4, or placeholder if skipped
- `{{KNOWN_TRAPS}}` — verbatim user input from Q5, or placeholder if skipped
- `{{TODAY}}` — today's date in YYYY-MM-DD format
- `{{PROJECT_NAME}}` — derived from the directory name or stated in Q1

**Write the files in this order** (so dependent docs reference docs that already exist):

1. `CLAUDE.md` (root)
2. `docs/architecture.md`
3. `docs/roadmap.md`
4. `docs/sprint-backlog.md`
5. `docs/plan-template.md`
6. `docs/systems/README.md`
7. `plans/active/.gitkeep` and `plans/shipped/.gitkeep` (empty files)
8. `.claude/rules/README.md`
9. `.claude/rules/{surface}.md` for each surface from Q3 (stub files with section headers, no content)
10. `.claude/skills/{command}/SKILL.md` for each command selected in Q6

**Stay silent during writes.** The user will see your tool calls. Don't narrate.

**For retrofit cases:** skip any file the user said to skip in Q7. Never overwrite without explicit per-file confirmation.

---

## Phase 4 — Report + next steps (one final message)

After all files are written, send one summary message:

> "Done. Scaffolded:
>
> - CLAUDE.md
> - docs/ (roadmap, sprint-backlog, architecture, plan-template, systems/README)
> - plans/active + plans/shipped
> - .claude/rules/ (README + N stub files)
> - .claude/skills/ (N slash commands)
>
> **Next steps:**
> 1. Open CLAUDE.md and skim — adjust anything that doesn't fit.
> 2. Add your first roadmap items to docs/roadmap.md.
> 3. When ready to start work on something, run `/new-plan` to scaffold a plan file.
> 4. The bootstrap skill is no longer needed — delete `.claude/skills/bootstrap-claude-system/` whenever you want.
>
> The system is yours now. Edit anything, add slash commands as needs emerge, and let the 'self-improvement directive' in CLAUDE.md grow the rules over time."

---

## Hard rules for the bootstrap itself

- **Never overwrite existing files without explicit user confirmation.** Always check before write in retrofit cases.
- **Never invent project specifics.** If the scan didn't surface enough to propose something, ask the user instead of guessing.
- **Never lecture.** This is a one-shot scaffold, not a tutorial. Keep messages short.
- **Don't anticipate every slash command the user might want.** Scaffold the four bundled, let the user grow their own from there.
- **Hard rules + Known traps default to empty** with placeholder comments. Do not seed with generic examples like "never commit secrets" — those should come from the user's real experience, not the template.
- **Stay in the propose-then-confirm pattern.** Don't ask cold questions when you have scan data to draw from.
