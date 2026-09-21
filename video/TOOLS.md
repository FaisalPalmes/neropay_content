# Tools register — third-party libraries worth keeping an eye on

Repos Faisal has come across and wants kept. Each entry says what the thing is, what it would do for NeroPay content,
what it would do for the paid-social client work, and the verdict as of the date on the row. Nothing here is installed
unless the entry says so. Before pulling any of them into a build, re-read the environment rules in `CLAUDE.md`
(no CDN scripts — vendor the file; every frame must be seek-safe and deterministic for HyperFrames).

| Repo | What it is | Licence | Saved |
|---|---|---|---|
| [dashersw/liquid-glass-js](https://github.com/dashersw/liquid-glass-js) | Apple "Liquid Glass" panels for the web: WebGL refraction, blur and tint over whatever sits behind the element. Rounded, circle and pill shapes; nested glass. ~1,300 lines, no build step. Samples the page with html2canvas. | MIT | 13 Sep 2026 |
| [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | React renderer for three.js — 3D scenes written as JSX components. v9 pairs with React 19. | MIT | 13 Sep 2026 |
| [ruucm/shadergradient](https://github.com/ruucm/shadergradient) | Animated 3D gradients (the Framer / Figma plugin); the `@shadergradient/react` package renders through react-three-fiber + three. Presets, camera controls, driven by props or a query string. | MIT | 13 Sep 2026 |
| [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) | Editorial diagram skill: self-contained HTML with inline SVG, no shadows, no Mermaid. ~41 type references, six connector rules, a complexity budget, plus `lint-skin.py` and `lint-render.py` which verify a diagram by painting it in headless Chromium. 41.7k stars. | MIT | 21 Sep 2026 |
| [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) | File-based planning for long agent tasks: `task_plan.md`, `findings.md`, `progress.md`, or `.planning/<id>/` for parallel work. Hooks on UserPromptSubmit, PreToolUse, PostToolUse, Stop and **PreCompact** — the last re-injects plan state after compaction and after `/clear`. No database, no daemon, no network. 27k stars. | MIT | 21 Sep 2026 |
| [Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) | 152 shot recipe cards in ten categories, each a parameter table in frames and pixels, plus 149 Mixkit commercial-free SFX, 209 preview clips and a Remotion template. The cards are framework-neutral; the code is Remotion-only. 9.2k stars. | Apache 2.0 (audio: Mixkit free-commercial, attribution required) | 21 Sep 2026 |
| [virgiliojr94/book-to-skill](https://github.com/virgiliojr94/book-to-skill) | Turns a PDF, EPUB, DOCX or folder of documents into an agent skill with chapter files and decision rules. Runs fully locally — no API, no network, no key. Needs `pdftotext` or `pypdf` for PDFs. 31.8k stars. | MIT | 21 Sep 2026 |
| [blader/humanizer](https://github.com/blader/humanizer) | 25 numbered AI-writing patterns in five categories, ~8,500 words of editing guidance. Prose only: no script, no linter. 50.9k stars. | MIT | 21 Sep 2026 |
| [tt-a1i/archify](https://github.com/tt-a1i/archify) | Architecture, sequence and data-flow diagrams as one self-contained HTML file, everything inline, optional SVG/CSS motion. The alternative to diagram-design. 68.8k stars. | MIT | 21 Sep 2026 |
| [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) | A curated list of Claude skills and resources. A list, not a skill: nothing installs from it. | CC0-style list | 19 Sep 2026 |
| [VoltAgent/awesome-claude-design](https://github.com/VoltAgent/awesome-claude-design) | 68 ready-made `DESIGN.md` files for Claude Design. A list, not a skill. The `DESIGN.md` format is the same one `/impeccable document` writes and reads, so it is a reference for writing NeroPay's own. | MIT | 19 Sep 2026 |
| [collidingScopes/liquid-logo](https://github.com/collidingScopes/liquid-logo) | Browser tool that turns a logo PNG into a "liquid metal" animation: a fragment shader finds the edges, builds a vector field and flows simplex noise along it with a metallic sheen. Exports PNG or MP4 (WebCodecs + mp4-muxer) in the browser. | MIT | 13 Sep 2026 |

## What each one means for this project

### The 21 Sep 2026 survey — twelve repos checked, two worth installing

Faisal asked for a sweep of open-source repos above 1,000 stars that suit our workflow. Twelve were
read properly, three of them by separate agents that fetched the licence and the actual skill files
rather than trusting the README. **The headline finding is that star count predicts nothing here.**
The two largest, at 94k and 60k, are the two we categorically cannot use. Two mid-sized ones are
genuinely good.

**Adopt — `diagram-design` (MIT).** The best fit of everything surveyed. Its output substrate is
exactly ours: a self-contained HTML file with inline SVG. Its six connector rules (rounded orthogonal
only, a 6–10 px label gap with a mask rect, no overlaps, fanned attach points) and its complexity
budget (at most 9 nodes, 12 arrows, 2 accent elements) fill a real gap — `motion/CLAUDE.md` has a
timing law but no diagram grammar, and The Maths is a diagram series. Its anti-pattern list
("borders in, shadows out") already matches our light stage. Re-cut it to our tokens the way
`/linkedin-post` was re-cut: paper → `#fbfaf7`, ink → `#111114`, accent → `#FFCF24`. Its two lint
scripts paint a diagram in headless Chromium and check it, which is the same verification loop as
our contact sheet.

**Adopt — `planning-with-files` (MIT).** The only one that addresses a problem we actually have and
have not solved. `.claude/NOTICES.md` broadcasts *between* sessions; this holds state *within* a long
task, and its PreCompact hook re-injects the plan after compaction — the exact failure mode that
costs us detail on every long build. Plain markdown, so it commits and merges like anything else,
and `.planning/<id>/` gives each of the three sessions its own plan directory. One folder to copy,
nothing to install.

**Harvest, don't install — `video-shotcraft` (Apache 2.0).** The 152 recipe cards are real numbers,
not vibes: `camera/crash-zoom-punch.md` specifies a 6-frame push (4–8 f range, over 10 f "reads as a
normal zoom"), target zoom 2.4–2.8 filling 60–75 % of frame, 3–6 % rebound, shake envelope
`14px·e^(−t/1.8)` with over 20 px "reads as malfunction". That ports to a paused GSAP timeline in an
afternoon. Take about twenty cards matching our register and the 149 Mixkit SFX, which serve
`AUDIO.md` directly and are licensed for commercial use with attribution. Do not vendor the repo:
hundreds of megabytes, partly Chinese-language, and much of the catalogue is off-brand for us
(we ban motion blur and most of its "electric" energy tier).

**Harvest — `book-to-skill` (MIT).** Fully local, no network, no key. The obvious job: the ~40 NeroPay
docs that live in the claude.ai Project and that no session in this repo can currently read — the
pricing ladder, the KYC rules, the GTM playbook. Converting those into committed skills would close
the single biggest context gap we have. Faisal supplies the files; the conversion runs here.

**Skip — `claude-mem` (94k stars, Apache 2.0).** Architecturally impossible for us and worth saying
why, because the star count is seductive. Its entire value sits in a SQLite plus Chroma store under
`~/.claude-mem/`, which our ephemeral container destroys on exit. Committing it is not a workaround:
it is a binary file rewritten on every tool call, so three concurrent sessions would collide on an
unmergeable blob at every push. It also needs Bun from a blocked host, spends tokens calling the API
to compress transcripts, ships telemetry, and its cloud sync pushes memories to a third-party host —
which, for a repo carrying s.21 FSMA rails and unpublished commercial terms, is an objection on its
own.

**Skip — `OpenMontage` (60k stars).** AGPLv3, a network-clause copyleft, which should stop adoption
by itself. Beyond that it vendors copies of `hyperframes-core`, `hyperframes-creative`,
`media-use` and `motion-graphics` — skills we already have first-party — and needs twenty-plus paid
video providers and a GPU we do not have. Its original pieces (a five-aspect video-prompt spec, a
sound-design note) are worth reading for ideas; the licence means we copy nothing.

**Skip — the marketing packs, and this one matters.** `coreyhaines31/marketingskills` (51k, MIT) is
well written and dangerous to us: its default copy skill recommends rhetorical questions — "Tired of
chasing approvals?" — which is rail 9's banned personal-attributes phrasing verbatim, and its
psychology skill routes "increasing urgency" to scarcity and loss aversion. `wondelai/skills` is
worse: it scores an offer 9/10 for "ethical scarcity" and named dollar-valued bonuses, templates
"10 qualified leads or you don't pay", and scripts "How much would you like to save per month?" —
rails 2 and 8 straight through. None of the four marketing repos mentions the ASA, the CAP Code,
the FCA or financial promotion once. They assume an unregulated advertiser. Lift `copy-editing`
from Corey's pack if anything; read `aaron-he-zhu/aaron-marketing-skills` (Apache 2.0) for its
claims-ledger contract, which is `figures.json` under another name.

**Skip — the rest.** `last30days-skill` (62k) needs eighteen source hosts and our proxy blocks all
but one. `anti-slop` duplicates `/slopmonster` and `/impeccable`, and its R-02 bans the em dash,
which fights our house voice. `anything2explainer` is PolyForm Noncommercial, so a commercial
advertiser cannot use it. `humanizer` (50.9k) overlaps `/slopmonster` — it is prose only with no
linter, so the linter we have is the stronger half; a few of its 25 patterns could be folded in.
`archify` is a good MIT alternative to `diagram-design` if that one disappoints.


**The two "awesome" lists (19 Sep 2026): read, don't install.** Faisal asked for both to be installed alongside the
skills below. Neither is a skill; they are catalogues. Nothing was pulled from either. `awesome-claude-design` is the more
useful of the two: its `DESIGN.md` files are the format `/impeccable` uses for a project's design system, so when the
warehouse gets its own `DESIGN.md` (from `SOCIAL-BRIEF.md` and `MOTION-SYSTEM.md` v3, never from a stranger's), the
shape comes from there. The skills that were installed the same day are `/impeccable`, four of the `taste-skill`
family, `playwright-skill` and `img2threejs`; each has a `NEROPAY-NOTE.md` in its folder and `STACK.md` §3 lists them.

**liquid-glass-js — the look we already have, built a way we can't render.** Our panels (v6 onward, `video/b1-v8/build.mjs`
`glass()`) are the liquid-glass look: a blurred copy of the footage behind each panel, tint, sheen, rim. LESSONS #27 is why
they are not a `backdrop-filter` — Chrome re-rasterises the blur under a transform, so the blur edge drifts during the lean
and the fold-away. liquid-glass-js has the same problem one layer down: its refraction reads the page through html2canvas,
which cannot see a `<video>` frame, and it runs on `requestAnimationFrame`, which a frame-by-frame render does not drive.
So it is not a drop-in for the panels. What it *is* good for: the refraction shader itself (`container.js`) as a reference
if Faisal ever asks for the panel edge to bend the footage rather than blur it — that would be a new pass over the `.bg`
copy, written as our own shader with the time driven from HyperFrames' seek clock, not this library. Also a decent
reference for the pill and circle shapes if we ever want a glass chip that isn't a rounded rectangle. Verdict: keep as a
reference, don't install.

**react-three-fiber — not for the videos, maybe for the editor.** The HyperFrames compositions are plain HTML + GSAP, and
HyperFrames already has a three.js adapter for a 3D scene if one is ever needed; putting React in front of it adds a
bundler and a runtime for no gain. The one place it would slot in is `edit/`, the Remotion editor, which is React — Remotion
has `@remotion/three` for exactly this. But nothing in the series calls for a 3D scene: the brand rule is that the terminal
is the only branded object in frame, and a 3D terminal would need a model and a lot of care to look real rather than like
a render. Verdict: nothing to do now. Revisit only if Faisal asks for a 3D product shot of the Flex (and then compare with
Higgsfield's 3D generation first).

**shadergradient — the only one with a job in reach, and it's a small one.** The title and end card sit on a near-white
ground with three static, heavily blurred yellow blooms (MOTION-SYSTEM v3, chosen 11 Sep). A slow, barely moving version
of that ground is the kind of thing shadergradient makes, and its presets are close to our palette. Two things stand in
the way. It needs React + react-three-fiber + three, which is the wrong weight for a background on two cards; the same
result is a few dozen lines of GLSL or even animated CSS gradients, seek-safe, no dependencies. And the brand asks for
everything sharp and still — the blooms are static on purpose, and a moving background under "NeroPay" is a taste call
for Faisal, not a default. Verdict: keep for the palette and the presets as a reference; if Faisal wants the blooms to
breathe, write it as our own shader and time it from the seek clock. For the paid-social clients (below) it is more
directly useful.

**liquid-logo — off-brand for NeroPay, useful for client stings.** Liquid chrome is the opposite of the NeroPay wordmark
(Nero white, Pay yellow, flat, on charcoal), so this stays out of the series. Where it earns its place is a client logo
sting for the paid-social work: drop the client's PNG in, pick a preset, export a 3–5 s MP4 in the browser, use it as a
Reel opener or the last card of an ad. It runs entirely client-side (the logo never leaves the machine — fine for client
assets). Its shader is also driven by uniforms, so the same effect could be run inside a HyperFrames composition with the
time uniform bound to the seek clock — but the browser export is the quick path and is enough for a sting. Verdict: the
first one to actually use, for clients, not for NeroPay.

## For the paid-social client work

- **A logo sting or Reel opener**: liquid-logo, straight from the browser tool. Five minutes per client.
- **A moving gradient ground for stat cards, hooks, end cards**: shadergradient's presets as the reference; render either
  via its Framer/Figma plugin (if the client work is designed there) or as a small shader in a HyperFrames stat card.
- **Glass UI chips over footage**: liquid-glass-js for the look on a *website* or landing page; for video, our own
  `glass()` pattern in `video/b1-v8/build.mjs`, which is already the same aesthetic and renders deterministically.
- **3D**: react-three-fiber only if a client brief genuinely needs a 3D scene in a React app; for a one-off 3D product
  shot in a video, Higgsfield's generation tools get there faster.

## Rules that apply before any of these touch a build

- No CDN scripts in the web container — vendor into `video/vendor/` (liquid-glass-js's quick start loads html2canvas from
  jsdelivr; that line would be blocked).
- HyperFrames renders frame by frame: anything driven by `requestAnimationFrame`, `Date.now()` or `performance.now()` has to be
  rewritten to take its time from the seek clock or it renders wrong. liquid-logo and liquid-glass-js both use wall-clock time.
- Brand rules from `CLAUDE.md` hold for every frame: Nero white, Pay yellow as an accent on charcoal, no bokeh, no props.
