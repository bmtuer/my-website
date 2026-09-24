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
- **The site:** `index.html` — one page with four sections: `#top` (the `.page` wrapper; hero is first inside it), `#work`, `#life`, `#contact`
- **Old URLs:** `work.html`, `life.html`, `contact.html` are redirect stubs to `index.html#work` / `#life` / `#contact` (meta refresh + `location.replace`, `noindex`, canonical to the anchor). Keep them so old links from LinkedIn/search still land.
- **Fonts:** Google Fonts `<link>` in each page's `<head>` (Geist 400/500/600, Geist Mono 400/500, JetBrains Mono 400/500/700)

## How the look is chosen

`data-look="day" | "night"` on `<html>`.

1. The inline `<head>` script runs before first paint: saved choice in `localStorage['bt-look']`, else the OS `prefers-color-scheme`.
2. The switch (`.look-switch`, `role="switch"`) flips `data-look`, saves it, and updates `aria-checked`.
3. The flip is wrapped in `document.startViewTransition()` when available and reduced motion is off. Otherwise it's instant.
4. With JS off entirely, `:root:not([data-look])` + `prefers-color-scheme: dark` swaps colors only (structure stays Day).


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
- **Work footnote:** a `.fn-mark` asterisk (accent color) after a company name links to a `.footnote` under the track (used for the Grammarly/Superhuman rename).
- **Life** (`.life-grid`): Day draws hairlines with a **1px gap over a `--line` background** (no per-cell borders, so wide cells never break the lines). Night uses a 12px gap and bordered panels.
- **Labels** (`.label`): Day is gray mono uppercase. Night is amber with a small square bullet.
- **Facts** (`.facts dl`): Day is a ruled spec table. Night is an unruled key/value list with blue keys.

## Photos

`.pic` holds an `<img>` and a `<canvas class="dither" data-src>` stacked on top of it.

- Day: canvas hidden, img grayscale, color on hover.
- Night: canvas shown, and it fades out on hover to reveal the photo.
- Hover is **per photo** (`.pic:hover`), so the Family pair reveals one photo at a time. Keyboard focus on a `.reveal` cell reveals all its photos.
- Touch screens (`@media (hover: none)`): tapping a `.reveal` cell (it has `tabindex="0"`) reveals it, and the Life label swaps "hover a photo" for "tap a photo" (`.hint-hover` / `.hint-tap`).
- Canvas resolution: hero 340×300, Life 180×240. Much lower and faces stop being recognizable.
- Life photos crop to **portrait 3:4** (most are photos of people); set each photo's focus with both `style="object-position"` on the img and matching `data-x`/`data-y` on the canvas, or Day and Night will frame it differently.
- `js/main.js` draws each canvas once on load: cover-crop (focus via `data-x` / `data-y`, 0–1), then Bayer 4×4 ordered dither. Canvas pixel size is the `width`/`height` attributes; CSS scales it up with `image-rendering: pixelated`.
- **`file://` previews:** browsers block `getImageData` there, so Night shows the undithered photo. Serve over http to see it properly.

## Motion

- **Nav jumps:** the nav is `position: sticky`; links are in-page anchors with `scroll-behavior: smooth`. `html { scroll-padding-top }` is tuned so a section's label lands ~24px below the nav (20px desktop, 64px under 760px where the nav wraps to two rows). If the nav height or `.section` padding changes, retune it.
- **Jump targets:** "home" targets `#top` on the `.page` wrapper (true top of the page). Work and Life scroll as far as the page allows. Contact is the last section, so it lands at the bottom of the page. There's deliberately **no filler** below Contact: an earlier min-height fix that let every section reach the top left a huge empty gap under the form, and was rejected.
- **Scroll-spy** (`js/main.js`, scroll-based): the current section is the last one whose top has passed ~35% down the viewport; at the very bottom of the page, Contact wins. A nav click marks its own link and holds it until the reader scrolls themselves (wheel/touch/key/mouse), because on tall screens Life and Contact can land on the same scroll position.
- **Nav states:** hover is ink + underline (Day) or bright ink (Night); current is the accent color. Night's `>` marker on the current link is absolutely positioned outside the link, so moving it never shifts the other links.
- **Look switch:** same-document View Transition (see above).
- **Cursor:** blinking block after the home statement, Night only.
- **Nav scramble:** letters scramble on hover (`js/main.js`), skipped under reduced motion.
- **Reduced motion:** kills the cursor blink, all transitions and view-transition animations.

## Layout

- `.page` is a centered 1160px column, 24px gutters (16px under 760px). Sections after the hero are `.section` (72px top padding, 56px on phones) with a `.section-head` (label + `.lede`).
- Under 760px: hero stacks to one column, the Life grid goes to two columns, contact stacks, and the nav puts name + switch on one row and links below.
- The Work timeline stays horizontal at every width (`overflow-x: auto`, drag-to-scroll with a mouse). This was a deliberate call; don't switch it to a vertical stack.

## Known gaps

- Photos are 1–3 MB originals, all on one page now (Life photos use `loading="lazy"`, but the dither script still fetches every photo on load).
- The Life label says "hover a photo" even on touch devices. Tapping does work via sticky hover.
