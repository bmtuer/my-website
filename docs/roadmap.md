# my-website — Roadmap

> Single forward-looking backlog. When a thing ships, it **comes off this list**. The record lives in commit history, the plan file in `plans/shipped/`, and the relevant `docs/systems/*.md`.

## How to read this

Every roadmap item carries three orthogonal tags: **Workstream** (where the work lives — see [Workstreams](#workstreams)), **Priority** (importance within its milestone), and **Milestone** (the shipping arc it belongs to, optional).

**Priority bands (importance *within the item's milestone*):**

- **P0** — Foundation. Must exist before anything else in the milestone is buildable or shippable.
- **P1** — Core deliverable. Together with P0 items, P1 items constitute "the milestone has shipped its v1."
- **P2** — Round-out. Completes the milestone but the milestone reads as shipped without it.
- **P3** — Optional / decision-gated / speculative.

**Type tags:** `system` (plumbing) · `feature` (new user-facing capability) · `content` (more of an existing thing) · `polish` (improving what already works)

**Markers:**
- `[milestone: Name]` — the shipping arc this item belongs to. Exactly one per item; items without a milestone are Backlog.
- `[depends-on: Milestone Name]` — hard dependency on another milestone.
- `[needs-decision]` — blocked on a design call.
- `[blocked-by: ...]` — blocked on something specific.

## Workstreams

- [Design](#design) — Visual language, layout, typography, CSS work.
- [Content](#content) — Page copy, messaging, portfolio narrative.
- [Pages](#pages) — HTML structure, new pages, navigation.
- [Assets](#assets) — Images, media, optimization.
- [Deploy](#deploy) — Hosting, domain, publishing pipeline.

---

## Design

### P0 — Foundation within milestone

*(None.)*

### P1 — Core deliverables within milestone

- **Day / Night redesign** `feature` [milestone: Day / Night Redesign] — Replace Warm Ink with two switchable looks (Day spec sheet, Night terminal) from one set of HTML. Plan: `plans/active/2026-09-24-day-night-redesign.md`.

### P2 — Round-out within milestone

*(None.)*

### P3 — Optional / decision-gated

*(None.)*

---

## Content

### P0 — Foundation within milestone

*(None.)*

### P1 — Core deliverables within milestone

- **Content rework for Day / Night** `content` [milestone: Day / Night Redesign] — Bryan rewrites fields and copy (intro, quick facts, role blurbs, Life cells, meta) for the new design.

### P2 — Round-out within milestone

*(None.)*

### P3 — Optional / decision-gated

*(None.)*

---

## Pages

### P0 — Foundation within milestone

*(None.)*

### P1 — Core deliverables within milestone

*(None.)*

### P2 — Round-out within milestone

*(None.)*

### P3 — Optional / decision-gated

*(None.)*

---

## Assets

### P0 — Foundation within milestone

*(None.)*

### P1 — Core deliverables within milestone

*(None.)*

### P2 — Round-out within milestone

*(None.)*

### P3 — Optional / decision-gated

*(None.)*

---

## Deploy

### P0 — Foundation within milestone

*(None.)*

### P1 — Core deliverables within milestone

*(None.)*

### P2 — Round-out within milestone

*(None.)*

### P3 — Optional / decision-gated

*(None.)*

---
