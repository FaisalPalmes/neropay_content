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
| `*.html` | Five pages | Rarely |
| `overlays.js` | Every on-screen graphic the pack calls for, drawn as SVG for post | Only when a figure changes in the pack |
| `README.md` | Field reference for adding posts and the parser format | Keep current |

On `youtube.html` each video is one timeline: presenter shots in yellow, overlays in purple slotted in
where they start. Keep that for any new video — don't split overlays into their own list.

## Adding a post

Copy any object in `posts.js`, change the fields, push. It renders with filters and a sketch
automatically. Required fields: `id` (L# for LinkedIn, M# for Meta — keep unique), `channel`,
`pillar` (Statement · Street · Product · Merchant · Partner), `format`, `date`, `blocked`
(`false` or a string saying what must happen first), `title`, `copy`, `creative`, `sketch`.
`why` is optional. Sketch types: `reel`, `carousel`, `statcard`, `photo`, `none` — parameters in README.

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

## Verification before pushing

Run `node --check app.js posts.js videos.js` at minimum. If Playwright is available, load each
page and confirm no console errors, `.post` count matches `POSTS.length` on social.html, and
nothing overflows at 390px. Both colour schemes must paint their own background.

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
