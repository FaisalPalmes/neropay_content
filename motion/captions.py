"""Burn-in captions for an episode: data/vo_words.json + data/captions.json -> data/captions-<ratio>.ass

    python3 motion/captions.py <series>/<episode>

captions.json: { "head": 0.8, "lines": ["clause", "clause", ...] }  — the VO script split into the
clauses you want as cues, in order, punctuation as spoken. Words are matched in order against the
Whisper words (case- and punctuation-insensitive), so a cue's in-point is its first word's onset and
its out-point is its last word's end, clamped to the next cue's start. Long clauses wrap at 26 chars.
Style: Chivo ExtraBold (the TTF libass can read — its internal name is 'Chivo Medium ExtraBold'),
white on a translucent black box, above the footer.
"""
import json, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ep = HERE / sys.argv[1]
words = json.load(open(ep / 'data/vo_words.json'))
spec = json.load(open(ep / 'data/captions.json'))
head = spec.get('head', 0)
norm = lambda w: re.sub(r"[^a-z0-9']", '', w.lower().replace('’', "'"))

cues, i = [], 0
for line in spec['lines']:
    toks = [t for t in line.split() if norm(t)]
    start = None
    for t in toks:
        # advance to the next Whisper word that matches this token (tolerant of hyphen splits)
        tgt = norm(t)
        j = i
        while j < len(words) and not (norm(words[j]['w']) == tgt or tgt.startswith(norm(words[j]['w'])) or norm(words[j]['w']).startswith(tgt)):
            j += 1
        if j >= len(words):
            raise SystemExit(f"could not align '{t}' in: {line}")
        if start is None: start = words[j]['s']
        end = words[j]['e']; i = j + 1
    cues.append([head + start, head + end, line])
for k in range(len(cues) - 1):
    cues[k][1] = min(cues[k][1] + 0.12, cues[k + 1][0] - 0.04)
cues[-1][1] += 0.4

def wrap(s, n=26):
    if len(s) <= n: return s
    ws, a, b = s.split(), [], []
    for w in ws:
        (a if len(' '.join(a + [w])) <= n or not a else b).append(w)
    if not b: return s
    return ' '.join(a) + r'\N' + ' '.join(b)

def ts(t):
    h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"

LAYOUT = { '9x16': (1080, 1920, 62, 190), '4x5': (1080, 1350, 58, 150), '1x1': (1080, 1080, 54, 140) }
for ratio, (W, H, size, mv) in LAYOUT.items():
    ass = [ '[Script Info]', 'ScriptType: v4.00+', f'PlayResX: {W}', f'PlayResY: {H}', 'WrapStyle: 0', 'ScaledBorderAndShadow: yes', '',
        '[V4+ Styles]',
        'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
        f'Style: Cap,Chivo Medium ExtraBold,{size},&H00FFFFFF,&H00FFFFFF,&H00000000,&HA0000000,-1,0,0,0,100,100,-1,0,3,17,0,2,75,75,{mv},1', '',
        '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text' ]
    for s, e, txt in cues:
        ass.append(f"Dialogue: 0,{ts(s)},{ts(e)},Cap,,0,0,0,,{wrap(txt)}")
    (ep / f'data/captions-{ratio}.ass').write_text('\n'.join(ass) + '\n')
print(f"{len(cues)} cues, {cues[0][0]:.2f}s -> {cues[-1][1]:.2f}s, three .ass files written")
