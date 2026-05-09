# Plan: Design Polish

## Status
- [x] Drafting
- [x] Approved to start
- [x] In progress
- [x] Shipped
- [ ] Cancelled

## Decisions (locked at preflight)

- **Bento:** Commit to deliberate asymmetric layout. Explicit row heights, intentional `row-2` / `span-2` choices, tuned visual rhythm. Image-bearing cells (Baltimore, Family, Maya) lean tall/portrait; text-bearing cells (Video Games, Other Interests) lean wide.
- **Typography:** Light hierarchy bump only. No type-scale variables. Bump year markers from 0.75rem → ~1.5rem, role titles a bit, lean company smallcaps further (more letter-spacing). No CSS-variable refactor.
- **Hero credit:** *Dropped* — current treatment is fine. Acceptance criterion removed below.
- **Cursor wayfinding:** *Dropped mid-session.* `aria-current="page"` attributes were added to all nav links anyway for accessibility, but no visual swap.

## Acceptance criteria (revised)

The hero-credit criterion was dropped at preflight — Bryan likes the current treatment and didn't want a redesign. Three criteria remain.

## Problem
With mobile working and inner-page legibility solid, the remaining moves are opinionated polish: Play page grid lacks intentional rhythm, typographic hierarchy is too compressed, the hero photo credit deserves better treatment, and the cursor motif is wasted as a wayfinding signal. These are the "make it yours" moves — each is small individually, but they compound.

## Acceptance criteria

- [ ] **Play page bento grid:** Cards have intentional varied widths/heights (or strict equal columns — pick one and commit). Current accidental unevenness is gone.
- [ ] **Typography hierarchy:** Bigger size spread across the page (e.g. 12px / 16px / 28px / 56px). Year markers display-large; job titles heavier; company names smaller-caps with extended letter-spacing.
- [ ] ~~**Hero credit treatment:**~~ *Dropped at preflight (2026-05-08).*
- [ ] ~~**Cursor wayfinding:**~~ *Dropped mid-session (2026-05-08). The existing coral-cursor-everywhere is doing aesthetic work (visual rhyme with the nameplate, bullets, button accents); the proposed swap would compete with the existing coral→teal hover state and solve a wayfinding problem that doesn't really exist on a 4-page site. `aria-current="page"` was added to all nav links as part of this work and stays — useful for screen readers regardless.*

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
**Goal:** The "make it yours" pass — bento rhythm, typography hierarchy, hero credit treatment, cursor wayfinding.

**Shipped:**
- Bento grid restored to deliberate asymmetric layout: `grid-template-rows: 200px 200px auto`. Image cells (Baltimore, Family, Maya) anchor the top two rows; text cells (Video Games, Other Interests) run wide along the bottom. The dead-space problem that was solved earlier (by removing `margin-top: auto` on `.bento-cta`) means explicit row heights and content-flowing CTAs work together now.
- Typography hierarchy bumped: year markers promoted from 0.75rem uppercase to 1.5rem display font (Tenor Sans) with `letter-spacing: 0.06em` and 0.85 opacity — they read as temporal anchors. Role titles 1.15rem → 1.35rem with tighter line-height. Company names tightened (smaller, more letter-spacing, more bottom margin). Body description dropped 0.88rem → 0.85rem and opacity 0.85 → 0.78 to give the role more contrast.
- `aria-current="page"` added to all four nav links across `index.html`, `work.html`, `play.html`, `contact.html`. Useful for screen readers regardless of the dropped visual swap.
- One commit pushed: `47726cd design polish — bento rhythm + typography hierarchy`.

**Didn't ship / blocked:**
- **Hero credit treatment — dropped at preflight.** Bryan likes the current treatment; the "museum-label" idea wasn't worth chasing.
- **Cursor wayfinding — dropped mid-session.** Discovered during implementation that the existing `.cursor` rules already use coral default + teal-on-hover for an existing wayfinding/interaction signal. The proposed swap (teal default, coral on active) would have flipped the look in a way that competed with the existing hover state and solved a problem that doesn't exist on a 4-page site. The HTML attributes were kept (still useful for accessibility); the CSS swap was scrapped.

**Tech debt introduced:**
- None new. `docs/systems/visual-system.md` is the next piece of work — it should be created now to capture the cumulative state across all three design uplift plans.
- Eventually `.claude/rules/styles.md` should codify: desktop-first responsive (additive `@media` blocks), motion respects `prefers-reduced-motion`, frosted-glass card pattern, and the typography pattern (display font for prominent text, body font for utility text).

**Next session's first move:**
- Create `docs/systems/visual-system.md` capturing the design system as it stands. Then deploy: configure DNS for `bmtuer.com` (purchased) and host the static site somewhere free (Cloudflare Pages, Netlify, Vercel — pick one).
