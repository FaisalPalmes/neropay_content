# PP01 — The Partner Programme, how it pays · DRAFT

Built 16–17 September 2026 from `motion/partner/BRIEF.md` (Faisal, 16 Sep 2026). One complete social video, not the
brief's hook + body + close modules: Faisal's note after the first take was that the brief was fine but the copy
should be better — "fully UGC-sounding, engaging from the beginning, no AI-sounding phrases, no one-liners, no gaps,
no breaths" — so the script below was written as one continuous piece of talking and the take is tightened, sped a
touch and breath-gated. Voice: **Olivia — Warm, British Female** (`pPoztmvzd5p26S3MsNrV`), Faisal's choice for this
video, in place of the merchant series' Verity.

**DRAFT.** The figures are the brief's, released for a draft build only — `figures.json` carries them as
`status: "draft"` with what is still open with Eray. Every export is named `-DRAFT`, a draft mark sits on every frame,
and nothing posts until the three CONFIRM items in Part 7 of the brief are closed.

## The take, as generated (eleven_v3, one take)

> [warmly] Okay, here's the catch first, because we'd rather you heard it from us than found it in the terms: the
> revenue share only kicks in when you're introducing three businesses a month, and the bonus has no catch at all.
> So here's how the whole thing works. You know a café, or a takeaway, or a barber that takes card payments, and you
> introduce them to NeroPay. We go and set them up, we do the support, you don't touch any of it. [excited] And when
> they go live you get a bonus for that one business, which starts at a hundred pounds, goes to two hundred if they
> take over twenty thousand in their first month, and three hundred if they take over forty. So every business you
> introduce pays you, and there's nothing to unlock. Then if you introduce three or more in the same month, you're an
> Active Partner, which means you also get a share of what all your merchants' card payments earn us, not just the new
> three, every month you hit it. [warmly] And if you have a quiet month and only bring one, you still get that bonus,
> it's yours either way. So if someone's already come to mind, go to partners dot NeroPay dot app, it's free to join,
> and get your link.

Where the brief's rules sit in it: the condition is said before the offer (rule 1, H12's shape); every number travels
with its condition in the same sentence (rule 1); the bonus is per business, never a total (rule 2); none of the banned
words (rule 3); no lifestyle imagery, no personal attribute (rules 4 and 5); "yours either way" is in the body
(QA item 5). "Pays you" and "earn us" are the per-unit constructions rule 2 permits — `checks.py` scans for everything
else.

**Takes.** Three were generated on 16 Sep 2026: Verity on the brief's H12 + body-1 script (46.1 s, 735 credits, flow
`lzSodLHV3P99DZcXCvAL`) — superseded by Faisal's rewrite note; Verity on the script above (73.4 s, 1,165 credits, flow
`V5Z2DUgxnS9rAnIxR1yP`, node `XfW0r6pZ09qU7FiEvdPM`) — superseded by the Olivia request mid-turn; **Olivia on the script
above (79.5 s raw, 1,165 credits, same flow, node `Q0mFCXt6o7lFGSMlqA1E`) — the take used.** The two Verity takes are
not kept in the repo.

**The read, tightened.** `motion/tighten.mjs partner/pp01 --gap .2 --min .3 --tempo 1.06`: 28 gaps cut to 0.2 s
(9.8 s removed), then the whole take at 1.06× with the pitch held — 79.6 s → 69.8 s → 65.8 s. Then
`motion/gate.py partner/pp01`: the 26 gaps that Whisper timed cleanly are muted with 30 ms ramps (23 of them carried a
breath above −40 dBFS); five gaps whose peak was above −18 dBFS were left alone as word edges Whisper had timed late.
Word timings: faster-whisper `small.en` in the Higgsfield sandbox, the script as the initial prompt.

## The picture — one world, dark ground

`motion/lib/world3d.js` with `dark:true` (the first use): the partner brief's ground `#0A0B0D`, mats `#141619`, white
ink, `#8A8F97` dim, the yellow as the one accent, green only for LIVE. Poppins is the family (house ruling, 16 Sep) in
place of the brief's Inter; Martian Mono where the brief says DejaVu Mono. Six sections on the arc, 60 units apart,
the view turning 29°; captions drawn in the picture with the spoken word on a yellow block; a draft mark top-left on
every frame. Bed **partner-upbeat-118** (Eleven Music v2, 117.84 bpm measured with `motion/tempo.py`, no vocals —
Whisper finds no speech) from 0, extended past 65 s at a bar boundary with a 0.3 s crossfade (`data/bed.mp3`), ducked 5:1
under the voice; 35 cues, 12 distinct effects, no effect twice in a row, one soft thud on the CTA landing.

| Section | Lands | What happens |
|---|---|---|
| S0 the catch | 0 s | *We'll tell you the condition first.* · **The catch, up front.** on "catch" · three shops rise on "here's the catch" and light 1-2-3 on "three" · **Three a month.** · kicker *for the revenue share · 3+ new active merchants in a month* · **The bonus has no catch.** |
| S1 how it works | 14.2 s | NeroPay mark · **Partner Programme.** · café, takeaway, barber rise on their words with labels, light together on "introduce" · pills YOU INTRODUCE · WE SET UP · WE SUPPORT on their words · *you don't touch any of it.* |
| S2 the bonus | 26.8 s | **A bonus on every one.** · ledger row *Café · Stockport · went live* flips PENDING → LIVE on "live" · the Bonus Dial: £100 at £0 on "hundred pounds", the marker travels to £20,000 landing on "two hundred" (£200), to £40,000 landing on "three hundred" (£300), rests from "forty" on **£300 · £40,000+ in their first 30 days · per merchant** with the dim "up to £300 per merchant — £40,000+ in their first 30 days" — held 4.3 s · three steps rise on the floor with £100 · £200 · £300 on them · NOTHING TO UNLOCK on "unlock" |
| S3 the share | 43.3 s | **Active Partner.** · ACTIVE PARTNER pill on "partner" · kicker *a share of what your merchants' card payments earn NeroPay* · the Rate Climb: count 1-2-3 on "three or more", 20% and "Active Partner · a share of the whole network" at 3, the count climbs 3 → 21 → 36 → 61 → 111 with each chip lighting as it is passed, rests from "card payments earn" on **111+ · 40%** with "111+ new active merchants in one month" and **Most partners start at 20%: three a month.** — held 4.2 s · the path of twelve tiles lights with the count and lifts once on "every month" |
| S4 either way | 55.2 s | one shop · row *Barber · Longsight · went live* flips to LIVE · £100 on "only bring one" · *Your bonus is **yours** either way.* on "still" |
| S5 the close | 61.8 s | our terminal rises · *Someone come to mind?* · **partners.neropay.app** in the accent on "partners" · FREE TO JOIN · GET YOUR LINK · the compliance super, short form, from 1 s after "partners" and held 6.3 s (the last 3.8 s silent) |

Timing law (hold = max(1.5 s, words × 0.4)) passes on all seven beats, the compliance super counted as its own beat.
Duration 70.4 s. Frame scan clean at all four crops.

## Delivered

*(filled in after the render — see the Higgsfield links and md5s below)*
