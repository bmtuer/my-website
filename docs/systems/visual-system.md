# Visual System

> Canonical reference for the site's design language. Updated when work changes the system, not before.
>
> Code is ground truth — when in doubt, read `css/style.css`. This doc summarizes the load-bearing decisions so they survive between commits.

## Where the code lives

- **All visual rules:** `css/style.css` (single file, hand-written, no preprocessor, no build step)
- **Per-page markup:** `index.html`, `work.html`, `life.html`, `contact.html`
- **Page transitions + nav effects + form handling:** `js/main.js`
- **Static assets:** `assets/images/` (photos, logos), `assets/favicon.svg`

## Color palette — "Warm Ink" (as of Design Uplift v2)

Defined in `css/style.css:7-15` as CSS custom properties on `:root`:

| Variable | Value | Role |
|---|---|---|
| `--bg` | `#F5ECE0` | Cream — page background, card fill, hero credit color on photos |
| `--text` | `#241512` | Warm near-black — primary text, nameplate "Tuer" stroke |
| `--ink` | `#8A3A34` | Deep maroon — secondary text, nav links, year markers, borders, smallcaps labels |
| `--terracotta` | `#D89468` | Warm coral — nameplate "Bryan", cursor `_`, CTAs, hover accents, list bullet markers |
| `--grey` | `#9a9a9a` | Mid-grey — currently unused; available for future muted text |

`--ink` was `--teal` (`#2D6E7E`, a cool color) through Design Uplift v1. It was recolored and renamed in v2 after checking the hero photo's actual dominant colors (all warm sunset peach and near-black/maroon brick — no teal anywhere in it) — `--ink` is now pulled from the photo's own brick-shadow tones instead of being an arbitrary cool accent.

**When touching palette values:** every hardcoded RGB duplicate has to move too, not just the `:root` declarations — several rules use raw `rgba(45, 110, 126, …)` / `rgba(240, 235, 227, …)` instead of `var(--ink)` / `var(--bg)` (frosted-card shadows, scrollbar thumbs, hairline borders, the nameplate's own text-shadow). Grep the old hex/RGB triplet across `css/style.css` before considering a color change done.

Two fonts are loaded from Google Fonts (`css/style.css:2`):
- **Display and body:** `'IBM Plex Mono'` — weights 300/400/500/600 imported, one monospace font for everything except the nameplate. `--font-display` and `--font-body` both point at it. Went through two changes same day: `'Tenor Sans'` (v1) → `'Fraunces'` (early v2, a warm serif) → `'IBM Plex Mono'` (still v2, after the Fraunces pass didn't land — the user wanted an overall more "terminal-y" feel, which the site's nav-link cursor (`<span class="cursor">_</span>`) was already gesturing at). Display headings still run at weight 500 for hierarchy against 300/400 body weights, even though it's the same family as body text now.
- Also loaded but used only on the nameplate: `'Bungee'` (solid) and `'Bungee Inline'` (striped). Bungee Inline = "Bryan" filled coral. Bungee = "Tuer" outlined dark. Not monospace, not affected by the terminal-font pass — the nameplate is treated as a separate logo mark, not body/display type.

**Before changing `--font-display`/`--font-body` again:** check whether the new font's available weights actually cover what's used (`grep -n "font-weight" css/style.css` — currently needs 300/400/500/600) before writing the `@import`, and check `letter-spacing` on uppercase labels once it's live — monospace fonts are wider per character than proportional ones, so tracking values tuned for the previous font can end up looking excessive.

## Type scale

No formal scale variables. Values are inline on the rules where they apply. Effective scale (after Design Uplift v2):

| Role | Size | Font | Treatment |
|---|---|---|---|
| Nameplate (Home) | `5.5rem` | Bungee + Bungee Inline | Two-tone, tracking 0.01em, layered depth (see below) |
| Nameplate (inner pages) | `3.5rem` | Bungee + Bungee Inline | Smaller so the card is the visual lead |
| Card title | `2.8rem` | IBM Plex Mono 500 | Letter-spacing 0.04em |
| Year marker | `1.5rem` | IBM Plex Mono 500 | Ink, 0.85 opacity, letter-spacing 0.06em — temporal anchor |
| Role title | `1.35rem` | IBM Plex Mono 500 | Tight line-height 1.25 |
| Bento title | `1.25rem` | IBM Plex Mono 500 | line-height 1.2 |
| Body copy | `0.85rem` (timeline-desc), `0.84rem` (bento-desc) | IBM Plex Mono 300 | line-height 1.6, opacity 0.78 |
| Company name | `0.7rem` | IBM Plex Mono 600 | Uppercase, letter-spacing 0.22em — smallcaps treatment |
| Bento label | `0.6rem` | IBM Plex Mono 600 | Uppercase, letter-spacing 0.22em |
| Hero credit | `0.7rem` | IBM Plex Mono 400 | Uppercase, letter-spacing 0.12em, cream with text-shadow |

Pattern: display text runs at weight 500, body/utility text at 300-600 depending on role — same monospace family throughout, hierarchy comes from weight/size/color, not font contrast (unlike v1/early-v2, which paired a distinct display font against a body font).

### Nameplate depth treatment

`.nav-name-first` ("Bryan") gets an offset text-shadow — a solid ink-colored layer plus a soft black blur — and `.nav-name-last` ("Tuer") gets a matching `drop-shadow` filter, for a screen-printed poster feel. Both use **em units**, not px, so the shadow scales down proportionally at the smaller inner-page nameplate size (`3.5rem`) instead of looking oversized relative to the smaller type.

## Card pattern (frosted glass)

Three frosted-card variants exist (`.timeline-frosted`, `.contact-frosted`, `.play-frosted`) — same recipe, different containers:

```css
background: rgba(241, 231, 218, 0.93);
border: 1px solid rgba(255, 255, 255, 0.9);
box-shadow:
  0 1px 0 rgba(255, 255, 255, 1) inset,       /* top glass highlight */
  0 -1px 0 rgba(200, 190, 178, 0.6) inset,    /* bottom edge shadow */
  0 20px 80px rgba(0, 0, 0, 0.22),
  0 4px 16px rgba(138, 58, 52, 0.1);
```

Architecture note: each card uses a *separate sibling element* for the frosted background (positioned absolute, behind the content). This is intentional — `backdrop-filter` on the card itself was bleeding into child images. The frosted pane lives outside the card's compositing group.

`.content-card` (used by simpler pages) is a single-element variant with `backdrop-filter: blur(12px)` directly applied. Works because it has no child images.

**Don't bump card opacity above 0.95** — that erases the frosted-glass character. If legibility suffers, dim the background instead (see "Background overlay" below).

## Work timeline

`.timeline-track` lays out entries in a single flex row on desktop, collapsing to a vertical CSS-grid stack at the tablet breakpoint. Each entry's dot + connecting line sit unboxed above the content (`.timeline-item::before`, a hairline positioned at a fixed `top` offset); the role/company/description sit inside `.timeline-body`, which has its own subtle card (background/border, same recipe as `.bento-cell`).

**Card width and scroll (desktop).** `.timeline-item` is a fixed `flex: 0 0 260px`, not `flex: 1`. It used to be equal-width columns splitting the row, but once the display font went monospace (see below) that squeezed 5 entries into ~1/5 of the row width each, causing brutal word-wrapping. `.timeline-track` now does what its scrollbar CSS had implied since v1 but never actually did (`overflow` was `hidden`): `overflow-x: auto`, with a themed scrollbar matching `.bento-grid`'s (slim rounded thumb, no native buttons, terracotta on hover) and real drag-to-scroll wired up in `js/main.js` (mousedown/mousemove/mouseup on `.timeline-track`, adjusting `scrollLeft`) to match the `cursor: grab`/`grabbing` styling.

A **vertical single-column "log" layout** (bracketed years, `@company` handles, no per-column width constraint) was prototyped and screenshotted as an alternative — solves the wrapping problem by construction since nothing needs to share a row — but was rejected: the user wanted to keep the original horizontal-row concept, just with the space fixed, not replace it. Don't re-propose the vertical layout without cause; the horizontal-scroll fix above is the settled direction.

**Per-entry card sizing.** `.timeline-track` sets `align-items: flex-start` (not the flex default `stretch`), so `.timeline-item` sizes to its own content instead of stretching to match the tallest sibling in the row, and because `.timeline-body` has a visible boundary, a shorter entry just reads as "a smaller card" rather than "empty space inside my card." **The tablet breakpoint needs both `align-items: stretch` AND `flex: none` on its `.timeline-item` override** — `.timeline-item` becomes a CSS grid there needing full width (not shrink-to-fit, hence `stretch`), and without `flex: none` the desktop rule's `flex: 0 0 260px` would still apply as a *height* constraint once `.timeline-track` becomes `flex-direction: column` at that breakpoint (flex-basis follows the flex container's main axis, which rotates to vertical in a column layout).

## Background overlay (inner pages)

Inner pages share a fixed-position background image (`.bg-wrap`) that's globally dimmed:

```css
.bg-wrap .hero-image {
  filter: saturate(0.45) brightness(0.55);
}
.bg-wrap .hero-overlay {
  background: linear-gradient(
    to bottom,
    rgba(245, 236, 224, 0.7) 0%,
    rgba(0, 0, 0, 0.25) 30%,
    rgba(0, 0, 0, 0.35) 60%,
    rgba(0, 0, 0, 0.55) 100%
  );
}
```

The dim is what makes cards win against the busy skyline. **Home (`.hero`) is intentionally NOT dimmed** — Home gets the full atmospheric photo because the page is artistically empty and the photo is the hero.

## Bento grid (Life page)

`grid-template-columns: repeat(4, 1fr)` with `grid-template-rows: 172px 172px auto` (was `200px 200px` through Design Uplift v2's first pass — see below). Two tall rows hold the image cells (Baltimore, Family, Maya); a third auto row holds the wide text cells (Video Games, Other Interests).

Span classes:
- `.row-2` — cell spans 2 rows (used by Baltimore, Family — tall portrait/landscape)
- `.span-2` — cell spans 2 columns (used by Family, Video Games, Other Interests — wide)

The asymmetric layout is deliberate. Don't rebalance to equal-column unless the content shape changes meaningfully.

**Why the rows shrank.** The grid's own box height is fixed by flexbox (`.bento-grid` is `flex: 1` inside the height-capped `.play-card`, see "Panel containment" below) — its `auto` third row does NOT size to its content's natural height the way an unconstrained grid's `auto` row would. It only gets whatever space is left over after the two fixed rows, within the container's already-fixed total height. When the display font went monospace and needed more room per line, the two `200px` rows were leaving too little for the third, and `.bento-cell`'s content (Video Games, Other Interests) was overflowing its own box — invisible without scrolling, not just visually cramped. Fixed by shrinking the two fixed rows to `172px` (freeing space for row 3) alongside tighter `.bento-cell` padding/gap, smaller `.bento-desc`/`.bento-list` font-size and line-height, and trimmed copy. **If this recurs** (a font or copy change increases text volume again): check `scrollHeight` vs `clientHeight` on each `.bento-cell` and on `.bento-grid` itself — any nonzero delta means a cell is silently overflowing its box, which reads as content being cut off rather than a subtle scroll hint.

### Panel containment (desktop/tablet)

`.play-card` is height-capped to `calc(100vh - 240px)` on desktop and `calc(100vh - 320px)` at the tablet breakpoint — matching `.content-wrap`'s vertical padding at each breakpoint exactly, since that padding is what reserves room for the fixed `.nav` and `.hero-footer`. Without the cap, tall bento content grows the whole page past the viewport, and because nav/footer are `position: fixed` and mostly transparent, the panel visually scrolls *behind* them instead of staying framed between them.

`.bento-grid` itself scrolls internally (`overflow-y: auto`, `flex: 1`, `min-height: 0` on a `flex-direction: column` `.play-card`) for any content that doesn't fit, with a themed scrollbar — slim rounded ink thumb, no native arrow buttons, terracotta on hover (`::-webkit-scrollbar-*` plus `scrollbar-color`/`scrollbar-width` for Firefox).

At the phone breakpoint (`≤480px`) both the cap and the internal scroll are undone (`.play-card { max-height: none }`, `.bento-grid { flex: none; overflow-y: visible }`) — `.nav` goes `position: absolute` and `.hero-page .hero-footer` goes `position: static` there, so the whole page scrolls in normal flow instead, and the cap would just clip content.

## Motion

### Page transitions (`js/main.js:1-18`)

Body fades in from opacity 0 → 1 over 350ms on `DOMContentLoaded`. Internal links intercept the click, fade body to 0, then navigate after 350ms. Same-domain only.

### Card stagger fade-in (`css/style.css`, near end)

`@keyframes fade-up` (8px translateY + opacity). Applied to `.timeline-item` (Work) and `.bento-cell` (Life). Animation delays from 0.40s → 0.80s in 80ms increments per child (up to 6 children — beyond that the later cards fade in immediately, which is acceptable tech debt).

The 0.40s offset means stagger starts *after* the body fade completes (0.35s) so they don't fight visually.

### Hover states

- **Nav links** (`.nav-link:hover`) — color flips coral → ink, cursor `_` flips terracotta → ink. Visual rhyme: hover swaps the palette.
- **Nameplate** — same coral → ink swap on the "Bryan" side; "Tuer" outline shifts.
- **Timeline icons** (`.timeline-image:hover`) — `transform: scale(1.06)` + lifted box-shadow, 0.2s ease. Just the icon, not the whole card row, to avoid implying false clickability.
- **Bento links** (`.bento-link:hover`) — slight background lighten + 2px translateY lift; CTA letter-spacing widens 0.14em → 0.20em.
- **Contact buttons** — `translateY(-1px)` lift on hover; arrow `→` translates 3px right.

### Reduced-motion preference

```css
@media (prefers-reduced-motion: reduce) {
  .timeline-item,
  .bento-cell {
    opacity: 1;
    animation: none;
  }
}
```

Stagger fade-in is disabled for users who've opted out. Page transitions still fire (lighter motion, less likely to bother).

## Responsive breakpoints

Desktop-first, additive `@media (max-width: ...)` blocks at the bottom of `css/style.css`:

| Breakpoint | Block | What it covers |
|---|---|---|
| `max-width: 768px` | Tablet | Nav wraps below nameplate, smaller type, content padding shrinks, Work timeline becomes vertical 2-col grid (icon + body), Life bento becomes 2-col equal, hero credit positioning |
| `max-width: 480px` | Phone | Sticky bottom-bar nav (`.nav-links { position: fixed; bottom: 0 }` with backdrop-blur), nameplate scrolls in flow, Life bento → 1-col, contact buttons stack vertically, hero credit sits in flow above the bottom bar |

The `.nav` container itself becomes `position: absolute` on phone (so the nameplate scrolls with content) while `.nav-links` is lifted to a fixed bottom-bar — see code comment at the phone breakpoint for why.

## Wayfinding

`aria-current="page"` is set on the matching nav link in each HTML file (e.g. on `work.html`, the Work link has `aria-current="page"`). Currently used only by screen readers — there's no visual swap because adding one would compete with the existing coral→ink hover state and solve a problem that doesn't really exist on a 4-page site.

## What's not in this doc (and where to find it)

- **Architectural rationale ("why we built it this way")** → `docs/architecture.md` and `plans/shipped/2026-05-08-*.md` for the original three plans
- **Roadmap / future visual work** → `docs/roadmap.md`
- **Per-surface coding conventions** → `.claude/rules/styles.md` (currently empty stub)
