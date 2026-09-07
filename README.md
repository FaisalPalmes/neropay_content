# NeroPay Content Warehouse

Every NeroPay social post, video script and publishing date in one place. Static HTML — no build
step, no dependencies, no framework.

**Live:** deployed on Vercel from `main`.

---

## What's in here

| Page | What it holds |
|---|---|
| `index.html` | What social is for, the three channels, the five pillars, how the week works |
| `social.html` | All 18 posts — final copy, creative direction, rough sketches, filters |
| `youtube.html` | Three YouTube series — Explained by NeroPay (owners, partners) and Behind the Counter — every shot, every prompt, every on-screen graphic as a downloadable file |
| `ideas.html` | The backlog: series proposed, one-offs tied to dates, the next Behind the Counter episodes — each judged by the engine rule |
| `calendar.html` | Sixteen weeks, 7 Sept – 3 Jan, with the immovable dates marked |
| `rails.html` | Compliance rails and how the channel is measured |

```
.
├── index.html · social.html · youtube.html · calendar.html · rails.html
├── style.css              one stylesheet, light + dark, CSS variables at the top
├── app.js                 post rendering, sketches, filters, copy buttons
├── posts.js               the 18 social posts  ← edit this to add a post
├── videos.js              generated from generation-pack.md — do not hand-edit
├── calls.js               Behind the Counter series  ← hand-edited, copy an episode to add one
├── ideas.js               the video backlog — proposed series and one-offs  ← hand-edited
├── overlays.js            the video graphics drawn as SVG — overlays, cards, plates, disclosure, specimen statements
├── generation-pack.md     source of truth for the video series
├── vercel.json
├── README.md
└── CLAUDE.md              rules Claude Code reads automatically — rails, voice, brand, what's blocked
```

**Everything is at the top level on purpose.** No subfolders. GitHub's web uploader silently skips
folders when files are picked through the file-chooser dialog rather than dragged, which breaks the
site in a way that's hard to spot — the HTML loads and the styling just vanishes. Flat means every
upload works, whatever route you take.

---

## Adding a social post

Open `posts.js`, copy any object, change the fields. It appears on `social.html`
automatically, filters and all.

```js
{
  id: "L9",                       // L = LinkedIn, M = Meta. Keep them unique.
  channel: "linkedin",            // "linkedin" | "meta"
  pillar: "Statement",            // Statement | Street | Product | Merchant | Partner
  format: "Text only",
  date: "Mon 20 Oct",
  blocked: false,                 // or a string saying what must happen first
  title: "Short internal label",
  copy: "The post itself.\n\nUse \\n\\n for paragraph breaks.",
  creative: "What to shoot or make, in words.",
  why: "Why this post works. Optional.",
  sketch: { type: "none", cap: "One line under the sketch." },
  assets: [                       // the creative, drawn and downloadable under the post
    { t: "stat", size: "sq", big: "42%", line: "…", src: "Correct as of …" }
  ]
}
```

**Asset types** — `stat` (one figure), `quote` (a pull line, optional on text-only posts), `cards`
(a carousel: `cards:[{n, h, b}]`, one file per card), `cover` (a Reel opening frame, `ai:true` adds
the presenter disclosure), `ref` (an asset that already exists on `youtube.html`, by id). Sizes:
`sq` 1080×1080, `pt` 1080×1350, `st` 1080×1920. Charcoal ground, white type, yellow accent, wordmark
bottom-left. No money figure ever dominates an image — that is the rule that got the profile restricted.

**Sketch types** — `reel`, `carousel`, `statcard`, `photo`, `none`.

```js
// reel      subject: "presenter" | "product" | "street" | "graphic"
sketch: { type:"reel", subject:"product", beats:["beat 1","beat 2"], cap:"…" }

// carousel  up to 4 card labels shown
sketch: { type:"carousel", cards:["title","card 2","card 3","…"], cap:"…" }

// statcard  one big figure
sketch: { type:"statcard", big:"42%", line1:"…", line2:"…", src:"Correct as of …", cap:"…" }

// photo     shapes are [x,y,w,h] in a 200×112 box; focus is [x,y]
sketch: { type:"photo", shapes:[[10,44,42,58]], focus:[84,60], note:"…", cap:"…" }

// none      text-only post
sketch: { type:"none", cap:"Text only." }
```

The sketches are deliberately rough. They show composition and hierarchy — where the subject sits,
what the eye hits first — not finished design. Replace with real creative when it's shot.

---

## Adding or changing a video

`generation-pack.md` is the source of truth. `videos.js` is generated from it, so edit the
markdown and regenerate rather than editing the JS by hand — otherwise the two drift apart and
nobody knows which is right.

The parser reads this structure:

```
# B1 — Title of the video
*Series B - … · aspect 16:9 · runtime 2:53 · 18 presenter shots · 7 overlays*

## Presenter shots
### B1-01 · 0:00–0:10
> The spoken line goes here as a blockquote.
```(fenced block: the full generation prompt)```

## Overlay clips
### OV-1 — 23s — sits over B1-03 and B1-04
**Step 1 · Still** … ```(fenced prompt)```
**Step 2 · Animation** … ```(fenced prompt)```
```

### The generation workflow on `youtube.html`

Every shot has two copy buttons. **Copy global + shot** is the one to use: it pastes the presenter
global and the shot prompt together, which is what Higgsfield wants. **Shot only** is there for
when the global is already in the box. Overlays work the same way — a still prompt for the image
model, then **Copy global + animation** for the video model. **Copy every generation for B1** at
the top of each video dumps all of it in timeline order, divided by `=== id ===` lines.

Each video is one timeline. Presenter shots are yellow; overlays are purple and sit in the
timeline at the point they start (just before the first shot they cover), each carrying its
still prompt, animation prompt and exact asset. That is the convention for every video, including
any added later — the page does it from the `sits over …` line, so nothing extra is needed.

### Behind the Counter (`calls.js`)

The second YouTube series: a fortnightly video-call montage. One question from the NeroPay side,
answered by six AI-generated owners in their own premises, cut together from short bites. Unlike the
Explained pack there is no markdown source — `calls.js` is hand-edited data, like `posts.js`. To add
an episode, copy one, give it the next `C#` id, date and question, and write the shots: `kind` is
`host`, `bite`, `title` or `end`; `who` is a cast key; `secs` drives the timecodes; the paste-able
prompt is built for you. The cast and the two globals live at the top of the same file.

Rules that keep the series legal: everyone is AI-generated and the disclosure runs over the first
three seconds; the owners are composite characters with first names only, they describe situations
and never endorse NeroPay; the host carries the product facts and the concession; no rate, no price,
no competitor named. On the page, host shots are yellow, owner bites blue, and the question card
purple at the point it sits.

### The graphics (`overlays.js`)

Every graphic the scripts put on screen is drawn as SVG in `overlays.js` and shown on
`youtube.html` under its prompt and in the Assets tab: the 21 overlay stills, the title and end
cards, the AI-presenter disclosure and the two specimen statements. Download as a transparent PNG
(drop it straight on the timeline), a PNG on black (Screen/Add blend) or the SVG. Figures are
typed by hand, so if a number changes in `generation-pack.md` it has to change in `overlays.js`
too — search for the old value. Nothing in there is new content; each asset is one the pack
already specifies, and the ground rules from the overlay global (black or transparent, white
sans-serif, one yellow accent, no icons, no logos except the wordmark on the cards) are baked in.

---

## Deploying

Vercel is connected to this repo. Push to `main` and it redeploys — there is no build command, it
serves the files as they are.

```bash
git add .
git commit -m "Add October posts"
git push
```

To preview locally, open `index.html` in a browser. Everything works from the filesystem — the data
files load as scripts rather than by `fetch`, specifically so this works without a local server.

---

## House rules

Two of the compliance rails carry criminal or account-ending consequences and one of them has
already cost NeroPay a restricted profile. **Read `rails.html` before writing anything.** The short
version:

- NeroFinance, merchant cash advance and any credit or lending language never appear anywhere
- No earnings claims on any platform — no "passive income", "no effort", "risk-free", no large money
  figures as the dominant element on an image
- Nothing commercial from a personal profile
- AI-generated presenters get an on-screen disclosure in the first three seconds
- Every competitor figure carries a date and a screenshot kept on file
- No merchant named without written consent
- Demo data only — never the live dashboard, never real transactions

---

*Built 2 September 2026. This site is unlisted and carries `noindex` — it's an internal working
document, not a public one.*
