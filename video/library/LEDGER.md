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

## bgm/ — nothing yet

No music bed is in use. When one is added, list it here with source, licence and any attribution line
before it goes into a build.

## How to add a sound

1. Download it from a source whose licence you can quote (Pixabay: no attribution; Freesound: check the
   file's own Creative Commons licence, CC0 is the safe one). `resolve-freesound.mjs` in this folder does
   the Freesound search and download with a token and writes the ledger line for you.
2. Drop the file in `sfx/` or `bgm/`, add a line here with the source URL and licence.
3. Copy it into the project's `assets/` folder and reference it from the build. Never load it from
   the network in a composition.
