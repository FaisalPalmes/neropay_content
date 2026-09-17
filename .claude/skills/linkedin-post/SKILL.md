---
name: linkedin-post
description: "Write or audit a NeroPay LinkedIn post. Use for any LinkedIn copy — a partner post, a Statement write-up, a NeroConnect post — before it goes into posts.js. Distilled on 17 Sep 2026 from two MIT-licensed skills (sergebulaev/linkedin-skills, marian-kamenistak/linkedin-post-writing-skill) and re-cut to NeroPay's rails and voice, which always win where they disagree."
---

# LinkedIn post — NeroPay cut

LinkedIn is NeroPay's partner channel: wholesalers, EPOS installers, accountants, software platforms,
trade bodies. Not merchants. Every post is the company speaking as "we". `CLAUDE.md` and `rails.html`
outrank anything below; `SOCIAL-BRIEF.md` §5 says what ships with the post.

## What the two source skills got right, kept

**Hooks (2026 feed behaviour).**
- Never open with a question. A question in line one costs reach; the question goes at the close, where it helps.
- Open with a number or a flat statement. "98 food businesses in 800 metres of Wilmslow Road. We counted." is the model.
- The first 210 characters are the post — everything before "…see more" has to work on its own.
- No "Here's what / how", no "Stop X, start Y", no "It's not X, it's Y", no "The result?" / "Plot twist:" bridges.
- No announced candour ("let me be honest", "the honest bit"). State the uncomfortable fact flat, with a date if it has one.

**Body.**
- 900–1,300 characters by default; longer is fine when the content earns it (1,000+ characters and 20+ sentences
  still lift reach). LinkedIn's hard limit is 3,000.
- One or two sentences per paragraph, blank lines between. One contrast and one rule-of-three per post at most.
- Density, not blacklist: one marker word in a paragraph is English; three is a signature. Markers to count —
  leverage, robust, seamless, streamline, empower, landscape, ecosystem, fundamentally, ultimately, crucially,
  notably, delve, journey, "quietly", "X matters.", "the work", "let that sink in".
- Em dashes: about one per hundred words at most. NeroPay copy uses full stops and commas instead; a split dash
  must not become two fragments.
- At most two standalone fragments in a post. No staccato stacks ("Simple. Effective. Done.").
- Something real in every post: a named place, a dated figure, a thing we saw. Not adjectives.

**Close.**
- A specific question or a clean landing. Never "What do you think?", never "tag someone who needs this".
- 0–2 hashtags, or none. No external link in the body: the URL is written as plain text (partners.neropay.app)
  or goes in the first comment.
- Post Tue–Thu, before 9am, for partner posts. Reply to every comment in the first hour.

**Audit before it ships.** Read the first two lines alone. Count the markers per paragraph. Count the fragments.
Find the concession. Find the dated figure. Find the "I" — there must not be one.

## What NeroPay changes, and why

- **"We", never "I".** Both source skills are first-person founder voices. Every NeroPay post is the company.
  Nobody is named: not Faisal, not Elif, not a merchant without signed consent.
- **No vulnerability theatre.** The sources want "one moment of real vulnerability". Ours is structural, not
  personal: we concede a case where the reader should stay where they are (rail 8), and we say where we are weaker
  ("We're small. We're not Worldpay."). That is the vulnerability. Nothing about how anyone feels.
- **No earnings register**, even on LinkedIn. No "passive income", "no effort", "risk-free", no total anyone would
  earn. A partner figure travels with its condition in the same sentence, per unit, never a total
  (`motion/partner/BRIEF.md` Part 2). "£100, £200 or £300, set by their card takings in their first 30 days."
- **No price, no rate.** Not the terminal price, not a transaction rate, not a NeroConnect fee, not a support
  plan price. "No monthly software fee" is the product fact that is safe.
- **No credit or lending language anywhere** — in the post, the alt text, or the page it links to. Not "spread the
  cost", not "finance available", not "monthly payments". s.21 FSMA.
- **Every competitor figure carries its date** and exists as a screenshot. Correct as of 18 Aug 2026 is the current
  register. Never update one in a post.
- **Third person, product-led.** No personal-attributes phrasing ("struggling with fees?"). Any post might be boosted.
- **Cut the first sentence** of every draft and see if it still works. Usually it does.
- **The register to match is L1, L3 and L8** in `posts.js`. Local, specific, plain, a little dry. If it could be a
  LinkedIn guru's post with the nouns swapped, it isn't ours.

## Procedure

1. Read the post's pillar and input. It must be a by-product of a video, a field day or a product the docs already
   describe. If it needs its own research, say so and expect it to be cut.
2. Draft. Number or statement first. Concession in. Figures with conditions. No names.
3. Run the audit above. Fix the paragraph, not the word.
4. Write the `posts.js` object: `copy` verbatim, `creative` in words, `assets` for the card, `alt` on each asset.
5. Hand back: caption, files, alt text, schedule line, one sentence to Faisal. Nothing publishes from a session.

## Sources

- sergebulaev/linkedin-skills — MIT, © 2026 Sergey Bulaev. Hook rules, the density scoring, the 2026 reach notes.
- marian-kamenistak/linkedin-post-writing-skill — MIT, © 2026 Marian Kamenistak. The anti-AI writing guide, the
  "voice memo while walking" register.
Both are first-person founder-voice skills; the NeroPay changes above are where we depart from them on purpose.
