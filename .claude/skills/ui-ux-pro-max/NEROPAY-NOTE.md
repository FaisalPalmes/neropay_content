# ui-ux-pro-max in this repo

Installed 23 Sep 2026 from https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (`.claude/skills/ui-ux-pro-max/`,
v2.13.0, MIT; LICENSE beside this file), at Faisal's ask. Only this skill was taken; the repo's `design`, `brand`,
`design-system`, `ui-styling`, `banner-design` and `slides` skills were left out. `scripts/tests` was dropped.

What it is good for here: the UX rules (`references/quick-reference.md`, `references/pro-rules.md`) and the search
over them — accessibility, touch targets, type sizes, reduced motion, navigation — as a checklist for the warehouse
pages. `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux`.

What it must not decide: colour, type or the logo. Its `--design-system` generator proposes a palette and a font
pairing of its own (for this repo it suggested a dark OLED theme with green accents and Fira), and it has never
read `BRAND.md`, `SOCIAL-BRIEF.md` or the rails. Those outrank it.
