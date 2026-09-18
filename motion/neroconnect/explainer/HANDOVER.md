# Handover — NeroConnect explainer, motion graphics build

You are the Claude Code session that runs NeroPay's video pipeline in `/root/neropay-video/` (edit.py with the JSON edit list, anim.py with the `setFrame(n)` frame capture, the end-card system). This handover gives you a new job in that pipeline: a liquid-glass motion graphics explainer for **NeroConnect**. Two files come with it — `neroconnect-overlay-kit.zip` and `BRIEF-overlays.md` — and this note tells you what they are, what the finished thing should be, and how to put it together. Read all of this first, then the brief, then open the kit.

## What NeroConnect is, in one paragraph

NeroPay (Nero Panda Ltd, Stockport) supplies UK businesses with card terminals, free EPOS software and payment processing. **NeroConnect is NeroPay's white-label platform product.** A business — the *platform* — signs up to NeroConnect and can then create and run payment accounts for *its own* merchants (cafés, takeaways, shops) under its own brand and domain: it sets what those merchants are charged, brands their dashboard and checkout, sells them hardware from a white-label store, and earns the margin between NeroPay's cost and its own price. NeroPay stays the regulated processor underneath and keeps KYC, compliance and hard payout limits. Typical platforms are EPOS providers, wholesalers, software companies and franchise operators. The full product reference is `HANDBOOK.md` in the kit; treat it as the only source of product facts.

## What we are making

One long-form explainer, about 2:30–3:30, for YouTube, the NeroConnect page on docs.neropay.app and the partner sales deck. Calm, professional, editorial. Audience: a business owner deciding whether to become a platform partner. It should leave them understanding what they control, what NeroPay controls, and where their margin comes from. Cut-downs (30–45s per chapter, 16:9 and 9:16) come from the same scenes afterwards.

It is **not** a screen recording. Every visual is a rebuilt "overlay": HTML/CSS on a white ground with liquid-glass cards, one soft yellow light, real CSS 3D, rendered frame by frame through Playwright and encoded with ffmpeg. Faisal has approved the look on five overlays; the kit holds them. Your job is to make the rest in that system, animate everything, add voice, music and sound, and assemble the film.

## What is in the zip

```
neroconnect-overlay-kit/
  glass/
    glass.css              the theme: ground, light, glass, thick "liquid" glass, type, pills, motion helpers
    frames.js              renderer: `node frames.js <file> still` (2× PNG at frame 300) or `seq <from> <to>` (1× frames)
    m18-ledger-tiles.html  APPROVED — grid of six glass tiles
    v1-hero-pill.html      APPROVED — hero number in a glass pill, defocused cards in depth
    v2-tilted-panel.html   APPROVED — dashboard panel in 3D with a floating icon rail
    v3-chart-card.html     APPROVED — large glass chart card, tabs, readout, small stats
    v4-cascade.html        APPROVED — overlapping cards in depth: fee − cost = margin
    BRIEF-overlays.md      the design rules, the 16-scene plan, the motion grammar, the QA list
  stills/                  2× PNGs of the five approved overlays — your visual reference
  crops/                   51 element-level crops of the real NeroConnect screens (data already replaced with the invented Harbourline set) + SHOTLIST.md + index.json
  data.json                the invented platform "Harbourline Ltd" and 16 invented merchants — the ONLY figures you may show
  HANDBOOK.md              what every screen does, every label, every rule — the ONLY product facts you may state
  SHOTLIST.md              which crops matter for which chapter
  fonts/                   Inter 400/500/600/700 woff2 (glass.css expects ../fonts/… relative to glass/)
```

Unzip into `/root/neropay-video/neroconnect/` and keep that layout so the font paths resolve. Run `node glass/frames.js glass/v4-cascade.html still` first; if the PNG matches `stills/v4-cascade.png`, the environment is right.

The crops are reference for *content and structure* — what each screen contains — not images to place in the video. Nothing from the real product is ever shown as a screenshot; every scene is rebuilt as an overlay. Never ask for, or use, the original captures.

## What to build, in order

**1. Read `BRIEF-overlays.md` fully.** It carries the eight rules Faisal set. The three that get broken most: text is never touched by the glass or the light; copy is timeless and simple (no dates, no NCPA/NCPF/"ledger", no sensitive figures); no two consecutive scenes use the same layout archetype.

**2. Build the two missing archetypes** before any scene work, in `glass/`, using the same CSS classes and `setFrame` pattern as the approved five:
- `v5-row-stack.html` — glass rows sliding in one at a time, stagger 6 frames, one row lit (a coloured pill or yellow rule). For lists: attention queue, merchant register, fee report rows, orders, support plans.
- `v6-floating-form.html` — controls as glass objects hovering at slight angles: a toggle, two read-only panels, a URL pill, a DNS record row, a field with its floor printed beneath. For settings, pricing, branding, domain, store modes.
Render a still of each and keep them alongside the five as references.

**3. Write the voiceover script** from `HANDBOOK.md`, using the 16-scene plan in the brief as the spine. ~420–480 words, plain British English, second person "you" = the platform partner, merchants are "your merchants". No product jargon, no figures for NeroPay's costs or rates, no dates. A draft to start from is at the end of this note. One idea per scene; a scene's VO should run 6–14 seconds.

**4. Build one overlay per scene** as `scenes/sNN-<slug>.html`, choosing the archetype from the brief's table and varying camera angle, light position and hero element inside each archetype. Every overlay exposes `setFrame(n)`: frame 0 empty, settled by frame ≤ 70, ambient drift after. Add the scene's hero move into `setFrame` too (push-in, rack focus, a card lifting on `translateZ`) so the camera work is deterministic and renders identically every time. Render a 2× still of every scene and review them as a contact sheet before rendering frames.

**5. Voice, music, sound.**
- Voice: ElevenLabs, one voice for the whole film — mid-thirties, British, unhurried, warm, sounds like someone explaining their own product. Generate per scene so timing is editable; keep the VO files named `vo/sNN.mp3`. Disclose "Voice generated with AI" in the video description.
- Music: one licensed bed only if Faisal supplies it; otherwise none. Do not improvise a music track — licensing is not something to guess at.
- Sound: three sounds, used sparingly — a soft tick when a card lands, a lower tick when a number finishes counting, a single soft thud on hard cuts. No whooshes.

**6. Assemble** with `edit.py` from a JSON edit list: each scene's frame sequence (or its mp4) trimmed to its VO plus ~0.6s of air, cross-dissolve 10 frames between scenes, hard cut into the close. Burn captions from the VO as the ASS track in Inter, house palette. Master 1920×1080 25fps; export 1080×1920 and 1080×1080 from the master for the cut-downs, composing safe for 9:16 (keep text inside the centre 1080 width — the approved overlays already do). Loudness-normalise. Write `qc-contact.png` as usual.

**7. QA** with the list at the end of the brief, plus: watch it once at 1× and once at 2×; any frame where a number sits on the light, any two adjacent scenes with the same layout, any word that dates it or names a real company other than NeroPay, is a fail.

## What Faisal decides, not you

- The VO script: send him the draft before generating audio. He will cut lines.
- The music bed: ask; do not source one.
- Anything in the handbook you find unclear or contradictory: ask, do not invent product behaviour.
- Scene count: 16 is a plan, not a contract. Merge or split to serve the VO, but report the final list.

## Deliverables back to Faisal

`neroconnect-explainer-16x9.mp4`, `-9x16.mp4`, `-1x1.mp4`; `scenes.json` (scene, archetype, duration, VO text, hero move); the `scenes/` HTML and `stills/`; `vo/`; `claims.md` (every figure on screen → its key in `data.json`); `qc-contact.png`; and a one-paragraph note of anything you changed from the brief and why.

---

## Draft voiceover (starting point — Faisal edits before recording)

1. **Open.** *NeroConnect lets you run card payments for your own merchants, under your own brand. This is how it works.*
2. **Three parties.** *There are three parts. NeroPay processes the payments and handles compliance. You, the platform, bring the merchants and set the terms. Your merchants take payments, on your dashboard, on your domain.*
3. **Dashboard.** *Everything lives in one place. How many merchants are live, what they've taken, what you've earned, and what needs you today.*
4. **Attention.** *When something needs a response — a dispute, a document, proof of a payment — it's at the top, with a deadline. Nothing hides.*
5. **Register.** *Every merchant on one screen: who they are, whether they're live, and whether their identity checks are done.*
6. **Creating a merchant.** *Adding a merchant is five steps. You enter their details, NeroPay runs the checks, and they're taking payments.*
7. **Who sets what.** *Two things are fixed with NeroPay: who pays the processing fee, and who pays the monthly account fee. Everything else — what your merchants are actually charged — is yours to set.*
8. **Fee, cost, margin.** *Your fee, minus NeroPay's cost, is your margin. On every payment.*
9. **The floor.** *There's a floor under every price. You can't set a rate below NeroPay's cost, so you can never lose money on a service. Set it at the floor and you pass it through at cost.*
10. **Branding.** *Your logo. Your domain. Your login link. Your merchants see your brand, and only your brand, if that's what you want.*
11. **Store.** *Terminals, EPOS and accessories, sold through your own store, at your own prices. NeroPay ships and supports; you keep the margin.*
12. **Reports.** *Reports show what your merchants earn you — payments, your fee, NeroPay's cost, and what you keep.*
13. **Trend.** *And how it moves over time, by terminal and online.*
14. **Wallet.** *Your balance is yours to move. A reserve keeps payouts flowing even on a thin day.*
15. **Support.** *Support comes in two tiers. Free covers the platform. Premium answers your merchants' tickets, ships their hardware, and picks up the phone — in your name.*
16. **Close.** *Your merchants. Your brand. NeroConnect. Read the full guides at docs.neropay.app.*
