# Plan: Design Polish

## Status
- [x] Drafting
- [ ] Approved to start
- [ ] In progress
- [ ] Shipped
- [ ] Cancelled

## Problem
With mobile working and inner-page legibility solid, the remaining moves are opinionated polish: Play page grid lacks intentional rhythm, typographic hierarchy is too compressed, the hero photo credit deserves better treatment, and the cursor motif is wasted as a wayfinding signal. These are the "make it yours" moves — each is small individually, but they compound.

## Acceptance criteria

- [ ] **Play page bento grid:** Cards have intentional varied widths/heights (or strict equal columns — pick one and commit). Current accidental unevenness is gone.
- [ ] **Typography hierarchy:** Bigger size spread across the page (e.g. 12px / 16px / 28px / 56px). Year markers display-large; job titles heavier; company names smaller-caps with extended letter-spacing.
- [ ] **Hero credit treatment:** On Home, the photo credit is set deliberately — larger, more breathing room, treated like a caption to the photograph rather than a tucked-away footnote.
- [ ] **Cursor wayfinding:** The `_` after the active nav link is coral; the others stay teal. Reuses an existing motif as a wayfinding signal.

## Changes by area

### Pages (`*.html`)
- Add `data-active` or `aria-current="page"` to the current nav link on each page (or use an existing per-page body class to drive the styling).
- Possible markup tweaks for bento grid spans.

### Styles (`css/style.css`)
- New typography scale variables; refactor existing rules to use them.
- Play `.bento` grid CSS — `grid-template-areas` or `grid-column / grid-row` spans.
- Hero credit positioning + sizing on Home.
- Active-nav `_` color override.

### Scripts (`js/main.js`)
- None expected.

### Test plan
- Smoke each page: hierarchy reads top-to-bottom without fighting itself.
- Play page feels intentional, not accidental.
- Home credit feels like a deliberate caption.
- Active-page cursor color changes correctly across nav clicks.
- Mobile still works (re-smoke after).

## Rollback plan
CSS / minor HTML — git revert.

## Deferred (intentional cuts)
- **Dark mode.** Out of scope; would warrant its own plan.
- **Adding new content / pages.** Visual only.
- **Accessibility audit.** Worth doing but separate.
- **Component framework / build step.** Hand-written CSS stays the rule.

## System doc impact
**On ship, create `docs/systems/visual-system.md`** capturing the final state across this plan + the two preceding plans:
- Type scale (variables + applied roles)
- Color palette (CSS vars in `:root`)
- Card pattern (opacity, backdrop, padding rules)
- Motion conventions (durations, easing, stagger delay)
- Breakpoints (from mobile plan)
- Cursor wayfinding rule

## Links
- Relevant files: `index.html`, `work.html`, `play.html`, `contact.html`, `css/style.css`
- Relevant plans:
  - `plans/active/2026-05-08-mobile-responsive.md` (prerequisite)
  - `plans/active/2026-05-08-legibility-and-motion.md` (prerequisite)
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
