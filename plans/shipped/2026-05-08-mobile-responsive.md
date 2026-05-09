# Plan: Mobile Responsive

## Status
- [x] Drafting
- [x] Approved to start
- [x] In progress
- [x] Shipped
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
**Goal:** Land the mobile responsive pass — make all four pages render cleanly at phone and tablet widths.

**Shipped:**
- Two breakpoints in `css/style.css`: `@media (max-width: 768px)` (tablet) and `@media (max-width: 480px)` (phone), additive at the bottom of the file.
- Phone nav pattern: nameplate scrolls in flow (`.nav { position: absolute }`), nav links lifted to a sticky bottom bar (`.nav-links { position: fixed; bottom: 0 }` with backdrop-blur). Stacked "Bryan" / "Tuer" via `inline-flex` column.
- Work timeline mobile reflow: switched `.timeline-item` to a 2-column grid (icon column + body column) with year sitting above the role title, dot above the icon image, vertical connector line via `::before`.
- Play bento mobile reflow: 2 columns at tablet, 1 column at phone; `.span-2` and `.row-2` overrides cleared.
- Contact links stack vertically on phone via `flex-direction: column`.
- Card paddings, type sizes, and content-wrap padding shrink across breakpoints.
- Hero credit visibility on Home: heavier `text-shadow` on `.hero-credit` (desktop side-effect, intentional) and a center-aligned variant on phone above the sticky nav.
- Inner-page credit on phone: switched to static flow (`position: static`) with `margin-bottom: 64px` clearance, cream text + dark text-shadow.
- `play.html` copy edits: trimmed Music description, rewrote Video Games description (added "Fascinated by virtual worlds and how to build them"), sentence-cased Other Interests, "Current Events" → "Software and how it works", "Diners" → "Food, especially from diners", reframed sports.
- Image positioning: `style="object-position"` on `son.jpg` and `dog.jpg` to better frame faces/subjects.
- Bento grid sizing fix: `grid-template-rows: 200px 200px auto` → `grid-auto-rows: auto`; `.bento-cta { margin-top: auto }` removed. Cells now hug content; CTAs sit tight under descriptions.
- Cosmetic CSS cleanups (separate commit `f2dca32`): collapsed `padding: 18px 18px` → `padding: 18px`, removed empty `.nav-name` phone block, added comment explaining `.nav` vs `.nav-links` positioning split.
- Three split plans created: `mobile-responsive.md`, `legibility-and-motion.md`, `design-polish.md`. Sprint backlog updated with shipping order.
- Two commits pushed to `bmtuer/my-website` (`56b49ea`, `f2dca32`).

**Didn't ship / blocked:**
- Real-phone testing — only verified in browser devtools at 375×667 and ~768px. The plan calls out devtools-vs-real-phone divergence; haven't validated on a physical device yet.
- Work timeline iteration burned several attempts before the grid-based layout landed. Two false starts (absolute-positioned year, then a flex/order attempt) both produced misaligned columns before settling on `grid-template-columns: 56px 1fr`.

**Tech debt introduced:**
- Inline `style="object-position: ..."` on two `<img>` tags in `play.html`. Acceptable for one-offs; if more images need positioning, factor into CSS classes.
- `.hero-credit` text-shadow change touched the desktop styling (not strictly mobile-scoped). Functionally an improvement, but creep beyond the plan.
- `.bento-grid` row-sizing change and `.bento-cta` margin removal also touched desktop. Same shape — necessary correctness fix once mobile-driven content shifts revealed dead space, but out of plan scope.
- No `docs/systems/visual-system.md` stub yet capturing the breakpoint values. Reviewer flagged this; deferred to design-polish plan as the original mobile plan said. Worth flagging that breakpoints are now load-bearing across `css/style.css`.
- `.claude/rules/styles.md` is still empty stub — the "responsive: desktop-first, additive `@media` blocks at bottom of file" convention is now codified in the diff but not in the rules file.

**Next session's first move:**
- Mark mobile-responsive plan status "Shipped," then start `legibility-and-motion`: open `plans/active/2026-05-08-legibility-and-motion.md` and run `/preflight` against it. First piece of code work in that plan is darkening the inner-page background overlay (`.bg-wrap .hero-overlay` gradient) so cards win against the skyline.
