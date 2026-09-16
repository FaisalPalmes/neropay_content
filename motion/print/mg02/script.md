# MG02 — The 18-month rule · Small Print

v5, 16 September 2026: the v4 script and take, the picture rebuilt as one 3D world (see *World and camera*). v4, 16 September 2026. Script rewritten with Faisal line by line (drafts 1 and 2 in the session): plain,
educational, nothing forced, a question on screen under the opening line, an ending that asks the viewer to
act, and the sign-off shape every video will share — what to do, how to reach us, "that's it for today", follow.

Voice: Verity (`oW8bn5YtBB89X2nJ0DT9`), `eleven_v3`, one take, 58.7 s (flow `ns3m8FupNDBjPPLIO8eV`, node
`vijJnXSSffXJtTJCwsVJ`, 952 credits). Word timings: faster-whisper `small.en` in the Higgsfield sandbox.
The take is tightened with `motion/tighten.mjs` (nine gaps to 0.34 s, 58.7 s → 53.6 s; the raw take is kept as `data/vo-raw.mp3`).
Bed: `video/library/bgm/underscore-120-a.mp3`, 117.45 bpm, looped at bar 24. HEAD = 2 beats, TAIL 1.6 s → 55.86 s. White editorial. Board, five stations, no pull-back; the end card is stage level.

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

## World and camera — v5

One three.js scene: a paper floor, a mat under each section, a pencil-line route between them, the objects on
the mats and the type standing in the scene as CSS3D signs. Six sections on an arc, each 60 units to the right of
the last with the view turning 29°. The camera is fitted to each section's box per crop, and between sections it
climbs and pulls back to a wide view of both, then settles — 0.8 s, inside the narrator's breath.

| Section | View | What happens | Lands |
|---|---|---|---|
| S0 question | az −22°, el 16° | *When does your card machine contract actually end?* types in word by word, standing over the old machine, which is there from frame one | 0 s |
| S1 rule | az −20°, el 18° | **The 18-month rule.** with the highlighter on "eighteen" · SINCE JAN 2023 stamp · PSR · PS22/2 kicker · three pillars on the mat: 3 years and 4 years grow on "tie you in", 18 months grows gold on "eighteen", the two tall ones sink on "not three years" and "not four"; labels stand on their tops | 5.1 s |
| S2 letter | az −18°, el 18° | **They have to write to you.** · 14 largest providers · from July 2023 · the envelope's flap swings back on "up", the letter (a card drawn to a texture) rises out of it on "write": *Your minimum term ended on DD·MM·YYYY* (underline on "date"), ✓ *free to switch provider* on "switch" · the old machine sinks into the paper on "switch", ours rises on "another" | 15.1 s |
| S3 month | az −16°, el 32° | **One month's notice.** · *if you choose to stay* · 31 day tiles rise out of the mat as the camera lands, ripple on "stay", fall away on "leave"; one stays and turns gold, the 1 MONTH pill stamps beside the grid on "one month's" | 25.8 s |
| S4 compare | az −20°, el 18° | *Some deals are fine as they are.* / *But you won't know until you compare.* · **Compare your rates.** · both machines rise as the camera lands · twelve month tiles turn gold in a run on "adds up over a year", kicker *the difference, over a year* | 32.7 s |
| S5 end card | az −16°, el 16° | our terminal rises as the camera lands · **Get a quote in minutes.** on "Here" · MESSAGE US · CALL US pills on the words · neropay.app · *That's it for today.* · FOLLOW FOR MORE VIDEOS LIKE THIS on "follow" | 43.6 s |

At rest only the current section's type is on screen; in the air every section's is, so the wide view reads as
the map of the whole piece. Nothing enters from above; everything that appears comes up out of the paper, and the
floor is solid to the depth buffer so what is below it is gone. No masthead, no footer, no episode number.

## Sound

36 cues, 15 distinct effects, each on something moving (`data/mix.json`); the bed at 0.30 ducked 5:1 under the
voice; two-pass loudnorm to −14 LUFS with a true-peak limiter.

## Delivered 16 Sep 2026 (v4.1, Higgsfield CDN, prefix `https://d2ol7oe51mr4n9.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/`)

9:16 `f4b3d009-2c0b-47e3-8127-482a7df48f09.mp4` · 16:9 `84ce9938-099a-4d45-8862-9ee5dd612389.mp4` ·
4:5 `ea95d0bc-feab-4cf6-b380-bb8ce9976e2d.mp4` · 1:1 `e50245ae-f89b-4998-b6bf-5f7b9abc7240.mp4` ·
contact `6acf0d0c-5f9a-4b0f-bacb-56c0e7b2383b.jpg`. Master −14.44 LUFS / −1.37 dBTP, 55.9 s, no single-frame spikes.
