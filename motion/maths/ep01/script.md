# EP01 — "Don't switch to us."

The Maths, episode 1. From `EP01-RUN-PROMPT.md` (Faisal, 14 September 2026).
Target 9:16, ~38s. **Built at 41.9s nominal** — see the note at the foot of this file.

The hook is that a payments company argues against itself. Nothing softens it, no rescue
line lands early, and the yellow accent stays off the good number until the turn at £40.

## Voiceover

One generation, so prosody stays continuous. Level, unhurried, faintly dry — stating facts, not
selling. No upward inflection at line ends. 3.0s of silence padded at the head in ffmpeg, not asked
of the model.

| Line | Words | Script |
|---|---|---|
| L1 | 10 | That's our rate on a four pound coffee. It's terrible. |
| L2 | 20 | One point three percent, plus eight pence. On four pounds, that's thirteen pence. Which is three point three percent. |
| L3 | 19 | A flat rate with no fixed fee would charge you half that. On a four pound sale, we lose. |
| L4 | 15 | Same rate card. Forty pound sale. One point five percent. Now we're the cheaper one. |
| L5 | 16 | The fixed fee is what moves. It stops hurting at about twenty pounds fifty a sale. |
| L6 | 14 | Our rate isn't one number. It depends entirely on what you sell things for. |
| L7 | 11 | So work that out before anyone quotes you anything. Us included. |

105 words. ElevenLabs voice `jP5jSWhfXz3nfQENMtf4`, `eleven_multilingual_v2`, `mp3_44100_128`,
word timestamps on, output mode files → `out/vo.mp3`, `out/vo_words.json`.

## Beats

| # | Anchor | On screen | Motion |
|---|---|---|---|
| 1 | 0.0–3.0s, silence | `3.30%` huge white centred; under it, muted: *what you'd pay NeroPay on a £4 coffee* | Counts 0.00→3.30 over 0.8s, then dead still |
| 2 | L1 | same frame | Yellow rule wipes in under the figure, left to right, 0.4s |
| 3 | L2 | Stack in Martian Mono: `1.30% × £4.00 = 5.2p` → `+ 8p fixed` → `= 13.2p` → `= 3.30%` | Each line masks up on its own beat. Final line takes the yellow |
| 4 | L3 | Two bars. `US` 13.2p long; `A FLAT RATE, NO FIXED FEE` 6.8p short | Bars draw from the left. Ours is `--loss` grey, not red. Caption *we lose* |
| 5 | L4 | Header flips to `£40.00 SALE`, bars redraw: ours 60.0p now shorter than 67.6p | Bars re-draw, never crossfade. Ours turns yellow as it lands — the turn |
| 6 | L5 | `£20.51` alone, yellow; under it *where the fixed fee stops hurting* | 3 frames of hard black, then mask up. The only hard cut in the video |
| 7 | L6 | `£4.00 sale → 3.30%` over `£40.00 sale → 1.50%`, then *same rate card* | Rows fade up in sequence |
| 8 | L7 | **NERO** white / **PAY** yellow, `neropay.app` below | Wordmark masks up, URL follows 6 frames later |

Bar widths are proportional to real cost, asserted in `checks.py` — 13.2/13.2 against 6.76/13.2 at
£4, then 60.0/67.6 against 67.6/67.6 at £40.

**Persistent footer, full duration**, muted 11px equivalent, bottom, safe-area inset:

> Our rate: 1.30% + 8p, no contract. Comparison: an illustrative flat 1.69% with no fixed fee. Correct 14 September 2026.

## Three departures from the run prompt, each deliberate

**1. Beat 7 is typographic, not a Higgsfield texture beat.** The prompt makes the texture optional and
says to skip it rather than spend a round trip. Skipping it outright would have left `£20.51` holding
alone for ten seconds across L5 and L6, so L6 gets a quiet recap of the two tickets instead. It
introduces no new figure — both numbers are already on screen in beats 1 and 5 and both are asserted
in `checks.py`.

**2. Built to the timing law, not to word timestamps.** No ElevenLabs MCP in the session that built
this, which is the prompt's documented fallback. Beat times come from the VO line table at an
assumed 3.0 words/sec; `index.html` derives every beat from that table, so swapping in the real
per-line durations from `vo_words.json` re-times the whole thing without touching a keyframe.

**3. It runs 41.9s, not ~38s.** 105 words at an unhurried read is about 35s of speech, plus 3s of
head silence, six inter-line gaps and a 1.5s tail. To reach 38s either the read speeds up — which
fights the "level, unhurried" direction — or a line comes out. L6 is the one that could go: L5
already lands the point and L7 closes it. Your call; it's one line in the table.

## Still pending

- **VO and SFX** — needs the ElevenLabs MCP. The sub-thud, stack ticks, bar whooshes and the tone on
  `£20.51` are all specified in the run prompt and none are generated.
- **Captions** — built from `vo_words.json`, so they wait on the VO. Burned into 9:16, 4:5 and 1:1;
  16:9 stays clean for YouTube.
- **Loudnorm** — nothing to normalise yet. −16 LUFS integrated, true peak ≤ −1.5 dBTP when there is.
