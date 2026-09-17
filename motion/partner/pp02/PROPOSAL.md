# PP02 — proposal (draft for Faisal, 17 Sep 2026 — nothing built until approved)

Second partner video. Same house: the white world, ink type, the yellow accent, Poppins, Olivia, captions in the picture.
Everything else new — the angle, the hook, the script, the camera, the objects, the type animation, the bed.

## The angle: your road

PP01 said what an introduction pays. PP02 says who the viewer already knows — the network-led body from BRIEF.md
Part 4, variant 2, aimed at the people who walk past twenty card machines a day. The whole video is one walk down one
road, and the camera walks it. **No place is named** (Faisal, 17 Sep 2026): the road on screen is any English high
street — no signage, no landmarks, trading types only — so the same film targets Manchester, London or anywhere on Meta.

## The hook

Spoken on the first frame: **"How many of the business owners on your road actually know your name?"** On screen: the
camera already walking a long paper-model street; a tally rolls up on the pavement in mono as each shop passes, 1, 2,
3 … and lands on "?"; the question types in under it.

Fallback: the brief's A2, "We'll pay you for a conversation you were going to have anyway."

## The script — one continuous UGC read, Olivia, about 40 seconds (v3, Faisal's notes of 17 Sep 2026)

> [curious] How many of the business owners on your road actually know your name? The café, the barber, the takeaway.
> Because every one of them you introduce to NeroPay pays you a hundred to three hundred pounds, once they've been
> taking card payments with us for thirty days. And you don't sell anything. You don't set anything up. You don't even
> have to make the call: send us a name and a number, and we'll close it for you. [warmly] Do it three times in a month
> and you're an Active Partner, with a share of what all your merchants' card payments earn us, every month you hit it.
> And if a month's quiet and you only bring one, that bonus is still yours. It's free to join. Go to NeroPay dot app
> slash partners and get your link.

Per merchant, never a total; nothing from the banned register (no "no effort", no "easy", no "guaranteed"); no
personal attribute (a road is a situation); the concession is the quiet month; the CTA is the link.

**Two rulings from Faisal, 17 Sep 2026, for every partner video from now on:**

1. **The bonus is said as paid, not as conditional.** Never "based on what they take in their first thirty days" in
   the take. The spoken line is "a hundred to three hundred pounds, once they've been taking card payments with us for
   thirty days" — it reads as certain, only delayed. The tier condition (which of £100 / £200 / £300, by first-30-day
   takings) stays **on screen** in the receipt's small print and in the compliance super, so the brief's rule — every
   figure with its condition on the same frame — still holds. It is no longer in the sentence.
2. **Every video portrays how little the partner does.** We handle everything. The partner does not have to sell, set
   up, or even make the introduction call: a name and a phone number is enough and we close it. Nothing in the copy
   may sound like work for the partner — "walk down your road and count" was cut for exactly that.

**Location versions for ads.** Only the first sentence changes — "How many of the business owners in Manchester
actually know your name?" / "… in London …" / "… on your high street …" — generated as a separate Olivia take of that
one line, spliced at the sentence boundary, and the composition re-times itself from the words. The street on screen
stays the same generic English road, so one build makes every version.

## How it looks — seven stops on one street

The camera does not hop between sections on an arc this time. It walks: a slow dolly down the pavement of one long
street of paper shopfronts, turning to face each stop, never still. The type stands in the street like signage.

| Stop | Words | On screen |
|---|---|---|
| 1 Your road | "How many of the business owners on your road actually know your name?" | A long row of shopfronts (mixed heights, awnings, a few shutters, trading types only — Café, Barber, Takeaway, Grocer, Florist — no names, no place). A tally rolls up on the pavement in mono as each shop passes and lands on "?". The question types in, the full stop hits with a tick. |
| 2 Three of them | "The café, the barber, the takeaway." | Three shops light in turn as she names them, a small label hanging in over each. |
| 3 Paid | "pays you a hundred to three hundred pounds, once they've been taking card payments with us for thirty days" | The lit café's door prints a receipt that curls up into frame: **£100–£300 · per merchant** · "paid once they've taken card payments with us for 30 days" · small print "£100 / £200 / £300 by their first 30 days' takings". A 30-day strip ticks along the pavement to the word "thirty". The highlighter draws under the figure. |
| 4 You don't | "you don't sell anything. You don't set anything up. You don't even have to make the call" | Three lines stand in the street — *sell anything* · *set anything up* · *make the call* — and a strike draws through each as she says it. |
| 5 A name and a number | "send us a name and a number, and we'll close it for you" | A phone stands on the pavement, our screen: a contact card types in — "Café · 07··· ··· ···" (dots, never digits) — and a SENT tick lands. The small white van (unbranded) drives from the camera's end of the road to the lit shop and drops a terminal at its door: we closed it. |
| 6 Active Partner · the quiet month | "three times in a month… every month you hit it. And if a month's quiet and you only bring one, that bonus is still yours" | Month bunting overhead, four weeks, three ticks; a lamp-post sign flips to ACTIVE PARTNER and a second sign climbs "3 · 20%" → "111+ · 40%" ("Most partners start at 20%: three a month." on the rest frame). Then shutters come down on all but one shop; that one stays lit and its receipt prints anyway; serif on the pavement: *Your bonus is yours either way.* |
| 7 The end of the road | "It's free to join. Go to NeroPay dot app slash partners and get your link." | The street runs out; FREE TO JOIN hangs in; a street nameplate hangs in on "slash partners": **neropay.app/partners**, YOUR OWN LINK beneath; our terminal at the kerb; the compliance line on the pavement, held. |

## Type animation — the upgrade

- **Per-word rise with a stagger** for every heading: words mask up one after another, 40 ms apart, not the whole line at once.
- **Typewriter** for the hook question, with the full stop landing on a tick.
- **Odometer roll** for the tally and the climb: digits roll vertically in tabular mono, never fade or count in place.
- **Tracking settle** on the big words: letter-spacing tightens from wide to tight over 300 ms as the word lands.
- **The highlighter draws** left to right under the hit word, on the beat, instead of appearing.
- **Three strikes** — through *sell anything*, *set anything up*, *make the call* — drawn as she says each.
- **Signs hang in**: pills and nameplates swing in from a hinge and settle, no overshoot.
- **Captions pop per word**: the current word scales 1.06 → 1 as it lights, on top of the marker.

## New objects (three.js, `objects3d.js`)

A long street with mixed shopfronts and shutters (`street()`), a kerb and road with a dashed centre line, a lamp post with
hanging signs, a phone slab with our screen texture (the contact card, dots for the number), a receipt strip that prints and curls, a small unbranded van, a
street nameplate. One card at the edge as PP01, or none if it competes with the street.

## Sound

A new bed: lighter than PP01's, acoustic guitar and hand claps, about 105–110 bpm, no vocals, generated once with
Eleven Music and put in the ledger. Effects: the receipt print, the SENT tick, one shutter, the van passing, a sign's hinge, the tick on the full
stop. None twice in a row.

## Length and crops

About 40 seconds, shorter than PP01's 68. 4:5 first for Meta, then 9:16 and 1:1 if wanted.

## What I need from Faisal

1. Approval of the angle and the hook — or "use A2 instead".
2. The script (v3 above), or edits to it.
3. Which location lines to record for the ad versions, if any (Manchester / London / high street).
