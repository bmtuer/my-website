# Plan: Day / Night Redesign

## Status
- [ ] Drafting
- [x] Approved to start
- [x] In progress
- [ ] Shipped
- [ ] Cancelled

## Problem
The Warm Ink look (cream, maroon, coral, frosted glass, Bungee nameplate, centered everything) reads "preppy" and lifestyle-brand rather than savvy and technical. Bryan is an IC in technical support operations and wants the site to feel competent and understated, not flashy.

## Acceptance criteria
- [x] Every page renders in two looks from the same HTML: **Day** (spec sheet: Geist, graphite on off-white, hairline grid, cobalt accent) and **Night** (terminal look: JetBrains Mono, dark ground, amber accent, bordered panels, 1-bit dithered photos)
- [x] A Day / Night switch in the nav flips the look; the choice persists across pages and visits (localStorage)
- [x] First-time visitors get the look matching their OS light/dark setting
- [x] No flash of the wrong look on page load (look is set by an inline `<head>` script before first paint)
- [x] Switching animates via the View Transitions API (crossfade + home hero blocks morph into their new positions); instant switch when unsupported or with `prefers-reduced-motion`
- [x] Page-to-page navigation uses cross-document view transitions (nav stays put, content crossfades) instead of the old JS opacity fade
- [x] Night photos are amber-dithered at rest and reveal the real photo on hover/focus; Day photos are grayscale at rest and reveal color on hover/focus
- [x] Work timeline stays horizontal at every width, with drag-to-scroll on desktop
- [x] Contact form still posts to Formspree via AJAX with a toast, styled in both looks
- [x] No page scrolls horizontally at 375px width
- [x] Page titles/meta no longer call Bryan a "leader" or "team lead"

## Changes by area

### Styles (`css/style.css`)
Full rewrite. Day tokens on `:root`, Night tokens on `:root[data-look="night"]`, no-JS fallback via `prefers-color-scheme`. Look-specific structure (hero grid areas, panels vs hairlines, dither visibility) lives in `[data-look="night"]` overrides. Old palette, frosted cards, Bungee nameplate, bento grid, and fixed hero background all removed.

### Scripts (`js/main.js`)
- Add: look switch (View Transitions + localStorage), dither renderer for `canvas.dither`
- Keep: contact form AJAX + toast, timeline drag-to-scroll, nav scramble on hover
- Remove: body opacity page-fade (replaced by CSS `@view-transition`), timeline edge fades/scroll buttons (tied to the old card layout)

### Pages
All four pages share a new shell: inline look script in `<head>`, nav with the switch, `<main>`, footer. Content ported from the prototype; copy is placeholder-quality and will get a full rework from Bryan separately.

### Assets
`favicon.svg` recolored to the new palette.

## Rollback plan
Static site, one feature branch. Revert the branch's commits (or don't merge) to get Warm Ink back. No data involved.

## Deferred (intentional cuts)
- **Content/wording rework.** Bryan is rewriting fields and copy himself; this pass only fixes the "leader"/"team lead" framing and removes invented details.
- **Image weight.** Photos are 1-3 MB originals. Resizing/compressing is worth doing but is separate from the redesign.
- **Single-page layout.** The prototype was one scrolling page; this keeps the existing four pages.

## System doc impact
`docs/systems/visual-system.md` is rewritten to describe the Day/Night system.

## Links
- Relevant files: `css/style.css`, `js/main.js`, `index.html`, `work.html`, `life.html`, `contact.html`, `assets/favicon.svg`
- Prototype: artifact "bmtuer.com Day and Night" (claude.ai)
- Sprint backlog item: Day / Night Redesign

---

## Session log

### Session 1 — 2026-09-24
**Goal:** Pick a new art direction and build it.

**Shipped:**
- Four direction mockups → narrowed to A (spec sheet) + B1 (terminal look, plain words) → Day/Night prototype approved
- Full rebuild of all four pages, CSS and JS on the Day/Night system (see acceptance criteria)

**Didn't ship / blocked:**
- Content rework (Bryan's, next)

**Tech debt introduced:**
- Dither runs on every page load for every photo, even in Day look (cheap at these canvas sizes, but it still decodes full-size photos)
- Local `file://` previews can't read canvas pixels, so Night photos show in full color there; works over http(s)

**Next session's first move:**
- Bryan reviews the branch, then content rework
