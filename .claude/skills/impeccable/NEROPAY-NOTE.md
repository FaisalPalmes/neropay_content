# /impeccable in this repo

Installed 19 Sep 2026 from https://github.com/pbakaus/impeccable (`plugin/skills/impeccable/`, engine 0.1.5,
Apache 2.0; LICENSE and NOTICE beside this file), at Faisal's ask. **The plugin's hooks were not installed**: upstream
runs its engine after every Edit/Write and on every Stop, which would fire on every caption edit in every session
on this repo. Call it on purpose instead: `/impeccable critique social.html`, `/impeccable polish`, `/impeccable audit`.

The launcher (`scripts/impeccable`) downloads its engine binary from GitHub releases into `~/.impeccable/bin/` on
first run. GitHub is reachable from a cloud session, so this works; it was verified here on install day.

What outranks it here:

- **`SOCIAL-BRIEF.md` and `MOTION-SYSTEM.md` v3 are the design authority**, and they are Faisal's rulings, not
  taste. Impeccable's craft floor bans a kicker above a heading "no brief earns it back"; ours carries one on every
  social card and on the v8 title stage. The kicker stays. Same for the yellow-through-frost blooms and the wordmark
  bottom-left: fixed furniture, not up for critique.
- It has no idea about the rails. A design pass must not add a figure, a claim, a testimonial or a price to a page.
- Use it on the warehouse pages (`*.html`, `style.css`) and the `social/` templates. Not on a HyperFrames composition's
  timing or on anything in `motion/`.
