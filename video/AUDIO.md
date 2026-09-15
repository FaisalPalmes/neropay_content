# Sound for HyperFrames builds — the standing note

Written 15 Sep 2026 as a handover to the session building motion-graphics videos from scratch in
Claude Code, after one shipped silent. Read it with `PLAYBOOK.md` (the standing brief) and
`LESSONS.md` (the fault log). It covers everything a build needs to make noise: what is already in
this repo, what the container can and cannot reach, how sound is wired into a composition, the mix,
and the voiceover route.

**The rule: no NeroPay video ships silent.** A motion graphic with no sound reads as a broken file,
not a design choice. Every piece needs at least a bed and an effect on each entrance. B1 shipped
silent once because the sound files were empty placeholders and nobody listened before delivery
(LESSONS #68) — Faisal's words were "the sound effects are gone, essentially, even the intro song".
Listen to the render, or at minimum run the peak gate in `b1-v8/sandbox.sh`, before you deliver.

---

## 1. What you can use today, offline, with no key

Nineteen effects are **committed** at `video/library/sfx/*.mp3` — they arrive with the clone, no
network, no credential. Pixabay Content Licence: commercial use on YouTube, Instagram, Facebook and
LinkedIn, no attribution required. `sfx/manifest.json` carries a duration and a one-line use note
per file.

```
chime  click  click-soft  error  glitch-1/2/3  impact-bass-1/2  key-press
notification  ping  pop  riser  sparkle  typing  whoosh  whoosh-short  whoosh-cinematic
```

A second set — `whoosh swish pop tick chime riser impact bounce music` — is declared in
`library/sounds.json` and fetched from Freesound (CC0) by `library/fetch-sounds.mjs`, normalised to
a measured −3 dBFS peak and written as `.m4a` into a project's `assets/sfx/`. Those files are
git-ignored: they are fetched at render time, in the sandbox. In a web session the fetcher writes
silent placeholders of the right length (`--placeholder`) — enough for `npx hyperframes check`,
**never** for a delivery render.

```bash
node ../library/fetch-sounds.mjs --into ./assets/sfx               # real files (sandbox / a PC)
node ../library/fetch-sounds.mjs --into ./assets/sfx --placeholder # web container, check only
```

**Nothing goes into a NeroPay video unless it is listed in `library/LEDGER.md` with a licence that
allows commercial use.** Add the source URL and licence there in the same commit as the file. That
is the rule that keeps a track from being claimed on YouTube.

There is no committed music bed. B1's intro and outro beats are cut from one CC0 Freesound track
(`music`, 82 bpm) into `music-intro` (5.4 s) and `music-outro` (18.6 s) by the `derived` block in
`sounds.json`. If a motion-graphics series needs a bed of its own, add it to `sounds.json` and the
ledger — do not reach for something unlicensed because it is to hand.

## 2. What this container can reach — measured, not assumed

Outbound HTTPS goes through a policy-enforcing proxy. Measured 15 Sep 2026 from the web container:

| Host | Result | What it costs us |
|---|---|---|
| `api.elevenlabs.io` | **403 at CONNECT** | no ElevenLabs voiceover in a web session |
| `api.heygen.com` | **403** | no HeyGen TTS, no HeyGen music/SFX catalogue |
| `huggingface.co`, `cdn-lfs.huggingface.co` | **403** | no Kokoro, MusicGen or Whisper model download — the local fallbacks cannot install either |
| `freesound.org`, `cdn.freesound.org` | **403** | `fetch-sounds.mjs` writes placeholders only |
| `pixabay.com` | **403** | no new effects from source |
| `registry.npmjs.org`, `pypi.org`, `files.pythonhosted.org` | allowed | packages install fine; their model weights do not |
| MCP connectors (Higgsfield, Drive, GitHub) | allowed | their traffic goes through Anthropic's servers, not the session's network — which is why `sandbox_exec` works when `curl` does not |

So the honest position: **a Claude Code web session cannot generate or fetch a single new sound.**
It can only use what is committed. Editing is not affected: once a file is on disk — committed,
fetched in the sandbox, or made locally — wiring it into a composition, mixing it and mastering it is
all local work with `ffmpeg` and needs no network at all. Only *acquiring* audio is blocked. Three ways round it, in the order they are worth trying:

The block is the **cloud environment's network access level**, not the provider and not Claude. The
default level is **Trusted** — package registries, GitHub and cloud SDKs, nothing else — so the proxy
refuses at CONNECT before it ever reaches the host. Four ways round it, best first:

1. **Store the key as an environment API credential** (Pro and Max plans). In the environment editor
   at claude.ai/code → **API credentials** → **Add credential**: allowed website `api.elevenlabs.io`,
   a custom header named `xi-api-key` with the prefix cleared, the key as the value. Anthropic's proxy
   then attaches the header *after* each request leaves the VM — **the key never enters the session**,
   is not in the environment variables or any file, and the host becomes reachable even at Trusted.
   Call it with plain `curl` and no auth header. Note the corollary: `$ELEVENLABS_API_KEY` is unset in
   that session, so `hyperframes tts` and the `media-use` engine will think there is no key and fall
   back to a local voice — use `curl` for ElevenLabs on this route, not those.
2. **Raise the environment's network access.** Same editor → **Network access** → **Custom**, then
   `api.elevenlabs.io`, `freesound.org`, `*.freesound.org`, `huggingface.co`, `cdn-lfs.huggingface.co`,
   `cdn.pixabay.com` and `d2ol7oe51mr4n9.cloudfront.net` in **Allowed domains**, one per line, with
   *Also include default list of common package managers* ticked. **Full** allows any domain.
3. **Run the session locally.** The Desktop app's environment selector has a **Local** row — a session
   on the machine itself, with its own network and no egress proxy, where all of this just works.
4. **The Higgsfield sandbox** (`mcp__Higgsfield__sandbox_exec`) has open internet and is where every
   B1 render already happens, so it needs no configuration at all. Fetch sounds there freely; think
   twice before passing an API key into it, since the key then transits a third party's machine.

## 3. How sound is wired into a composition

HyperFrames owns media playback: sound is declared as `<audio>` elements with timing attributes, not
played by script. One element per cue, each on its own track index.

```html
<audio id="sfx-pop-1240" src="assets/sfx/pop.m4a"
       data-start="12.4" data-duration="0.56" data-track-index="14" data-volume="0.12"></audio>
```

- `data-start` — seconds on the timeline. Keep it on the frame grid and on the beat (§4).
- `data-duration` — how long it is scheduled for.
- `data-track-index` — **unique per cue.** Two cues sharing an index fight.
- `data-volume` — the mix, 0–1.

**The renderer plays to the end of the file, not to `data-duration`** (LESSONS #56). A bed longer
than the time left in the piece runs past the last frame and tears the tail. `b1-v8/build.mjs`'s
`sfx()` helper handles this: it measures the file with `ffprobe`, and when the file outlasts the
room left it writes a trimmed copy with a 0.3 s fade-out and references that instead. **Copy that
helper rather than writing a new one** — it also applies `SFX_GAIN` and knows which roles are beds:

```js
const SFX_GAIN = 0.75;                       // effects 2.5 dB down; beds are not effects
const BEDS = new Set(['music-intro', 'music-outro']);
function sfx(role, start, vol, maxLen) { /* b1-v8/build.mjs, ~line 210 */ }
```

For fades, crossfades, ducking under a voiceover, or one chain over a group of tracks
(`<hf-audio-group>`), load the `/hyperframes-audio` skill — it owns mixing of already-placed audio.
`/media-use` owns sourcing and generating it. Do not improvise either with raw Web Audio.

Run `npx hyperframes check` after adding audio; it catches a missing file, an overlapping index and
a cue past the end.

## 4. The mix, and the beat grid

**Levels.** Effects at 0.12–0.28 before `SFX_GAIN`, beds at 0.34–0.42. In a narrated piece the
effects sit 15–20 dB under the voice — there but barely, which is the brief. Faisal's note on the v6
mix was "slightly lower", which is where the 0.75 gain came from. Master with ffmpeg at the end of
the render, never by adjusting element volumes upward:

```bash
ffmpeg -y -i renders/out-high.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 \
  -c:v copy -c:a aac -b:a 192k renders/out-final.mp4
```

−14 LUFS / −1.5 dBTP / 48 kHz is the delivery target for every platform we post to. Report the
measured LUFS and true peak in the delivery message.

**The beat grid is what makes a motion graphic feel designed rather than assembled.** Take the bed's
BPM, derive the beat, and land every card, count-up and wordmark on it:

```js
const BEAT = 60 / SOUNDS.sounds.music.bpm, BAR2 = 2 * BEAT;   // 82 bpm → 0.732 s
```

B1's title card is the worked example: the bed starts on "NeroPay" at beat 0, the slab expands over
one beat, the letters rise from beat 1 with the impact, the dot pops as the y lands, the episode line
rises on beat 2. Faisal asked for exactly this — "animate the title text better with the sound and
beats". In an unnarrated motion graphic the grid is stricter, not looser: if the piece is 8 seconds
at 100 bpm, it is 13 beats, and every event belongs on one.

**Every sound is motivated by something moving.** A cue with nothing on screen to justify it is
noise. Conversely, a panel that slides in silently reads as a dropped frame.

## 5. The cue vocabulary — motion to sound

| What moves | Cue | Level |
|---|---|---|
| Panel or card entrance | `whoosh-short`, `whoosh` (airy, long tail) | 0.14–0.15 |
| A row sliding in, a bar rising | `swish`, `sparkle` | 0.13–0.16 |
| A chip, tag or small card appearing | `pop` | 0.16–0.18 |
| A checklist item, a counter step, a small change | `tick`, `click-soft` | 0.18–0.20 |
| The highlight figure landing | `chime` | 0.22 |
| Title or end card landing | `impact` | 0.26–0.28 |
| Into a title card | `riser`, started at `land − duration` | 0.26 |
| An emphatic tag ("more than double") | `bounce` | 0.22 |
| Typing / terminal / data feel | `typing`, `key-press` | 0.12–0.16 |
| Error or refusal beat | `error`, `glitch-1` | sparingly |

A count-up gets a `tick` on its first frame, not one per number. A number that is the point of the
shot gets a `chime` when it lands. Two cues inside 80 ms read as one muddy hit — space them or drop
one.

## 6. Voiceover — the ElevenLabs route

For a narrated motion graphic, the order is: script → audio → **word timings** → captions and
animation timed to those words. That is how B1's per-word captions are built, and it is why the
figures land on the syllable.

ElevenLabs returns audio with **no word timestamps**. So the second step is a Whisper pass over the
generated file:

```bash
# 1. synthesize (wherever api.elevenlabs.io is reachable — sandbox or a PC)
curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/$VOICE_ID" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" -H "Content-Type: application/json" \
  -d '{"text":"...","model_id":"eleven_multilingual_v2"}' -o vo.mp3
ffmpeg -i vo.mp3 -ar 44100 -ac 1 vo.wav

# 2. word timings, the same flat [{id,text,start,end}] shape the captions pipeline wants
npx hyperframes transcribe vo.wav --words data/words.json
```

`hyperframes transcribe` downloads a Whisper model from HuggingFace on first use, so it runs in the
sandbox too, not in a web session. Commit `data/words.json` and the voice file with the build — a
generated voiceover that only exists in a sandbox run is not reproducible, and the next render will
quietly differ.

The key is read from the environment as `ELEVENLABS_API_KEY`. **Never** commit it, never paste it in
chat. Two places it belongs: the environment's variables (code.claude.com → the environment →
environment variables) for a web session, or `video/library/.env` locally — that file is already
git-ignored and already holds `FREESOUND_TOKEN`.

What the ElevenLabs route needs before it can run, once:

- `ELEVENLABS_API_KEY` in the environment — a key issued for content work, scoped to text-to-speech and
  voice read, with its own credit cap so video work cannot drain the quota the AI call assistant runs on.
- One `voice_id`, chosen once and written down here, and a note of the plan it was generated under (the
  commercial-use licence rides on the plan). British English; `eleven_multilingual_v2` also covers the
  Turkish cuts, so the same voice can carry both.
- `api.elevenlabs.io` reachable — the sandbox, an allowlisted environment, or a PC.

Fallbacks if ElevenLabs is not set up yet: HeyGen TTS (`npx hyperframes auth login`, free web
allowance) or local Kokoro (`npx hyperframes tts "..." -o vo.wav`, no key). Both need hosts this
container cannot reach, so both are sandbox-only too. Do not silently swap voices between episodes —
a series that changes narrator halfway sounds like two products.

**Pacing:** 145–155 words per minute with room to breathe. Music under a voice sits around −31 LUFS.

## 7. Rails that apply to sound

The rails in the root `CLAUDE.md` do not stop at the picture.

- **Rail 4 — synthetic voice is a disclosure.** An ElevenLabs or Kokoro voiceover is AI-generated
  content. Faisal's decision of 9 Sep 2026 stands: no AI wording inside the video, the disclosure is
  made at upload — YouTube's "altered or synthetic content" setting plus a line in the description,
  and Meta's AI-content disclosure on an ad. Per upload; it does not carry over between cuts, and it
  applies to the Turkish version separately.
- **No voice cloned from a real person** without written consent, and never a customer's or a
  merchant's. The narrator is a stock or purpose-made voice, and it is not Eray's call-assistant
  voice — that one is a support agent, and reusing it makes marketing sound like a service call.
- **The script carries every copy rail.** No credit or lending language (s.21 FSMA), no earnings
  claims, no guaranteed saving, no terminal price or transaction rate spoken aloud, "We" never "I",
  Faisal never named, and a concession in every educational piece. A spoken word is a financial
  promotion exactly like a caption.
- **Licence every sound in `library/LEDGER.md`** before it ships, with its source URL.
- **Music with vocals or a recognisable hook is out** — it dates the piece and risks a claim.

## 8. Adding sound to a build that shipped silent

1. Read `PLAYBOOK.md` §12 and LESSONS #56 and #68 first.
2. Choose the bed and its BPM; derive `BEAT`; check that the existing card timings are on the grid,
   and move them if they are not. The grid comes first — cues follow it.
3. Copy `sfx()` out of `b1-v8/build.mjs` with `SFX_GAIN` and `BEDS`.
4. Place a cue on every entrance, landing and counter, from the table in §5.
5. Fetch the real files (`fetch-sounds.mjs` without `--placeholder`) in the sandbox.
6. `npx hyperframes check`, then render `-q high`, then loudnorm to −14 LUFS.
7. **Verify the audio is actually there**: `sandbox.sh` refuses a file whose sounds peak under
   −40 dBFS, and the report lists the peak per cue window. A silent placeholder passes every other
   check — this gate is the only thing that catches it.
8. Add the ledger row and a LESSONS line for anything new that bit you.
