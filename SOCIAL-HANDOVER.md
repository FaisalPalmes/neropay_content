# Social handover — the session that owns NeroPay's social posts

Written 17 Sep 2026 for a new Claude Code session, on this repo, whose job is every social post:
choosing from the posts already in the warehouse, adjusting them when Faisal asks, writing new ones,
making the creative for each, and keeping the warehouse site correct. Everything below was checked
against the repo on the date shown. Read this file first; it tells you what to read second.

You are talking to Faisal. They run marketing and operations. Eray owns the company. Elif does the
field visits and the Turkish. None of them is named in a post. Every post is NeroPay speaking.

---

## 1. What you own and what you don't

**Yours.**

- `posts.js` — the posts. Every social post lives here and nowhere else.
- `ideas.js` — the backlog. Proposals go here before they become posts.
- The creative for each post: stat cards, quote cards, carousel cards, Reel covers, Reel cuts.
- `social.html`, `calendar.html`, `ideas.html` when their copy or structure needs to change.
- The publishing calendar as it stands in `calendar.html` — sixteen weeks from September.

**Not yours. Ask before touching.**

- `generation-pack.md`, `videos.js`, `overlays.js`, `scripts-tr.js` — the presenter video series.
  Another session and Faisal own those. A post that needs a figure from the pack reads it; it never
  edits it.
- `motion/` — the faceless motion graphics. A separate session is building that series right now.
- `edit/` — the Remotion series edit.
- `video/b1-*` — the finished B1 builds. Copy their patterns into your own folder; never edit them.
- **Paid advertising.** Meta campaigns, audiences, boosts and the daily brief run in a separate
  session with the Facebook Ads connector. You write organic. You can write *ad copy* when asked. You
  never create a campaign, an ad set, a boost, or upload to the ad account.

**Nobody publishes from a session.** There is no LinkedIn or Meta organic-posting connector on this
account. You produce the caption and the files; Faisal posts them by hand from the NeroPay Page and the
NeroPay LinkedIn page. Say "ready to post" and mean it: caption final, files exported, disclosure line
written where a synthetic voice or presenter is in the piece.

## 2. Read order — the first hour

1. `CLAUDE.md` — the ten rails and the list of things that are unconfirmed. Not optional, not skimmable.
2. `rails.html` — the same rails as the site shows them, with what to measure and what to ignore.
3. `index.html` — what social is for, the three channels, the five pillars, the engine rule.
4. `calendar.html` — the sixteen weeks and the seasonality.
5. `posts.js` — all eighteen posts. Read L1, L3 and L8 twice; that is the register.
6. `README.md` §"Adding a social post" — the object shape, the `sketch` and `assets` formats.
7. `STACK.md` — connectors, credentials, skills, toolchain, what the network reaches.
8. `generation-pack.md` — skim the six scripts and the competitor register. Most Reels and carousels
   are cuts of these.
9. Only when a Reel or a video creative comes up: `video/PLAYBOOK.md`, `video/LESSONS.md`,
   `video/AUDIO.md`, then the `/hyperframes` skill.

## 3. The warehouse as it stands, 17 Sep 2026

Eighteen posts, L1–L8 on LinkedIn and M1–M10 on Meta, dated Mon 7 Sep to Fri 16 Oct. Pillars:
Statement 8, Street 4, Product 3, Partner 2, Merchant 1. Every one carries a `sketch`; **none yet
carries `assets`**, which means no post has a drawn, downloadable creative on the site — that is
the first gap you fill (§5).

Four are blocked, each with the reason in its `blocked` string:

| Post | What has to happen first |
|---|---|
| L4 | Eray signs off the partner incentive model. No figures in the post either way. |
| M8 | Arman's written consent — filming, his name, the business name, every channel — signed before the shoot. |
| M9 | Flex pricing is unconfirmed. The caption carries no price; keep it that way. |
| M10 | Posts from the NeroPay Page only. Elif's personal profile restriction lifts 18 Sep; nothing commercial goes from a personal profile regardless. |

**There is no "posted" field.** The repo doesn't record which posts have gone out. Ask Faisal on
day one which of the September posts are already live, and propose a `posted: "Thu 10 Sep"` field
so the warehouse tracks it from now on (optional field; the parser ignores fields it doesn't know).

Other dated things that go stale:

- The competitor register in `generation-pack.md` is dated 18 Aug 2026. A month old on the day this
  was written. Don't update it yourself; flag it to Faisal when a post leans on it.
- The optimism figure (51% → 16%, Feb → Aug 2026) is used in L2's stat card. Fine to reuse with the date.
- The PSR switching figures are from 2019 fieldwork. Always say so.

## 4. The weekly loop

Five posts a week, batched in one afternoon, pillar weights Statement 2× · Street 1× · Product 1× ·
Merchant 1× per fortnight · Partner 1×. Short week: cut Product first, never Street.

**The engine rule decides whether an idea exists.** Nothing is made specially for social. Every post
is a by-product of the weekly long-form video or a field day. If it needs its own shoot, its own
script or its own research, it doesn't happen. Say so when you cut one.

How a request from Faisal maps to work:

| Faisal says | You do |
|---|---|
| "Post L3 this week" / "what's due" | Check `posts.js` and the calendar, produce the creative (§5), hand back caption + files + any disclosure line. |
| "Change M4 — softer opening" / "move L6 to Friday" | Edit the object in `posts.js`, `node --check posts.js`, push. Tell them what changed in one line. |
| "Ideas for October" / "something for the Christmas markets" | Three ideas, not ten: pillar, channel, one-line hook, creative needed, which input it's a by-product of. Write the strongest one in full as a `posts.js` object with `blocked` set honestly. |
| "Make a Reel from B2" | `/hyperframes` in `video/`, your own folder, per §5.4. |
| Anything about the ad account | Not this session. Point them at the paid session. |

Every change to `posts.js` ends the same way: `node --check posts.js`, a short present-tense commit
("Add October street posts"), push to `main`. Vercel redeploys on every push, so a syntax error in
`posts.js` takes the social page down for everyone — the check is not optional.

## 5. Making the creative

The site already knows how to draw four kinds of creative from a post's `assets` field, at the three
feed sizes, in the brand: charcoal ground `#141416`, white type, yellow `#F5C518` as the one accent,
wordmark bottom-left, Poppins. This is the route for everything that is not a photograph or a video.

### 5.1 Stat card, quote card, Reel cover — one `assets` entry each

```js
assets: [
  { t: "stat",  size: "sq", big: "51% → 16%", line: "Independent operators optimistic · Feb → Aug 2026", src: "Correct as of 18 Aug 2026" },
  { t: "quote", size: "sq", text: "We tell some merchants to stay where they are.", sub: "L3" },
  { t: "cover", size: "st", title: "The rate you were quoted", sub: "and the one you pay", ai: true }
]
```

Sizes: `sq` 1080×1080 (feed), `pt` 1080×1350 (4:5 Meta), `st` 1080×1920 (Reel/Story). `ai: true` on
a cover draws an "AI-generated presenter" tag on the frame. Use it **only for Behind the Counter**
(series C), which carries its disclosure on screen. Explained-series Reels (B1–B6) do not: Faisal
decided on 9 Sep 2026 that no AI wording goes inside those videos, and the disclosure is made at
upload instead — the platform's synthetic-content setting plus a line in the description, per upload,
per language. Rail 4 in `CLAUDE.md` has the wording.

Add the entry, push, open `social.html` — the creative appears under the post with **PNG** and
**SVG** download buttons. Fonts are embedded in the export so the PNG matches the preview.

### 5.2 Carousel — one entry, one file per card

```js
assets: [{ t: "cards", size: "sq", cards: [
  { n: "1", h: "Four lines on your statement that aren't the rate", b: "" },
  { n: "Authorisation fee", h: "A few pence every time a card is tapped.", b: "On 2,000 transactions a month it's the biggest line you've never noticed." },
  { n: "…", h: "…", b: "…" }
]}]
```

Card one is the title card (bigger heading). Every card carries "n / total" top-right. Keep the body
under about 25 words or it wraps below the wordmark — check the preview.

### 5.3 Exporting without a browser in front of you

The download buttons need someone clicking them. For a batch, render headlessly: in a cloud session
Playwright 1.56 is installed globally and its Chromium is at `/opt/pw-browsers/chromium-1194`. Load
`social.html` over `file://`, then for each post call `window.OVERLAY_ART.postAssets("M2")` to get its
asset ids and `window.OVERLAY_ART.toPng(id, {})` for each, and write the blobs to
`social-out/<post id>/`. No such script exists yet — writing `export-assets.mjs` at root and
git-ignoring `social-out/` is a good first task. Until then, click.

### 5.4 Reels and anything with motion

`video/` and the `/hyperframes` skill, exactly as `CLAUDE.md` §"Editing video" says. One folder per
piece. `video/b1-rate-you-were-quoted/` is the reference for the 9:16 cut and `video/b1-ad-4x5/`
for the 4:5. The real clips are on the Higgsfield CDN, which a cloud session cannot reach, so the
pattern is: build and `npx hyperframes check` here against placeholders, push, render in the
Higgsfield sandbox, loudnorm to −14 LUFS, deliver by `media_upload`. Pure-graphics pieces (a stat
count-up, a title sting, a card animation) render right here in under a minute.

Sound is part of the deliverable. `video/AUDIO.md` has the committed library, the `<audio>` contract
and the voiceover route. No NeroPay video ships silent.

### 5.5 Photographs

Street and merchant photos are **real**, taken on the field day, phone camera, flat light, slightly
imperfect. Ask Faisal for them; they arrive by chat attachment or Drive. Do not generate a street, a
shopfront, a merchant or a customer with an image model — L1 works because it is believed, and an
AI street photo under "we counted" is the fastest way to lose that. Higgsfield `generate_image` is
fine for a product still (the terminal on a counter, no props, no bokeh, deep focus) when Faisal has
no photo, and it must read as a product shot, not a scene.

### 5.6 The rule that already cost a profile

No money figure is ever the dominant element of an image. `51% → 16%` is fine. `£308.46` at 320px
is not, and neither is "£1,200 a year" on a card, however true. Meta's classifier matches the pattern,
not the meaning. The stat-card sizes in `overlays.js` don't know this; you do.

## 6. Writing — what bites social specifically

The full rails are in `CLAUDE.md`. These are the ones a post breaks most easily:

- **No credit, lending, finance, cash-advance language**, in the post, the alt text, or the page it
  links to. Including "spread the cost", "0% for", "finance available". s.21 FSMA.
- **No earnings claims.** No "passive income", "no effort", "risk-free", no dominant money figure.
- **No terminal price, no transaction rate**, except the one released workhorse-tier figure in
  `figures.json` (1.30% + 8p) for The Maths episode 1 — and that is the motion session's, not yours.
  Flex has no price. Say "no monthly software fee" — that is the product fact that is safe.
- **Concede something** in every educational post. It is what makes L3 and L8 believable.
- **Third person, product-focused.** "Struggling with fees?" is a personal-attributes phrase and will
  be refused if the post is boosted later. Write every organic post to ad standards.
- **"We", never "I".** No emoji, no hashtag piles, no "🧵", no LinkedIn cadence, no list of adjectives.
  Cut the first sentence of every draft and see if it still works. Usually it does.
- **Competitor figures carry their date.** "Square for Restaurants Plus, £69/month, correct as of
  18 Aug 2026." Never update one yourself.
- **"Competitors charge for POS software" is wrong** and L8 corrected it in public. Free tiers exist.
  The accurate line is about their paid tiers.
- **No merchant named without written consent.** Only the Armenian Taverna shoot is in progress and
  only once the form is signed.
- **Turkish captions are financial promotions too.** Same rails, and rail 4 per upload per language.

## 7. The environment — connectors, skills, tools

Everything is in `STACK.md`; this is the social-session cut of it.

**Connectors to enable on the session:**

| Connector | Why |
|---|---|
| GitHub (this repo) | The warehouse. Required. |
| Higgsfield | Product stills, the render sandbox, `media_upload` for delivering an MP4 |
| ElevenLabs | Voiceover for a Reel that needs one; voices come from `creative_list_voices`, never memory |
| Google Drive | Field photos and notes from Faisal; text exports. It cannot carry an MP4 |
| Google Calendar | Optional — reading the field-day schedule |
| Facebook Ads | **Do not enable.** Paid lives in another session, and a social session with the ads API attached is one misread instruction from a campaign. |

**Skills.** Twenty-two are committed under `.claude/skills/` — the seventeen HyperFrames skills,
`/brag`, and the four Caveman skills. Nothing to install. `/caveman` compresses chat, never a post.

**Toolchain.** Node 22, HyperFrames 0.8.31 pinned in `video/package.json`, GSAP vendored, Poppins
local, system ffmpeg. The session-start hook installs all of it — on a cloud session only.

**Credentials.** None exist to hand over and none should be pasted anywhere. Connectors carry their
own auth. `STACK.md` §1 has the three correct ways to give a session a key if one is ever needed.

## 8. Cloud or local

**Cloud is the right place for this session.** The reasons, verified:

- The session-start hook only runs on the web (`CLAUDE_CODE_REMOTE=true`), so a cloud session has
  both toolchains, ffmpeg and a render browser on first prompt. A local session needs Node 22, ffmpeg,
  `npm install` in `video/` and `npx hyperframes browser ensure` done by hand.
- Connectors (Higgsfield, ElevenLabs, Drive) bypass the network allowlist. They work on the default
  **Trusted** network level with no changes.
- GitHub is scoped per session; nothing to configure.
- Pure-graphics renders (cards, stat animations, the `/brag` piece) run in the container in seconds.
- The container is ephemeral. Anything not pushed is gone when it idles out — which is the right
  discipline for a repo three sessions share anyway.

What cloud **cannot** do, and the workaround for each:

| Blocked at Trusted | Workaround |
|---|---|
| Higgsfield CDN (the real clips) | Render in the Higgsfield sandbox, as every B1 render was |
| `api.elevenlabs.io` direct | Use the ElevenLabs connector; its output on `storage.googleapis.com` is downloadable |
| Freesound, Pixabay | The nineteen committed effects in `video/library/sfx/` and the committed music bed cover most pieces; new sounds are fetched locally or in the sandbox |

If Faisal wants those hosts open, the environment's network setting can be **Custom** with an
allowlist; `video/AUDIO.md` §2 lists the hosts to add. Not needed for the social job on day one.

**Three sessions share `main`.** This one (warehouse, B1, handover notes), the motion session
(`motion/`), and the social session. The rules that keep that safe:

1. `git pull origin main` before the first edit of every working stretch, not just at session start.
2. Small commits, pushed as soon as they check clean. A post that sits unpushed for an hour will
   conflict with someone.
3. Never force-push. Never rewrite history on `main`. A conflict is resolved by merging, theirs
   then yours, the way `video/library/LEDGER.md` was on 16 Sep.
4. Stay inside the files in §1. A conflict in `posts.js` is yours to resolve; a conflict in
   `motion/` means you were somewhere you shouldn't have been.

## 9. Delivery — what "done" looks like for one post

1. The object in `posts.js` is final and pushed. Caption text is the `copy` field, verbatim.
2. The creative is in the `assets` field and exported: PNG per card, named by post id, at the size
   the channel needs. A Reel is an MP4 delivered by `media_upload` or chat attachment, with its
   cover PNG.
3. Alt text written — a plain description, no figures, no finance words.
4. If a synthetic presenter or voice is in it: the upload disclosure line for the description, and a
   reminder to tick the platform's synthetic-content setting. Per upload, per language.
5. One line in chat: what it is, when it's scheduled, what Faisal has to do (post it, and where).

## 10. First-day checklist

- [ ] Read the nine files in §2 in order.
- [ ] `git pull origin main`; `node --check posts.js ideas.js`.
- [ ] Ask Faisal which posts are already live and add the `posted` field to those.
- [ ] Add `assets` to every unblocked post that has a stat card, carousel or cover in its `sketch`,
      so the site draws them. L2, M2, M5, M7 first.
- [ ] Write `export-assets.mjs` (§5.3) and export the week's creative.
- [ ] Confirm which ElevenLabs account the connector is signed into before any voiced piece.
- [ ] Note the competitor-register date (18 Aug) and raise the refresh with Faisal.

## 11. Open questions to bring to Faisal — do not resolve them yourself

- Which September posts are already published, and on which channel.
- L4: has Eray signed off the partner incentive model? Until then it stays blocked.
- M8: is Arman's consent form signed? Until then it stays blocked.
- Flex pricing — still unconfirmed; M9 stays priceless.
- The 0.70% video rate versus the internal ladder is Eray's question, listed on `youtube.html`.
- The competitor register refresh (dated 18 Aug 2026).
- The field-photo supply: who sends what, and where (chat or Drive).

---

## The opening message for the new session

Paste this as the first prompt:

> You are the NeroPay social session. Read `SOCIAL-HANDOVER.md` at the root of this repo first, then
> the files it lists in §2, in order. You own `posts.js`, `ideas.js` and the creative for every
> social post; you do not touch the video series files, `motion/`, `edit/`, or paid advertising.
> Every post obeys the rails in `CLAUDE.md` — no credit or lending language, no earnings claims, no
> prices or rates, concede a case in every educational post, "we" never "I", no emoji or hashtags.
> Nothing publishes from here; you produce captions and files and I post them. Start with the
> first-day checklist in §10 and tell me which September posts you can see are due this week.
