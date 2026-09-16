# MG02 — They have to tell you. · Small Print

Rebuilt 16 September 2026 (v3) from Faisal's notes on the 15 Sep cut: the read must open with energy and keep
it, the script must sound like a British person talking to the British public with a purpose to every line, a
CTA to neropay.app and a CTA to follow, real 3D objects on the board, no episode number, no persistent footer,
a music bed matched to the beat, and no repetitive effects.

Voice: Verity (`oW8bn5YtBB89X2nJ0DT9`), `eleven_v3`, one take, 49.04 s (ElevenLabs flow `ns3m8FupNDBjPPLIO8eV`,
node `GYyqRI1A8tDoXPY7HPjo`, 16 Sep 2026). Word timings: faster-whisper `small.en` in the Higgsfield sandbox →
`data/vo_words.json` → `data/words.js`. Bed: `video/library/bgm/underscore-120-a.mp3`, Eleven Music v2, measured
117.45 bpm → BEAT 0.511 s. HEAD = 2 beats (1.022 s), TAIL 1.5 s → 51.48 s. Ground: white editorial. Format: board,
four stations in a 2×2 and a pull-back.

## The take, as generated (tags in place)

> [excited] Quick one. Your card machine company has to tell you when you can walk away. Did they?
>
> [serious] Since January twenty twenty-three, the regulator caps a terminal lease at EIGHTEEN months. Not three years. Not four.
>
> And when that term ends, the big providers must write to you. The date it ends… and a nudge to shop around.
>
> After that, it rolls monthly. One month's notice — and you're OUT.
>
> [warmly] Now, if your deal's decent, ignore all this. Plenty are. But find that letter, check the date. It's your call, not theirs.
>
> [excited] We're NeroPay. Card machines, from Manchester. Follow us for more of this — and have a look at neropay dot app.

Every line has a job: hook (a claim that costs you something to ignore) · the rule with its date · what they
must do · what that means for you · the concession · who we are · follow · site. Nothing is a one-liner for its
own sake. Whisper heard "NeroPay" as "Niropay" — listen for how Verity says the name before this ships.

## Board and camera

| Station | Board centre | 3D object | Type | Lands |
|---|---|---|---|---|
| S1 hook | 800, 780 | the card terminal, drops in on beat 0 | QUICK ONE pill (beat 1) · THEY HAVE (beat 2) / TO TELL YOU. (beat 3) · when you can / WALK AWAY. · …did they? | 0 s |
| S2 calendar | 2500, 780 | 48 month tiles in four rows of twelve; the first 18 turn gold; years 3 and 4 are struck and fall away | JAN 2023 stamp · Payment Systems Regulator · PS22/2 · 18 / months · year 1–4 · 36 · 48 | beat 15 (7.66 s), after "did they?" |
| S3 letter | 800, 2280 | the envelope lands, the flap opens on "term ends", the glass letter rises out of it on "write" | 14 largest providers · July 2023 · IN WRITING. · letter: Minimum term ends on / DD · MM · YYYY / ✓ the date / ✓ shop around | 17.62 s, after "not four." |
| S4 month | 2500, 2280 | 31 day tiles; ripple on "rolls"; every tile falls away on "out" | 31-day rolling · ONE MONTH'S / NOTICE. · OUT stamp | 26.32 s, after "shop around." |
| Pull-back | 1650, 1600 | the whole board at 35% | Deal's decent? Ignore this. · Plenty are. · Find the letter. Check the date. · Your call. Not theirs. | beat 63 (32.18 s), after "you're out." |
| End card | stage | the terminal comes back, bottom right | Nero/Pay · Card machines, from Manchester. · FOLLOW US FOR MORE · neropay.app | 42.60 s, on "NeroPay" |

Camera moves only inside Verity's pauses (0.56–0.9 s), eased in-out, a 2–3° perspective tilt in the direction
of travel that lands flat; the first and last moves start on a beat of the bed.

## Word anchors (index into `data/vo_words.json`)

quick BEAT · h1 2·BEAT · h2 3·BEAT · lead 10 "when" · WALK AWAY 13 "walk" · ask 15 "Did" · JAN 18 "January" ·
tiles 17 "Since" · kicker 21 "regulator" · gold + 18 27 "18" · months 28 · years 22 "caps" · strike 36 30 "three" ·
strike 48 33 "four" · envelope 34 "And" · flap 37 "term" · kicker 40 "big" · IN WRITING + letter 43 "write" ·
date 46 "The" · tick 47 "date" · tick 53 "shop" · tiles 55 "After" · kicker + ripple 58 "rolls" · notice 60/61 ·
OUT 65 "out" · close 67 "if" / 74 "Plenty" / 77 "find" / 83 "It's" · mark 89 "NeroPay" · tag 90 "card" ·
follow 94 "Follow" · url 105 "neropay".

## Sound

30 cues from 15 distinct effects, every one motivated by something moving (`data/mix.json`), the bed at 0.30
ducked 5:1 under the voice, two-pass loudnorm to −14 LUFS / −1.5 dBTP with a limiter on the true peak.
