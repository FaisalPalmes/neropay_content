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
