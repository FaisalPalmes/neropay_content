# PP01 — The Partner Programme, how it pays

Built 16–17 September 2026 from `motion/partner/BRIEF.md` (Faisal, 16 Sep 2026). One complete social video, not the
brief's hook + body + close modules: Faisal's note after the first take was that the brief was fine but the copy
should be better — "fully UGC-sounding, engaging from the beginning, no AI-sounding phrases, no one-liners, no gaps,
no breaths" — so the script below was written as one continuous piece of talking and the take is tightened, sped a
touch and breath-gated. Voice: **Olivia — Warm, British Female** (`pPoztmvzd5p26S3MsNrV`), Faisal's choice for this
video, in place of the merchant series' Verity.

**The figures are final.** Faisal's v4 brief of 17 Sep 2026 confirmed every tier and condition; `figures.json` carries
them as confirmed records and the exports carry no draft mark. (v1, the night before, was a DRAFT build on the same
figures while three items were open — that day is over.)

## v3, 17 Sep 2026 — the earnings hook, the new close, the big spheres, a gentler tighten

Faisal's notes on v2: the hook assumed the viewer already knew us — lead with the potential earnings instead, as if they
know nothing about NeroPay, then how and why it is easy; redo the ending, copy and picture, the link is
**neropay.app/partners**; no small spheres floating about, a few very large ones half in the frame instead; the breath
gate was clipping words — be lenient, a split second of gap is fine. So v3 is a new script and a new take, the same world.

**The v3 take (Olivia, eleven_v3, one take, 69.0 s raw, 1,137 credits, flow `V5Z2DUgxnS9rAnIxR1yP`, node `f2AhMX604HdfokuGr0Fj`):**

> [excited] You could be earning a hundred to three hundred pounds for every café, takeaway or barber you introduce to
> a card machine company. Here's how it works, and why you don't need to sell anything. We're NeroPay, we do card
> terminals with free till software for UK businesses. You know a business that takes card payments, you introduce them
> to us, and that's your whole job, because we go and set them up and we do the support. [warmly] When they go live you
> get a bonus for that one business, a hundred pounds if they take up to twenty thousand in their first month, two
> hundred over that, and three hundred once they're over forty thousand. Every one you introduce pays you, and there's
> nothing to unlock. Then if you bring three or more in the same month, you're an Active Partner, and you also get a
> share of what all your merchants' card payments earn us, not just the new three, every month you hit it. And if you
> only bring one that month, you still get your bonus, it's yours either way. It's free to join, and you get your own
> link to share. Go to NeroPay dot app slash partners, and think about who you'd introduce first.

The hook is the brief's "you could be earning" shape (Part 4): per merchant, with "£100–£300 · per merchant · based on
their first 30 days" on the same frame. "Why you don't need to sell anything" is the brief's A4 line. "Free till
software" is the one merchant-side claim the brief permits. No banned register; the gate passes.

**The read, gently.** `tighten.mjs --gap .32 --min .45 --tempo 1.03`: 14 gaps cut to 0.32 s (4.5 s removed), the
take at 1.03× — 69.0 s → 64.5 s → 62.6 s. `gate.py --inset .12 --max -30`: only nine gaps muted, with 120 ms of every
word left untouched either side, and nothing louder than −30 dBFS touched. The two v2 settings that clipped words
(inset 60 ms, max −18) are not used again.

**The picture, v3.** S0 is the hook: *You could be earning* → **£100–£300** on a yellow marker → *for every business you
introduce.* → the condition kicker → *How it works, and why you don't sell anything.*; the three shops light on café,
takeaway, barber. S1 is who we are: the NeroPay mark, **Card terminals. Free till software.**, the shops rising on
"business that takes card payments" with the paths from YOU on "introduce them to us", the pills, a terminal beside each
shop on "set them up", *that's your whole job.* S2–S4 as v2. S5 is the new close: FREE TO JOIN · YOUR OWN LINK TO
SHARE, **neropay.app/partners** with the marker drawing on "slash partners", *Who would you introduce first?*, the three
shops coming back and lighting one by one on "introduce first", our terminal at the right, the compliance super with
the new link. The small spheres are gone; each section has two very large pale ones (yellow, blush or lilac) sitting
half in the frame at the edges, bobbing slowly, no shadow. The share section's kicker was dropped (the spoken sentence
carries the approved wording; the slab's note says "a share of the whole network"). 42 cues re-timed from the anchors.
Duration 68.1 s.

## v2 — the take (superseded by v3 above)

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

## The picture — v2, the white world that keeps moving (17 Sep 2026)

v1 was built on the partner brief's dark ground and Faisal rejected it the same night: light mode only, keep the 3D but
make it move the whole time, vary where things sit, turn the phrases into graphics, borrow from the Webflow reference.
So v2 is the merchant videos' white world (`#FBFAF7`, ink, the yellow accent, blush and lilac in the spheres and the
glass tint) with: a camera that never stops (a slow orbit and breath around the target, continuous through the flights);
shaded spheres floating and bobbing over every section; the view swinging left (S0), right (S1), centre (S2), right
(S3), left (S4), centre (S5) with the type anchored to match; the terms sheet on "terms"; connector paths drawn on the
floor from a YOU pill to the three shops on "introduce", a dot running each; a small terminal landing beside each shop
on "set them up"; the ledger row tilted above the dial as a stack; ink value badges slamming in with two frames of
sparks on the pillars and on "pays you"; four month chips ticking on "every month you hit it"; one of four weeks on
"only bring one"; three arc rings turning at their own rates behind the address. Poppins is the family (house ruling,
16 Sep) in place of the brief's Inter; Martian Mono where the brief says DejaVu Mono. Six sections on the arc, 60 units
apart; captions drawn in the picture with the spoken word on a yellow marker; in 4:5 and 1:1 the section boxes drop 6
units below the floor so the captions sit under the objects. Bed **partner-upbeat-118** (Eleven Music v2, 117.84 bpm measured with `motion/tempo.py`, no vocals —
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

## Delivered 17 Sep 2026 — v2, final figures, 4:5 first (Higgsfield CDN, prefix `https://d2ol7oe51mr4n9.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/`)

4:5 `b69e0423-b0aa-4732-a5c2-9d22889df4ec.mp4` (md5 `c2aaf03bbf390fd97f9d22fae2e37347`, 24.4 MB) · contact
`84903f50-9e26-4cc9-9c84-537a7c1673b6.jpg`. −14.92 LUFS / −1.21 dBTP, 70.4 s, 0 single-frame spikes, no frame-to-frame
jump outside a camera move, frame scan clean. Faisal asked for the 4:5 Meta version only; 9:16, 1:1 and 16:9 of v2 on
request (about 35 minutes a crop). Drive: the READ ME "PP01 v2 final" in `03 Finished`; the v1 note is renamed superseded.

**Analysis before hand-over (v2).** Stage 3 passed on the confirmed records. Timing law: all seven beats hold. Frame scan:
no overflow. 24-frame contact sheet reviewed: the section-3 kicker that ran into the climb slab in the first v2 render was
moved (kicker up, slab down) and re-rendered before sending; nothing else touches. Freeze-frames of the Bonus Dial and the
Rate Climb are unchanged from v1 (the modules are the same code): the bonus and volume are together at every frame, the £200
step lands on "two hundred" with "£20,000+", no threshold skipped, both rest frames carry their conditions. Compliance super
on screen 7.1 s. Audio unchanged from v1.

## Delivered 17 Sep 2026 — v1, the dark draft, superseded (Higgsfield CDN, prefix `https://d2ol7oe51mr4n9.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/`)

9:16 `b7b12bbc-f92b-4f76-9ae1-b45e94eb2233.mp4` (md5 `c41f6d08ddb2eb6ef9e748670e821f1d`, 9.3 MB) · contact
`7b92cd96-cd37-40f9-b09b-4a2bf2f56c82.jpg`. Master −14.92 LUFS / −1.21 dBTP, 70.4 s, 0 single-frame spikes, frame scan
clean, no frame-to-frame jump outside a camera move. 1:1, 16:9 and 4:5 follow as they render (about 35 minutes a crop).

Drive: `NeroPay Ads › 05 - Video Edits (YouTube) › PARTNER VIDEOS › 09-2026 › Motion graphics › PP01 - Partner Programme (DRAFT)`
(folder `11gSOA2be260FQlJcRUN2ZxPvMwn4AtUU`): `01 Script & voice` (this file and `claims.md`), `02 Test cut`, `03 Finished`
(the READ ME with the links, the post copy and the filenames — "NeroPay PP01 — Reels 9x16 (1080x1920) DRAFT.mp4" and so on),
`04 Exports`. The MP4s cannot pass through the Drive connector; Faisal drops them in.

**Analysis before hand-over.** Stage 3 passed (DRAFT). Timing law: all seven beats hold. Frame scan: no overflow at any crop.
Freeze-frame of the Bonus Dial every half second: the bonus and the volume that earns it are on screen together at
every frame; the step to £200 lands on "two hundred" with "£20,000+" under it (the first render had it sitting at
£100 on exactly £20,000 for three seconds — fixed and re-rendered); the rest frame carries "£300 · £40,000+ in their
first 30 days · per merchant" and the "up to" line. Freeze-frame of the Rate Climb: 0 → 1 → 2 → 3 (20%) → 11 (20%) →
21 (25%) → 33 (25%) → 36 (30%) → 51 (30%) → 61 (35%) → 111+ (40%); no step skipped; "Most partners start at 20%: three
a month." on the rest frame. Compliance super on screen 7.1 s (213 frames at 30 fps; the brief asks ≥ 75). Audio: two
gaps over 0.3 s left in the voice (0.32 s and 0.34 s, sentence breaks); the bed runs from frame 0 to the fade; peak
−1.25 dBFS, flat factor 0 (no clipping); LRA 3.0. Captions are the take word for word, built from the timings.
