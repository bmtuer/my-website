# Visual System

> Canonical reference for the site's design language. Updated when work changes the system, not before.
>
> Code is ground truth — when in doubt, read `css/style.css`. This doc summarizes the load-bearing decisions so they survive between commits.

## Where the code lives

- **All visual rules:** `css/style.css` (single file, hand-written, no preprocessor, no build step)
- **Per-page markup:** `index.html`, `work.html`, `life.html`, `contact.html`
- **Page transitions + nav effects + form handling:** `js/main.js`
- **Static assets:** `assets/images/` (photos, logos), `assets/favicon.svg`

## Color palette

Defined in `css/style.css:4-12` as CSS custom properties on `:root`:

| Variable | Value | Role |
|---|---|---|
| `--bg` | `#F0EBE3` | Cream — page background, card fill, hero credit color on photos |
| `--text` | `#1a1a1a` | Near-black — primary text, nameplate "Tuer" stroke |
| `--teal` | `#2D6E7E` | Muted teal — secondary text, nav links, year markers, borders, smallcaps labels |
| `--terracotta` | `#C8866A` | Coral — nameplate "Bryan", cursor `_`, CTAs, hover accents, list bullet markers |
| `--grey` | `#9a9a9a` | Mid-grey — currently unused; available for future muted text |

Two fonts are loaded from Google Fonts (`css/style.css:2`):
- **Display:** `'Tenor Sans'` — used for nameplate, card titles, role titles, year markers
- **Body:** `'Outfit'` — weights 300, 400, 500, 600 — everything else
- Also loaded but used only on the nameplate: `'Bungee'` (solid) and `'Bungee Inline'` (striped). Bungee Inline = "Bryan" filled coral. Bungee = "Tuer" outlined dark.

## Type scale

No formal scale variables. Values are inline on the rules where they apply. Effective scale (after the design-polish session):

| Role | Size | Font | Treatment |
|---|---|---|---|
| Nameplate (Home) | `5.5rem` | Bungee + Bungee Inline | Two-tone, tracking 0.01em |
| Nameplate (inner pages) | `3.5rem` | Bungee + Bungee Inline | Smaller so the card is the visual lead |
| Card title | `2.8rem` | Tenor Sans | Letter-spacing 0.04em |
| Year marker | `1.5rem` | Tenor Sans | Teal, 0.85 opacity, letter-spacing 0.06em — temporal anchor |
| Role title | `1.35rem` | Tenor Sans | Tight line-height 1.25 |
| Bento title | `1.25rem` | Tenor Sans | line-height 1.2 |
| Body copy | `0.85rem` (timeline-desc), `0.84rem` (bento-desc) | Outfit 300 | line-height 1.6, opacity 0.78 |
| Company name | `0.7rem` | Outfit 600 | Uppercase, letter-spacing 0.22em — smallcaps treatment |
| Bento label | `0.6rem` | Outfit 600 | Uppercase, letter-spacing 0.22em |
| Hero credit | `0.7rem` | Outfit 400 | Uppercase, letter-spacing 0.12em, cream with text-shadow |

Pattern: prominent text uses Tenor Sans (display); utility text uses Outfit body weights. The contrast between display and body is intentional.

## Card pattern (frosted glass)

Three frosted-card variants exist (`.timeline-frosted`, `.contact-frosted`, `.play-frosted`) — same recipe, different containers:

```css
background: rgba(236, 230, 221, 0.93);
border: 1px solid rgba(255, 255, 255, 0.9);
box-shadow:
  0 1px 0 rgba(255, 255, 255, 1) inset,       /* top glass highlight */
  0 -1px 0 rgba(200, 190, 178, 0.6) inset,    /* bottom edge shadow */
  0 20px 80px rgba(0, 0, 0, 0.22),
  0 4px 16px rgba(45, 110, 126, 0.1);
```

Architecture note: each card uses a *separate sibling element* for the frosted background (positioned absolute, behind the content). This is intentional — `backdrop-filter` on the card itself was bleeding into child images. The frosted pane lives outside the card's compositing group.

`.content-card` (used by simpler pages) is a single-element variant with `backdrop-filter: blur(12px)` directly applied. Works because it has no child images.

**Don't bump card opacity above 0.95** — that erases the frosted-glass character. If legibility suffers, dim the background instead (see "Background overlay" below).

## Background overlay (inner pages)

Inner pages share a fixed-position background image (`.bg-wrap`) that's globally dimmed:

```css
.bg-wrap .hero-image {
  filter: saturate(0.45) brightness(0.55);
}
.bg-wrap .hero-overlay {
  background: linear-gradient(
    to bottom,
    rgba(240, 235, 227, 0.7) 0%,
    rgba(0, 0, 0, 0.25) 30%,
    rgba(0, 0, 0, 0.35) 60%,
    rgba(0, 0, 0, 0.55) 100%
  );
}
```

The dim is what makes cards win against the busy skyline. **Home (`.hero`) is intentionally NOT dimmed** — Home gets the full atmospheric photo because the page is artistically empty and the photo is the hero.

## Bento grid (Life page)

`grid-template-columns: repeat(4, 1fr)` with `grid-template-rows: 200px 200px auto`. Two tall rows hold the image cells (Baltimore, Family, Maya); a third auto row holds the wide text cells (Video Games, Other Interests).

Span classes:
- `.row-2` — cell spans 2 rows (used by Baltimore, Family — tall portrait/landscape)
- `.span-2` — cell spans 2 columns (used by Family, Video Games, Other Interests — wide)

The asymmetric layout is deliberate. Don't rebalance to equal-column unless the content shape changes meaningfully.

## Motion

### Page transitions (`js/main.js:1-18`)

Body fades in from opacity 0 → 1 over 350ms on `DOMContentLoaded`. Internal links intercept the click, fade body to 0, then navigate after 350ms. Same-domain only.

### Card stagger fade-in (`css/style.css`, near end)

`@keyframes fade-up` (8px translateY + opacity). Applied to `.timeline-item` (Work) and `.bento-cell` (Life). Animation delays from 0.40s → 0.80s in 80ms increments per child (up to 6 children — beyond that the later cards fade in immediately, which is acceptable tech debt).

The 0.40s offset means stagger starts *after* the body fade completes (0.35s) so they don't fight visually.

### Hover states

- **Nav links** (`.nav-link:hover`) — color flips coral → teal, cursor `_` flips terracotta → teal. Visual rhyme: hover swaps the palette.
- **Nameplate** — same coral → teal swap on the "Bryan" side; "Tuer" outline shifts.
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

`aria-current="page"` is set on the matching nav link in each HTML file (e.g. on `work.html`, the Work link has `aria-current="page"`). Currently used only by screen readers — there's no visual swap because adding one would compete with the existing coral→teal hover state and solve a problem that doesn't really exist on a 4-page site.

## What's not in this doc (and where to find it)

- **Architectural rationale ("why we built it this way")** → `docs/architecture.md` and `plans/shipped/2026-05-08-*.md` for the original three plans
- **Roadmap / future visual work** → `docs/roadmap.md`
- **Per-surface coding conventions** → `.claude/rules/styles.md` (currently empty stub)
