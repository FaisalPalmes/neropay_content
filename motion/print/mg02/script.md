# MG02 — They have to tell you. · Small Print 01

Built 15 September 2026 from the `motion.js` brief. Voice: Verity (`oW8bn5YtBB89X2nJ0DT9`), `eleven_v3`,
one take, 47.54 s (ElevenLabs flow `ns3m8FupNDBjPPLIO8eV`, node `OjiGdNx2M7QQDpDpRIed`). Word timings:
faster-whisper `small.en` in the Higgsfield sandbox → `data/vo_words.json` → `data/words.js`.
HEAD 0.6 s, TAIL 1.3 s → 49.44 s. Ground: white editorial. Format: board, five camera stations.

## The take, as generated (tags in place)

> Your card machine company is LEGALLY required to tell you when you can leave. [curious] Did you get the message?
> [serious] Since twenty twenty-three, the payments regulator caps a card terminal lease at EIGHTEEN months. Not thirty-six. Not forty-eight.
> And when that term ends, they have to send you a message. In writing. Telling you the date, and telling you to shop around.
> After that it rolls month to month. THIRTY-ONE days. You can leave with a month's notice, not a year's.
> [warmly] If your deal's good — bin the message. Most of them are fine. The point is it's your choice, on a date you know. … Check the letter. Then decide.

## Board and camera

| Station | Board centre | What's there | Lands |
|---|---|---|---|
| S1 hook | 700, 900 | THEY HAVE / TO / TELL YOU. · BY LAW stamp · serif aside · "did you get the message?" | 0 s |
| S2a calendar | 2170, 900 | Contract slab (glass) · 48-month ruler · yellow bar to 18 · "18 months" stamp · FROM JAN 2023 | after "message?" |
| S2b 36 · 48 | 3400, 900 | 36 and 48 on the ruler, struck through on their words | after "months." |
| S3 letter | 2520, 1370 | Wire from month 18 · the letter (glass): "Your minimum term ends on" · three ledger ticks · FROM JULY 2023 | after "forty-eight." |
| S4 thirty-one | 3500, 1450 | 31 blocks · THIRTY-ONE / DAYS · "rolling, after that." · 365 days struck | after "shop around." |
| Pull-back | 2100, 1130 | The whole board at 30% under the close | after "not a year's." |

Camera moves only inside Verity's pauses (0.6–1.0 s), eased in-out, a 2–3° perspective tilt in the
direction of travel that lands flat. The close is stage-level: serif "If your deal's good, / bin the
message." → "Your choice. / On a date you know." → Nero/Pay · neropay.app.

## Word anchors (index into `data/vo_words.json`)

hook 0.04/0.16/0.28 · sub 3 "company" · BY LAW 5 "legally" · ask 14 "Did" · contract 19 "Since" ·
ticks 23 "the" · label 26 "caps" · bar 32 "eighteen" · 18 months 33+.3 · JAN 33+.6 · strike 36 36 "-six" ·
strike 48 39 "-eight" · wire 41 "when" · letter 51 "message." · ticks 52 "In" / 57 "date," / 62 "shop" ·
JULY 58 "and" · blocks 67 "rolls" · THIRTY-ONE 71 · DAYS 73 · rolling 74 "You" · 365 79 "month's" ·
strike 83 "year's" · l1 84 "If" · l2 88 "bin" · out 96 "The" · l3 100 "your" · l4 104 "date" · mark 107 "Check" · url 110 "Then".

## On screen (for the gate)

See `checks.py` — every figure resolves to `psr_terminal_lease_cap` and `psr_trigger_messages`;
the footer carries the directed-providers scope.
