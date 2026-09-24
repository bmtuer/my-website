# Sprint backlog — current

Working whiteboard for the current sprint window. Items pulled from `docs/roadmap.md` that are actively being worked or slated for imminent landing.

When a sprint closes, clear this file and pull the next batch. Shipped items don't stay here — their record lives in plan files + git log.

## Sprint theme

*(Sprint cleared — Day / Night redesign shipped 2026-09-24. Next sprint to be themed when the next batch of work is queued up.)*

## Active

*(None.)*

## Blocked / carry-over (long-running)

<!-- Items waiting on external dependencies or that span multiple sprints -->

---

## Last cleared

### Sprint: Day / Night Redesign — closed 2026-09-24

Replaced the "preppy" Warm Ink look with a single-page site in two switchable looks from one set of HTML: Day (spec sheet: Geist, hairline grid, cobalt, grayscale photos) and Night (terminal visuals, plain-English copy: JetBrains Mono, amber, dithered photos). View-transition look switch that persists and follows the OS setting, sticky nav with scroll-spy, old page URLs kept as redirects, Bryan's full content pass, and a mobile pass (one-row nav, tap targets, no iOS input zoom, snapping Work cards).

Plan (in `plans/shipped/`): `2026-09-24-day-night-redesign.md`. System doc: `docs/systems/visual-system.md`.

### Sprint: Design Uplift v2 — closed 2026-09-19

Follow-up round after v1: Play page panel no longer scrolls behind the fixed nav/footer (internal scroll instead, themed scrollbar), nav scramble effect slowed down, work timeline updated with the 2026 promotion, Play page renamed to Life across the whole site with word+emoji headers dropped, nameplate got a layered-depth treatment, and the color palette moved from an arbitrary cool teal to a "Warm Ink" maroon pulled from the hero photo's own tones, paired with a Fraunces display font swapped in for more presence.

Plan (in `plans/shipped/`): `2026-09-19-design-uplift-v2.md`. System doc: `docs/systems/visual-system.md`.

### Sprint: Design Uplift v1 — closed 2026-05-08

Shipped three plans in sequence: mobile-responsive → legibility-and-motion → design-polish. All four pages now render cleanly at desktop, tablet, and phone widths; inner pages have a proper figure-vs-ground via global background dim; cards stagger in with motion; bento grid is deliberately asymmetric; typography hierarchy expanded across the type scale.

Plans (all in `plans/shipped/`): `2026-05-08-mobile-responsive.md`, `2026-05-08-legibility-and-motion.md`, `2026-05-08-design-polish.md`. System doc: `docs/systems/visual-system.md`.
