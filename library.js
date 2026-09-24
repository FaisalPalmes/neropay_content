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
     dropped    killed. Not a backlog item, not "later" — say who killed it and why, in `by` and
                `waiting`, so nobody rebuilds it. The build stays in the repo.

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

  /* ── Motion graphics and paid Meta: a premise problem, not a wording problem ──────────────────
     Recorded 22 Sep 2026 after the Meta session refused MG02 and archived its ad set.

     Route C (META-ADS.md §5) allows an ad to show the terminal and the EPOS software, and bars rates,
     fees, percentages, settlement, payout and credit language — and bars positioning a firm that is not
     on the FCA Register in its own right as an authority on payment regulation.

     Small Print's whole premise is "the law, the deadline and the rule an owner-operator hasn't been
     told about". The Maths's whole premise is arithmetic on a rate. **Both series are structurally
     outside Route C, and no rewrite fixes that** — rewriting a regulation explainer until it clears
     Route C leaves you without the explainer. They are organic, YouTube and website pieces, and they
     are good ones. MG02 is cleared for exactly that and approved for organic Facebook and Instagram.

     What CAN be made for paid Meta is product-led: the terminal, the free EPOS software, what NeroPOS
     does on a Tuesday lunchtime. That is a new brief, not an edit of these. Faisal parked the question
     on 22 Sep to work on the Higgsfield presenter videos instead.                                   */

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

    { id: 'AS01', series: 'App Store', title: 'App preview — iPhone, iPad, Google Play',
      version: 'v9', rendered: '2026-09-23', secs: 29.0,
      status: 'review', by: 'unrecorded — v9 made on Faisal\'s 23 Sep instruction to end it on the locked logo sting; sent for his review',
      waiting: 'Faisal watches v9: the v8 edit with the swish outro replaced by the yellow logo sting. "Flat rate" and "Amex" stay out of the pop-ups until Eray confirms them.',
      build: 'video/appstore-iphone/', drive: null, backup: false, clearedFor: null, notCleared: null,
      clearanceNote: 'A store listing asset, so the question is store review, not Route C. Three risks Faisal has been told about: Apple expects app previews to be captured app footage, and these use hand photographs and animated screens; the iPad screenshots show iPhones (guideline 2.3.3); "on your phone" assumes Tap to Pay on iPhone is live, which is unconfirmed. Play needs a 1024×500 feature graphic, which is not made.',
      note: 'The six carousel slides at the stills\' own 660 × 1434: the hero with the Visa card, the keypad and the transactions list in the yellow glass outline, the three hand photographs. Each swipe pulls the slide back into a card, slides across and pushes in, with the art trailing for depth. Each slide has its moment: the contactless signal, keys and CHARGE pressed, a tap and the dish card lifting, the NeroWeb row, the total and tooltip, the amount field. Hands and glass are baked from the stills page (stills/render.cjs layers); grounds, copy, taps and lifts are live. The Shutter intro is kept; since v9 the outro is the locked yellow logo sting (brand/sting) on the off-white ground. No voiceover, no captions. v1–v5 are in archive/. The iPad (1200×1600) and Google Play (1080×1920) cuts are made from the same composition (fit.js, render-all.sh), 23 Sep, with seven screenshots per store; each store\'s v9 is its own Higgsfield upload.',
      files: [
        { crop: '9:16 App Store iPhone', px: '886×1920', lufs: '−13.6', media: 'cfc7a40d-e640-42b4-85d3-fa0e81347a7d', md5: 'a539ae5716a855bbfbd57bc19f3f0cb9' },
        { crop: '3:4 App Store iPad', px: '1200×1600', lufs: '−13.6', media: '7430d6ed-f276-442b-b321-477ff869b3e9', md5: 'e4eff7b7f5c34c397ac32000ebaa55f7' },
        { crop: '9:16 Google Play promo', px: '1080×1920', lufs: '−13.6', media: '1c48f40e-4b1c-48e2-843e-78097c043bf5', md5: '730cd1a332d7e33646fbff4df2e3ae99' },
        { crop: 'v8 iPhone, superseded', px: '886×1920', lufs: '−13.9', media: '5fe76e7d-ae80-4b99-a508-2dd371b5335a', md5: 'd1cbf2dc473d38e04c6b6eb788a8d766' },
        { crop: 'v8 iPad and Play, superseded', px: '1200×1600, 1080×1920', lufs: '−13.9', media: '16e7bb4b-4919-4136-99c5-61608eaff051 (zip, all three stores)', md5: 'c4e1b15b3af828cb1e63b604affadfa4, c0f5fdb436cbf3c607ee5101d796d860' },
        { crop: 'v7, superseded', px: '886×1920', lufs: '−13.9', media: 'e4a8f9c0-f802-473b-878f-599af38d1060', md5: '5a044d460b3a8480024ceeb3a0ad8f46' },
        { crop: 'v6, superseded', px: '886×1920', lufs: '−13.9', media: '27c2d347-6fe8-440c-85dd-5c8607a52f7a', md5: '86c981f5b73b20cfd5bd3b32e4304877' },
        { crop: 'v5, superseded', px: '886×1920', lufs: '−13.9', media: 'cce72b47-2900-43de-8268-77beb2cdd6e0', md5: 'd8682c6cdd835e9ce7c8c739ea03e368' },
        { crop: 'v4, superseded', px: '886×1920', lufs: '−13.8', media: 'f9cc3a68-b18a-4f7d-bd73-73c1892b5567', md5: 'c636220bf84fc69db7b1411611f93c96' },
        { crop: 'v3, superseded', px: '886×1920', lufs: '−13.8', media: 'de6ff248-9d32-469a-8639-369397fcf441', md5: '1aa7e5c4fb371c2910e3f4e37f6e8bf3' },
        { crop: 'v2, superseded', px: '886×1920', lufs: '−13.8', media: '95de77ce-860a-41ec-940c-16572defa056', md5: '1c3db388fc0fc6d847861fd94af1c38c' },
        { crop: 'v1, superseded', px: '886×1920', lufs: '−13.5', media: 'ffdeb658-553c-4f1a-a74b-03f6cfa97219', md5: '41a8563735273d3d008210bcc2082674' }
      ] },

    { id: 'AM01', series: 'App motion', title: 'App motion test — phone on black, cut to the beat',
      version: 'v1', rendered: '2026-09-23', secs: 8.6,
      status: 'review', by: 'unrecorded — a test Faisal asked for on 23 Sep, to see how close we get to an Incard story ad without screen recordings',
      waiting: 'Faisal decides whether the look is worth a full 15–20 s piece; for that he would send screen recordings from the demo account, choose dark or the carousel\'s light ground, and a harder music track.',
      build: 'video/app-motion-test/', drive: null, backup: false, clearedFor: null, notCleared: null,
      clearanceNote: 'A test, not cleared anywhere. The screens show demo figures only; no rate, no price, no coins or money counters (earnings register); the phone back is plain so the terminal stays the only branded object.',
      note: 'Four moves on the partner-upbeat-118 bed, each cut on a bar: the phone swings in with the keypad filling live, spins round to the tap screen and a notification, is thrown off into a close-up of its corner over the scrolling transactions list, and pulls away to the end card. Rendered at 120 fps and blended to 30 for motion blur.',
      files: [
        { crop: '9:16', px: '1080×1920', lufs: '−13.7', media: '8c0ea0f3-6efb-41b9-bf85-a64c4f898296', md5: '682343ce495912a513292241349e1117' }
      ] },

    { id: 'AM02', series: 'App motion', title: 'App motion — light, six screens, clear glass with the mark behind, ends on the locked outro',
      version: 'v5', rendered: '2026-09-24', secs: 31.5,
      status: 'approved', by: 'Faisal, in chat, 24 Sep 2026: "yes happy with it. for now. if we need to update later we can as we develop our brand and look and features". Approves v5 (all three store cuts); expect later versions as the brand, look and app features move',
      waiting: 'Nothing on the edit. Two open items: Faisal to drop the three MP4s into the store folders on Drive (notes with the links are there), then backup can be set true; and where it may go is not yet ruled (see clearanceNote: App Store review risk, Play takes a YouTube link, paid Meta would need a Route C check).',
      build: 'video/app-motion/', drive: null, backup: false, clearedFor: null, notCleared: null,
      clearanceNote: 'Not assessed for social. As a store asset: Apple asks for app previews captured from the app, and this is a motion graphic built from the screenshots, so App Store review may refuse it; the iPad cut also shows phones; "on your phone" assumes Tap to Pay on iPhone is live, which is unconfirmed. Google Play takes it as a YouTube link. Demo figures only; no rate, no price, no coins or money counters; nothing lifted out of a screen is a total; the phone back is plain. For paid Meta, Route C would need checking: the reports screen shows channel figures and the headlines include "Get paid."',
      note: 'v2 on Faisal\'s notes (too fast; screens cut off at the bottom; hold the tap screen with a subtle contactless animation; pull out from the transactions close-up to the whole screen; slower payment link and finale; new end card). 31.2s, 62 beats of partner-upbeat-118. Every export is finished in code where it was cut (the CHARGE and TAP buttons, the snapshot card, the sheet edge) with a home indicator on every screen. Moves between screens are the app\'s own where they can be: CHARGE slides the tap screen in, one spin to the menu, transactions slides in and the camera pushes into its corner then pulls back to the whole list, reports swipes in, the payment link rises as a sheet, the phone steps back as two more slide in beside it. The tap screen holds for eight beats with the signal breathing out every other beat. Since v3 it ends on the locked yellow outro (brand/sting/outro.html, rendered by make-assets.sh with the subtext neropay.app), its hit on beat 54; the off-white wash stays up under it and the phone clips end before it starts. 120 fps blended to 30 for motion blur.',
      files: [
        { crop: '9:16 master, Google Play promo', px: '1080×1920', lufs: '−14.2', media: '4fbbc3b2-71d0-4c05-84af-109b4e030cd6', md5: '734d97a64b8690a3e62a12108a40374a' },
        { crop: 'App Store iPhone, 30.00s', px: '886×1920', lufs: '−14.6', media: '95af0520-49f6-4baa-9201-caafd49c46d6', md5: '655d49b27550313078b864af49e016ed' },
        { crop: 'App Store iPad, 30.00s', px: '1200×1600', lufs: '−14.6', media: '605d2b80-d773-4dd3-8400-9d975fb9f8cb', md5: '44ba7983086a257f1c8f26ded757856f' },
        { crop: 'v4 textured glass, superseded', px: '1080×1920', lufs: '−14.1', media: '08b9c58d-b8ea-4cec-9733-a892d5b81c3c', md5: '50a07c96539bf78034dad9c6fb4e4b40' },
        { crop: 'v4 clear glass, superseded', px: '1080×1920', lufs: '−14.1', media: '2868ba15-113f-4ad3-b826-32e3c88e3da8', md5: 'fc785dff4faeda9f630ada52f880761f' },
        { crop: 'v3, superseded', px: '1080×1920', lufs: '−14.1', media: '053b90da-2ccf-4ce5-bda2-c060a1fe088e', md5: 'cb92b5055b2006622dd16168c2d313da' },
        { crop: 'v2, superseded', px: '1080×1920', lufs: '−14.1', media: '63ad00fc-7e12-4f44-a613-c6de7fe6ff00', md5: '3264ed7d13fd597f2c8a07882c0e763f' },
        { crop: 'v1, superseded', px: '1080×1920', lufs: '−13.9', media: '08ccf8f2-090c-435e-a01a-c0e4ab8a05ab', md5: '1855e2b633b3667a2966989c474c03f4' }
      ] },

    { id: 'MA01', series: 'Mobile Apps', title: 'Mobile Apps — "Order. Book. Join. Pay." (four merchants, their own app)',
      version: 'v1', rendered: '2026-09-24', secs: 29.9,
      status: 'review', by: 'unrecorded — Faisal asked for the full edit on 24 Sep ("go ahead and actually run me a full final edit"), sent for his review',
      waiting: 'Faisal watches v1. Before posting: a Companies House check on Sage & Co, Kestrel Barbers, Ironvale Studio and Marigold Lane (a web search found no exact UK match; it is US-based and not exhaustive).',
      build: 'video/mobile-apps/', drive: null, backup: false, clearedFor: null, notCleared: null,
      clearanceNote: 'Not assessed. Organic is the intended use (Reels, TikTok, Stories); the handover holds paid Meta until Faisal says otherwise, and Route C would need a look at "Pay £28.00". Claims are the four Faisal confirmed on 24 Sep: Android and iOS, the merchant\'s own brand, their existing booking, ordering and checkout, set up in the NeroPay dashboard. No NeroPay price, rate or fee; the prices in the apps are the invented merchants\' own. No real merchant, person or data; nothing AI-generated.',
      note: 'Cowork\'s /brag-slim storyboard (handover of 24 Sep) rebuilt on the AM02 light look: warm off-white, yellow light moving behind the glass mark, the 64px-deep 3D phone on one continuous curve, headlines in Poppins in the house style. A home screen with four merchant icons popping in, a tap opens Sage & Co, then Order (café), Book (barber), Join (gym studio), Pay (florist), each app sliding in as on a phone with a visible touch; the phone steps back into a row of four with "Available on Android & iOS" as the highlight and "Create yours in the NeroPay dashboard"; ends on the locked yellow outro with Available on Android & iOS over neropay.app. The merchant screens keep their own fonts and colours. 120 fps blended to 30 for motion blur. Share copy is Cowork\'s share-copy.txt.',
      files: [
        { crop: '9:16', px: '1080×1920', lufs: '−14.2', media: 'eef1ff75-3790-4552-af47-94ec8d09c53a', md5: '44a17c96f671e298e8e52fa5c315f0c4' }
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
      version: 'v3.6', rendered: '2026-09-24', secs: 145,
      status: 'approved', by: 'Faisal, 24 Sep 2026, in chat with the content video session — "approve for now" (v3.6; he may still add real dashboard screenshots)',
      waiting: 'Approved for now (v3.6). Before it goes out: the master into Drive (backup false), and clearedFor is unassessed. What v3.6 is: opening A ("Look at the card machine on any shop counter. There\'s a name on it … it can be yours") on his NeroPay terminal photo, the bezel swapping to YOUR LOGO; the brand scene full screen, the same terminal swapping to Keelstone Pay on "logo" then pulling back beside the login card; "no payment is ever priced at a loss" in the voice; the whole script re-voiced as take 4; the music steady and quieter; the stutter after "Your logo" fixed (motion/tighten.mjs now cuts only true silence). Open: real dashboard screenshots, if he sends them (previews first, then a re-render and a fresh approval).',
      build: 'motion/neroconnect/explainer-v3/ (v2 kept at explainer/)', drive: 'https://drive.google.com/drive/folders/1hVAZJFL5uLPqC4ATJzpoO9QkvvM9dpaP',
      backup: false, clearedFor: null, notCleared: null,
      note: 'Figures on screen are the seven approved in the overlay kit; the platform is the invented Keelstone Pay (Harbourline until v3.3) and the merchants the invented set. Placeholder brand throughout.',
      files: [
      { crop: '16:9 master', px: '1920×1080', mb: 28.7, md5: 'bf73b41e4f93c88133b2e92f10121e7a', lufs: '−14.07', where: 'v3.6 sent in chat 24 Sep 2026; not yet in Drive' },
      { crop: 'v3.5 16:9 (superseded)', px: '1920×1080', mb: 26.8, md5: '67621e18daca246fe25ade6f28f657b1' },
      { crop: 'v3.4 16:9 (superseded)', px: '1920×1080', mb: 28.4, md5: '64ecf30908b128377de905d13ca18bdc' },
      { crop: 'v2 16:9 master (superseded)', px: '1920×1080', mb: 62.5, media: '243e9316-3761-4f7e-8883-799780616ac2', md5: 'f56bea4a7f82761407b4e344283480ca' }] },

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
      status: 'dropped', by: 'Faisal, 22 Sep 2026 — "let\'s skip that for now, i dont like that"',
      waiting: 'DROPPED. Do not rebuild it without Faisal saying so. Three things were wrong with it at once and any one would have held it: he does not like it; the files were rendered on 15 Sep and then lost (out/final/ is gitignored and no delivery link was ever written, so only the md5s in script.md survive); and publish was blocked anyway on the workhorse rate — the internal standard says 1.30% + 15p, not + 8p, and "no contract" collides with the unanswered 18-month-agreement question. The build stays in motion/maths/ep01/ if the argument is ever worth reviving.',
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
      waiting: 'DO NOT GENERATE AS WRITTEN. The A-series was scripted on 18 Aug 2026 in generation-pack.md v6 and describes a SUPERSEDED partner model — account credit against the partner\'s own trading account, not the confirmed \u00a3100/\u00a3200/\u00a3300 bonus plus 20\u201340% revenue share. A2-06 still reads \"we put [PLACEHOLDER] of credit on their account with you\" \u2014 the figure was never set, which is why this never got made on 14 Sep and why L4 was blocked. The fix is a rewrite against motion/partner/BRIEF.md v4 (final, 17 Sep), not a generation run: chapters 0–2 of the Brief B script (what NeroPay does · who partners are). The presenter format and the shot rhythm are still good and worth keeping. A REWRITE EXISTS: PARTNER-SCRIPTS.md P1 (22 Sep, recovered from chat 24 Sep). It waits on Faisal\'s edits and the new presenter he is making.'},

    { id: 'A2', series: 'Explained by NeroPay — partners', title: 'What a partner actually has to do',
      version: null, rendered: null, secs: null,
      status: 'brief', by: 'content session', build: 'generation-pack.md · videos.js (13 shots)',
      drive: null, backup: false, clearedFor: null, notCleared: null, files: [],
      waiting: 'DO NOT GENERATE AS WRITTEN. The A-series was scripted on 18 Aug 2026 in generation-pack.md v6 and describes a SUPERSEDED partner model — account credit against the partner\'s own trading account, not the confirmed \u00a3100/\u00a3200/\u00a3300 bonus plus 20\u201340% revenue share. A2-06 still reads \"we put [PLACEHOLDER] of credit on their account with you\" \u2014 the figure was never set, which is why this never got made on 14 Sep and why L4 was blocked. The fix is a rewrite against motion/partner/BRIEF.md v4 (final, 17 Sep), not a generation run: chapters 3–4 (the Bonus Dial and the Rate Climb). The presenter format and the shot rhythm are still good and worth keeping. A REWRITE EXISTS: PARTNER-SCRIPTS.md P2 (22 Sep, recovered from chat 24 Sep). It waits on Faisal\'s edits and the new presenter he is making.'},

    { id: 'A3', series: 'Explained by NeroPay — partners', title: 'What happens to your customer after you introduce them',
      version: null, rendered: null, secs: null,
      status: 'brief', by: 'content session', build: 'generation-pack.md · videos.js (14 shots)',
      drive: null, backup: false, clearedFor: null, notCleared: null, files: [],
      waiting: 'DO NOT GENERATE AS WRITTEN. The A-series was scripted on 18 Aug 2026 in generation-pack.md v6 and describes a SUPERSEDED partner model — account credit against the partner\'s own trading account, not the confirmed \u00a3100/\u00a3200/\u00a3300 bonus plus 20\u201340% revenue share. A2-06 still reads \"we put [PLACEHOLDER] of credit on their account with you\" \u2014 the figure was never set, which is why this never got made on 14 Sep and why L4 was blocked. The fix is a rewrite against motion/partner/BRIEF.md v4 (final, 17 Sep), not a generation run: chapters 5–7 (what a month looks like · dashboard · join). The presenter format and the shot rhythm are still good and worth keeping. A REWRITE EXISTS: PARTNER-SCRIPTS.md P3 (22 Sep, recovered from chat 24 Sep). It waits on Faisal\'s edits and the new presenter he is making.'},

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
