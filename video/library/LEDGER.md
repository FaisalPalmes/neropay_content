# Sound library ledger — every file, where it came from, what licence it carries

Rule: nothing goes into a NeroPay video unless it is listed here with a licence that allows commercial
use on YouTube, Instagram, Facebook and LinkedIn. Attribution requirements are noted per file and
must be copied into the video description when they apply.

## sfx/ — Pixabay Content Licence (commercial use, no attribution required)

Nineteen effects bundled with the HyperFrames `media-use` skill, all sourced from
https://pixabay.com/sound-effects/ under https://pixabay.com/service/license-summary/ .
`sfx/manifest.json` carries duration and a one-line use note per file. Files: chime, click, click-soft,
error, glitch-1/2/3, impact-bass-1/2, key-press, notification, ping, pop, riser, sparkle, typing,
whoosh, whoosh-short, whoosh-cinematic.

Used in B1 (copied into `b1-rate-you-were-quoted/assets/sfx/`): whoosh-short (panel entrances),
pop (chips and tags), sparkle (bars rising), click-soft (checklist).

## bgm/ — the B1 intro and outro bed

"Tropicorp Advertisement" by Nancy_Sinclair, CC0, https://freesound.org/apiv2/sounds/561190/ — 82 bpm; the
build cuts it into `music-intro` (5.4 s) and `music-outro` (18.6 s) with baked fades.

Used in `motion/showcase` (15 Sep 2026): the bed cut to 28 beats (`music-showcase`, 20.488 s, ends dead on the
end-card downbeat); Pixabay impact-bass-1/2, whoosh-short, sparkle, chime, click-soft, riser (its last 3 s).

## Voiceover — the same rule, a different source

A generated voiceover is a sound file in a NeroPay video and gets a ledger line like any other: the provider,
the voice id, the model, and the date. ElevenLabs and HeyGen output is licensed for commercial use on a paid
plan — confirm the plan before the first delivery, and record which account it was generated under. No voice
cloned from a real person without written consent, and the narrator voice stays the same across a series.
`../AUDIO.md` has the route and the disclosure rule (rail 4 — the disclosure is made at upload, per upload).

| Piece | Voice | Provider · model | Generated | Account |
|---|---|---|---|---|
| `motion/maths/ep01` (The Maths 1, v1 — to be re-voiced) | `jP5jSWhfXz3nfQENMtf4` | ElevenLabs `eleven_multilingual_v2`, then `eleven_v3` demo | 15 Sep 2026 | the ElevenLabs connector on Faisal's Claude account (work admin) — confirm the plan's commercial-use licence before first delivery |
| `motion/print/mg02` (Small Print 1, v2 — replaced) | **Verity** `oW8bn5YtBB89X2nJ0DT9` — the series voice from 15 Sep 2026 | ElevenLabs `eleven_v3`, one take, 47.5 s | 15 Sep 2026 | same account; flow `ns3m8FupNDBjPPLIO8eV` |
| `motion/print/mg02` (Small Print 1, v3 — current) | **Verity** `oW8bn5YtBB89X2nJ0DT9` | ElevenLabs `eleven_v3`, one take, 49.0 s, 658 credits | 16 Sep 2026 | same account; flow `ns3m8FupNDBjPPLIO8eV`, node `GYyqRI1A8tDoXPY7HPjo` |

## Music beds — `bgm/`

Generated beds are sound files like any other and get a row. Eleven Music output is licensed for commercial
use on a paid plan — the same plan check as the voice, recorded once per account.

| File | What | Provider · model | Generated | Account · licence |
|---|---|---|---|---|
| `bgm/underscore-120-a.mp3` | neutral instrumental underscore, 60 s, measured 117.45 bpm, no vocals (Whisper finds no speech), fades from ~50 s | ElevenLabs Eleven Music v2 (`eleven_music_v2`), 900 credits | 16 Sep 2026 | the ElevenLabs connector on Faisal's Claude account; flow `G5DGJBeWy6NWDdicrEKJ`, node `0oLT5z4eTuohNjfxiG84` — confirm the plan's commercial-use licence before first delivery |

Used in `motion/print/mg02` v3 (16 Sep 2026): the bed above at 0.30 ducked under the voice, and Pixabay
impact-bass-1, impact-bass-2, pop, whoosh-short, whoosh, whoosh-cinematic, click, click-soft, sparkle, typing,
key-press, chime, notification, riser, ping — thirty cues, none twice in a row.

## How to add a sound

1. Download it from a source whose licence you can quote (Pixabay: no attribution; Freesound: check the
   file's own Creative Commons licence, CC0 is the safe one). `resolve-freesound.mjs` in this folder does
   the Freesound search and download and writes the ledger line for you. It reads the token from
   `library/.env` (`FREESOUND_TOKEN=...`), which is git-ignored — Faisal holds the key.
2. Drop the file in `sfx/` or `bgm/`, add a line here with the source URL and licence.
3. Copy it into the project's `assets/` folder and reference it from the build. Never load it from
   the network in a composition.

## Freesound picks used by B1 (CC0 1.0, fetched by `fetch-sounds.mjs` from `sounds.json`)

No token needed since 12 Sep 2026: with `FREESOUND_TOKEN` unset the fetcher reads each sound's public page
(`freesound.org/s/<id>/`) for the same `-hq.mp3` preview and the licence link, and still refuses anything that is not
CC0. The API route is used when the token is present. Every file is normalised to a measured −3 dBFS peak.

- `whoosh` — "Woosh" by Anthousai, 1.72s, https://freesound.org/apiv2/sounds/683096/ — panel entrance — airy, long tail
- `swish` — "digital_whoosh_soft" by Halleck, 0.95s, https://freesound.org/apiv2/sounds/71852/ — bar rising, a row sliding in
- `pop` — "Pop in sfx" by BaggoNotes, 0.56s, https://freesound.org/apiv2/sounds/824189/ — a chip, tag or card appearing
- `tick` — "Soft UI Button Click" by Erokia, 0.24s, https://freesound.org/apiv2/sounds/528561/ — a checklist item, a small change
- `chime` — "snd_fragment_retrieve" by Kastenfrosch, 1.7s, https://freesound.org/apiv2/sounds/562196/ — the highlight figure landing
- `riser` — "Cinematic Riser #3 subtle" by Pixabay (mirror), 3.0s, https://freesound.org/apiv2/sounds/859482/ — into the title card — crests at the end
- `impact` — "Impact Hit at soft but big material" by Nox_Sound, 1.34s, https://freesound.org/apiv2/sounds/728515/ — title and end card landing
- `bounce` — "Energy Bounce 1" by Aleks41, 1.21s, https://freesound.org/apiv2/sounds/523088/ — the 'more than double' tag
- `music` — "Tropicorp Advertisement" by Nancy_Sinclair, 37.65s, https://freesound.org/apiv2/sounds/561190/ — intro and outro beats — corporate, claps, bright
