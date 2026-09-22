# Publishing — the contract between the two sessions

Written 22 September 2026 by the content session, for the **nPanda Meta session** — the one that runs the
ad account and posts to Facebook, Instagram, TikTok, LinkedIn and YouTube. Faisal asked for a way for the
two sessions to hand work to each other without either having to ask him what the other did.

**Read this before publishing anything.** It is three pages and it is the whole agreement.

---

## 1. Who owns what

Two sessions work in this repo. The rule that makes that survivable is that they never edit the same file.

| File | What it holds | Who writes it |
|---|---|---|
| `library.js` | **What we made.** Every video, its state, a link to every rendered master | content + motion sessions |
| `published.js` | **What went out.** One record per thing published, per platform | **you** |
| `posts.js` · `calls.js` · `motion.js` · `ideas.js` | the written content and the briefs | content session |
| `motion/` · `video/` · `edit/` | the builds | motion session |
| `META-ADS.md` | the ad account, the audit, Route C | **you** |

**You write `published.js` and `META-ADS.md`. You do not write `library.js`, `posts.js`, `calls.js`,
`motion.js`, `ideas.js`, or anything under `motion/`, `video/` or `edit/`.** If one of those is wrong,
say so — don't fix it. The content session will.

`library.html` joins `library.js` and `published.js` by id and shows one picture. That page is what Faisal
opens.

## 2. Finding something to publish

Open `library.html`, or read `library.js` directly. A video is worth your attention when **all three** hold:

1. `status` is `ready` or `approved`. Not `review` — that one is waiting on Faisal for a reason written
   in its `waiting` field.
2. `clearedFor` includes the platform you have in mind. **`clearedFor: null` means nobody has assessed
   it, which is not the same as cleared.** Ask Faisal; don't assume.
3. `notCleared` does not name that platform. If it does, the reason is in there and it is a real one.

Each record carries a direct MP4 link per crop, the md5, and the build folder. Pick the crop that matches
the platform — the register names them (`9:16 Reels / TikTok / Shorts`, `4:5 Meta ads`, `16:9 YouTube
master`, `1:1 feed`).

**One live example of why this matters.** MG02 "The 18-month rule" is `clearedFor` YouTube, Instagram,
Facebook, TikTok and the website, and `notCleared` for paid Meta — rate-comparison language, a savings
claim, a switching premise, and it positions a firm that is not on the FCA Register in its own right as an
authority on payment regulation. That was your own judgement on 22 Sep, recorded in `META-ADS.md` §10. It
is now in the register so nobody has to rediscover it.

**Two are flagged and unruled**, with the tension written into their `clearanceNote`:

- **B1** turns on a rate comparison (0.50% quoted, 0.70% illustrative) — the same shape you refused for
  MG02 on paid Meta.
- **PP02** carries £100/£200/£300 per merchant and a 20–40% revenue share. You built a PAUSED ThruPlay ad
  set for it on 22 Sep. Route C bars percentage and payout language from an ad, and rail 2 bars earnings
  claims. Every figure travels with its condition, which is why it is fine organically. **Paid is a
  different call and nobody has made it.**

Neither is yours to decide alone. Put them to Faisal, then record the answer in `clearedFor` /
`notCleared` with the date and who decided — and tell the content session, because that field lives in
its file.

## 3. Recording a publish

Add one record per thing per platform to `published.js`:

```js
{ ref: 'MG02', crop: '9:16', platform: 'tiktok', kind: 'organic',
  on: '2026-09-23', url: 'https://www.tiktok.com/@neropay/video/…',
  by: 'meta session · Faisal asked 23 Sep', note: '' }
```

- **`ref`** is a video id from `library.js` (B1, MG02, PP02, NC01, NCEX, PP01, MG01, MG03, MG04, C1–C6)
  or a post id from `posts.js` (L1–L12, M1–M14). It must resolve — the checker fails the build if not,
  because a typo here silently vanishes from the page instead of erroring.
- **`platform`** is one of: `youtube` · `instagram` · `facebook` · `tiktok` · `linkedin` · `website` ·
  `paid-meta`. A paid ad uses `paid-meta` and puts its ad id in `url`.
- **`kind`** is `organic` or `paid`. A boosted organic post gets two records.
- **`by`** names who recorded it and when. An entry nobody can attribute is how the tracking got lost.

Then run the checker and push:

```
node check-register.mjs
```

It resolves every `ref`, validates the platform, the kind and the date, and **refuses a record that
publishes something to a platform it is `notCleared` for.** That last one is the point of the whole file.

## 4. Four things the register does not excuse

- **Rail 4 is per upload.** A video with a synthetic presenter or a synthetic voice needs the
  altered-or-synthetic content setting ticked and the disclosure line in the description **on every
  platform separately, and in every language separately**. It does not carry over from the YouTube
  upload to the TikTok one. Nearly every video we have has a generated voice.
- **Rail 3.** Everything posts as NeroPay. Nothing commercial from a personal profile — that is what cost
  the restricted profile on 21 Aug.
- **Organic is written to ad standards** (rail 9), but that does not make it cleared for paid. Route C is
  a separate and tighter test and it applies only to ads.
- **Don't publish something in `review`.** The `waiting` field says what is outstanding, and on NC01 it is
  simply Faisal's approval — which also blocks post L12.

## 5. Git, with two sessions in one repo

```
git pull origin main      # before you start writing. Always.
… edit published.js …
node check-register.mjs
git add published.js && git commit && git push -u origin main
```

Push as soon as the record is written rather than batching a day's publishes — a record sitting
uncommitted in your container is invisible to everyone, which is the failure this file exists to stop.
The session-start hook warns when the checkout is behind; believe it.

If you do hit a conflict in `published.js`, it will be two sessions appending records to the same array.
Keep both sides — publish records are facts, not opinions, and losing one loses a fact.

## 6. What the content session owes you

- A row in `library.js` in the same commit that renders a video, carrying the crop, the link, the md5 and
  the build folder. No hunting through Drive READMEs.
- An honest `status` and a `by` that names who set it.
- A straight answer on clearance when you ask, recorded in the file rather than in chat.

If any of that is missing, say so. The register only works if both halves are kept.
