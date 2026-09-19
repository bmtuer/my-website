# Plan: Design Uplift v2

## Status
- [ ] Drafting
- [ ] Approved to start
- [ ] In progress
- [x] Shipped
- [ ] Cancelled

## Problem
Follow-up round of feedback after Design Uplift v1: the Play page's panel could scroll behind the fixed nav/footer, the scrollbar and nav scramble effect felt off-theme/off-pace, the work timeline needed a new role plus consolidation, the "Work 💼" / "Play 🎮" word+emoji header pattern felt dated, the nameplate needed more visual presence, and — after looking at the whole page together — the teal/terracotta palette and Tenor Sans display font didn't feel fully aligned with the hero photo or with each other.

## Acceptance criteria
- [x] Play page panel stays contained between the fixed nav/footer on desktop/tablet; internal scroll only, page never scrolls the card behind them
- [x] `.bento-grid` scrollbar is a themed slim rounded thumb, not the native OS scrollbar
- [x] Nav link scramble-on-hover is slower and longer per letter
- [x] Work timeline reflects the Sep 2026 promotion (Senior Support Operations Manager), consolidated into the existing most-recent entry rather than added as a 6th column
- [x] `play.html` renamed to `life.html` (nav, title/canonical/og tags, card header) across all pages; nav labels read Home / Work / Life / Contact
- [x] Card headers (Work / Life / Contact) drop the word+emoji pattern
- [x] Nameplate gets a "layered depth" treatment (offset ink shadow behind "Bryan", drop-shadow on "Tuer"), scaling correctly at both the home and inner-page sizes
- [x] Site-wide palette moves from teal/terracotta ("teal" didn't occur anywhere in the actual hero photo) to a "Warm Ink" palette pulled from the photo's own maroon/brick tones
- [x] Display font moves from Tenor Sans to Fraunces, with display headings bumped to weight 500 for more presence

## Changes by area

### Styles (`css/style.css`)
- Play page: `.play-card` height-capped to the space `.content-wrap` reserves for the fixed nav/footer; `.bento-grid` scrolls internally; themed scrollbar (slim rounded thumb, ink on hover, no native buttons); breakpoint-specific caps at tablet, uncapped at phone (nav/footer aren't fixed there)
- Nameplate: `.nav-name-first`/`.nav-name-last` get em-based offset text-shadow / drop-shadow for a screen-printed poster feel
- Palette: `--teal` renamed `--ink` and recolored `#2D6E7E` → `#8A3A34`; `--terracotta` `#C8866A` → `#D89468`; `--bg` `#F0EBE3` → `#F5ECE0`; `--text` `#1a1a1a` → `#241512`. Every hardcoded duplicate of the old teal RGB (`45, 110, 126`) and old cream RGB (`240, 235, 227` / `236, 230, 221`) swapped to match — these weren't all wired through `var()`.
- Type: `--font-display` `'Tenor Sans'` → `'Fraunces'` (variable font, opsz+wght 400/500 imported); every hardcoded `font-weight: 400` on a `var(--font-display)` rule bumped to `500` (h1/h2/h3 base rule, `.card-title`, `.timeline-year`, `.timeline-role`, `.contact-form-heading`, `.bento-title`)

### Scripts (`js/main.js`)
- Scramble effect: interval 40ms → 55ms, per-tick increment 0.5 → 0.4

### Pages
- `play.html` → `life.html` (git mv); nav links/labels, `<title>`, canonical, og:url, og:title updated across `index.html`, `work.html`, `contact.html`, `life.html`
- Card headers: `Work 💼` → `Work`, `Play 🎮` → `Life`, `Contact 📬` → `Contact`
- `work.html`: first timeline column updated from the 2025 "Senior Delight Specialist — Superhuman (Grammarly)" entry to 2026 "Senior Support Operations Manager — Superhuman", description folding in both the acquisition/rename and the promotion

## Rollback plan
Everything is a CSS/HTML content change on a feature branch with clean, isolated commits (one per concern — scroll fix, scrollbar/scramble, timeline update, rename, nameplate, palette+font). Revert the relevant commit(s) or `git checkout` the prior value of the affected CSS variables. No data migrations, no backend, nothing to lose.

## Deferred (intentional cuts)
- A redirect shim for the old `play.html` URL — full rename was explicitly requested over keeping a compatibility URL
- Any further font pairing/weight tuning beyond the 400→500 bump — ship this pass, revisit if it doesn't read right in practice

## System doc impact
`docs/systems/visual-system.md` — color palette table, type scale, and "Bento grid (Play page)" section all need updating to match: new palette values, new font, new page name.

## Links
- Relevant files: `css/style.css`, `js/main.js`, `index.html`, `work.html`, `life.html`, `contact.html`
- Relevant plans: `plans/shipped/2026-05-08-*.md` (Design Uplift v1)
- Sprint backlog item: Design Uplift v2

---

## Session log

### Session 1 — 2026-09-19
**Goal:** Work through a round of user feedback on the Play page and the site's overall visual identity.

**Shipped:**
- Play page panel containment fix (already pushed directly to `master` per explicit request, ahead of this plan's creation)
- Scrollbar restyle + scramble timing
- Work timeline update (2026 promotion, consolidated in place)
- Play → Life rename (full URL rename, no redirect)
- Header de-emoji (Work/Life/Contact)
- Nameplate "Layered Depth" (Variant B)
- Warm Ink palette + Fraunces font, display headings bumped to weight 500

**Didn't ship / blocked:**
- Nothing deferred within scope; see "Deferred" above for cuts made on purpose

**Tech debt introduced:**
- None identified — palette/font changes went through the existing CSS custom-property system, no new hardcoded one-offs left behind (hardcoded duplicates of the old colors were found and swapped, not left as drift)

**Next session's first move:**
- None — plan ships this session pending final visual verification
