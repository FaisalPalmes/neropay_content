# /prompt-master in this repo

Installed 21 Sep 2026 from https://github.com/nidhinjs/prompt-master (v1.8.0, commit `2bd9251`, MIT,
licence beside this file), at Faisal's ask. Whole repo: `SKILL.md`, `README.md` and `references/`
(templates and the 37-pattern catalogue). Nothing removed, nothing changed.

## What it is

A prompt writer. It takes a rough idea, works out which AI tool the prompt is for, and returns one
finished prompt ready to paste. It routes by tool, so a Midjourney prompt and an ElevenLabs prompt
come out in different shapes. It asks at most three clarifying questions, never more.

It only fires when you explicitly ask for a prompt. It does not hijack ordinary work.

## Where it earns its place here

| Job | Why the skill helps |
|---|---|
| Higgsfield `generate_video` / `generate_image` | Routes to the video and image categories: camera move, shot type, lighting, lens. Those are the fields our prompts usually miss |
| ElevenLabs voice | Emotion, pacing, emphasis and rate stated as parameters. The skill's own note: "prose descriptions do not translate" |
| Briefing another session | Template M, the agentic-tool template, with scope locks, forbidden actions and stop conditions. That is exactly the shape of the handover prompts in `SOCIAL-HANDOVER.md` and `BRAND.md` |
| Fixing a prompt that keeps missing | Decompiler mode: paste the prompt, get it broken down or adapted for a different tool |

## What outranks it here

- **The rails.** A prompt it writes is still copy or a frame. No credit or lending language, no
  earnings claims, no price or rate, no named merchant, no AI-generated street or person. The skill
  knows nothing about s.21 FSMA. Read the generated prompt before you run it.
- **`BRAND.md`.** A generated image or video prompt must carry the current brand: yellow `#FFCF24`,
  ink `#111114`, the terminal as the only branded object, no bokeh, no props.
- **Credential safety is already ours.** The skill strips keys from prompts, which matches
  `STACK.md` §1. Neither of us ever puts a key in a prompt.

## Using it

Ask for a prompt and name the tool:

```
/prompt-master write me a Higgsfield video prompt for the Flex on a market stall in November
/prompt-master turn this into an ElevenLabs prompt: <the line>
/prompt-master this prompt keeps giving me bokeh, fix it: <paste>
```

It returns one prompt block, a one-line note on what it optimised, and setup steps only if needed.
