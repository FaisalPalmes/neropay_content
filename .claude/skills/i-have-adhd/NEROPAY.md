# i-have-adhd — NeroPay house notes

Installed 24 Sep 2026 at Faisal's request from ayghri/i-have-adhd (MIT). Instructions only; no code runs.

- Output style for replies to Faisal. On with `/i-have-adhd`, off with "stop adhd mode". It never switches
  itself on (`disable-model-invocation: true`).
- The upstream repo also ships an always-on SessionStart hook. It is **not** installed here, because a hook
  in this repo would change the output of all four sessions. Add it only if Faisal asks for every session.
