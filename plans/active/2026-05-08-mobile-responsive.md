# Plan: Mobile Responsive

## Status
- [x] Drafting
- [x] Approved to start
- [x] In progress
- [ ] Shipped
- [ ] Cancelled

## Decisions (locked at preflight)

- **Breakpoints:** `max-width: 768px` (tablet) and `max-width: 480px` (phone). Desktop-first, additive at bottom of `css/style.css`.
- **Nav:** wrapped on tablet, sticky bottom-bar on phone. No hamburger. Sticky bottom-bar matches the monospace/cursor personality.
- **Work timeline:** vertical stack on phone (and likely tablet). Drop the horizontal connector line; use a vertical one between dots.
- **Play bento:** equal-weight stack — 1 column on phone, 2 columns on tablet. Don't try to preserve desktop hierarchy.
- **Hero on phone:** stack "Bryan" above "Tuer" so the nameplate stays large; don't shrink it small.
- **Card padding:** responsive (clamp or breakpoint override) — the desktop `60px 70px` is too generous for 375px screens.
- **Contact links:** stack vertically on phone for thumb reach.
- **Scramble nav effect (`js/main.js`):** leave as-is. It's mouseenter-only, won't fire on touch — graceful degradation.

## Problem
The site is currently broken on phone widths — Work timeline (5 horizontal cards) overflows, Play grid breaks down, nav doesn't collapse. Until this is fixed, half of any future visitor's experience is bad. Foundational for the rest of the design uplift; everything else assumes desktop layouts that work.

## Acceptance criteria

- [ ] All four pages render cleanly at ~375px (phone) and ~768px (tablet) widths.
- [ ] Work timeline collapses to a sensible mobile pattern — vertical stack, or horizontal-scroll with snap points. Decide which during the work.
- [ ] Play grid reflows without breaking the visual rhythm. Cards stack or move to single-column.
- [ ] Nav collapses sensibly on mobile (hamburger, or wrapped, or sticky-at-bottom — pick one and commit).
- [ ] Hero photo + nameplate scale gracefully on Home — no horizontal scroll, no awkward cropping, nameplate stays legible.

## Changes by area

### Pages (`*.html`)
- Likely minimal — most work is CSS. May need to add markup hooks (e.g. nav toggle button) depending on nav strategy.

### Styles (`css/style.css`)
- `@media` rules for the chosen breakpoints (probably `max-width: 768px` and `max-width: 480px`).
- Work timeline mobile reflow.
- Play grid mobile reflow.
- Nav mobile pattern.
- Hero scaling rules (typography, image positioning).

### Scripts (`js/main.js`)
- Only if the chosen nav pattern needs JS (hamburger toggle).

### Test plan
- Manual smoke at 375px, 768px, 1024px, and full-width in browser devtools.
- Test on a real phone before calling it done — devtools lies about touch behavior.
- Sanity-check page transitions still work after changes.

## Rollback plan
All CSS / minor HTML — git revert the commit(s).

## Deferred (intentional cuts)
- **Design polish during this plan.** Don't get distracted tuning typography or grid aesthetics — that's the next plan. The bar here is "doesn't look broken on phone."
- **Touch gestures / swipeable galleries.** Out of scope.
- **Responsive images (`srcset`).** Worth doing later but not blocking mobile basics.

## System doc impact
This is the first work that establishes a breakpoint strategy. When this ships, the breakpoint values + mobile patterns should be documented in `docs/systems/visual-system.md` (likely created during the next plan, design-polish) — flag the breakpoint decisions clearly.

## Links
- Relevant files: `index.html`, `work.html`, `play.html`, `contact.html`, `css/style.css`, possibly `js/main.js`
- Relevant plans:
  - `plans/active/2026-05-08-legibility-and-motion.md` (next)
  - `plans/active/2026-05-08-design-polish.md` (after that)
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
