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

## v3, 17 Sep 2026 — the voice leads

Faisal's notes on v2: type and overlays were on screen before Olivia had said them ("pays you" sat above the street two
seconds before "pays"); the overlays should feel guided by her, interactive; the opening count bigger and a real attention
grabber, the lone "?" given a purpose; more dynamic and modern; liquid glass used tastefully with animated movement; the van
detailed and stopping on the road in frame when it delivers to a shop; the yellow on a shop matching the business she names.

So every anchor is now the start of the word that earns the graphic (`sync()` rises a heading word by spoken word,
`typeSync()` types each word across the time she takes to say it), and every camera walk is timed to land before the first
word of its stop: to the paid stop on the end of "takeaway", to you don't on the end of "days", to the phone on the end of
"call", to Active Partner on "and you're an", to the quiet month on the end of "hit it", to the end of the road on "It's".
"You don't" as a heading went (the captions carry it; the three struck claims are the graphic) so the stop holds its law.

| Stop | What lands on which word |
|---|---|
| 0 | The count tile (a glass slab, 290 px Martian Mono) flies in at once; the view rides six units along the street while it counts 1 → 14 and the four shops it passes light on their counts; BUSINESS OWNERS ON YOUR ROAD types under it on those words; on "know" the count flips like a board into a large ? which takes the marker on "name?", the kicker retyping KNOW YOUR NAME? on those words; Café / Barber / Takeaway light on their words, each with a label hanging in above the awning |
| 1 | Three shops on "every", "one", "them"; the far shop on "introduce"; a terminal lands at its door on "NeroPay"; "pays" then "you"; £100 in its glass on "hundred", the dash on "to", £300 on "three hundred"; PER MERCHANT on "pounds"; the receipt prints from "once"; "paid after 30 days / of card payments with us." on "thirty days" |
| 2 | "sell" "anything." on the words, struck as she finishes "anything"; the same for "set anything up." and "make the call." |
| 3 | The phone stands on "Send"; "Send us a name" word by word; NAME types on "name"; "and a number." on the words, NUMBER on "number"; the van comes along the road from "Send" and brakes to a stop in frame at the shop on "close" (its nose dips, the wheels roll by distance); SENT on "close"; the side door slides; the terminal lands at the shop door on "it"; the shop lights on "for you"; three ticks pop on the phone on "three times", THIS MONTH on "month" |
| 4 | The camera lands on "and you're an": bunting with three ticks and the three shops as it settles; ACTIVE PARTNER on the words; the climb in its glass on "share"; the rest on "every month" |
| 5 | Shutters on "quiet"; the one shop on "one"; its receipt on "bonus"; "Your bonus is … yours" on "that bonus is … yours", the marker after; "either way." after "yours." |
| 6 | FREE TO JOIN on the words; the nameplate hangs on "NeroPay dot app", the marker draws under partners on "slash partners"; YOUR OWN LINK on "get your link"; the terminal (0.72 scale) inside the frame at the kerb |

Glass: three slabs (`.slab`), each tilting in on a perspective, floating a little, with a sheen passing every 3.8 s — the
count, the money, the climb. The van (`van()` in `objects3d.js`) gained a raked windscreen with pillars, cab side windows,
grille, bumpers, headlights, tail lights, wing mirrors, hub caps, the band on both sides and the back, and a sliding side
door on to a dark bay (`open(p)`), with `roll(dist)` for the wheels. It stays unbranded: the terminal is the only branded
object in frame (root CLAUDE.md, Brand).

The type is raised into the frame's upper third (the 4:5 frame reaches y ≈ 27 above a box that ends at 17.4): headings at
y 20–22.6, slabs at 16–18, conditions at 12–14. The frame scan caught the count tile past the right edge during the
opening dolly at ten units; six. Sound: 47 cues re-timed to the word anchors, none twice in a row; bed unchanged.

**Delivered (v3, 4:5):** `out/final/pp02-4x5.mp4`, 49.1 s, 1,474 frames, md5 `5ed5ef84948b9e97e7c2c606c8b6aa57`;
stereo, −13.99 LUFS / −1.31 dBTP. Higgsfield:
`https://d2ol7oe51mr4n9.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/360391df-95bf-4928-b7b2-63ffde5575f0.mp4`
(contact `…/9b532774-abdb-4c98-9cb6-6e4c8a7ca1ec.jpg`). Drive: README v3 in the PP02 folder, v2 renamed superseded. Law
passes on all eight beats; frame scan clean; 0 spikes, 0 jumps; the gate passes; contact sheet at 32 points.

## v4, 17 Sep 2026 — the review of v3

Faisal's notes: the count and its line must never touch, and that stop needs no glass — the mark on its own, the line
revealed beneath it, no yellow bar; the strikes should carry the feeling (animated, red); "Send us a name and a number"
grander, a different face; the phone and the terminals never in the bottom half or over the shops — float them in the
upper half; the Active Partner climb was choppy and clipped (numbers teleporting); colour on the arrow, more life in the
week chips; the receipts clipped inside the shops — float them, colour them, animate them; the end screen's text sat
behind its overlays — lay it out in the top half with the terminal, some shops lit, the van on the road; the van must sit
on the road, never hover; then more space in the CTA stack and a subtle depth on the assets.

So: the count is a bare 400 px number that flips into the question mark, the kicker 44 px below; the strikes are red
(`#E0433A`), shake the claim as they land and grey it behind them; the name-and-number heading is Chivo 800 uppercase
at 96 px with NAME and NUMBER on the marker; the phone floats at the left above the roofs (`hover()`: up from below, a
slow bob and turn), the terminals float above the shop they serve (`above()`), the end terminal floats at the right
below the nameplate; the climb runs continuously 3 → 111 in a fixed 4-character slot with the rate rolling up on each
threshold (thresholds solved from the easing at init, `STEPT`), the arrow yellow, the week chips swinging in on a damped
curve with ticked chips turning yellow and the tick bouncing; the receipts print upward from a slot floating above the
shop, a yellow header band, a slow bob; the CTA stack is Free to join 22.7 · nameplate 19.3 (74 px) · Your own link
15.8 · compliance 11.7, three shops lit, the van coming along the road from "NeroPay dot app" and stopping; the van sits
flat on the road (the pitch and wobble were rotating it about its ground origin and lifting the wheels); a soft text
shadow under the type and a deeper one under the plates. The money slab grows with its words. 48 cues.

**Delivered (v4, 4:5):** `out/final/pp02-4x5.mp4`, 49.1 s, 1,474 frames, md5 `dc509d946241b46f4fc90f37b866fded`;
stereo, −13.99 LUFS / −1.36 dBTP. Higgsfield:
`https://d2ol7oe51mr4n9.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/623e5e5b-2c72-4b7e-be84-63953a5e1f38.mp4`
(contact `…/24ff807f-cc63-45ec-8091-d890a7980ec8.jpg`). Drive: README v4 in the PP02 folder, v3 renamed superseded. Law
passes on all eight beats; frame scan clean; 0 spikes, 0 jumps; the gate passes; contact sheet at 32 points.

## v5, 17 Sep 2026 — the money stop and the revenue-share stop, redone

Faisal's notes on v4: the money slab was covering the text beneath it and the stop was tight; the revenue share wanted a
better graphic — a visual one, bars for 20%, 30% and 40% against the merchants that earn them, large and in the middle
above the caption, the shops ghosted into the background for that stop only, nothing overlapping.

So: the money stop keeps "pays you" and the large £100 – £300 in its slab, and the condition is one kicker line well
below it — PER MERCHANT on "pounds", · PAID AFTER 30 DAYS WITH US on "thirty days" (`sync()` with a tracking range that
keeps the kicker's spacing) — the two serif lines are gone; the receipt is smaller (3.6 × 4.4) and floats lower above the
first shop. The revenue-share stop is a bar chart (`chart()`): three bars rising one after another from "share", each
percentage counting up as its bar grows and popping as it lands, the count that earns it beneath (3+ · 36+ · 111+
merchants a month), the whole chart lifting a touch on "every month"; the rest line "Most partners start at 20%: three a
month." centred beneath; the ACTIVE PARTNER pill hangs below the bunting at the right; and the shops behind are ghosted
for this stop only — `street().fade(i, p)` in `objects3d.js` turns each shop's materials translucent and drops its shadow,
in over the landing and back out over the walk to the quiet month. The chart shows three of the five tiers; the full
ladder stays in `figures.json` and the compliance line, and `checks.py` now asserts `TIERS` against the register and that
each bar carries its count. 50 cues.

**Delivered (v5, 4:5):** `out/final/pp02-4x5.mp4`, 49.1 s, 1,474 frames, md5 `575fba3256d9adcd6abf96685fafe6a8`;
stereo, −13.99 LUFS / −1.34 dBTP. Higgsfield:
`https://d2ol7oe51mr4n9.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/a6441514-97c2-41ce-b8c9-72363527263a.mp4`
(contact `…/6bec7093-9687-4642-8a08-b16ab156c900.jpg`). Drive: README v5 (`1ijqYxKwh44FGyiwrJfLtL_VHjCXq4qUFYLVYXE7HFoo`),
v4 renamed superseded. Law passes on all eight beats; frame scan clean; 0 spikes, 0 jumps; the gate passes;
contact sheet at 32 points.

## v6, 18 Sep 2026 — a new take, a new hook, the picture re-directed

Faisal's notes on v5: redo the creative direction; adjust the script so the intro is an engaging hook, cut the
rhythm-sounding sentences and make it a real conversation; the picture to match the energy. The camera whipping past
shops on "how many businesses on your road" with an animated yellow line above them carrying numbers, fast, not a slow
count; the question mark bigger, yellow, placed with a purpose; the money stop without "pays you", the £100–£300 animated
rather than popping into glass, less text under it; the three claims more impactful — animated in, with a camera shake
like an earthquake as they land; a different look for "send us a name and a number" — no phone, the shops larger as if
the camera is closer, an effect that says the name and the number are all we need; "do it three times" as a zoom on three
shops flashing yellow in sync with her; the Active Partner chart more animated and in sync; the chimes quieter, the voice
the same; the close with liquid-glass social icons, the link, the terminal with the shops, and only the text that is needed.

**The take (Olivia, eleven_v3, one take, 48.5 s raw, 795 credits, flow `V5Z2DUgxnS9rAnIxR1yP`, node `8CX5dfq6DJFctU8xj3Rh`):**

> [curious] Quick question. How many of the businesses on your road actually know your name? The café, the barber, the
> takeaway on the corner. Because every one of them you introduce to NeroPay is worth a hundred to three hundred pounds
> to you, paid once they've been taking card payments with us for thirty days. And you don't do any of it. No selling, no
> setting anything up, you don't even have to make the call. Just send us a name and a number and we'll close it for you.
> [warmly] Do that three times in a month and you're an Active Partner, so you also get a share of what all your merchants'
> card payments earn us, every month you hit it. And if it's a quiet month and you only bring one, that bonus is still
> yours. It's free to join. Go to NeroPay dot app slash partners and get your link.

"Quick question." is recorded but **cut from the front of the take** (`data/vo-untrimmed.mp3` keeps it): the standing
ruling in `motion/CLAUDE.md` cuts openers that exist to sound clever ("Quick one"), and the whip is the hook. Say the word
and it goes back — it is one trim. Both rulings hold: paid after thirty days is in the sentence, the tier condition stays
on the receipt and in the terms; nothing sounds like work. `tighten.mjs --gap .32 --min .45 --tempo 1.03` (10 gaps, 47.5 s →
44.1 s → 42.8 s); `gate.py --inset .12 --max -30` muted two breaths. Composition 52.0 s (HEAD two beats, TAIL 8.3 s). Whisper
in the Higgsfield sandbox from the take re-hosted in the Higgsfield media store (a retyped signed URL had broken).

| Stop | What lands on which word |
|---|---|
| 0 | From "How" the camera whips fifty units along the street (`dolly` from −50 on an in-out ease over "How many of the businesses on your road") while a yellow rail shoots ahead of it above the roofs, a number popping on the rail at every shop it passes (`RN`, solved once from the whip so any still is the same frame) and the shop flashing under it; the rail ends where the camera settles and a 560 px yellow question mark with an ink stroke scales in there on "know", with KNOW YOUR NAME typing above it; the numbers dim to a trace; café / barber / takeaway light on their words with labels |
| 1 | The street starts eight shops earlier (`street(60, x0:-109.6)`) so the whip has shops. Three shops on "every one of them", the far shop on "introduce", the terminal on "NeroPay"; £100 flips in digit by digit on "hundred" (`roll()`: split-flap, five whole glyphs then its own — never a partial glyph), the dash draws on "to", £300 on "three hundred"; on "pounds" a glow blooms behind the figure and the marker draws beneath it; PER MERCHANT on "pounds", · AFTER 30 DAYS WITH US on "thirty days"; the receipt prints on "paid". No glass, no "pays you" |
| 2 | "selling." / "setting anything up." / "the call." each slam in from twice their size on their word (`slam()`), the camera shaking as each lands (`SHAKES`, a decaying burst on the camera's right and up axes and a small roll), then struck in red as she finishes the phrase, with a smaller shake |
| 3 | The camera is in close (box x ±9.5, y to 13.4): "a name" rises on its words, "a number" beneath on its words, and on "close" a yellow ring draws round both (`#ring`, a hand-drawn ellipse path); the van comes along the road from "send" and stops at the shop on "close", the terminal lands on "it", the shop lights on "for you". No phone. The "send us" kicker was dropped for the timing law (the caption carries it) |
| 3B | On the end of "for you" the camera pushes in on three shops (`S3B`, box y to 10.8); on "three" they flash yellow one after another, .19 s apart, each popping (`street().pop`), and stay lit |
| 4 | The bunting and ACTIVE PARTNER as v5; the 20% bar rises on "share", 30% on "merchants", 40% on "earn", each with its sheen as it lands; on "every month" a dotted ladder steps across the bar tops with a dot on each, and the chart lifts; the chart sits in a slow perspective drift; the rest line on "every month"; the shops ghosted |
| 5 | As v5, on the new words ("quiet", "one", "that bonus is … yours") |
| 6 | FREE TO JOIN on its words, the nameplate on "NeroPay dot app" with the marker on "slash partners", five glass discs — Instagram, Facebook, TikTok, LinkedIn, YouTube, the marks in ink — swinging in one after another on "get your link", the terms line, the terminal at the right, three shops lit, the van along the road. "Your own link" is gone |

Sound: 51 cues on the new anchors, the effects at 0.05–0.13 (v5 was 0.10–0.22), the bed and the voice unchanged.
Captions: 25 lines set by hand so no line starts with the tail of a sentence.

**Built and peeked, not rendered:** contact sheet at 36 points sent to Faisal 18 Sep 2026 for confirmation before the full
render. Law passes on all eight beats (the push-in carries no type, so it is not a beat); the gate passes.
