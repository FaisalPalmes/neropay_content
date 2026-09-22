/* published.js — the publish log. What has actually gone out, where, and when.

   ── The split, and why there are two files ─────────────────────────────────────────────────────
   Two Claude sessions work in this repo and they must never edit the same file, or they spend their
   time resolving merge conflicts instead of working.

     library.js    WHAT WE MADE.   Owned by the content and motion sessions.
                   Every video, its state, and a link to each rendered master.
     published.js  WHAT WENT OUT.  Owned by the nPanda Meta session — the one that runs the ad
                   account and posts to Facebook, Instagram, TikTok, LinkedIn and YouTube.

   The content session never writes this file. The Meta session never writes `library.js`, `posts.js`,
   `calls.js`, `motion.js` or anything under `motion/` or `video/`. `library.html` joins the two by
   `ref` and shows one picture. `PUBLISH-HANDOVER.md` is the full contract.

   ── A record ───────────────────────────────────────────────────────────────────────────────────
     ref       the id it refers to: a video in library.js (B1, MG02, PP02, NC01, NCEX, PP01, C1…)
               or a post in posts.js (L1…L12, M1…M14). It must resolve — `node check-register.mjs`
               fails the build if it does not, because a typo here silently vanishes from the page.
     crop      which file went out ('9:16', '4:5', '16:9', '1:1'), or null for a post
     platform  youtube · instagram · facebook · tiktok · linkedin · website · paid-meta
     kind      'organic' or 'paid'
     on        ISO date it went live
     url       the live post, where there is one. A paid ad carries its ad id instead.
     by        who recorded it and when. Same rule as library.js: an entry nobody can attribute is
               how the tracking got lost in the first place.
     note      anything the next person needs — a boost, a takedown, a repost, a rejection.

   ── The rails still apply at the point of publishing ───────────────────────────────────────────
   Rail 4 is PER UPLOAD and does not carry over between platforms or languages: every video with a
   synthetic presenter or a synthetic voice needs the altered-or-synthetic setting ticked and the
   disclosure line in that platform's description. Rail 3: everything posts as NeroPay, never from a
   personal profile. Publishing to paid Meta is a separate decision from publishing organically —
   `clearedFor` on the library.js record says where a video may go, and `notCleared` says where it
   may not and why. MG02 is the live example: fine for YouTube, organic and the website, refused for
   paid Meta on Route C.                                                                            */

window.PUBLISHED = {

  updated: '22 September 2026',
  owner: 'the nPanda Meta session',

  records: [

    { ref: 'MG02', crop: null, platform: 'facebook', kind: 'organic', on: '2026-09-22',
      url: null,
      by: 'the nPanda Meta session, 22 Sep 2026 — Faisal confirmed in chat that it went out on both platforms.',
      note: 'First record in this file. URL OUTSTANDING — Faisal to send the permalink. Crop not recorded: MG02 has both a 1:1 feed and a 4:5 cut and it is not known which was uploaded. Organic only; paid Meta stays refused under Route C (library.js notCleared). Rail 4 does not bite — no AI presenter — but the voice is synthetic and is declared in the description.' },

    { ref: 'MG02', crop: null, platform: 'instagram', kind: 'organic', on: '2026-09-22',
      url: null,
      by: 'the nPanda Meta session, 22 Sep 2026 — Faisal confirmed in chat that it went out on both platforms.',
      note: 'URL OUTSTANDING — Faisal to send the permalink. Same crop question as the Facebook record. Posted as NeroPay (@neropayapp), never a personal profile — rail 3.' }
  ]
};
