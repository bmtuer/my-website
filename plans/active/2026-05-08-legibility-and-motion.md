# Plan: Legibility and Motion

## Status
- [x] Drafting
- [x] Approved to start
- [x] In progress
- [ ] Shipped
- [ ] Cancelled

## Decisions (locked at preflight)

- **Background dim:** Global dim on inner pages (not vignette). The photo becomes atmospheric; card sits on it naturally.
- **Card opacity:** Stay frosted at 0.93. The frosted-glass effect is load-bearing aesthetic; bumping to 0.97 would erase it. Lean on global dim for legibility.
- **Nameplate on inner pages:** Shrink to ~3.5rem. Keeps Home's 5.5rem feeling more important by contrast. The "large with intentional overlap" move belongs in design-polish if pursued.
- **Stagger timing:** ~80ms between cards, offset by 0.35s so it fires after the body fade-in completes.
- **Hover scope:** `.timeline-image` only — `transform: scale(1.06)` + subtle box-shadow lift, 0.2s ease. Whole-item hover would imply false clickability.

## Problem
On Work / Play / Contact, the cream cards have to fight a busy skyline behind them — figure-vs-ground is murky and content has to work too hard. Add subtle motion (staggered card entrance, hover states) to lift perceived quality. Resolves the "make it not broken on desktop" cluster.

## Acceptance criteria

- [ ] **Inner-page background dimming:** Work / Play / Contact get a darker overlay on the hero photo (Home stays bright). Cards win against the skyline.
- [ ] **Card opacity bump:** Cream cards on inner pages are more opaque (or use a backdrop-filter blur) so text reads cleanly without fighting the photo.
- [ ] **Nameplate treatment on inner pages:** A deliberate decision is made and applied — not the default "shrunk into the corner" look. Either intentionally small, or intentionally large with overlap.
- [ ] **Staggered card entrance:** Work timeline cards and Play grid cards fade in sequentially (~80ms between cards) on page load.
- [ ] **Hover states on Work timeline icons:** Cards/icons respond on hover — slight scale, glow, or info reveal. Currently static.

## Changes by area

### Pages (`*.html`)
- Add body class hook for inner-page overlay if not already present (e.g. `body class="hero-page inner"`).

### Styles (`css/style.css`)
- Background overlay rule bound to inner-page class.
- Card opacity / `backdrop-filter` tuning.
- Nameplate sizing override on inner pages.
- `@keyframes` for fade-up + `animation-delay` per card index.
- Hover states on `.work-icon` / `.work-card` (or equivalent).

### Scripts (`js/main.js`)
- Likely none — pure CSS animations.

### Test plan
- Smoke each inner page: card text reads cleanly without squinting.
- Stagger animation feels polished, not slow — adjust delay if needed.
- Hover states feel intentional, not janky.
- Home page still feels artistically empty — inner-page changes don't bleed.
- Mobile (post-mobile-plan) still works after these changes.

## Rollback plan
CSS-only — git revert.

## Deferred (intentional cuts)
- **Bento grid for Play.** Next plan.
- **Typography hierarchy overhaul.** Next plan.
- **Cursor wayfinding (`_` color per page).** Next plan.
- **Hero credit re-treatment.** Next plan.
- **Parallax on Home.** Optional; likely deferred unless cheap to add.

## System doc impact
Once this and design-polish ship together, create `docs/systems/visual-system.md` — codify the card pattern, overlay strategy, and motion conventions established here.

## Links
- Relevant files: `work.html`, `play.html`, `contact.html`, `css/style.css`
- Relevant plans:
  - `plans/active/2026-05-08-mobile-responsive.md` (prerequisite)
  - `plans/active/2026-05-08-design-polish.md` (next)
- Sprint backlog item: `docs/sprint-backlog.md` → Active

---

## Session log

### Session 1 — 2026-05-08
**Goal:** ...

**Shipped:**
- ...

**Didn't ship / blocked:**
- ...

**Tech debt introduced:**
- ...

**Next session's first move:**
- ...
