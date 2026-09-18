# NeroConnect explainer — overlay design & motion brief

**For:** the Claude Code session that owns `/root/neropay-video/` (edit.py, anim.py).
**From:** Faisal Palmes, NeroPay. **Date:** 18 September 2026.
**Kit:** `neroconnect-overlay-kit.zip` — `glass/` (glass.css, frames.js, five approved HTML overlays), `crops/` (51 module crops of the real screens, redacted data), `data.json` (the invented dataset), `HANDBOOK.md` (what every screen does), `SHOTLIST.md`.

## What we are making

Editorial, liquid-glass motion graphics that explain NeroConnect — NeroPay's white-label platform product — for one long-form YouTube/docs explainer and cut-downs. Not screen recordings. Every overlay is rebuilt HTML/CSS on a white ground with glass cards and one soft yellow light, driven by a `setFrame(n)` function so frames render deterministically through Playwright and encode with ffmpeg.

Five overlays are already approved and in the kit. They are the reference for look, type, spacing and copy register. Match them; do not restyle them.

| File | Archetype | Approved for |
| --- | --- | --- |
| `m18-ledger-tiles.html` | Grid of six glass tiles | Any "here are the numbers" beat |
| `v1-hero-pill.html` | Hero number in a glass pill, supporting cards defocused in depth | One number that matters |
| `v2-tilted-panel.html` | Dashboard panel in 3D perspective with floating icon rail | Overviews, navigation, settings |
| `v3-chart-card.html` | One large glass chart card with tabs, readout, small stats beneath | Trends, splits, reports |
| `v4-cascade.html` | Overlapping cards cascading in depth, fee − cost = margin | Logic, sequences, "how it works" |

Two more archetypes to build in the same system before the scene work: **row stack** (glass rows sliding in one at a time, one lit, for lists like the attention queue, fee report, logs, orders) and **floating form** (toggles, fields, DNS records, store modes — controls as glass objects hovering at slight angles).

## Rules (all from Faisal, all final)

1. **Text is never touched by the glass.** Ink `#0b1220` at full opacity sits above every glass layer (`.glass > * {z-index:2}`). No highlight, sweep, blur or light crosses text. If a card must sit on the light, the light dims, the text does not.
2. **White ground, one light.** `#fff` ground, faint grid, one large blurred yellow light (`--yel #fbc50f`, ~1700px, blur 150px, opacity ≤ .6) parked off-centre — a corner or an edge, never the middle — plus at most one faint secondary. The light drifts slowly; it is the only ambient motion. Glass picks it up; nothing else does.
3. **Timeless copy.** No dates, no "this week/month", no version numbers, no names of real platforms or merchants. Figures come only from `data.json` (Harbourline Ltd). Nothing sensitive: no NeroPay wholesale cost, protected base values, real margins, thresholds or plan prices.
4. **Simple copy.** Labels a shop owner understands: "Your platform fee", "NeroPay processing cost", "Your net margin", "What you keep". No NCPA/NCPF, no "ledger", no "settled entries", no accountant words. One idea per card. Sub-lines ≤ 9 words.
5. **Variety is mandatory.** No two consecutive scenes use the same archetype. Across the film each archetype appears at most 4 times. Within an archetype, vary the camera angle, which element is hero, and the light position.
6. **Real 3D, not faked.** Perspective via CSS `perspective` / `rotateY` / `rotateX` / `translateZ` on real elements so the camera can move per frame. Depth of field via `filter:blur()` on background elements only.
7. **Liquid, not flat.** Cards carry the thick-glass treatment (`.glass.liquid` + `.rim` + optional `.drop`): inner top highlight, inner bottom shade, 3px outer halo, rim refraction that only shows where something sits behind the card (grid, light, another card). On plain white the rim reads as thickness — that is expected; put overlaps and the light behind cards where you want the bend to show.
8. **Type.** Inter (embedded from the kit's fonts path). Headline 50–64px, hero numbers 96–150px, labels 22–26px, subs 18–22px. Tabular numerals. One yellow accent element per frame (a rule, a dot, a pill, the `=` badge) — never yellow text.

## Scene plan — 16 scenes (overlays follow the script, not the screenshot count)

| # | Chapter | Beat | Archetype | Data / source crop |
| --- | --- | --- | --- | --- |
| 1 | Open | "One platform. Your merchants. Your brand." | v2 tilted panel — wide, sidebar menu as the panel | menu-01, dashboard-1-01 |
| 2 | What it is | Three parties: NeroPay · You · Your merchants | v4 cascade (three cards, arrows) | HANDBOOK §01 |
| 3 | Dashboard | "One place for your whole estate" | v2 tilted panel | dashboard-1-03, dashboard-2-02 |
| 4 | Dashboard | Needing attention: dispute, proof, compliance | row stack (3 rows, one lit red pill) | dashboard-1-02 |
| 5 | Accounts | The register: your merchants at a glance | row stack (5 rows, status pills) | connected-accounts-2-02 |
| 6 | Accounts | Creating a merchant in five steps | v4 cascade (5 small steps) | HANDBOOK §06 |
| 7 | Pricing | Who sets what: NeroPay owns the fee payer, you own merchant pricing | floating form (two read-only panels + editable fields) | settings-pricing-1-01/02 |
| 8 | Pricing | Your fee − NeroPay cost = your margin | v4 cascade (approved) | v4-cascade.html |
| 9 | Pricing | The floor: protected base, you can't go below cost | v1 hero pill ("0.00% at cost" concept, no figures) | settings-pricing-2-01 |
| 10 | Branding | Your domain, your logo, your login link | floating form (URL pill, logo switch, DNS records) | settings-branding-02, settings-custom-domain-01 |
| 11 | Store | Three store modes; your prices, your margin on hardware | v2 tilted panel (three mode cards + one item priced) | settings-store-02, settings-store-pricing-01 |
| 12 | Reports | What your merchants earn you | m18 ledger tiles (approved) | m18-ledger-tiles.html |
| 13 | Reports | Margin over time; terminal vs online | v3 chart card (approved) | v3-chart-card.html |
| 14 | Wallet | Available balance + reserve that keeps payouts moving | v1 hero pill | dashboard-2-02 |
| 15 | Support | Free vs Premium, white-label support | row stack (two tall rows) or v4 | connect-support-03 |
| 16 | Close | "Your merchants. Your brand. NeroConnect." + docs URL | v1 hero pill, text only | — |

Add or drop scenes as the voiceover needs; keep rule 5.

## Motion grammar (the `setFrame(n)` contract)

- 25 fps. Every overlay exposes `setFrame(n)`; frame 0 = nothing on screen, everything settled by frame ≤ 70, ambient drift continues after. Stills are taken at frame 300.
- Entrances: opacity 0→1 with `translateY(28px→0)` and `scale(.985→1)`, 18–22 frames, `cubic-bezier(.16,1,.3,1)` feel (the `ease` function in the files). Stagger siblings 5–9 frames.
- Numbers: count-up 24–30 frames, ease-out, start 8–10 frames after their card lands.
- Camera: each archetype has a slow loop — panel `rotateY` drifts 4–5°, cascade `rotateX` 2°, light `--lx/--ly` 150–250px — over 150–220 frames. For a scene's hero moment the assembler may push in (scale 1→1.08 over 40 frames) or rack focus (background `filter:blur` 0→8px) — both are per-frame properties, so add them to `setFrame` rather than post-processing.
- Never animate blur radius on the glass itself, or displacement scale, per frame. Position, opacity, scale, rotation only.
- Render: `node frames.js <file> seq 0 <N>` → `out/glass/<name>/frame_%05d.png` at 1920×1080 1×; `ffmpeg -framerate 25 -i frame_%05d.png -c:v libx264 -pix_fmt yuv420p -crf 16`. Stills at 2× with `still`.

## Deliverables

For each scene: `sNN-<slug>.html` (self-contained apart from `glass.css` and fonts), a 2× still, a frame sequence or preview mp4, and a line in `scenes.json` (name, archetype, duration frames, hero element, VO cue). Plus `claims.md`: every figure on screen with its source in `data.json`.

## QA before anything is handed over

1. Freeze any frame: is any text overlapped by light, sweep or blur? Fail.
2. Grep every HTML for: 2026, Sep, Kepos, Vazmo, NCPA, NCPF, ledger, protected base £, %, 0.85, 0.08 — investigate every hit; only `0.00%` may appear and only in scene 9.
3. Two consecutive scenes, same archetype? Fail.
4. Compare frame 0 / 40 / 300 contact sheet per scene: entrances complete, only the intended things drift after.
5. Fonts embedded; no network fonts; renders identical run to run.
