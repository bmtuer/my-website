# Plan: Legibility and Motion

## Status
- [x] Drafting
- [x] Approved to start
- [x] In progress
- [x] Shipped
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
**Goal:** Resolve inner-page legibility (cards vs busy skyline) and add subtle motion to lift perceived quality.

**Shipped:**
- Global background dim on inner pages: `.bg-wrap .hero-image` filter changed from `saturate(0.6) brightness(0.85)` to `saturate(0.45) brightness(0.55)`. Gradient overlay strengthened across all stops (cream-to-dark gradient now darker through the middle and bottom).
- Home stays bright — only `.bg-wrap` (the inner-page shared backdrop) was darkened. `.hero` (Home) untouched.
- Card opacity left frosted at 0.93 — the dim does the legibility work without erasing the frosted-glass aesthetic.
- Nameplate shrinks on inner pages: `.hero-page .nav-name { font-size: 3.5rem }` (from desktop's 5.5rem). Home keeps full size; the size contrast makes Home's nameplate feel more important by design.
- Hover on `.timeline-image`: `transform: scale(1.06)` + lifted box-shadow on hover, 0.2s ease both ways. Just the icon, not the whole card row, to avoid implying false clickability.
- Stagger fade-in: new `@keyframes fade-up` (8px translateY + opacity), applied to `.timeline-item` and `.bento-cell`. Animation delays from 0.40s through 0.80s in 80ms increments per card. Fires after the existing body fade (0.35s) so they don't fight.
- `@media (prefers-reduced-motion: reduce)` block disables the stagger for users who've opted out.
- Plan updates: locked decisions in the plan's frontmatter (background dim, card opacity, nameplate, stagger timing, hover scope).
- Mobile-responsive plan formally closed: moved `2026-05-08-mobile-responsive.md` from `plans/active/` to `plans/shipped/`, removed from sprint backlog.
- One commit pushed: `3f6bfd2 legibility and motion pass`.

**Didn't ship / blocked:**
- Nothing meaningful — all five acceptance criteria landed in one pass without iteration. Much smoother than the mobile session because this was layered on a known-good responsive layout instead of restructuring it.
- Skipped `/review-diff` at user's request before commit.

**Tech debt introduced:**
- Stagger fade-in uses `nth-child` selectors hardcoded for up to 6 cards each (`.timeline-item:nth-child(1..6)`, `.bento-cell:nth-child(1..6)`). If Work or Play ever has more than 6 entries, the later ones will fade in immediately without delay. Easy fix when needed; not blocking now.
- `docs/systems/visual-system.md` still not created — deferred to design-polish per the original plan agreement, but the dim/overlay/card-opacity decisions made in this session are now load-bearing aesthetic choices that should land in that doc when it's created.
- `.claude/rules/styles.md` rule file still empty — should eventually capture the "additive `@media` blocks at bottom" convention plus the new "motion respects `prefers-reduced-motion`" convention.

**Next session's first move:**
- Mark legibility-and-motion plan status "Shipped," move it to `plans/shipped/`, remove its sprint-backlog entry. Then start `design-polish`: open `plans/active/2026-05-08-design-polish.md` and run `/preflight` against it. First decision in that plan is whether to commit to a deliberate Play bento layout (with intentional `span` and `row` choices) vs. accepting the current cells-hug-content approach.
