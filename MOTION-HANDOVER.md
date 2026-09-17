# Motion graphics & video — the handover for a session making NeroPay content

Written 17 September 2026 by the session that built The Maths, Small Print and the two Partner Programme videos
(`motion/`), for the session that owns social — LinkedIn first, Instagram and Facebook second — and will make longer,
educational pieces (one to two minutes, never over three) rather than paid ads. It assumes you already have the NeroPay
context. It gives you the design side: how the videos look, how they are made, what Faisal likes and does not, the
stack and the skills, and the fundamentals that make a NeroPay piece land. Everything here is on `main` of
https://github.com/FaisalPalmes/neropay_content — read `CLAUDE.md` at root first, then this.

---

## 1. The one-paragraph version

NeroPay content is **white, sharp, plain and local**. Off-white ground, ink type, the yellow as the single accent, a
little blush and lilac where a graphic earns it. Poppins does the talking, a monospace does the numbers, an italic serif
does the human aside. Everything moves the whole time but nothing overshoots. A British woman's voice reads one
continuous piece of talking, UGC-plain, with no one-liners and no breaths. Every figure sits with its condition on the
same frame. Every educational piece concedes something. It closes on `neropay.app` (or `neropay.app/partners`) and holds
the compliance line long enough to read. Faisal reviews before anything posts.

---

## 2. The look — what "NeroPay" means on a frame

**Ground.** Light mode only. Faisal killed the dark ground on 17 Sep 2026 ("no more black background theme"). The world is
`#FBFAF7` with a soft radial to `#F1EFE8` at the edges; paper, not a gradient you notice. Never charcoal, never neon.

**Colour.** Ink `#141416` for type. Yellow `#F5C518` as the accent and only the accent: the marker under the word the voice
is hitting, a pill, the lit window of a shop, the terminal's head. Blush `#F4BDB6` and lilac `#C9B8F5` are allowed at a
whisper inside glass tints. Green `#2FBF71` only for a LIVE / SENT state. No blue, no saturated fields, no gradients on
type.

**Type, three faces, three jobs** (`motion/CLAUDE.md`, "Type hierarchy is the animation"):

| Face | Job | How it moves |
|---|---|---|
| **Poppins 700**, letter-spacing −.035em | the shout: headings, the big word, pills | rises word by word, tracking settles from wide to tight |
| **Martian Mono 700 / 400** | every figure, date, kicker (small caps, wide tracking) | counts, rolls, ticks, stamps — never fades |
| **Source Serif 4 italic** | the human line: the question, the aside, the concession | rises softly, half a beat late |

Colour by phrase: the thing the voice is hitting is the thing that is yellow. Italic is the voice dropping to an aside.
Caps and size are the voice raising. **The frame should read as the narrator's performance with the sound off.**

**Liquid glass, kept to the rule.** One frosted slab per idea: even white tint, thin bright rim, soft drop shadow, one
sheen pass on entrance. Pills, badges, the receipt, the nameplate. Never glass for its own sake, never two glass objects
competing, never `backdrop-filter`. The value badge is the inverse: ink fill, white mono type.

**Objects, not clip art.** Real 3D objects built from primitives in three.js (`motion/lib/objects3d.js`,
`motion/lib/glass.js`): our terminal (the only branded object, ever), a run of shopfronts, tiles, pillars, a lamp post, a
phone, a printing receipt, a van, one real payment card (no number, no scheme mark, not a NeroPay card). Matte, soft-lit,
one contact shadow, standing on paper. Nothing enters from above — objects rise out of the paper and sink into it.

**Composition.** One idea per frame, composed like a magazine spread, not centred: something small in a corner, something
large across the middle, empty space doing work. Type alternates left, right and centre from beat to beat so nothing sits
in the same place twice running. Captions are drawn in the picture (grey Poppins, the current word ink on a yellow
marker, a small pop on each word), never a black strap.

**Brand rules that never bend** (`CLAUDE.md`): "Nero" ink/white, "Pay" yellow; the terminal is the only branded object; no
NeroPay cards, mugs, pens; everything sharp and deep, no bokeh; no price or rate on screen; never Verifone or Stripe.

---

## 3. What Faisal likes — the rulings, in the order he gave them

These are his words turned into rules. They beat any general instinct.

1. **No AI slop.** A level dry read, one centred figure on a card, every beat the same shape — rejected on day one. High
   energy is investment, not volume.
2. **UGC-sounding, continuous, engaging from the first word.** No "show phrases", no one-liners, no gaps, no breaths.
   The script is one piece of talking. Tighten the take gently (`tighten.mjs --gap .32 --min .45 --tempo 1.03`) and gate
   only silence (`gate.py --inset .12 --max -30`) — harder settings clipped into words and he heard it.
3. **Light mode. Yellow accents. A little pink or purple where it earns it.** Keep the 3D vibe but "more 4D": something on
   screen must be moving at every moment — the camera drifts and breathes, objects sway, the field breathes.
4. **Every phrase that can be a graphic is one.** "You introduce them" draws paths; "we set them up" lands a terminal;
   "every month" ticks chips; "only bring one" ticks one of four weeks; "make the call" gets struck through.
5. **Variety in the frame.** Not everything on the left facing right.
6. **No floating shapes.** Spheres rejected; glass rings and coins rejected. One real, relevant object per frame at most,
   subtle, at the edge, never the focus.
7. **The text animation should be good.** Word-by-word rise with a tracking settle, a typewriter with a caret, an odometer,
   drawn strikes, hanging signs, captions that pop — this is the current bar (PP02).
8. **Lead with the potential, for a stranger.** The hook assumes the viewer has never heard of us. A question or a
   statement, then how, then why it is easy. Start instantly.
9. **No place names in copy meant to travel.** "Your road", not Wilmslow Road, so one build serves every Meta location.
   (Organic Statement posts are the exception — local and specific is the register there.)
10. **The bonus is said as paid, only delayed.** "Once they've been taking card payments with us for thirty days", never
    "based on what they take". The tier condition lives on screen, not in the sentence.
11. **Nothing may sound like work for the partner.** We handle everything; a name and a number is enough and we close it.
    "Walk down your road and count" was cut for this.
12. **The ending is a real ending.** Free to join, the link on something physical (a nameplate), the question left with the
    viewer, the compliance line held.
13. **A full analysis before hand-over, every time.** Timing law, frame scan, spike scan, contact sheet, loudness. He
    reads it.
14. **Money and stats are grand, once.** One large figure per frame with its condition under it in readable type; never a
    second small copy of the same figure (a receipt repeating the hero figure was rejected). Counts fly in large and
    settle; no rolling digit columns. No empty sky: the frame is full.
15. **Never delete a previous note on Drive.** Rename it "superseded" and add a new one.
16. **The voice leads; nothing is on screen before it is said.** Every graphic lands on the word that earns it: headings
    rise word by spoken word, a typewriter types each word as it is said, a shop lights on the word that names it, a
    phone types on "name" and "number", a van stops on "close it". The overlays should feel as if the narrator is pointing
    at them. Anchoring a graphic to the camera landing (so it is already there when she gets to it) was rejected.
17. **The opening count is the hook, with a purpose.** Large, in a glass tile, counting something visible, and flipping
    into the question mark of the question itself — never a lone "?". Liquid glass is used sparingly, under what matters.
    A vehicle that delivers stops in the frame; nothing branded is cut by the frame edge.
18. **Objects float in the upper half; vehicles sit flat.** The phone, the terminals and the receipts hover above the
    street, never in front of a shop or in the bottom half. A van never hovers or pitches. Red, animated strikes. A
    climb never teleports: fixed-width digits, the rate rolling into place. Panels in a stack keep clear space between
    them. A soft shadow under type and panels for depth, never a hard one.

---

## 4. Fundamentals — why a NeroPay piece works, ad or educational

**The rails are the strategy, not a constraint on it** (`CLAUDE.md`, `rails.html`, `motion/CLAUDE.md`). No earnings claims
and no personal-attribute phrasing is exactly what makes the copy read as honest to an owner-operator who has heard every
pitch. Write organic to ad standards because any post may be boosted. Third person, product-focused, "we" never "I".

**Win the first three seconds, then the next five** (`motion/partner/BRIEF.md`, Part 4). Three hook kinds work: a question
the viewer answers in their head before they can stop ("How many of the business owners on your road actually know your
name?"), a per-unit "you could be earning…" tied to a place the viewer is standing in, and the absurd-but-true statement
that the body then proves. The first line after the hook must escalate it, not start over. Intensity is a big single
number, a hard cut, a typewriter hitting a full stop, a tick — never an exclamation mark, never shouting.

**One video, one number, one concession.** The Maths does one number worked out on screen. Small Print does one rule. A
partner video does one programme with every figure beside the condition that earns it, per unit never a total. Every
educational piece names a case where the viewer should stay where they are — it is rail 8 and it is also the reason
anyone watches to the end.

**Say the condition on the same frame as the figure.** In a sentence for the ear, in a super for the eye, in the
compliance line for the record. A figure without its condition is a compliance incident, not a typo; the stage-3 gate
(`motion/verify.py` + each episode's `checks.py`) asserts it in code.

**Local, specific, plain.** Manchester streets and real counts in organic posts (98 food businesses in 800 metres of
Wilmslow Road). Trading types, never names, on anything drawn. No hashtag piles, no emoji, no LinkedIn-guru cadence. Cut
the first sentence of any draft and see if it still works.

**Relatable means the viewer's situation, never their attributes.** "The café you're stood in", "your road", "the person
everyone asks about card machines". Never "struggling", never "unemployed", never age or origin.

**Length by job.** Paid social modules: 22–28 s (the brief), though the two partner videos run 49 s and 68 s as complete
pieces. Organic educational: one to two minutes is the sweet spot, three is the ceiling. YouTube long-form: 2:30–3:00
chaptered. Whatever the length, the timing law holds: a beat with N words to read is on screen for at least
max(1.5 s, N × 0.4 s), asserted in code, and the compliance super gets its own beat.

**Close the same way every time.** What to do (compare, ask, join), how to reach us (`neropay.app`, spoken and on screen),
and on educational pieces a follow line. The end card is the mark, one line about who we are, the pill, the URL.

**Disclosure.** Rail 4: no AI wording inside the video (Faisal, 9 Sep 2026). At upload: tick the synthetic-content
setting and put "Voice generated with AI" in the description. Behind the Counter (AI people) carries it on screen; the
faceless motion pieces do not.

---

## 5. How a video is made — the pipeline, end to end

Read `motion/CLAUDE.md` (the spec) and `motion/README.md` (the tools) before touching `motion/`. The short version:

1. **Brief and script.** Proposal first (`PROPOSAL.md` in the episode folder): the angle, the hook, the script, how it
   looks, stop by stop. Faisal approves the script before a take is generated. Write it as one person talking.
2. **Figures.** Every number goes in `figures.json` as a `confirmed` record before it goes on screen. `checks.py` in the
   episode asserts it; `python3 motion/verify.py partner/pp02` is the gate.
3. **Voice.** ElevenLabs through the connector: `creative_generate_in_flow`, `node_type: tts`, `eleven_v3`, one
   generation, on flow `V5Z2DUgxnS9rAnIxR1yP`. Voices: **Verity** (`oW8bn5YtBB89X2nJ0DT9`) for the merchant series,
   **Olivia — Warm, British Female** (`pPoztmvzd5p26S3MsNrV`) for the partner series. The MP3 lands on
   storage.googleapis.com, which the web container can download. Every take gets a row in `video/library/LEDGER.md`.
4. **Word timings.** faster-whisper `small.en` in the Higgsfield sandbox (`sandbox_exec`), the script as the initial
   prompt → `data/vo_words.json`. Then `tighten.mjs`, then `gate.py`. Anchors in the composition are found **by the word**
   (`at('three hundred')`), never by index, so a re-take re-times everything.
5. **Bed.** Eleven Music v2 through the same connector (`node_type: music`, "no vocals, no hook, constant tempo"),
   checked for speech with Whisper, tempo measured with `motion/tempo.py`, committed under `video/library/bgm/` with a
   ledger row. The composition starts on a beat (`HEAD = 2 × BEAT`).
6. **Composition.** One HTML page per episode (`index.html`), an ES module: three.js world (`motion/lib/world3d.js`),
   DOM type placed in the scene by the CSS3D renderer, objects from `objects3d.js`. `setFrame(n)` is a pure function of
   time — no randomness, no transitions — so every render is identical. Captions from `data/caps.js`.
7. **Peek, then render.** `node motion/peek.mjs partner/pp02 4x5 2 9.5 30` prints the timing-law report and a contact
   sheet of chosen seconds. `node motion/render.mjs partner/pp02 --ratio 4x5 --jpeg` runs the law, the frame scan
   (nothing may overflow or sit under the captions) and then the frames — about 0.8 s a frame, so 30 minutes for a
   minute of video. Crops run one after another, never in parallel.
8. **Mix.** `data/mix.json`: the VO at `head`, the bed at `gain` ducked 5:1 under the voice, SFX cues from
   `video/library/sfx/` keyed to the anchors, none twice in a row. `node motion/mix.mjs partner/pp02` masters to
   −14 LUFS / −1.5 dBTP, stereo, with a limiter stage when the peaks would hold the gain back.
9. **Finish and analyse.** `finish.sh 4x5` muxes; then the loudness read, the single-frame luma spike scan, the
   frame-to-frame jump scan, a 27–30 frame contact sheet read by eye.
10. **Deliver.** `media_upload` + curl PUT + `media_confirm` to the Higgsfield media store (a CloudFront link), the MP4
    attached in chat, a README doc in the Drive folder (`PARTNER VIDEOS › 09-2026 › Motion graphics › PPxx`), the
    delivery recorded in the episode's `script.md`, commit, push to `main`.

Everything in `out/` is git-ignored; the sources, the take, the words and the mix spec are committed so any session can
re-render.

---

## 6. The stack and the skills

**Toolchain in the container** (`STACK.md` §4): Node 22, Playwright with Chromium (`/opt/pw-browsers`), ffmpeg/ffprobe,
Python 3 with numpy, three.js r170 vendored at `motion/assets/vendor/`, HyperFrames 0.8.31 pinned in `motion/` and
`video/`, fonts vendored under `motion/assets/fonts/` (Poppins, Martian Mono, Source Serif 4, Chivo). **No CDN scripts** —
the container blocks them; vendor everything.

**Connectors** (`STACK.md` §2): ElevenLabs (voice, music, SFX; direct `creative_generate_speech` is often refused by the
permission classifier — use `creative_generate_in_flow`), Higgsfield (`sandbox_exec` with open internet, `media_upload`,
`media_confirm`, image and video generation for plates only), Google Drive (docs and folders; cannot carry files over a
few MB; `update_file` only renames or moves), GitHub (this repo only).

**What the network reaches** (`STACK.md` §6): GitHub, storage.googleapis.com, the proxy's allowlist. Not the Higgsfield
CDN (fetch clips in the sandbox), not ElevenLabs' own API host, not HuggingFace, not Freesound.

**Skills, committed under `.claude/skills/` so every session has them:**

- `hyperframes` — the router for any request to make or edit a video in `video/`; it picks the workflow:
  `embedded-captions`, `talking-head-recut`, `motion-graphics`, `general-video`, `faceless-explainer`,
  `product-launch-video`, `slideshow`, `remotion-to-hyperframes`, plus the domain skills `hyperframes-core`,
  `hyperframes-animation`, `hyperframes-keyframes`, `hyperframes-creative`, `hyperframes-audio`, `hyperframes-cli`,
  `hyperframes-registry`, `media-use`, `brag`.
- `linkedin-post` — write or audit a NeroPay LinkedIn post against the rails and the voice, before it goes into `posts.js`.
- `caveman`, `caveman-commit`, `caveman-help`, `caveman-review` — token-saving reply modes; `STACK.md` §3 says what they
  may and may not compress (never a rail, a figure or a legal line).

**Two toolchains for video, chosen by the job** (`CLAUDE.md`, "Editing video"): `edit/` (Remotion) is the fixed edit for
the presenter series; `video/` (HyperFrames) is for captions, overlays on footage, Reels, stat cards, promos; `motion/`
(our own frame-by-frame renderer) is for faceless motion graphics with exact figures. For a one-to-two-minute educational
piece with numbers in it, use `motion/`. For dressing a talking-head clip, use `video/` via `/hyperframes`.

---

## 7. Links — everything the other session may need

Repo: https://github.com/FaisalPalmes/neropay_content (branch `main`; Vercel redeploys on push).

Rules and briefs:
- https://github.com/FaisalPalmes/neropay_content/blob/main/CLAUDE.md — the working rules and the ten rails
- https://github.com/FaisalPalmes/neropay_content/blob/main/rails.html — the rails as a page, for copy
- https://github.com/FaisalPalmes/neropay_content/blob/main/STACK.md — connectors, credentials, toolchain, network
- https://github.com/FaisalPalmes/neropay_content/blob/main/SOCIAL-HANDOVER.md — the social session's own brief
- https://github.com/FaisalPalmes/neropay_content/blob/main/SOCIAL-BRIEF.md — the light-glass look for social cards
- https://github.com/FaisalPalmes/neropay_content/blob/main/motion/CLAUDE.md — the motion graphics spec (the look, the
  rules, every ruling with its date)
- https://github.com/FaisalPalmes/neropay_content/blob/main/motion/README.md — the tools and the commands
- https://github.com/FaisalPalmes/neropay_content/blob/main/motion/partner/BRIEF.md — Faisal's partner brief v4, with
  the hook library (37 hooks) and the five hard rules
- https://github.com/FaisalPalmes/neropay_content/blob/main/motion/partner/CLAUDE.md — the partner series brief and
  the two standing rulings
- https://github.com/FaisalPalmes/neropay_content/blob/main/MOTION-SYSTEM.md — camera angles and overlay timing for
  the presenter videos (shares the timing law with `motion/`, nothing else)
- https://github.com/FaisalPalmes/neropay_content/blob/main/video/PLAYBOOK.md and
  https://github.com/FaisalPalmes/neropay_content/blob/main/video/LESSONS.md — Faisal's standards and the fault log
- https://github.com/FaisalPalmes/neropay_content/blob/main/video/AUDIO.md and
  https://github.com/FaisalPalmes/neropay_content/blob/main/video/library/LEDGER.md — the sound note and the licence ledger
- https://github.com/FaisalPalmes/neropay_content/blob/main/figures.json — the figure register (the gate)

Reference motion-graphics briefs Faisal saved (style references only, never copied):
- https://github.com/FaisalPalmes/neropay_content/blob/main/motion/MOTION-GRAPHICS-BRIEF.md
- https://github.com/FaisalPalmes/neropay_content/blob/main/motion/MOTION-REFERENCE.md (the Webflow one — his favourite)
- https://github.com/FaisalPalmes/neropay_content/blob/main/motion/MOTION-BRIEF-02-STOCKCHARTS.md
- https://github.com/FaisalPalmes/neropay_content/blob/main/motion/MOTION-BRIEF-03-INFINITUMX.md

Worked examples to copy patterns from:
- https://github.com/FaisalPalmes/neropay_content/tree/main/motion/partner/pp02 — the current bar: the street, the
  walk, the type animation, `checks.py`, `mix.json`, `script.md`, `claims.md`
- https://github.com/FaisalPalmes/neropay_content/tree/main/motion/partner/pp01 — the arc world, the Bonus Dial and
  Rate Climb modules, `AI-PLATES.md` (the brief for generated background clips)
- https://github.com/FaisalPalmes/neropay_content/tree/main/motion/lib — `world3d.js`, `objects3d.js`, `glass.js`
- https://github.com/FaisalPalmes/neropay_content/tree/main/video/b1-v8 — the presenter-video reference build

Skills: https://github.com/FaisalPalmes/neropay_content/tree/main/.claude/skills (each folder has a `SKILL.md`).
HyperFrames docs index: https://hyperframes.heygen.com/llms.txt.

Delivered videos (Higgsfield media store):
- PP01 v4, 4:5: https://d2ol7oe51mr4n9.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/4a729d5b-051f-49ab-b2ba-0a9480f161e6.mp4
- PP02 v1, 4:5: https://d2ol7oe51mr4n9.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/f75b4167-7c13-487c-a6eb-4d892128d3ce.mp4

Drive: `PARTNER VIDEOS › 09-2026 › Motion graphics` — https://drive.google.com/drive/folders/1HsPnvs3cMF_1UTBLFY-J-hCHwR90QRaU
(PP01 folder `11gSOA2be260FQlJcRUN2ZxPvMwn4AtUU`, PP02 folder `1wyUXzCzfII9BXtTcVngt-SIxDJ8EGd3z`; a README doc per delivery).

ElevenLabs flow used for every partner take and bed: https://elevenlabs.io/app/flows/V5Z2DUgxnS9rAnIxR1yP.

---

## 8. Making a one-to-two-minute educational piece — the shape that works

For LinkedIn (partners, installers, accountants, wholesalers) and for Instagram and Facebook (owner-operators):

1. **Hook, first 1.5 s**: a question the viewer has to think about, typed in under the first spoken line. Not a number,
   not a slogan.
2. **Who this is for and the thing worth knowing**, in one plain sentence.
3. **The rule, the number, or the mechanism**, one at a time, each phrase becoming a graphic, each figure with its
   condition on the frame. Use the Bonus Dial / Rate Climb pattern for tiers, a ledger row for a change of state, a
   receipt for a payment, a calendar strip for a deadline, a strike for a claim being retracted.
4. **What it means for you**, then **the concession** — the case where they should do nothing — as an italic aside.
5. **The push to act** and how to reach us, then "that's it for today", then the follow line (educational only).
6. **The compliance super**, held for its own beat.

Format: 4:5 for Meta feed, 9:16 for Reels and TikTok, 1:1 as a fallback, 16:9 for LinkedIn and YouTube (rendered without
burnt captions). Captions in the picture on every social crop. Post as NeroPay, never from a personal profile.

If it needs a shoot, its own research, or a figure that is not in `figures.json`, it does not happen until Faisal brings
the doc or confirms the number. Ask, don't guess.
