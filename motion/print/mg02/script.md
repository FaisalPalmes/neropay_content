# MG02 — The 18-month rule · Small Print

v4, 16 September 2026. Script rewritten with Faisal line by line (drafts 1 and 2 in the session): plain,
educational, nothing forced, a question on screen under the opening line, an ending that asks the viewer to
act, and the sign-off shape every video will share — what to do, how to reach us, "that's it for today", follow.

Voice: Verity (`oW8bn5YtBB89X2nJ0DT9`), `eleven_v3`, one take, 58.7 s (flow `ns3m8FupNDBjPPLIO8eV`, node
`vijJnXSSffXJtTJCwsVJ`, 952 credits). Word timings: faster-whisper `small.en` in the Higgsfield sandbox.
Bed: `video/library/bgm/underscore-120-a.mp3`, 117.45 bpm, looped at bar 24 so it runs under the whole minute.
HEAD = 2 beats, TAIL 1.6 s → 61.06 s. White editorial. Board, five stations, no pull-back; the end card is stage level.

## The take, as generated

> [excited] If you rent your card machine, there's a rule you should know about.
>
> [serious] Since January twenty twenty-three, the payments regulator says a terminal lease can only tie you in for eighteen months. Not three years. Not four.
>
> When those eighteen months are up, the big providers have to write and tell you. The letter gives the date your minimum term ended, and that you're free to switch to another card machine provider.
>
> If you choose to stay, you can still leave at any time after that, as long as you give them one month's notice.
>
> [warmly] Some deals are fine as they are. But you won't know until you compare. [excited] Comparing terminal rates is easy, it doesn't take long, and the difference between providers adds up over a year.
>
> Here at NeroPay you can get a quote in minutes. Drop us a message or give us a call and speak to someone from our team.
>
> That's it for today. Give us a follow to keep up with more videos like this.

Two rails held in the edit: "could save hundreds if not thousands" was left out (rails 2 and 8 — no money
figure, no promised saving; "adds up over a year" carries the point), and "Some deals are fine as they are" is the
one-clause concession the style requires, followed straight away by the push to compare. Whisper heard the brand as
"Niropay" again — listen before it ships.

## The objects

`motion/lib/objects3d.js` v4: `neroTerminal()` is the product from Faisal's photos — a white slab with a
full-height display and the till UI on it, a small camera, a white dock; the wordmark sits on the dock and on the
screen's status line, nothing louder. `oldTerminal()` is a generic older machine — grey, chunky, a small monochrome
LCD, rubber keys, a paper slot — for "the one you're tied to". No maker's name anywhere, nothing that identifies a
competitor, and the maker of our own hardware is not named in any file.

## Board and camera

| Station | Board centre | What happens | Lands |
|---|---|---|---|
| S0 question | 800, 780 | *When does your card machine contract actually end?* types in word by word under the first line; the old machine drops in beside it | 0 s |
| S1 rule | 2500, 780 | **The 18-month rule.** with a highlighter stroke behind "18-month" on "eighteen" · SINCE JAN 2023 stamp · PSR · PS22/2 kicker · three pillars: 3 years and 4 years rise on "tie you in", 18 months rises gold on "eighteen", the two tall ones sink on "not three years" and "not four" | beat 8 (4.36 s) |
| S2 letter | 1025, 2280 | **They have to write to you.** · 14 largest providers · from July 2023 · the envelope lands on "When", opens on "up", the glass letter rises on "write": *Your minimum term ended on DD·MM·YYYY* (underline on "date"), ✓ *free to switch provider* on "switch" · the old machine slides out on "switch", ours slides in on "another" | 15.0 s |
| S3 month | 2900, 2280 | **One month's notice.** · *if you choose to stay* · 31 day tiles drop in, ripple on "stay", fall away on "leave"; the 1 MONTH pill and the highlighter on "notice" on "one month's" | 26.6 s |
| S4 compare | 1350, 3880 | *Some deals are fine as they are.* / *But you won't know until you compare.* · **Compare your rates.** · both machines side by side on "Comparing terminal rates" · twelve month tiles turn gold in a run on "adds up over a year", kicker *the difference, over a year* | beat 66 (33.85 s) |
| End card | stage | the NeroPay terminal drops in on "Here" · **Get a quote in minutes.** · MESSAGE US · CALL US pills on the words · neropay.app · *That's it for today.* · FOLLOW FOR MORE VIDEOS LIKE THIS on "follow" | 46.4 s |

Only the station the camera is on is drawn (the one it is leaving fades over the move), so nothing from a
neighbouring station peeks into the 16:9 frame. No masthead, no footer, no episode number.

## Sound

36 cues, 15 distinct effects, each on something moving (`data/mix.json`); the bed at 0.30 ducked 5:1 under the
voice; two-pass loudnorm to −14 LUFS with a true-peak limiter.

## Delivered 16 Sep 2026 (v4, Higgsfield CDN, prefix `https://d2ol7oe51mr4n9.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/`)

9:16 `163db0df-7fb4-44f4-aea9-e2cfba052a5b.mp4` · 16:9 `77184997-b750-409b-ade2-b7f779fbc104.mp4` ·
4:5 `ebd7a25e-4c31-4000-9286-cd1d6d3683e1.mp4` · 1:1 `d0c2bad1-6363-4807-9010-d16a0faa7542.mp4` ·
contact `aa235c41-0ff3-4543-b75f-f607be8a33b1.jpg`. Master −14.64 LUFS / −1.17 dBTP, 61.1 s, no single-frame spikes.
