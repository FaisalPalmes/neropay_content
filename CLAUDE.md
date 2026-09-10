# NeroPay Content Warehouse — working rules for Claude Code

This repo is NeroPay's content warehouse: every social post, video script and publishing date,
served as a static site on Vercel. You are helping maintain it. Read this file before touching
anything, and read `rails.html` if you're about to write copy.

NeroPay: UK fintech, card terminals with free EPOS software, Manchester-based, trading name of
Nero Panda Ltd. Owner is Eray. Faisal runs marketing and operations and is who you're working with.

---

## Hard rails — these are not style preferences

Two carry criminal or account-ending consequences. One has already cost NeroPay a restricted
Facebook profile (21 Aug 2026). Refuse and explain if asked to cross one.

1. **NeroFinance, merchant cash advance, terminal finance, any credit or lending language — never.**
   Not in a post, caption, alt text, or on any page a post links to. s.21 FSMA — unauthorised
   financial promotion is capable of being a criminal offence.
2. **No earnings claims on any platform.** No "passive income", "no effort", "risk-free", no large
   money figures as the dominant element of an image. This is exactly what got the profile
   restricted. The terms being true is not a defence — Meta's classifier matches language patterns.
3. **Nothing commercial from a personal profile.** Everything posts as NeroPay. Faisal is never
   named in copy.
4. **AI-generated presenters carry an on-screen disclosure in the first three seconds.**
   ASA guidance 22 June 2026; EU AI Act Article 50, in force since 2 August 2026.
   *Faisal's decision, 9 Sep 2026: no AI wording inside the video itself. The disclosure is made at
   upload instead — YouTube's "altered or synthetic content" setting plus a line in the description.
   Raise it once per new series, then follow the decision.*
5. **Every competitor figure carries a date and is screenshotted.** Current register is dated
   18 August 2026 — see `generation-pack.md`. Don't invent or update competitor prices.
6. **No merchant named without written consent.** Currently only the Armenian Taverna shoot is
   consented, and only once the form is signed.
7. **No real data.** Demo accounts, fake figures, the specimen statements. Never the live
   dashboard, never real transactions, never KYC.
8. **No guaranteed savings.** Every educational post concedes a case where the reader should stay
   where they are.
9. **Write organic to ad standards.** Third person, product-focused, no personal-attributes
   phrasing like "struggling with fees?". Any post might be boosted later.
10. **Never publish negotiated rates, margins, partner commission or commercial terms.**

## Things that are currently unconfirmed — do not state them

- **NeroPay Flex has no confirmed price.** Never quote one.
- **The partner incentive model is not signed off.** No partner post carries figures; L4 stays blocked.
- **"Competitors charge for POS software" is inaccurate** — Square, SumUp and PayPal all have
  working free tiers. The accurate claim is about their paid tiers (Square for Restaurants Plus
  £69/month, SumUp POS Plus £39+VAT). Post L8 corrects this publicly; don't reintroduce the old line.
- The video pricing story (0.70% flat) differs from the internal 1.30%+15p / 0.80% floor. Open
  question for Eray, listed on `youtube.html`. Don't reconcile it yourself.

## Voice

Posted as NeroPay. **"We", never "I".** Direct, specific, plain. Local — Manchester streets,
named areas, real numbers. Concise: cut the first sentence of any draft and see if it still works.
No hashtag piles, no emoji, no "🧵", no LinkedIn-guru cadence, nothing that sounds like it was
written to go viral. Concede something in every educational post — it's what makes the rest
believable.

Strongest existing posts to match the register of: L1 (98 in 800 metres), L3 (we tell some
merchants to stay put), L8 (correcting ourselves).

## Brand — for any creative direction

- "Nero" in white, "Pay" in yellow. Yellow only as an accent against dark/charcoal.
- The terminal is the only branded object in frame. No NeroPay cards, pens, mugs, props.
- Everything sharp, deep depth of field, no bokeh anywhere. Locked-off, static framing.
- Flex terminal: NeroPay branding only. Never reference Verifone or Stripe in customer-facing content.

## Structure of this repo

Flat on purpose — no subfolders, because content gets added through the GitHub web UI as well as
from here, and folder uploads silently fail there.

| File | What it is | Edit? |
|---|---|---|
| `posts.js` | All social posts as `window.POSTS = [...]` | **Yes — this is where content goes** |
| `videos.js` | Six videos, every shot prompt | No — generated from `generation-pack.md` |
| `generation-pack.md` | Source of truth for the video series | Yes, then regenerate videos.js |
| `style.css`, `app.js` | One stylesheet, one script (sketches, filters, motion) | Only for design changes |
| `*.html` | Six pages — overview, social, youtube, ideas, calendar, rails | Rarely |
| `calls.js` | Behind the Counter — the video-call series, cast, globals, six episodes, next briefs | **Yes — hand-edited, copy an episode to add one** |
| `ideas.js` | The backlog — proposed series, one-offs, each judged by the engine rule | **Yes — this is where proposals go** |
| `overlays.js` | Every on-screen graphic the pack calls for, drawn as SVG for post | Only when a figure changes in the pack |
| `README.md` | Field reference for adding posts and the parser format | Keep current |
| `edit/` | The Remotion editor: assembles a finished Explained-by / Behind-the-Counter video from Higgsfield renders using the data above. Run from a terminal, never uploaded through the web page. `edit/README.md` explains it | Yes, when the series edit needs to change |
| `video/` | The HyperFrames workspace: HTML-authored videos for everything that isn't the fixed series edit — captioning a talking-head clip, overlays on existing footage, motion graphics, stat cards, Reels, a promo. `video/PLAYBOOK.md` is the brief and `video/LESSONS.md` the fault log — read both before any edit; `video/CLAUDE.md` is HyperFrames' own guide | Yes — one folder per piece inside it |
| `.claude/` | Skills (the HyperFrames pack, committed so every session has it) and the session-start hook that installs both toolchains on the web | Only to add or refresh skills |

The two subfolders are deliberate; everything else stays flat.

On `youtube.html` each video is one timeline: presenter shots in yellow, overlays in purple slotted in
where they start. Keep that for any new video — don't split overlays into their own list.

**Behind the Counter (series C, `calls.js`) is a dramatised explainer, not testimony.** Every person in
it is AI-generated and the disclosure runs over the first three seconds. The owners are composite
characters — first names only, no business named — who describe situations and never say they use
NeroPay. The host carries the product facts and the concession. Fabricated testimonials breach the
CAP Code (3.45–3.47) and the DMCC Act 2024 fake-review ban; real customers belong in the Merchant
pillar with signed consent. New episodes follow the same shape: host question → title → question card
→ four bites → host question → four bites → host close with a concession → end card. Fortnightly,
Thursdays, skipping the dead week and the dark period.

## Adding a post

Copy any object in `posts.js`, change the fields, push. It renders with filters and a sketch
automatically. Required fields: `id` (L# for LinkedIn, M# for Meta — keep unique), `channel`,
`pillar` (Statement · Street · Product · Merchant · Partner), `format`, `date`, `blocked`
(`false` or a string saying what must happen first), `title`, `copy`, `creative`, `sketch`.
`why` is optional. Sketch types: `reel`, `carousel`, `statcard`, `photo`, `none` — parameters in README.
`assets` draws the creative under the post (`stat`, `quote`, `cards`, `cover`, `ref` — README has the shapes).
Keep copy short and plain: no cringe, no LinkedIn cadence, no AI-sounding lists of adjectives. Cut the
first sentence of every draft and see if it still works. Concede something in every educational post.

Pillar weights per week: Statement 2× · Street 1× · Product 1× · Merchant 1× per fortnight ·
Partner 1×. If a week is short, cut Product first, never Street.

## Generating new content — this is the main job

You are the content engine for NeroPay, not just the maintainer. When Faisal asks for ideas or
posts, work from the strategy already in this repo rather than from general marketing instinct.

**Read as your brief, in this order:** `index.html` (what social is for, the three channels, the
five pillars, the engine rule) · `calendar.html` (the 16 weeks and the seasonality) · `posts.js`
(the voice — match L1, L3 and L8 in register) · `generation-pack.md` (the six video scripts, which
are the raw material for most Reels and carousels, and the dated competitor register).

**The premise you're working inside.** Social is not an acquisition channel for NeroPay and is
never judged on leads. Three jobs: credibility after a field visit, partner recruitment on
LinkedIn, and manufacturing shopping-around behaviour through education. LinkedIn is a partner
channel — wholesalers, EPOS installers, accountants, trade bodies — not a merchant channel.
Instagram and Facebook are where merchants are. YouTube produces; social distributes.

**The engine rule, which decides whether an idea is viable.** Nothing is made specially for social.
Every post is a by-product of one of two inputs already committed to: the weekly long-form video,
or a field day. If an idea needs its own shoot, its own script or its own research, it doesn't
happen. Three vertical cuts, a carousel and a LinkedIn write-up per video; street photos and a
field note per field day. Five posts a week total, batched in one afternoon.

**The audience.** Independent hospitality and retail owner-operators in Greater Manchester —
takeaways, restaurants, cafés, barbers, corner shops. They buy on trust and someone turning up.
Territory: the Rusholme → Longsight → Levenshulme corridor (~650 units, ~190 food businesses;
Rusholme alone has 98 food units in 800m of Wilmslow Road), Cheetham Hill, and the
Turkish-Cypriot cluster around Stretford and Moss Side. Field days run Tue–Thu, 2:30–4pm for
restaurants and 10:30–12 for shops and cafés.

**Numbers you can use, with their sourcing.**
- 98 food businesses in 800 metres of Wilmslow Road — NeroPay's own count
- 42% of UK merchants had not switched or considered switching in two years; 76% of those who did
  found it easy — PSR / IFF Research, n=1,037, fieldwork Oct–Dec 2019 (state the date; it's old)
- 16% of independent hospitality operators optimistic in Aug 2026, down from 51% in Feb 2026
- April 2026: 40% RHL rates relief ended; pubs got 15% + three-year freeze; restaurants, cafés,
  bars and takeaways excluded. NLW £12.71, 18–20 rate up 8.5%, employer NI 15% from £5,000.
- Every competitor price in `generation-pack.md`, dated 18 Aug 2026. Don't update them yourself.

**Product facts safe to state.** Card terminal with EPOS software included at no monthly software
fee: NeroPOS (till, product grid, staff, kitchen display, Z-reports), NeroWeb (online ordering,
no per-order commission), NeroBooking, Nero QR Pay, NeroAI, NeroTrade, NeroGym. Integrations:
Xero, QuickBooks, WooCommerce, Deliveroo, Uber Eats. NeroPay Flex: 5.5in screen, built-in
printer, wi-fi/4G/offline. **Do not state the terminal price or any transaction rate** — the
internal figures conflict and it's an open question for Eray. Product-led copy only.

**How to propose.** Three ideas at a time, not ten. For each: pillar, channel, the hook in one
line, what creative it needs, and which existing input it's a by-product of. If it isn't a
by-product of the video or a field day, say so and expect it to be cut. Then write the strongest
one in full as a `posts.js` object, blocked field set honestly.

**Seasonality that changes what to propose.** September is the strongest month. w/c 26 Oct is
dead (Budget + half term). CPMs double Oct–Dec but organic doesn't care. Christmas markets open
~6 Nov — Flex angle from mid-October. 18 Dec – 3 Jan is dark. January is the sprint, but the
window for Muslim-owned merchants closes ~5 Feb for Ramadan, and Ramadan moves ~11 days earlier
each year.

## Editing video

Two toolchains, chosen by the job:

- **`edit/` (Remotion)** is the fixed edit for the series videos — B1–B6 and Behind the Counter. Clips in,
  captions, hover overlays, intro, outro, loudness, out. Don't rebuild that in HyperFrames.
- **`video/` (HyperFrames)** is for everything else Faisal asks to have edited: captions or graphic
  overlays on a talking-head clip, a Reel cut, a stat card or motion graphic, a promo, a deck.
  Start every such request with the `/hyperframes` skill — it routes to the right workflow
  (`/embedded-captions`, `/talking-head-recut`, `/motion-graphics`, `/general-video`, …). Scaffold each
  piece as its own folder inside `video/` with `npx hyperframes init <name> --non-interactive --example blank`,
  run `npx hyperframes check` before any render, and render draft for review, high for delivery.

Rules that come from this environment, not from HyperFrames:

- **No CDN scripts.** The web container blocks jsdelivr, unpkg and the like, so a composition that loads
  GSAP or a font from a CDN renders black. Vendor the file: `video/vendor/gsap.min.js` is already there;
  copy it (or `npm install` the library and copy from `node_modules`) and use a relative `src`. Fonts:
  `@fontsource/*` packages or a local `.woff2`.
- Rendered MP4s go to Faisal via the Higgsfield media upload (or chat attachment); the Drive
  connector cannot carry files over a few MB. `out/` is git-ignored.
- Brand rules above apply to every frame: Nero white, Pay yellow (`#F5C518`) as an accent on charcoal,
  Poppins, tight letter-spacing, no bokeh, no props, no price or rate on screen.
- The session-start hook (`.claude/hooks/session-start.sh`) installs node modules for both folders, puts
  ffmpeg on PATH and fetches HyperFrames' Chrome. If `npx hyperframes doctor` complains, run the hook.
- **Real clips are not in this container.** They live on the Higgsfield CDN, which the web container
  cannot reach, so the pattern that works: build and check here against placeholder clips, push, then
  render in the Higgsfield sandbox (`sandbox_exec`: clone the public repo, `npm i node@22 -g --prefix`,
  `npm install` in `video/`, curl the clips into `assets/clips/`, `node build.mjs`, `npx hyperframes render`),
  loudnorm to -14 LUFS with ffmpeg, PUT to a `media_upload` URL, `media_confirm`. Identify a clip from a
  Higgsfield generation by matching Content-Length to the file size Faisal uploaded.
- **Read `video/PLAYBOOK.md` and `video/LESSONS.md` before any edit.** The playbook is the standing brief —
  Faisal's standards and the words they use for each fault, the rails as they apply to a frame, the three
  delivery formats (16:9 master, 9:16 Reels/TikTok, 4:5 Meta ad), the sandbox pipeline and the review loop.
  LESSONS.md is the log of faults Faisal has caught and the rule that prevents each one — add to it after
  every review.
- `video/b1-rate-you-were-quoted/` is the reference build: `build.mjs` generates `index.html` from
  `data/words.json` (Whisper timings), `data/edit.json` (trims) and the clips on disk. Copy its
  patterns — liquid-glass panels, the clamped virtual camera, per-word captions — for the next piece.

## Verification before pushing

Run `node --check app.js posts.js videos.js` at minimum. If Playwright is available, load each
page and confirm no console errors, `.post` count matches `POSTS.length` on social.html, and
nothing overflows at 390px. The site is light by default (off-white ground, black and grey type); dark is opt-in via `data-theme="dark"` and must still paint its own background.

## What lives elsewhere

Meta paid advertising — the ad account, campaigns, audiences, the daily performance brief — is
handled in a separate Claude session with the Meta connector. Don't build ad campaigns here.

The fuller NeroPay context (pricing ladder, the KYC rules, the Elif incident report, the GTM
playbook, ~40 docs) lives in a claude.ai Project, not in this repo. If a task needs something
that isn't in this file or `rails.html`, ask Faisal to bring the relevant doc over rather than
guessing.

## Commits

Short, plain, present tense. "Add October street posts." "Fix statcard contrast in dark mode."
Push to `main`; Vercel redeploys automatically.
