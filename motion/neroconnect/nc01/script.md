# NC01 — the NeroConnect intro

Built from `PROPOSAL.md` beside this file (17 Sep 2026). Voice: **Olivia — Warm, British Female**
(`pPoztmvzd5p26S3MsNrV`, `eleven_v3`), the partner-side voice. Status: **take generated for Faisal's review, script
not yet approved, nothing built.**

## The take (17 Sep 2026, flow `V5Z2DUgxnS9rAnIxR1yP`)

Two generations, both in `video/library/LEDGER.md`:

- `data/vo-main-raw.mp3` — node `Jo9eDqzSmwcJIwVmFSuz`, 95.8 s, 1,535 credits. The full proposal script, except that the
  closing sentence went into the generation garbled by a prompt error of mine ("Read it at NeroPay dot app, forward slash
  docs… actually, docs dot NeroPay dot app"). Everything before 83.10 s is the script as written.
- `data/vo-close-raw.mp3` — node `TbC1LYLwdHlQB9mK91Q7`, 9.0 s, 140 credits. The closing sentence alone, as written.
- `data/vo-review.mp3` — the first take cut at 83.10 s (inside the silence after "not after"), a 0.32 s gap, then the
  closing take. 92.4 s. This is the file Faisal reviews. If the script is approved as read, this is the take the video
  is built to (word timings from faster-whisper in the sandbox, then `tighten.mjs --gap .32 --min .45 --tempo 1.03`
  and `gate.py --inset .12 --max -30`). If the script changes, one new take replaces all three.

The script as spoken in the review file:

> [warmly] You don't have to build a payments company to run one. Everything it takes already exists. The card terminals.
> The till software. The settlement, the compliance, the support desk. We built all of it for NeroPay, and NeroConnect
> lets you run it under your own name. Here's how it works. You sign up as a platform and you get one dashboard for every
> merchant you look after. Your logo on the dashboard, your domain in the address bar, and if you want it, your branding
> on the terminal itself. You bring the merchants. [curious] And underneath, it's us: the card acquiring, the money landing
> in their account, the paperwork, the support. There are two ways to run it. Connected mode: you work under the NeroPay
> name, we set the merchant rates and we handle the disputes. It's the simpler start. Platform mode: your brand, your
> pricing, and more of the responsibility, disputes included. It's for when you want your own name on everything. Who
> it's for: EPOS installers. Software companies with restaurants or salons on their platform. Anyone looking after a
> group of merchants. [serious] And who it isn't for. If you look after three cafés, the partner programme is the right
> door — one introduction and nothing to run. And platform mode can need its own regulatory permissions, so that's a
> conversation we have before a contract, not after. [warmly] The documentation is public. Read it at docs dot NeroPay
> dot app, then talk to us. That's it for today. Follow us for more of this.

## Tooling note

`ffmpeg` on PATH in the cloud container is Remotion's bundled build with filters stripped (LESSONS #57); `/usr/bin/ffmpeg`
is the full build. Anything with `afade`, `loudnorm` or `sidechaincompress` in it calls `/usr/bin/ffmpeg` explicitly.
