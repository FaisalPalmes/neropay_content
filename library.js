/* library.js — the delivery register. Every video NeroPay has, what state it is in, and where the file is.
   Renders on library.html beside the social posts, so one page answers: what is out, what is waiting on
   Faisal, and what has not been made.

   Why this file exists. Until 22 Sep 2026 the repo recorded what was BUILT, Drive recorded what was
   RENDERED, and nothing anywhere recorded what Faisal APPROVED or what actually got POSTED. Version state
   lived in Google Doc titles ("superseded by v7"), readable only by opening six documents. This is the one
   place that carries a decision.

   ── The states, in order ───────────────────────────────────────────────────────────────────────
     brief      written, not built
     building   a build exists in the repo, never rendered
     review     rendered, and something is outstanding — see `waiting`
     ready      rendered, no known faults, nothing outstanding; waiting only on Faisal's go
     approved   Faisal has said yes
     published  out, with where and when in `published`

   ── Who may set what ───────────────────────────────────────────────────────────────────────────
   Faisal's ruling, 22 Sep 2026: a session may set any state, including `approved`, when Faisal says so
   in chat. In exchange every state carries `by` — who set it and when — so an approval is always
   attributable. `by: 'unrecorded'` means nobody wrote the decision down; it is not the same as no.
   Never infer `approved` from a render, a delivery or a README that calls itself final.

   ── This file is half of a pair ────────────────────────────────────────────────────────────────
   `library.js` is WHAT WE MADE and is owned by the content and motion sessions. `published.js` is
   WHAT WENT OUT and is owned by the nPanda Meta session. Neither session writes the other's file —
   that is what keeps two sessions out of each other's merge conflicts. `library.html` joins them by
   id. `PUBLISH-HANDOVER.md` is the contract. Do not record a publish here; it goes in published.js.

   ── clearedFor / notCleared ────────────────────────────────────────────────────────────────────
   Where a video may go, so the Meta session can pick something up without having to re-litigate it.
   `clearedFor: null` means nobody has assessed it — not that it is cleared. `notCleared` names the
   platform and the reason. A clearance is a decision like any other: it needs a date and a source.

   ── The backup field, and why it matters ───────────────────────────────────────────────────────
   `backup: false` means the MP4 exists ONLY as a Higgsfield CDN link. Those links are valid while the
   account holds them — the NC README says so in as many words. Drive has the folder and a note saying
   "download this and drop the file here", and that has never once been done. A session cannot do it: the
   Drive connector will not carry a file that size. Until Faisal downloads them, nothing here is safe.  */

window.LIBRARY = {

  updated: '22 September 2026',

  /* The Higgsfield media store. Every `url` below is this plus the media id. */
  cdn: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/',

  videos: [

    { id: 'B1', series: 'Explained by NeroPay', title: 'The rate you were quoted',
      version: 'v8.4', rendered: '2026-09-12', secs: null,
      status: 'ready', by: 'unrecorded — rendered and handed over, approval never written down',
      build: 'video/b1-v8/', drive: 'https://drive.google.com/drive/folders/1vnCpZjv2-tST91e8Bprz8hHHgLGY8mp-',
      backup: false, clearedFor: null, notCleared: null,
      clearanceNote: 'Not assessed. The script states 0.50% quoted and 0.70% illustrative and turns on a rate comparison, which is the exact shape META-ADS.md §10 refused for MG02 on paid Meta. Someone has to rule on it before this goes near an ad.',
      note: 'Ends on the old typeset NeroPay. lockup. Whether it is reissued against the new kit is BRAND.md §6.3, still open. Rail 4: nothing in the video says the presenter is AI — tick YouTube\'s altered-or-synthetic setting at upload and keep the line in the description. The 0.70% in the script is illustrative, not a NeroPay rate.',
      files: [
        { crop: '16:9 YouTube master', px: '1920×1080', lufs: '−15', media: '9a37d1ec-9f9c-4b30-8a50-41b9f93acd81', md5: 'c6ad7ec58121fd70059211fd831aae32', commit: 'ed6a9bd' },
        { crop: '4:5 feed', px: '1080×1350', lufs: '−15', media: 'e03316a0-948d-487a-beab-f923a11ecbcf', md5: '33d04105496b52cf943483d8f068c728', commit: 'f6bf682' },
        { crop: '4:5 Meta ad, 59s', px: '1080×1350', lufs: '−15', media: '3aafdeda-88f7-472b-9ae0-3fdd2a3c00b0', md5: '61bfc30a944a385e8173a91cb328f09d', commit: '2fc4a17' }
      ] },

    { id: 'MG02', series: 'Small Print', title: 'The 18-month rule',
      version: 'v6', rendered: '2026-09-16', secs: 55.9,
      status: 'approved', by: 'Faisal, in chat, 22 Sep 2026 — "can we post 1 of them now". Organic Facebook and Instagram only; paid Meta still refused.',
      build: 'motion/print/mg02/', drive: 'https://drive.google.com/drive/folders/1oeHnyT75J2cmSRM_lDyj6bfULDnkAuuC',
      backup: false,
      clearedFor: ['youtube', 'instagram', 'facebook', 'tiktok', 'website'],
      notCleared: { 'paid-meta': 'Route C. Rate-comparison language, a savings claim, a switching premise, and it positions a firm that is not on the FCA Register in its own right as an authority on payment regulation. Judged 22 Sep 2026 — META-ADS.md §10.' },
      note: 'Faceless motion graphics, Verity. No AI presenter, so rail 4 does not bite; the voice is synthetic and is declared in the description. Figures all confirmed in figures.json: 18 months, 14 largest providers, one month\'s notice. v5 and v4.1 were review cuts and are not to be published.',
      files: [
        { crop: '9:16 Reels / TikTok / Shorts', px: '1080×1920', lufs: '−14.4', media: '70e428ae-9cfd-4f09-b5d6-d40a2c4c0e8d', md5: '5a9e879fa12b978b800fb325a4f33d09', mb: 10.5 },
        { crop: '16:9 YouTube master', px: '1920×1080', lufs: '−14.4', media: '7b369ba0-e218-4df3-8190-e9665653caed', md5: '790ffdb2f48ad71e57be335505780192', mb: 10.2 },
        { crop: '4:5 Meta ads', px: '1080×1350', lufs: '−14.4', media: '1e086b32-af8b-462d-8829-8bd76217be98', md5: '5e5b8da6b0d207c7ec49f2c5ee409797', mb: 8.4 },
        { crop: '1:1 feed', px: '1080×1080', lufs: '−14.4', media: '3ab995c2-468e-4cc4-9897-9431ba0c53f6', md5: '6f4adf36ca6f7512650142773f8870df', mb: 7.6 }
      ] },

    { id: 'PP02', series: 'Partner Programme', title: 'Your road',
      version: 'v7', rendered: '2026-09-18', secs: 52.0,
      status: 'ready', by: 'unrecorded — its own README calls it final and publishable, but Faisal never confirmed',
      build: 'motion/partner/pp02/', drive: 'https://drive.google.com/drive/folders/1wyUXzCzfII9BXtTcVngt-SIxDJ8EGd3z',
      backup: false, clearedFor: null, notCleared: null,
      clearanceNote: 'Not assessed, and there is a tension to settle before it is. The Meta session built a PAUSED ThruPlay ad set for this on 22 Sep, but the video carries £100/£200/£300 per merchant and a 20–40% revenue share. META-ADS.md Route C bars rate, fee, percentage, settlement and payout language from an ad, and rail 2 bars earnings claims. Every figure travels with its condition, which is why it passes organically. Paid is a different call and nobody has made it.',
      note: 'Only the 4:5 is rendered; other crops on request. Figures are the confirmed partner_bonus_tiers, partner_revenue_share_tiers and partner_active_gate records, each with its condition on the same frame, per merchant, never a total.',
      files: [
        { crop: '4:5 Meta', px: '1080×1350', lufs: '−14.16', media: '62228ccf-ea52-4f90-b7d2-974aee17017b', md5: 'a126ac3a015e9c5bbf6d2fae11d55969' }
      ] },

    { id: 'NC01', series: 'NeroConnect', title: 'NeroConnect — the intro video',
      version: 'v2', rendered: '2026-09-17', secs: null,
      status: 'review', by: 'unrecorded',
      waiting: 'Faisal reviews the 16:9 render and approves it for posting. This is the only thing blocking post L12.',
      build: 'motion/neroconnect/nc01/', drive: null, backup: false, clearedFor: null, notCleared: null,
      posts: ['L12'],
      files: [
        { crop: '16:9', px: '1920×1080', media: 'd7d50f7c-9fcb-4930-9a70-a297ba1a1d2f' }
      ] },

    { id: 'NCEX', series: 'NeroConnect', title: 'NeroConnect explainer',
      version: 'v2', rendered: '2026-09-18', secs: 131,
      status: 'review', by: 'unrecorded',
      waiting: 'Four things: the terminal photos promised on 18 Sep never arrived, so the close uses our own 3D model; the 17 Sep series note bars margin figures, reports and support tiers on screen while the 18 Sep brief approves them, and the later brief was followed — Faisal confirms which stands; no cut-downs rendered; no music bed.',
      build: 'motion/neroconnect/explainer/', drive: 'https://drive.google.com/drive/folders/1hVAZJFL5uLPqC4ATJzpoO9QkvvM9dpaP',
      backup: false, clearedFor: null, notCleared: null,
      note: 'Figures on screen are the seven approved in the overlay kit and the invented Harbourline names. Placeholder brand throughout.',
      files: [
        { crop: '16:9 master', px: '1920×1080', mb: 62.5, media: '243e9316-3761-4f7e-8883-799780616ac2', md5: 'f56bea4a7f82761407b4e344283480ca' },
        { crop: '720p preview', px: '1280×720', media: '1ebf986e-4fc0-48f0-913a-afbb1bc7d024' }
      ] },

    { id: 'PP01', series: 'Partner Programme', title: 'The Partner Programme',
      version: 'v4', rendered: '2026-09-17', secs: 68,
      status: 'review', by: 'unrecorded',
      waiting: 'Faisal\'s review. The generated plates (motion/partner/pp01/AI-PLATES.md) are not in this cut — they could not be produced on the day. When they arrive they slot under certain beats and it re-renders.',
      build: 'motion/partner/pp01/', drive: 'https://drive.google.com/drive/folders/11gSOA2be260FQlJcRUN2ZxPvMwn4AtUU',
      backup: false, clearedFor: null, notCleared: null,
      note: '68s against the brief\'s 22–28s social module; the short modules can be cut from this script. Other crops render on request, about 35 minutes each.',
      files: [
        { crop: '4:5 Meta', px: '1080×1350', lufs: '−14.12', media: '4a729d5b-051f-49ab-b2ba-0a9480f161e6', md5: '2b747a617cd8f815f38f42692d458c3a' }
      ] },

    { id: 'MG01', series: 'The Maths', title: 'Don\'t switch to us',
      version: 'draft', rendered: '2026-09-15', secs: 46.4,
      status: 'review', by: 'unrecorded',
      waiting: 'Two things, and they are different in kind. (1) PUBLISH IS BLOCKED on the workhorse rate: the internal standard says 1.30% + 15p, not + 8p, and "no contract" collides with the unanswered 18-month-agreement question — both written into the figures.json record. (2) THE FILES ARE GONE: four crops were rendered on 15 Sep with their md5s recorded in script.md, but out/final/ is gitignored and no delivery link was ever written anywhere. Unless Faisal has them, this needs re-rendering from the build before it can be reviewed at all.',
      build: 'motion/maths/ep01/', drive: null, backup: false, clearedFor: null, notCleared: null,
      note: 'Rendered 9:16, 4:5, 1:1 and 16:9 at 46.4s against a 38s target — the take runs long. Voice Verity, one generation, −16.27 LUFS. The concession is the format: under about twenty pounds a sale, stay put. This is the only video where NeroPay argues against itself, which is why it is worth finishing.',
      files: [] },

    { id: 'MG05', series: 'Small Print', title: 'That sign',
      version: null, rendered: null, secs: 28,
      status: 'brief', by: 'motion session', build: null, drive: null, backup: false,
      clearedFor: null, notCleared: null, files: [],
      waiting: 'Briefed in motion.js with the full beat list. Not built. "Fifty pee for cards" has been illegal since 13 Jan 2018 — Consumer Rights (Payment Surcharges) Regulations 2012 as amended. A minimum spend is still lawful, which is the concession.' },

    { id: 'MG06', series: 'The Maths', title: 'Nine days',
      version: null, rendered: null, secs: 34,
      status: 'brief', by: 'motion session', build: null, drive: null, backup: false,
      clearedFor: null, notCleared: null, files: [],
      waiting: 'Briefed and flagged. The 9–18 day response window and the £15–35 fee are industry ranges, not regulation. Before it is built, either state our own dispute window and fee, or put "check your provider" on screen.' },

    { id: 'MG07', series: 'The Maths', title: 'Six a day',
      version: null, rendered: null, secs: 36,
      status: 'brief', by: 'motion session', build: null, drive: null, backup: false,
      clearedFor: null, notCleared: null, files: [],
      waiting: 'Briefed in motion.js. Not built. Six hospitality closures a day in 2026 (UKHospitality) and the three April 2026 bills. Every figure is already in CLAUDE.md and sourced.' },

    { id: 'MG08', series: 'Small Print', title: 'The £100 tap',
      version: null, rendered: null, secs: 26,
      status: 'brief', by: 'motion session', build: null, drive: null, backup: false,
      clearedFor: null, notCleared: null, files: [],
      waiting: 'Briefed in motion.js. Not built. The FCA stopped setting a single contactless cap on 19 Mar 2026; most banks kept £100; phone wallets never had one.' },

    { id: 'MG03', series: 'Small Print', title: 'The tip isn\'t yours',
      version: null, rendered: null, secs: 30,
      status: 'brief', by: 'motion session', build: null, drive: null, backup: false,
      clearedFor: null, notCleared: null, files: [],
      waiting: 'Briefed in motion.js with the full beat list. Not built.' },

    { id: 'MG04', series: 'Small Print', title: 'Four times a year',
      version: null, rendered: null, secs: 34,
      status: 'brief', by: 'motion session', build: null, drive: null, backup: false,
      clearedFor: null, notCleared: null, files: [],
      waiting: 'Briefed in motion.js. Not built.' },

    { id: 'B2', series: 'Explained by NeroPay', title: 'Why the same two quotes suit two businesses completely differently',
      version: null, rendered: null, secs: 151,
      status: 'brief', by: 'content session', build: 'generation-pack.md · videos.js (17 shots)',
      drive: null, backup: false, clearedFor: null, notCleared: null, files: [],
      waiting: 'Scripted shot by shot with its overlays, and scheduled for THIS WEEK on calendar.html (w/c 21 Sep, "B2 — pricing shapes"). Nothing has been generated. It is the next thing the plan expects.' },

    { id: 'B3', series: 'Explained by NeroPay', title: 'Contracts, minimum terms and exit fees: four questions before you sign',
      version: null, rendered: null, secs: 165,
      status: 'brief', by: 'content session', build: 'generation-pack.md · videos.js (18 shots)',
      drive: null, backup: false, clearedFor: null, notCleared: null, files: [],
      waiting: 'Scripted. Scheduled w/c 5 Oct. Overlaps MG02 on the 18-month rule — worth deciding whether both are needed before it is made.' },

    { id: 'A1', series: 'Explained by NeroPay — partners', title: 'What the partner programme is, and who it\'s for',
      version: null, rendered: null, secs: null,
      status: 'brief', by: 'content session', build: 'generation-pack.md · videos.js (11 shots)',
      drive: null, backup: false, clearedFor: null, notCleared: null, files: [],
      waiting: 'Scripted, and was scheduled for w/c 14 Sep — it did not happen. Open question: PP01 and PP02 now tell the partner story as faceless motion graphics, so A1 may be superseded rather than late. Faisal decides whether the presenter partner series still exists.' },

    { id: 'A2', series: 'Explained by NeroPay — partners', title: 'What a partner actually has to do',
      version: null, rendered: null, secs: null,
      status: 'brief', by: 'content session', build: 'generation-pack.md · videos.js (13 shots)',
      drive: null, backup: false, clearedFor: null, notCleared: null, files: [],
      waiting: 'Scripted. Scheduled w/c 28 Sep — next week. Same open question as A1.' },

    { id: 'A3', series: 'Explained by NeroPay — partners', title: 'What happens to your customer after you introduce them',
      version: null, rendered: null, secs: null,
      status: 'brief', by: 'content session', build: 'generation-pack.md · videos.js (14 shots)',
      drive: null, backup: false, clearedFor: null, notCleared: null, files: [],
      waiting: 'Scripted. Scheduled w/c 12 Oct. Same open question as A1.' },

    { id: 'C1', series: 'Behind the Counter', title: 'What did your last statement actually say?',
      version: null, rendered: null, secs: null,
      status: 'brief', by: 'unrecorded', build: 'calls.js', drive: null, backup: false, clearedFor: null, notCleared: null, files: [],
      waiting: 'Scripted in calls.js. Was due Thursday 17 Sep on the calendar and was not made. The Drive folder for the series is empty.' },

    { id: 'C2', series: 'Behind the Counter', title: 'Friday night, and the card machine\'s down',
      version: null, rendered: null, secs: null,
      status: 'brief', by: 'unrecorded', build: 'calls.js', drive: null, backup: false, clearedFor: null, notCleared: null, files: [],
      waiting: 'Scripted. Due Thursday 1 Oct.' },

    { id: 'C3', series: 'Behind the Counter', title: 'The six weeks before Christmas',
      version: null, rendered: null, secs: null,
      status: 'brief', by: 'unrecorded', build: 'calls.js', drive: null, backup: false, clearedFor: null, notCleared: null, files: [],
      waiting: 'Scripted. Due Thursday 15 Oct.' },

    { id: 'C4', series: 'Behind the Counter', title: 'How many screens are you running?',
      version: null, rendered: null, secs: null,
      status: 'brief', by: 'unrecorded', build: 'calls.js', drive: null, backup: false, clearedFor: null, notCleared: null, files: [], waiting: 'Scripted, unscheduled.' },

    { id: 'C5', series: 'Behind the Counter', title: 'Who gets paid before you do?',
      version: null, rendered: null, secs: null,
      status: 'brief', by: 'unrecorded', build: 'calls.js', drive: null, backup: false, clearedFor: null, notCleared: null, files: [], waiting: 'Scripted, unscheduled.' },

    { id: 'C6', series: 'Behind the Counter', title: 'What did you actually sign?',
      version: null, rendered: null, secs: null,
      status: 'brief', by: 'unrecorded', build: 'calls.js', drive: null, backup: false, clearedFor: null, notCleared: null, files: [], waiting: 'Scripted, unscheduled.' }

  ],

  /* The Drive tree, so a session does not have to walk it again. Everything lives under
     📁 NeroPay Ads › 05 - Video Edits (YouTube). */
  drive: {
    root: 'https://drive.google.com/drive/folders/1aDWq69Z_IjuJ9wGWvJGMCyWBEUm2ZiZB',
    partner: 'https://drive.google.com/drive/folders/1jbynGFcHYI9hyU0VVy6Sxp6XTNXRbNec',
    merchant: 'https://drive.google.com/drive/folders/1dpJoqrcc0zN_QgFbY7KbzB87-qIU97P5',
    note: 'Each series folder has 01 Script & voice · 02 Test cut · 03 Finished · 04 Exports. The exports folders currently hold READMEs pointing at CDN links, and no MP4s.'
  }
};
