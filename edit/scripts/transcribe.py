"""Word timings from the real clips with faster-whisper, for frame-tight captions.

The model host is blocked from the remote environment, so a model directory has to be
uploaded once (a CTranslate2 Whisper model, e.g. "small.en"). Then:

    pip install faster-whisper
    python scripts/transcribe.py B1 --model /path/to/whisper-small.en

Writes captions/<VID>.words.json in the shape captions.mjs reads:
    { "B1-01": [ { "w": "You", "s": 0.31, "e": 0.52 }, ... ] }

The script is known, so each clip is transcribed with its line as the initial prompt,
which keeps names and numbers spelled the way the pack spells them.
"""
import argparse, json, os, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument('vid')
ap.add_argument('--model', required=True, help='path to a CTranslate2 Whisper model directory')
ap.add_argument('--clips', default=os.path.join(os.path.dirname(__file__), '..', 'public', 'clips'))
a = ap.parse_args()

try:
    from faster_whisper import WhisperModel
except ImportError:
    sys.exit('pip install faster-whisper first')

# the shot list and lines come from the repo data, via node, so there is one source of truth
node = subprocess.run(['node', '-e', """
globalThis.window = globalThis;
await import('../videos.js'); await import('../calls.js');
const {clipIds} = await import('./edit/src/timeline.js');
console.log(JSON.stringify(clipIds({VIDEOS: window.VIDEOS, CALLS: window.CALLS}, process.argv[1])));
""", a.vid], cwd=os.path.join(os.path.dirname(__file__), '..', '..'), capture_output=True, text=True, check=True)
shots = json.loads(node.stdout)

model = WhisperModel(a.model, device='cpu', compute_type='int8')
out = {}
for s in shots:
    if not s['spoken']:
        continue
    f = os.path.join(a.clips, s['id'] + '.mp4')
    if not os.path.exists(f):
        print('missing', s['id']); continue
    segs, _ = model.transcribe(f, language='en', word_timestamps=True, initial_prompt=s['spoken'], vad_filter=True)
    words = []
    for seg in segs:
        for w in seg.words or []:
            words.append({'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3)})
    out[s['id']] = words
    print(s['id'], len(words), 'words')

dest = os.path.join(os.path.dirname(__file__), '..', 'captions')
os.makedirs(dest, exist_ok=True)
with open(os.path.join(dest, a.vid + '.words.json'), 'w') as fh:
    json.dump(out, fh, indent=1)
print('wrote captions/%s.words.json' % a.vid)
