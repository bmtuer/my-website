---
name: session-end
description: Update the active plan's session log with what shipped, what didn't, and tech debt. Use at the end of a working session before stopping. Identifies the relevant active plan from recent activity, drafts the session log entry, then writes it after user confirmation.
---

# /session-end

Captures what happened in this session into the relevant active plan's session log.

## What you do

### Step 1 — Identify the active plan

Look at `plans/active/`. List the files. If there's only one, use it. If there are multiple, ask the user which plan this session was working on:

> "Which plan was this session for?
> - {plan-1}
> - {plan-2}
> - ..."

Wait for the user's answer.

### Step 2 — Read the plan + recent activity

Read the chosen plan file. Note:
- The number of existing session log entries (so you know whether to add Session N or Session 1).
- What was outstanding from the last session ("Next session's first move").

Run `git log --oneline -20` and `git status` to see what landed since last session.

Look at the conversation history for context on what was attempted, what worked, what blocked.

### Step 3 — Draft the session log entry

Compose a draft following the existing template structure:

```markdown
### Session N — YYYY-MM-DD
**Goal:** (1 sentence — what was the session aimed at?)

**Shipped:**
- (Bullet list of what landed. Cite files when relevant. Be specific.)

**Didn't ship / blocked:**
- (Anything attempted that didn't land, with reason.)

**Tech debt introduced:**
- (Anything cut for time, hacks left in place, follow-ups noted.)

**Next session's first move:**
- (One specific concrete next step — not "keep working on X.")
```

### Step 4 — Confirm with the user

Show the draft (in the chat, NOT yet written to file):

> "Draft session log:
>
> [the draft]
>
> Looks right? Edit anything before I write it?"

Wait for confirmation. Iterate if the user wants changes.

### Step 5 — Write to the plan

Append the confirmed entry to the plan's `## Session log` section. Don't overwrite previous entries — append.

Update the plan's `## Status` checkboxes if the session changed status (e.g., now "In progress" if it was "Drafting"; now "Shipped" if the work is done).

### Step 6 — Confirm + suggest next step

> "Updated `plans/active/{plan}.md`. Next session's first move: [restate it]."

If status changed to "Shipped":
> "Status flipped to Shipped. Reminder: update or create `docs/systems/{relevant}.md`, move the plan to `plans/shipped/`, and remove the item from `docs/sprint-backlog.md` and `docs/roadmap.md`."

## Hard rules

- Never write a session log entry without showing the draft first.
- Never invent what shipped — ground the entry in git log + conversation history.
- Be specific in "Shipped" bullets — file paths, function names, component names. Vague entries are useless when re-read months later.
- The "Next session's first move" must be concrete and actionable. Not "continue working on X."
