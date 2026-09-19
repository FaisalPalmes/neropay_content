# img2threejs in this repo

Installed 19 Sep 2026 from https://github.com/img2threejs/img2threejs (v2.0.0, Apache 2.0; LICENSE beside this
file), at Faisal's ask. Whole repo minus `.git`, `.github` and the sponsor images. Python 3 plus `forge/requirements.txt`
for the pipeline scripts; the Three.js output is plain code with no build step.

What it is for here: a procedural Three.js model of the NeroPay terminal or the Flex from a reference photograph, for
motion graphics that want a turntable, a tilt or a light pass on the product. HyperFrames has a Three.js adapter
(`/hyperframes-animation`), so a model built this way can sit in a composition; every frame still has to be seek-safe
and deterministic, so the model's time comes from the timeline, never from `requestAnimationFrame`.

Rules that still apply: the terminal is the only branded object in frame, NeroPay branding only on the Flex, no price on
the screen it shows, and the skill's own honesty rule stands: a single photo cannot reveal the hidden sides, so the
result is stated as approximate. It keeps its state in `.img2threejs/state.json` in whatever folder it runs in; run it
inside the piece's folder under `video/` or `motion/`, and git-ignore that state file.
