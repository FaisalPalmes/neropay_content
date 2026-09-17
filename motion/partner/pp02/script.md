# PP02 — your road

The second partner video, built 17 September 2026 from the proposal Faisal approved the same day (`PROPOSAL.md` beside
this file, v3 script). The network angle: who the viewer already knows, as one walk down one English high street. No
place is named, so one build targets Manchester, London or anywhere on Meta. Voice: **Olivia — Warm, British Female**
(`pPoztmvzd5p26S3MsNrV`, `eleven_v3`), as PP01.

**Two rulings from Faisal, 17 Sep 2026, now standing for every partner video** (`motion/partner/CLAUDE.md`): the bonus is
said as paid after 30 days, never as conditional in the sentence — the tier condition stays on screen; and nothing may
sound like work for the partner — a name and a number is enough and we close it.

## The take (Olivia, eleven_v3, one take, 45.7 s raw, 730 credits, flow `V5Z2DUgxnS9rAnIxR1yP`, node `e4KeXcEdS13PY7UoVzTJ`)

> [curious] How many of the business owners on your road actually know your name? The café, the barber, the takeaway.
> Because every one of them you introduce to NeroPay pays you a hundred to three hundred pounds, once they've been
> taking card payments with us for thirty days. And you don't sell anything. You don't set anything up. You don't even
> have to make the call: send us a name and a number, and we'll close it for you. [warmly] Do it three times in a month
> and you're an Active Partner, with a share of what all your merchants' card payments earn us, every month you hit it.
> And if a month's quiet and you only bring one, that bonus is still yours. It's free to join. Go to NeroPay dot app
> slash partners and get your link.

Word timings: faster-whisper `small.en` in the Higgsfield sandbox, the script as the initial prompt. `tighten.mjs --gap .32
--min .45 --tempo 1.03`: ten gaps cut to 0.32 s, 45.7 s → 41.1 s → 39.9 s; `gate.py --inset .12 --max -30` muted two
breaths. Composition: `HEAD` of two beats at 107.9 bpm, `TAIL` 8.3 s for the compliance hold; 49.1 s in all.

**"We'll close it for you"** is a programme promise stated by Faisal on 17 Sep 2026 and not in the v4 brief; it is
recorded as such in `claims.md`.

## The picture — seven stops on one street

One long row of paper shopfronts (`street()` in `objects3d.js`: mixed heights and widths, awnings, shutters, trading
types only, no names, no place), a pavement, a kerb and a road with dashes, all DOM planes under the WebGL layer. The
camera walks: a straight dolly along the pavement between stops (`walk()`, no pull-back), turning to face each one
alternately left and right; a slow drift and breath the whole time. New objects: the street, a lamp post, a phone with a
canvas screen, a receipt that prints out of a slot through a local clipping plane, a small unbranded van. The payment
card from PP01 hangs at the top-right edge of the hook only.

| Stop | Words | On screen |
|---|---|---|
| 0 Your road | the question · café, barber, takeaway | A tally rolls up on an odometer as the shops pass, 1 → 14, and flips to "?" on "name"; the question types in character by character under it with a caret; the three shops light on their words with a label hanging in over each |
| 1 Paid | "pays you … thirty days" | "pays you" rises word by word; "£100–£300" on the marker; "PER MERCHANT"; the lit shop's door prints a receipt: £100–£300 · per merchant · "paid after 30 days of card payments with us" · small print "£100 · £200 · £300 by their first 30 days' takings"; a 30-day strip fills |
| 2 You don't | the three "you don't"s | *sell anything.* · *set anything up.* · *make the call.* — each rising word by word and struck through as she says it |
| 3 A name and a number | "send us a name and a number, and we'll close it for you" | A phone stands up on the pavement; NAME "Café" and NUMBER "07··· ··· ···" (dots, never digits) type in, SENT lands; the van drives in from our end of the road and a terminal rises at the shop's door as it lights |
| 4 Active Partner | "three times in a month … every month you hit it" | Week bunting hangs in, three ticks light with the three shops; ACTIVE PARTNER hangs from the lamp post; the badge climbs 3 · 20% → 21 · 25% → 36 · 30% → 61 · 35% → 111+ · 40% and rests on "Most partners start at 20%: three a month." |
| 5 The quiet month | "if a month's quiet and you only bring one, that bonus is still yours" | Shutters roll down on every shop in view but one; that one lights and its receipt prints anyway; *Your bonus is yours either way.* with the marker on "yours" |
| 6 The end of the road | "free to join … slash partners … get your link" | FREE TO JOIN hangs in, the street nameplate **neropay.app/partners** hangs in on "slash partners", YOUR OWN LINK, the compliance super held to the end, our terminal at the kerb |

**Type animation, new in this video.** Word-by-word rise with a 50 ms stagger and a tracking settle from wide to tight;
a typewriter with a caret that sits after the last character; an odometer in tabular mono that snaps digit to digit;
the highlighter drawing left to right; strikes drawn through three claims; signs that hang in from a string and settle
without overshoot; captions that pop on the word being said.

## Sound

Bed: `video/library/bgm/partner-walk-108.mp3` (Eleven Music v2, 107.9 bpm by `tempo.py`, no vocals — Whisper finds no
speech), at 0.2 under the voice, ducked 5:1, faded over the last 2.4 s. Forty cues, none twice in a row: the typing under
the question, a tick on the full stop, the three shops, the receipt printing, the strikes, the phone typing and SENT, the
van passing, the terminal landing, the bunting, the chime on ACTIVE PARTNER, the shutters, the nameplate's thud. Master
−14 LUFS / −1.2 dBTP, stereo.

## Location versions

Only the first sentence changes ("… in Manchester …", "… in London …", "… on your high street …"): one more Olivia take
of that line, spliced at the sentence boundary, the words re-timed, and the composition re-times itself. Not recorded
yet — Faisal to say which.

## Delivered, 17 Sep 2026 (v1, 4:5)

`out/final/pp02-4x5.mp4`, 1080×1350, 49.1 s, 1,474 frames, md5 `7162d9bf73d7eab6cd4ec47fc97989e0`; stereo AAC 192k,
−13.99 LUFS / −1.21 dBTP. Higgsfield media store:
`https://d2ol7oe51mr4n9.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/f75b4167-7c13-487c-a6eb-4d892128d3ce.mp4`
(contact sheet `…/9ca848c3-5a63-47a6-8518-d851ac3c547d.jpg`). Drive: `PARTNER VIDEOS › 09-2026 › Motion graphics › PP02 -
Your road`, README v1. Analysis: the timing law passes on all eight beats (13 / 13 / 10 / 7 / 10 / 6 / 7 / 21 words);
frame scan clean; 0 single-frame luma spikes and 0 frame-to-frame jumps over 12 across 1,474 frames; the stage-3 gate
passes; the contact sheet checked at 30 points — the receipt and the lamp-post signs clear of every heading, the van on
the road at 22.6 s, the shutters down for the quiet month, the terminal clear of the compliance line.

## v2, 17 Sep 2026 — grand figures, a fuller frame, every stop arriving

Faisal's notes on v1: the small "£100–£300" on the receipt beside the big one was wrong — money and stats are grand and
large, once; too much empty sky at the top at times; clipping and artefacts to go; the counting number should move in and
settle as the scene sets; the priority is dynamic, 3D→4D, large but subtle. So: the hero figure centred at 164 px with
PER MERCHANT and the condition in large serif under it; both receipts print PAID and carry the tier line only as small
print; the climb is a big "3 → 20%" … "111+ → 40%" in the frame, ACTIVE PARTNER hangs from the bunting; the tally is a
number that flies in large from below, pops on every count and hands over to a question mark that scales in (no rolling
glyphs); every stop's type slides up and settles as the camera lands (`settle()` composed onto the anchor transform);
the leaving stop fades in the first third of the walk; the drift and breath are stronger; the box is lower and shallower
(y to 17.4, elevation 11°) and the street bigger so the frame is fuller; headings 100 px, the nameplate 82 px; the card
is gone from this video. The frame scan caught the typed question two pixels over the right edge at 62 px; 56 px.

**Delivered (v2, 4:5):** `out/final/pp02-4x5.mp4`, 49.1 s, 1,474 frames, md5 `70cbcb711eb5a879dcbb31f7f59c53e3`;
stereo, −13.99 LUFS / −1.21 dBTP. Higgsfield:
`https://d2ol7oe51mr4n9.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/4497b38d-a4e5-49dc-89d7-d1be36a1d1c3.mp4`
(contact `…/46e62e45-53c1-4171-9720-22c62e1b9c45.jpg`). Drive: README v2 (`1X67fhjrybpimYQKgqHgX81rVWxnDOj4ENg4uNjt4LsQ`),
v1 renamed superseded. Law passes on all eight beats; frame scan clean; 0 spikes, 0 jumps; contact sheet at 30 points.
