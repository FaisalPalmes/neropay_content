# Local session handover: Faisal's home PC

Written 25 Sep 2026 by the Motion Graphics cloud session for a Claude Code session running on Faisal's PC. Read this,
then `CLAUDE.md` (the rules), then `WORKSPACE.md` (where files live). Everything in `CLAUDE.md` binds you exactly as
it binds the cloud sessions.

## 1. Who you are and what you do

Name the session **nPanda - LOCAL (PC)**. You are the fifth session on this repo and the only one on a real
machine. The four cloud sessions (CONTENT VIDEO, CONTENT IMAGES, Motion Graphics, META) keep their lanes; the lane
table is in `CLAUDE.md`. You exist for the work a cloud container can't do:

1. **Files across the PC, the SSD and Google Drive.** Build and keep the `WORKSPACE.md` layout; move media between
   `E:\nPanda` and Drive; put masters on Drive, which the cloud sessions can't (the Drive connector won't carry an MP4;
   Drive for desktop on this PC will).
2. **DaVinci Resolve.** Fusion tracking and compositing that needs a real screen and a human's clicks (§5).
3. **Heavy local renders and anything that needs the open internet.** This PC can reach the Higgsfield CDN, which
   the cloud containers can't.

You work in `video/mobile-apps-live/` (MA02, the live-action Mobile Apps ad) and in the workspace folders. You write
no other session's files: not `published.js`, not `posts.js`, not `social/`. If a job crosses a lane, say so and
leave it for the owning session.

## 2. What is the same as a cloud session, and what isn't

| | Cloud sessions | You (local) |
|---|---|---|
| Rules, briefs, lanes | `CLAUDE.md` and the docs in the repo | Same files, same rules |
| Skills in `.claude/skills/` (HyperFrames pack, caveman, slopmonster, humanizer, prompt-master, playwright and the rest) | Loaded | **Loaded: they come with the clone** |
| Account skills (`anthropic-skills:…`, e.g. brag-slim, liquid-glass-motion) | Loaded | Check with `/skills`; they follow the claude.ai account, not the repo |
| Connectors (Higgsfield, Drive, Gmail, ElevenLabs, Meta Ads, Notion, Vercel) | Attached per session | Check with `/mcp`. If one is missing, add it in Claude Code; never paste a key into chat |
| GitHub | A scoped credential from the harness | Faisal's own git login on this PC. Same repo, full push |
| Session-start hook | Installs the toolchain | **Exits at once on a local machine.** Install the toolchain yourself (§3) |
| Network | Allowlist; Higgsfield CDN blocked | Open |
| History | Per cloud session | On this PC only. Continuity comes from the repo, not from history |

**Git discipline, because five sessions share one repo:** `git pull` before you touch anything, commit small, push
straight after. Commit messages are short, plain and in the present tense, and carry no `Co-Authored-By` line. Push to
`main`.

## 3. First day

1. **Tools** (winget or the official installers): Git for Windows, Node 22, Python 3.12, ffmpeg (a full build, e.g.
   `winget install Gyan.FFmpeg`), and Google Drive for desktop and DaVinci Resolve, which Faisal has already.
2. **The workspace.** Run the PowerShell in `WORKSPACE.md` §5. It builds `D:\01 Client Work\nPanda` and `E:\nPanda` and clones the
   repo. **NeroPay only:** don't touch anything else on `E:`; the 200–300 GB already there stays where it is.
3. **The SSD stays NTFS** (Faisal, 25 Sep 2026). It stays at home, plugged into this PC. The MacBook doesn't write to
   it; Faisal drives this session from the MacBook instead (§6).
4. **The toolchain in the repo:**
   ```powershell
   cd "D:\01 Client Work\nPanda\repos\neropay_content"
   cd video;  npm install;  npx hyperframes browser ensure;  npx hyperframes doctor;  cd ..
   cd motion; npm install;  npx playwright install chromium;  cd ..
   py -m pip install opencv-python numpy
   ```
5. **Check it works:** render the nail-salon screens once
   (`node video/mobile-apps-live/screens/render-screens.cjs nail E:\nPanda\00_Inbox\test-nail`) and look at frame 0.
6. **Tell Faisal** in one message what is installed, what failed and what `/mcp` and `/skills` show.

## 4. Set up MA02 (the Mobile Apps live-action ad) on the SSD

```
E:\nPanda\02_Video\MA02_mobile-apps-live\    (copy from E:\nPanda\_Template)
```

**02_Source.** The three pilot clips (Kling 3.0, 5s, 1912x1080, 24 fps) and their start stills, straight from the
Higgsfield CDN (reachable from here, not from the cloud):

| Shot | Clip | Start still |
|---|---|---|
| Pavement, over the shoulder (Sage & Co) | `hf_20260924_221541_27a1e8c1-75d8-4bfc-8ac9-102bae9ed064.mp4` | `hf_20260924_215954_d057fbb2-509b-4d6b-b598-f1a8e771bee3.png` |
| Terrazzo table (nail salon) | `hf_20260924_221555_835fe222-ea69-43c9-bd88-ed08ed67a338.mp4` | `hf_20260924_215845_a2fa03d8-3a6a-40a7-9117-538d22f34022.png` |
| Mia against the sofa (floating cards) | `hf_20260924_221608_728408f3-e603-4c48-9770-37460c4646dc.mp4` | `hf_20260924_220311_da269452-87d0-41ea-a9cb-c1d9436e750d.png` |

The base URL for all six is `https://d8j0ntlcm91z4.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/`.

**04_Screens.** Render from the repo so they stay the source of truth:

```powershell
node video/mobile-apps-live/screens/render-screens.cjs sage E:\nPanda\02_Video\MA02_mobile-apps-live\04_Screens\sage
node video/mobile-apps-live/screens/render-screens.cjs nail E:\nPanda\02_Video\MA02_mobile-apps-live\04_Screens\nail
node video/mobile-apps-live/screens/render-cards.cjs E:\nPanda\02_Video\MA02_mobile-apps-live\04_Screens\cards
py video/mobile-apps-live/tools/float_cards.py <mia clip> E:\...\04_Screens\cards E:\...\06_Renders\mia-cards-preview.mp4 --box 880,400,1010,505 --layer E:\...\04_Screens\mia-card-layer
```

Each screen sequence is 121 PNGs at 780x1688, 24 fps, frame-for-frame with its clip. The taps are already timed to the
fingers: the nail app selects Gel pedicure at 2.3s, scrolls 2.6–4.15s, taps 11:30 at 4.3s and confirms at 4.5s; Sage
& Co scrolls at 2.05–2.65s and adds the cinnamon knot at 3.33s. `mia-card-layer` is the four Marigold cards animating
in place over the frame-0 phone position, on transparency, ready to be driven by a track.

## 5. The DaVinci work: why, and the recipe

**Why.** The cloud pilot (`tools/comp_video.py`) re-detected the screen edges on every frame. It wobbled by a pixel or
two, and it softened the screen edge with a blurred matte, a 1.5% overscan and a rescale. Faisal rejected it on
25 Sep 2026 ("so jittery and wiggly … the outline is blurred"). Fusion's planar tracker is the professional fix, and
a person has to draw the region and press track. Guide Faisal through it step by step; don't claim to drive the
DaVinci interface yourself.

**Project.** Timeline 1920x1080, 24 fps. Media from `E:\nPanda\...`. Put the cache on `E:\nPanda\_DaVinci-Cache` and
the project library on `D:\01 Client Work\nPanda\davinci\project-library`.

**Screen replacement (pavement and table), in a Fusion comp:**
1. `MediaIn1` is the plate. `MediaIn2` is the screen PNG sequence (`04_Screens\nail` or `\sage`), set to 24 fps and
   starting at frame 0.
2. **PlanarTracker** on the plate. Motion Type **Perspective**, Tracker **Hybrid Point/Area**. Draw the region around
   the whole phone body (bezel and screen), **excluding the fingers**. The green has no texture, so the bezel edges and
   corners carry the track. Track forward and backward from the frame with the clearest corners.
3. Switch the PlanarTracker's Operation Mode to **Corner Pin**, connect `MediaIn2` to its corner-pin input and drag the
   four pins onto the screen's four corners on the reference frame.
4. **DeltaKeyer** on the plate: pick the green (#00B140 family), then Clean Foreground and Clean Background just until
   the green is solid and the fingers are clean. **No matte blur**; at most one pixel of erode. This matte decides
   where the screen shows, so fingers, nails and the notch stay on top.
5. **Merge**: background the plate, foreground the corner-pinned screen, with the DeltaKeyer's matte (inverted as
   needed, so the screen shows only where the green was) as the effect mask. Limit it with a Polygon around the phone,
   tracked by the same PlanarTracker (Operation Mode: Track Mask).
6. **Match it to the plate.** ColorCorrector on the screen: gain about 0.9, warm it a touch on the golden-hour table.
   Add **MotionBlur** after the merge (quality 4, shutter 180°) so the screen blurs with the hand. Optional: bring the
   plate's glare back over the screen with a Screen-mode merge of the plate's highlights.
7. **Check before you render.** Scrub at 200% on the four corners. The screen edge has to sit on the bezel with no
   visible drift and no green line on any frame. If a corner drifts, add a keyframe correction on the pins; don't
   blur it away.

**Mia (the phone faces away):**
1. **PlanarTracker** on the back of the phone and the upper part of the fingers. Perspective, or Translation/Rotation/
   Scale if perspective is unstable. Track the whole clip.
2. Operation Mode **Planar Transform**. Feed it `04_Screens\mia-card-layer` (RGBA, already animated at the frame-0
   position). The cards now ride the phone and the push-in.
3. **Frosted glass:** Blur the plate (size around 25), mask it with the card layer's alpha shrunk by a few pixels, and
   merge it under the cards.
4. Check the cards never cover her face, and that the float stays smooth. If the track shakes, smooth the tracker path
   (Tracker → Modifiers → Smooth) rather than accepting jitter.

**Render.** Deliver page: H.264, 1920x1080, 24 fps, high quality, to
`E:\nPanda\02_Video\MA02_mobile-apps-live\06_Renders\MA02_pilot_vNN_16x9_YYYY-MM-DD.mp4`. Save the Fusion comps in
`05_Project`. Send Faisal the render; once he has it, copy it to Drive `02_Video/Masters/MA02`.

## 6. How Faisal works with you from the MacBook

In this repo folder on the PC, run `claude remote-control`. The session appears in the Claude Code app, so Faisal can
drive it from the MacBook or his phone while this PC stays on, with the SSD plugged in and DaVinci open. Leave the PC
awake (power settings: never sleep while plugged in). The DaVinci clicks in §5 need someone at the PC or on a remote
desktop.

## 7. Rules that bite on this job

- **The register.** A render writes its `library.js` row in the same commit (`CLAUDE.md`, "The delivery register").
  MA02 has no row yet, because the pilot was a test; the first real render adds it. Only Faisal's word in chat makes
  anything `approved`, recorded with who and when.
- **Casting** (NOTICES, 24 Sep 2026): AI people are mid to late twenties, fit, well kept and attractive but realistic,
  with done nails and hair. **One person per shot** (Faisal, 24 Sep 2026). The prompts are in
  `video/mobile-apps-live/HIGGSFIELD-STILLS.md`.
- **Higgsfield video prompts open with the screen lock** ("do not change the phone screen…"). Without it, Kling paints
  its own interface on the green.
- **The rails.** No NeroPay rate, fee or terminal price on screen. The app prices are the invented merchants' own. No
  real merchant: Sage & Co, Kestrel, Ironvale, Marigold Lane and Rosehip Nails are invented and still need a Companies
  House check before posting.
- **AI disclosure is made at upload**, not in the video (Faisal, 9 Sep 2026).
- **Every video ends on the locked outro** (`brand/sting/outro.html`, yellow; "Available on Android & iOS" over
  neropay.app for this ad). **No video ships silent** (`video/AUDIO.md`).
- **This ad's one-off exception** (Faisal, 24 Sep 2026): cinematic shallow depth of field and handheld framing are
  allowed here only.
