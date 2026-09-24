# Visual System — Day / Night

> Canonical reference for the site's design language. Updated when work changes the system, not before.
>
> Code is ground truth. When in doubt, read `css/style.css`.

## The idea

One set of HTML, two looks. A visitor flips between them with the **Day / Night** switch in the nav.

- **Day** is a spec sheet: Geist + Geist Mono, graphite on off-white, hairline grid, cobalt accent, grayscale photos that color in on hover.
- **Night** is a terminal look: JetBrains Mono everywhere, near-black ground, amber accent, blue keys, bordered panels, and photos rendered as 1-bit amber dithers that reveal the real photo on hover.

The Night look borrows terminal *visuals* only. Copy stays in plain English: no fake commands, file names, commit hashes or YAML. The blinking cursor and the `>` on the current nav link are the only terminal nods. (Earlier mockups with `$ whoami` / `cat ./about.yml` read as posing; see `plans/active/2026-09-24-day-night-redesign.md`.)

## Where the code lives

- **All visual rules:** `css/style.css` (single file, no build step)
- **Look switch, dither, form, drag-scroll, nav scramble:** `js/main.js`
- **Initial look (no-flash):** inline `<script>` in every page's `<head>`
- **Pages:** `index.html`, `work.html`, `life.html`, `contact.html`
- **Fonts:** Google Fonts `<link>` in each page's `<head>` (Geist 400/500/600, Geist Mono 400/500, JetBrains Mono 400/500/700)

## How the look is chosen

`data-look="day" | "night"` on `<html>`.

1. The inline `<head>` script runs before first paint: saved choice in `localStorage['bt-look']`, else the OS `prefers-color-scheme`.
2. The switch (`.look-switch`, `role="switch"`) flips `data-look`, saves it, and updates `aria-checked`.
3. The flip is wrapped in `document.startViewTransition()` when available and reduced motion is off. Otherwise it's instant.
4. With JS off entirely, `:root:not([data-look])` + `prefers-color-scheme: dark` swaps colors only (structure stays Day).

**Every page's `<head>` script must stay identical.** If you change the storage key or logic, change all four pages.

## Tokens

Defined on `:root` (Day) and `:root[data-look="night"]` (Night). Components read only these.

| Token | Day | Night | Role |
|---|---|---|---|
| `--bg` | `#F2F2EF` | `#0F1115` | Page background |
| `--surface` | transparent | `#151820` | Panel fill |
| `--ink` | `#15171C` | `#F1F3F6` | Headings, strongest text |
| `--text` | `#2A2D33` | `#D5D9E0` | Body text |
| `--soft` | `#5E6168` | `#A3AAB6` | Secondary text |
| `--mute` | `#6A6D74` | `#6F7682` | Labels, metadata |
| `--line` | `#D6D6D1` | `#262A33` | Hairlines, borders |
| `--acc` | `#2F4BD8` cobalt | `#E8B04B` amber | Links, current page, switch, cursor |
| `--key` | `#6A6D74` | `#86A8F4` blue | Quick-facts keys, company names (Night) |
| `--chip` | `#E4E4DF` | `#1E222B` | Chips, switch track |
| `--good` / `--bad` | green / red | green / red | "current" dot, toast edge |
| `--f-display` / `--f-body` / `--f-mono` | Geist / Geist / Geist Mono | JetBrains Mono ×3 | Type roles |
| `--radius` | `0` | `4px` | Panels, inputs, buttons |
| `--gap` | `0` | `12px` | Space between panels |

The dither's amber (`232, 176, 75`) and dark (`11, 12, 16`) are hardcoded in `js/main.js`. Change them alongside `--acc` / `--photo-bg` if the Night palette moves.

## Structure differences

Tokens handle color and type. Where the two looks differ in *structure*, a `[data-look="night"]` rule sits right after the Day rule for that component:

- **Home hero** (`.hero`): Day is `intro | facts` over a full-width grayscale photo strip. Night is `intro` over `facts` on the left, with the dithered photo filling the right column (`grid-template-rows: auto 1fr` keeps facts tucked under the intro). `.intro`, `.facts` and `.hero-photo` carry `view-transition-name`s, so switching morphs them into place.
- **Work** (`.track` / `.job`): Day uses hairline-separated columns. Night uses bordered panels with a header bar (amber year, green "● current").
- **Life** (`.life-grid`): Day draws hairlines with a **1px gap over a `--line` background** (no per-cell borders, so wide cells never break the lines). Night uses a 12px gap and bordered panels.
- **Labels** (`.label`): Day is gray mono uppercase. Night is amber with a small square bullet.
- **Facts** (`.facts dl`): Day is a ruled spec table. Night is an unruled key/value list with blue keys.

## Photos

`.pic` holds an `<img>` and a `<canvas class="dither" data-src>` stacked on top of it.

- Day: canvas hidden, img grayscale, color on `.reveal:hover` / `:focus-visible`.
- Night: canvas shown, and it fades out on `.reveal:hover` / `:focus-visible` to reveal the photo.
- `js/main.js` draws each canvas once on load: cover-crop (focus via `data-x` / `data-y`, 0–1), then Bayer 4×4 ordered dither. Canvas pixel size is the `width`/`height` attributes; CSS scales it up with `image-rendering: pixelated`.
- **`file://` previews:** browsers block `getImageData` there, so Night shows the undithered photo. Serve over http to see it properly.

## Motion

- **Page-to-page:** CSS `@view-transition { navigation: auto; }`. The nav has `view-transition-name: nav` so it stays still while content crossfades. Browsers without support just navigate normally.
- **Look switch:** same-document View Transition (see above).
- **Cursor:** blinking block after the home statement, Night only.
- **Nav scramble:** letters scramble on hover (`js/main.js`), skipped under reduced motion.
- **Reduced motion:** kills the cursor blink, all transitions and view-transition animations.

## Layout

- `.page` is a centered 1160px column, 24px gutters (16px under 760px), a flex column so the footer sits at the bottom of short pages.
- Under 760px: hero stacks to one column, the Life grid goes to two columns, contact stacks, and the nav puts name + switch on one row and links below.
- The Work timeline stays horizontal at every width (`overflow-x: auto`, drag-to-scroll with a mouse). This was a deliberate call; don't switch it to a vertical stack.

## Known gaps

- Photos are 1–3 MB originals and are loaded on every page that uses them (and decoded again for the dither).
- The Life label says "hover a photo" even on touch devices. Tapping does work via sticky hover.
