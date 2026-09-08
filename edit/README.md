# NeroPay edit

Turns a folder of Higgsfield renders into a finished YouTube video: the cuts in script order,
the cold open and hook, an animated intro card, captions in Poppins with the important words
picked out, a slow push on every shot and a punch when a number lands, the drawn overlays
sliding in with the presenter tucked into the corner, name plates and the host box for
Behind the Counter, the disclosure over the first three seconds, an animated outro, subtle
sound effects, and the audio normalised to YouTube's level. It is code, not a desktop editor:
the timeline comes from `videos.js` and `calls.js` in the repo root, so nothing is typed twice.

This is the one subfolder in the repo on purpose. It is run from a terminal, never uploaded
through the GitHub web page.

## What you give it

Drop the renders in `public/clips/`, named by shot id, MP4:

```
public/clips/B1-01.mp4  B1-02.mp4 … B1-18.mp4         Explained presenter shots
public/clips/C1-H1.mp4  C1-01.mp4 … LISTEN-1.mp4 …    Behind the Counter host shots, bites, listening loops
```

Overlays are not clips — they are drawn from `overlays.js` at render time, exact and transparent.

## Run

```
npm install                       once
npm run sfx                       once — synthesises the sound effects into public/sfx
npm run render -- B1 --test       the first 20 seconds, to look at before spending the time
npm run render -- B1              the full video → out/B1-final.mp4
npm run check -- B1               a frame at every cut and overlay into out/qc/B1, plus loudness
npm run studio                    Remotion's preview in a browser, if you want to scrub it
```

Without the real clips, `npm run placeholders -- B1` renders stand-ins so the whole pipeline
can be exercised. They never overwrite a real file.

## Captions

Word timing is estimated from the script and the clip length, which is close for eight-second
shots. For frame-tight highlighting, transcribe with Whisper and drop the result in
`captions/B1.words.json`; `scripts/transcribe.py` does that when you have a model directory
(`pip install faster-whisper`, then `python scripts/transcribe.py B1 --model /path/to/model`).
The model host is blocked from the remote environment, so the model has to be uploaded once.

Emphasis: every number, percentage and pound figure goes yellow and larger; a short list of
words per series in `src/emphasis.js` does too. Keep that list short.

## Where things are decided

- `src/timeline.js` — the edit: shot order, cold open, intro/outro lengths, overlay spans.
- `src/Main.jsx` — the look: captions, motion, overlay behaviour, cards, plates, host box.
- `src/emphasis.js` — which words get picked out.
- `scripts/make-sfx.mjs` — the sounds. Whoosh on an overlay, rise on the intro, pop on a
  question card, tick on the outro. All at low volume under the original clip audio.

## Limits worth knowing

Rendering is CPU-only in the remote environment: about ten to fifteen minutes for a
three-minute video. The renders' own sound is kept as-is; nothing here can fix lip sync or
a bad take, only cut around it. Music is not included — add a licensed track in `Main.jsx`
if you want one, ducked under the voice.
