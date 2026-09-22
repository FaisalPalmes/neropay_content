# NeroPay Meta Ads — handover brief

Context as at 22 September 2026, from the Claude Cowork session that ran this account before.
Descriptive, not directive. **Faisal moved control of Meta ads to this repo's session on 22 Sep 2026**,
which supersedes the "What lives elsewhere" line in `/CLAUDE.md`.

---

## 1. The account

**NeroPAY ADS** — `665564516470773`, GBP, ACTIVE, payment method present.
Business portfolio **Neropayment** `180822409719784`.

A second personal ad account `1023937029758691` ("Faisal Palmes") exists with no payment method and has
always been ignored.

**Portfolio split, real but not blocking:** the NeroPay Facebook Page (`567615189764832`) and Instagram
(`neropayapp`) sit in a *different* portfolio ("NeroPay") from the ad account. Untidy, never caused a failure.

**Who runs it:** Faisal Palmes, Operations Manager / Strategy Lead. He inherited the account from Ivy Liu,
the previous Ops manager, who left 7 August 2026. Owner and sole engineer is Eray, often in Indonesia, final
decision-maker on anything touching money, compliance or code.

## 2. What is live (as at 22 Sep 2026)

```
COLD | Terminal | Video | GM | 2026-09          ACTIVE   £10/day   (120249216708400743)
  └─ AS | Video | Messenger form | 25-65 | GM   ACTIVE   LEAD_GENERATION / LEAD_FORM_MESSENGER
COLD | EPOS | Static | NW | 2026-09             ACTIVE   £11/day   (120249624005110743)
  └─ AS | Static | Instant form | 25-65 | NW    ACTIVE   LEAD_GENERATION / ON_AD
```

- **£21/day is running against a £500/month budget** (£16.45/day). The plan was one cold campaign at a time.
- Only one of three planned statics exists (restaurant and takeaway approved, not built).
- The café static went live before its compliance read.
- 22 other campaigns are `Z-ARCHIVE` and PAUSED. They are kept, not deleted: deletion is irreversible and
  would destroy the campaign-level attribution the merchant cross-check depends on.

## 3. Performance history

**Fourteen months to August 2026:** £14,040.79 spent, 1,241 leads, £11.31 blended cost per lead, all from
Meta instant forms. Best October 2025 (£6.89), worst July 2026 (£46.41).

**How many of those 1,241 leads became merchants has never been established.** Only NeroForce can answer it.
Top open item since 21 August. The kill/scale maths turns on it: 15 merchants → £936 CAC → kill · 35 → £401
→ borderline · 50 → £281 → scale.

**September video campaign to 20 Sep:** £126.40, 7,315 impressions, 95 unique link clicks, 1 lead.
Click-to-lead 1.05% against the account's worst historic month of 2.86%. Traffic is not the constraint —
18–20 Sep ran 5.39% CTR at £0.38 CPC. **The Messenger destination is where it fails.**

**The 14 September lesson:** three ads added to a live ad set collapsed delivery onto the newest, worst
creative. CTR 3.80% → 1.47%, CPC £0.43 → £1.27. Adding ads to a live ad set on this account redistributes
delivery regardless of relative performance.

## 4. The August audit — three critical findings

1. **The pixel has never fired.** `NeroPay_Pixel`, dataset `25026372556963585`. No browser event, no CAPI
   event, ever.
2. **13 of 15 historic ad sets optimised for `OFFSITE_CONVERSIONS`** against that dead pixel, while 100% of
   results came from instant forms.
3. **Zero custom audiences.** No website visitors, engagers, customer list, lookalike or exclusions.
   Existing merchants have never been excluded from any campaign in fourteen months.

## 5. Compliance — "Route C". This shapes every creative decision.

**NeroPay is not on the FCA Register in its own right.** It operates via Stripe. Meta gates UK financial
advertisers against the FCA Register and payment services is explicitly restricted.

> **Route C: advertise the terminal and the EPOS software only. No rates, fees, percentages, settlement,
> payout or credit language — in the caption, the headline, or inside the image.**

- **NeroFinance never appears on Meta.** s.21 FSMA.
- **No personal-attributes copy** ("Struggling with fees?"). Product-focused third person only.
- **No earnings claims**, no "passive income", "no effort", "risk-free", no large money figures in creative.
- **Negative fee claims count as fee claims.** "No monthly fee", "no subscription", "no rental" are in scope.
  A disclaimer footnote does not mitigate.
- **Switching framing is high-risk.** `20251024_Card Terminal (Switching)` is the only ad this account has
  ever had permanently rejected.
- **"Get your quote"** as a CTA is avoided — a quote invites the rate conversation Route C exists to prevent.

Pricing facts, context only, never in an ad: standard 1.30% + £0.15, fixed fee to £0.08, bespoke from 0.7%
with a signed 18-month agreement, terminal £295 one-off. The "0.3% first month" promotion is no longer live.

## 6. Two incidents

**21 Aug 2026 — Elif's profile restricted.** Turkish partner-programme creative posted from a personal
profile into Turkish groups. Meta classified it under Fraud and Scams → financial fraud. The terms were
true; the classifier matches language patterns, not truth. *pasif gelir*, "no cost, no contract", and
£500 / 40% as the largest elements on the artwork matched Meta's own policy examples. Probable trigger was
volume. Restriction ran to 18 September.

**21 Sep 2026 — ad account compromise.** A casino affiliate campaign was created in the account at 10:40,
live at £20/day, deleted 12:21. £0.00 spend. All thirteen rogue events log against Faisal's own actor ID via
Power Editor, so most likely a stolen session cookie, which bypasses 2FA. **Remediation was written up but
not confirmed complete.** A £101.83 charge on 20 September has not been reconciled line by line.

For audit purposes: actions from an MCP session appear under application **`ads MCP server`**, not Power Editor.

## 7. What the MCP connector can and cannot do

**Works:** creating campaigns, ad sets and ads; reading everything; renaming; updating targeting and budgets;
pausing, archiving, activating; uploading media by public URL (`ads_creative_upload_media`, `upload_source: URL`).

**Does not work — creating a lead-generation ad set.** Returns "Terms of Service Not Accepted". The terms ARE
accepted; it is a connector scope limitation (`pages_manage_ads` is not requested). Misdiagnosed four times
between 23 Aug and 2 Sep. **Lead ad sets are built by hand in Ads Manager.**

**Local image upload** (`ads_creative_upload_local_image`) needs an interactive app and is unavailable here.
Route around it: put the file on a public URL and use `ads_creative_upload_media`. Done successfully 22 Sep.

**Draft reading** (`object_state: "draft"`) returns "not rolled out" for this account.

**Hazard:** Ads Manager holds new objects in an unpublished draft layer, invisible to the API, until the green
publish button is pressed. **Re-read status from the API after any write** rather than trusting the response.

## 8. Naming convention (v2, adopted 21 Sep 2026)

```
CAMPAIGN   [Temperature] | [Product] | [Format] | [Geo] | [Launch YYYY-MM]
AD SET     AS | [Format] | [Destination] | [Age] | [Geo]
AD         AD | [Format] | [Concept] | [Lang] | v[n]
```

Temperature: `COLD` · `RETARGETING` · `WARM` · `Z-ARCHIVE`. The destination goes in the ad set name because
it is the difference that matters most on this account and is otherwise invisible from the list view.
Campaigns that have spent are prefixed, never renamed in place, so old exports still match.

## 9. Operating rules

- Touch nothing for 7 days after a change. Batch changes weekly, one at a time.
- Scale by no more than 20–30% every 3–4 days.
- One ad set per campaign. Never test audiences — Advantage+ decides.
- Creative refresh: cold at frequency ~2.5–3.0 or CTR down ~30%; retargeting monthly.
- Testing order: offer → concept → hook → copy → format. No winners before ~15–20 leads or two weeks.
- "Learning limited" is normal at this budget and is not a reason to change anything.
- Opportunity Score and Campaign Score are ignored.
- CPMs roughly double October → December. January is cheapest; the Muslim-merchant window closes ~5 Feb.
- Attribution: 7-day click, no view. CRM is source of truth.
- **Budget £500/month**, set 18 Sep 2026. Needs logging with Eray.
- **Verdict rule for the September cold campaign:** ~100 leads or 8 weeks, whichever first, landing 3 Nov.
  At £10/day it reaches 8–10 leads by then, so the rule will not be answerable — record that as "we could
  not afford to find out", not "it didn't work".

## 10. Strategy

Partner-led and in-person outreach is the primary channel. **Meta's job is the credibility layer around
in-person contact, not national demand capture.** That is why September was concentrated on Greater
Manchester; the static campaign was widened to the North West on 21 Sep at Faisal's request.

Content is "a credibility backstop, not an acquisition channel — it matters when a merchant Googles us after
meeting me". **A script about PSR terminal-lease rules was reviewed on 22 September and judged unsuitable for
paid Meta** (rate comparison language, savings claim, switching premise, and it positions a non-FCA-registered
firm as an authority on payment regulation) **while being a good fit for website, YouTube, organic and direct
follow-up.** That script is MG02 in `motion/print/mg02/`.

## 11. Open items, longest-standing first

1. Merchant conversion number for the 1,241 historic leads, from NeroForce. Raised 21 Aug. Everything waits on it.
2. Eray — NeroPay's FCA Register position via Stripe, and whether the Stripe agreement permits this advertising.
3. Access and 2FA audit. Ivy Liu's Full access had not been removed four weeks after she left.
4. 21 September compromise remediation.
5. £500/month budget logged with Eray.
6. Merchant list CSV for the customer-exclusion audience.
7. `ivy.nero.partners` still in archived creative; the July 2025 lead form is deactivated and its copy would
   breach Route C anyway.

## 12. The written record

Lives in the NeroPay Claude project, not this repo: `claude/meta-account-audit-21-aug-2026.md` (the most
important single document), `claude/meta-ads-notes.md`, `claude/meta-incident-elif-profile-aug-2026.md`,
`claude/meta-account-compromise-21-sept-2026.md`, `claude/meta-access-blocker-23-aug-2026.md`,
`claude/meta-naming-convention-and-campaign-build.md`, `claude/meta-september-2026-plan.md`,
`claude/meta-static-campaign-build-18-sept-2026.md`, `claude/meta-static-creative-brief-18-sept-2026.md`,
`claude/meta-checkin-*.md`, `NEROPAY_CONTEXT (1).md`.

## 13. How Faisal works

One question at a time. Plain English before frameworks. Short answers. He writes quickly and informally,
often by voice, and wants polished output back. He defaults to handling things verbally and has asked to be
reminded to log decisions. He forgets details he was told days ago and has asked for a bias toward writing
things down now. His instinct is to move fast and say yes; he has asked for the friction of being asked
whether a decision is his to make. He has asked to be told when he is fiddling with the account for no reason.

Escalate to Eray: anything touching fund flow, commission, non-standard terms, code changes, legal or
compliance, or decisions affecting multiple merchants.

---

## 14. This session's log

**22 Sep 2026.** Built `VIEWS | Education | Video | GM | 2026-09` (`120249679702470743`, OUTCOME_ENGAGEMENT,
PAUSED) with two ad sets, both PAUSED at £8/day: `AS | MG02 18-month rule | ThruPlay | 25-65 | GM`
(`120249679705100743`) and `AS | PP02 Your road | ThruPlay | Feed only | 25-65 | GM` (`120249679707060743`).
Greater Manchester geo key `2861341`, copied from the live video ad set rather than guessed. Thumbnails
rendered from the repo compositions and uploaded (`2f8a380ee78ed9a145ac80e5708f3468` MG02,
`f52bf06785b5eb8d388d3acfa49c891c` PP02). **No ads were created** — the first attempt failed on a missing
thumbnail, the second on "Ad Set with Promoted Object Is Required", and then this handover arrived and
stopped the work. Both videos were already in the account's video library: MG02 `1811664206853327` (55.87 s,
matches v6), PP02 `1352116770336872` (52.0 s, cannot tell v6 from v7 by length).

**22 Sep 2026, later — the café static paused on a Route C read.** `AD | Static | Cafe | EN | v1`
(`120249665727150743`) was ACTIVE in `COLD | EPOS | Static | NW | 2026-09` on creative `926832176796526`
("Save with NeroPAY !!!", created 21 Sep). Its primary text breaches Route C on most lines: a transaction
rate with a competitor comparison ("up to 1.2% + 15p transaction fee (lower than others)"), negative fee
claims ("£0 monthly fee", "£0 setup / PCI / SIM fees"), payout language ("Instant payout available"),
personal-attribute phrasing ("Still paying high fees for your card machine?"), a savings claim in the
headline, a partner figure in a merchant ad ("£100 per referral"), "No contract — cancel anytime" and a
"FREE card terminal trial". The quoted rate does not match the internal standard either (1.30% + £0.15).
**Paused, not deleted.** Two sibling creatives with the same body (`1805274824259338`, `1104507042091049`)
also carry `https://ivy.nero.partners`, the departed employee's link (open item 7) — not attached to a live
ad, but they are in the library.

`AS | MG02 18-month rule` archived as `Z-ARCHIVE | MG02 refused for paid Meta (Route C)` on Faisal's
instruction ("one of the videos that you mentioned is not allowed... let's just get rid of that one").
The PP02 ad set and the VIEWS campaign stay PAUSED with no ads, pending a ruling on PP02's on-screen
£100–£300, which is the Elif pattern.

**22 Sep 2026, later still — the video campaign off, the statics blocked on a look at the images.**
`COLD | Terminal | Video | GM | 2026-09` PAUSED at Faisal's word ("I think we can disable the video ad
for now"). Its Online Bookings creative (`4263023013947605`) is the account's best-behaved ad and the
model for Route C copy: product-led, third person, a concession in the first line ("A salon that's happy
with its booking system doesn't need to change it"), no rate, no comparison. The one line to watch in it
is "EPOS software included, no monthly software fee" — an approved product fact, but a negative fee claim
under a strict Route C reading. It has run 14 days without a rejection.

Daily spend now £11 against the £16.45 the £500/month budget allows. It was £21.

**The static ad set has no live ad.** The café is paused on its copy; the takeaway Faisal describes is not
visible to the API, which means it is an unpublished Ads Manager draft (the §7 hazard). His nine static
images ARE in the ad account library: `N_cafe_A/B/C`, `N_take_A/B/C`, `N_rest_A/B/C` (1080×1350). The live
café ad used `N_cafe_C` (`7ac7e0ad1ddd687a9708a70150eb0b1a`).

**A session cannot see inside those images.** `scontent.*.fbcdn.net` is refused by the egress proxy
(CONNECT 403), so the overlay text on the statics cannot be read from here. Route C applies inside the
image as much as in the caption, so the statics cannot be cleared until Faisal sends the files or the
overlay wording into chat. That is a standing limitation, not a one-off.

## 15. Pricing and contracts, as Faisal stated them on 22 Sep 2026

Context for writing, **not** for putting in an ad.

- **Standard merchants are on no contract at all.** Rates start from 1.2%.
- **Contracts apply only to bespoke offers.** When a lead comes in unhappy with the standard terms, the
  rate can go below 1.2% and a contract goes with it. That is the only place an agreement appears.
- **Public-facing: "no contracts" is true and may be said. Rates are never mentioned** until a merchant
  makes contact, sends a statement and the volume is assessed. Only then is a rate quoted, privately.

This answers a question the repo had carried as open since 14 Sep: `figures.json`'s `neropay_workhorse_rate`
record notes that "no contract" collided with the unanswered question of whether the 8p fixed fee triggers
the 18-month agreement. It does not — the agreement belongs to bespoke pricing. **The content session
should fold this into `figures.json` and `/CLAUDE.md`; this session does not own those files.**

**On putting "no contracts" in a Meta ad.** It is true and Faisal has ruled it public, so the accuracy
objection is gone. The residual risk is register, not fact: Meta's classifier groups "no contract, cancel
anytime" with the too-good-to-be-true pattern, and it sat inside the creative paused earlier today next to
a rate, a comparison and a savings claim. Said plainly in a sentence it reads as a product fact; stacked in
a list of green ticks with "£0" lines it reads as a pitch. The three captions below say it once, in a
sentence.

**Contact details, confirmed 22 Sep 2026:** calls 020 8150 2104 · WhatsApp 0333 049 4380 ·
support@neropay.app · merchant landing page `https://eu.neropay.app/lp/i` (served by NeroForce, the URL is
stable, the page content will be updated later). The old creative's WhatsApp number and `ivy.nero.partners`
are both retired.

**One mismatch to settle:** the copy says Manchester-based and the calls number is an 020 London line.
Either is fine on its own; together a sharp merchant notices. Faisal to choose which gives way.

**22 Sep 2026 — discarding a draft reactivated a paused ad.** Faisal discarded the takeaway ad draft by
accident. Two consequences, one of them not obvious:

1. **The takeaway ad is unrecoverable.** It had never been published, so it lived only in the Ads Manager
   draft layer, which the API cannot see. Meta has no undo for a discarded draft. Its images survive in the
   library (`N_take_A/B/C`); only the ad and its setup are gone, and both are cheap to rebuild.
2. **`AD | Static | Cafe | EN | v1` came back ACTIVE.** It had been paused earlier today over its Route C
   copy — the pause returned `success: true`, `is_draft: false`, and a later read confirmed PAUSED. After
   the discard it read ACTIVE and had served 139 impressions for £2.24 before being paused again and
   re-verified. The mechanism is not established; what is established is that a discard touched the live
   status of a different object.

This is the second time the draft layer has moved a status on this account with nobody asking it to — on
21 Aug a pending draft committed itself during an unrelated rename and flipped `20260630` from PAUSED to
ACTIVE at £7/day. **The standing rule is now proven twice: after any action in Ads Manager, re-read status
from the API rather than trusting the screen.**

**22 Sep 2026 — the connector cannot create ads inside a lead ad set either.** Tested, not assumed.
`ads_create_ad` into `AS | Static | Instant form | 25-65 | North West` with an inline `link_data` creative
returns `Missing Lead Form: Choose or create an instant form for your leads campaign. (#3390001)`. The
creative must carry the instant form's id, and this connector exposes no tool to list, read or attach one.
`ads_get_creatives` does not return `object_story_spec`, so the form id cannot be lifted off the existing
café ad either, and duplicating that ad with `source_ad_id` would carry its retired copy.

So §7's rule widens: **anything that touches an instant form is built by hand in Ads Manager.** A session
can still write the copy, verify it against Route C, name it to convention, and read the result back.

## 16. The static image set — review, 22 Sep 2026

Faisal sent four of twelve (three per vertical plus a Flex feature card). Layout is the new brand kit:
the rounded-square mark, the brighter yellow, Poppins, a product shot over a real-premises photo. Route C
clean on rates: no percentage, no fee figure, no money anywhere. Four things to fix.

1. **Takeaway, "Switch in 24 hours." — change it.** Switching framing is the only thing this account has
   ever had permanently rejected (`20251024_Card Terminal (Switching)`, still in the account WITH_ISSUES).
   "24 hours" is also a hard delivery promise that underwriting or KYC can break. The sub-line underneath
   it already carries the idea safely: "We bring the terminal, set it up on your counter and show your
   staff. You keep serving."
2. **"Get your quote" on the café and takeaway cards — change to "Book a free demo".** §5 records that
   this CTA was deliberately avoided because a quote invites the rate conversation Route C exists to
   prevent. The restaurant and Flex cards already use the safer one.
3. **The Flex card footnote names card processing.** "Hardware, setup and card processing are quoted
   separately." §5 records that a disclaimer footnote did not mitigate, and that in one case naming card
   processing explicitly made it worse. Trim to the software sentence and the T&Cs line.
4. **"Table plans" is not in the approved product list.** `/CLAUDE.md` gives NeroPOS as till, product grid,
   staff, kitchen display, Z-reports. Either the feature is real and the product list is stale, or the card
   overstates. Confirm before it runs.

**The restaurant card is the template.** "The kitchen sees every order" with "Nothing shouted across the
pass" is product-led, specific, concedes nothing it cannot prove, names no rate and does not mention
switching. Build the others to that shape.

**On the lead form theory.** Faisal suspects the video ad's instant form was misconfigured and that this
explains the missing leads. The evidence says otherwise: `AD | Video | Online Bookings | EN | v1` took 71
link clicks and the campaign returned 1 lead, and that lead landed on day one. A form that is not wired up
returns zero, not one. This is a conversion problem, which matches the audit's own finding that the
Messenger destination converts at a third of the account's worst historic rate. Verify by submitting a test
through the ad preview rather than rebuilding on the assumption.

## 17. The instant form — 22 Sep 2026

The form **is** attached to `AD | Static | Cafe | EN | v1`. A `Website URL` of `http://fb.me/` in the
publish summary is how Meta renders a lead-ad destination, not a sign of a missing form; an earlier note in
this file guessing otherwise was wrong.

Three things seen in the form itself:

1. **"Require SMS verification to submit form" is ON.** The lead has to receive and enter a one-time code
   before the form submits. It raises lead quality and cuts completion hard. This account currently gets
   about one lead per £126 against a historic best of £6.89, so it is a live candidate for where the volume
   is going, and it is one checkbox. Recommendation: off while volume is the problem, revisit if the leads
   that do arrive turn out to be junk.
2. **The form is called `Generated form 09/21/2026 9:10am (v1)`** — Meta's auto-name, and the library holds a
   second, `Generated form 09/21/2026 8:51am`, from the same morning. Two near-identical auto-named forms is
   how nobody can later say which one collected which leads. Rename to the convention (`FORM | Static | NW |
   2026-09`) and archive the stray.
3. **Field order is Email (optional), Phone number, First name.** Follow-up on this account is by phone and
   WhatsApp, so phone is the field that matters; asking for an optional email first is a wasted first
   impression. Suggested order: First name, Phone number, then Email optional.

None of this blocks publishing. The SMS verification is the one worth changing first because it is free to
test and it bears directly on the open question of where the leads went.

## 18. The Messenger chat builder — 22 Sep 2026

The Chat builder is the scripted opening of a click-to-Messenger conversation: greeting, CTA button, and up
to three tappable suggested questions, each with an optional auto-reply that fires before a human sees it.
It applies only to ads whose destination is Messenger, so it does **not** touch the three static ads, which
go to the instant form.

**What was on screen was all Meta defaults**, and two of them ship as-is if nobody changes them: the button
read the literal placeholder `Current CTA`, and question 2 was **"How much do your services cost?"** That
question invites the rate conversation Route C exists to prevent — answering it publishes a price inside an
ad experience, leaving it blank asks every merchant about price and then refuses to answer. Deleted.

What replaced it:

- **Greeting:** "Thanks for getting in touch with NeroPay. Tell us what kind of business you run and we'll
  come back to you."
- **CTA:** Book a free demo — the same wording as the static ads.
- **Q1 "What comes with the terminal?"** → terminal plus EPOS software (till, product grid, staff, kitchen
  display, Z-reports), online ordering, bookings, website. No monthly software fee. No rate, no percentage,
  no figure.
- **Q2 "Do I have to sign a contract?"** → no contract on the standard setup, stop whenever. Safe to say
  publicly per §15; contracts are bespoke-only.
- **Q3 "Can someone come and show me?"** → Greater Manchester, we come to you, then 020 8150 2104 /
  WhatsApp 03330494380.

Q3 ends on a phone number on purpose. The audit's finding is that Messenger converts at about a third of
this account's worst historic rate because conversations stall; giving a route off Messenger in the first
auto-reply is the mitigation. The larger question — whether any ad should use the Messenger destination at
all rather than the instant form — is still open and is not answered by filling this in well.

## 19. Archived ad cleanup — 22 Sep 2026

Two archived ads inside `AS | Static | Instant form | 25-65 | North West` were set to `DELETED` at Faisal's
request, because they were cluttering the ad list:

| Ad | ID | Lifetime spend |
|---|---|---|
| `AD \| Static \| Cafe \| EN \| v1` (archived) | `120249665727150743` | £2.32 |
| `20250718_EnglishPriceSensitive` (archived) | `120249664926500743` | — |

Three things learned doing it.

**Archived is Meta's delete.** There is no UI button that removes an ad, because the object holds spend history
that has to reconcile against billing. The only reason archived ads appear in the list is the **"Deleted" filter
chip** in the Ads Manager toolbar being toggled on; turning it off hides all of them, account-wide, reversibly.
`DELETED` via the API is the permanent version and cannot be undone. The account still holds ~29 other archived
ads, including `20250930_switch to NeroPAY` (£658) and `20250723price_comparison_logo` (£168) — left in place,
because they are the record of what this account has already tried.

**The UI name and the API name disagreed.** Faisal's screen showed the archived row as
`AD | Static | Restaurant | EN | ...`; the API had it as `AD | Static | Cafe | EN | v1`. Name is the only field an
archived ad accepts (error #1885088), so a rename almost certainly sat unpublished in the draft layer, which the
API cannot read. An earlier note in this file said the archived *Restaurant* ad held the £2.32 — that was wrong;
it was the archived *Cafe* ad. **Confirm an id before any irreversible action; the draft layer makes names
unreliable.**

**Deleting moved nothing else.** Verified after: the ad set returns one ad, the live `AD | Static | Cafe | EN | v1`.
Worth checking every time on this account, which has twice had a status change ripple somewhere unasked.

### The lead form fork

Separately, the restaurant ad's publish preview showed `Lead form: None` with the tooltip reading
`New: None / Original: FORM | Static | NW | 2026-09 (v6)`. The form was not missing — the draft was staging its
**removal**. Clicking **"Edit this form"** on a form that has already collected leads does not edit it in place:
Meta **forks it to a new version**, the ad's pointer to v6 goes stale, and Ads Manager stages the stale pointer as
`None`. Fix is to re-pick the form from the dropdown, with only that one ad selected in the left panel, then
re-check the Review row before publishing. Leads collected against v6 stay attached to v6.

### Still open on the static set

- `AD | Static | Cafe | EN | v1` is **ACTIVE and now delivering** (£0.19). Its CTA button reads `Learn more` while
  the creative says "Book a free demo", and Advantage+ **Text improvements** and **Add overlays** are on. Creatives
  are immutable, so the CTA needs a v2; the Advantage+ toggles are free to change and should be off on all three.
- `Apply now` was proposed as the CTA on the restaurant ad and rejected here: application language on a financial
  services ad is the Rail 1 register, and this account has already lost a profile to a classifier match.

## 20. Standing rule — do not rebuild what is already live — 22 Sep 2026

Faisal's instruction, 22 Sep 2026, after this was got wrong more than once:

> "next time just make sure you're not making these errors where I've already got a V1 that's approved.
> I don't need to do it."

**An ad that is live and approved stays as it is.** Never propose a v2, a rebuild or a replacement for a
cosmetic improvement — a CTA label that could read better, a headline that could be sharper, a naming
inconsistency. Creatives are immutable, so every such suggestion costs a full rebuild and a fresh review on
something that already cleared.

A change to a live ad is proposed only when one of these is true:

1. It breaks a rail or Route C.
2. The destination is broken — no form, wrong form, dead link.
3. It is spending badly enough that the creative is the measured problem.
4. Faisal asked for it.

Everything else goes on a list for the next time that ad is being rebuilt anyway. **Check the live state
before proposing work**, and say what is already done before saying what is left — the answer to "do I need
to do X" is usually "no, you already have it".

## 21. The static campaign, audited live — 22 Sep 2026

All three static ads published. State at audit:

| Ad | Id | Status | Impressions | Spend |
|---|---|---|---|---|
| `AD \| Static \| Cafe \| EN \| v1` | `120249681700780743` | Delivering | 252 | £1.35 |
| `AD \| Static \| Takeaway \| EN \| v1` | `120249682646300743` | Delivering | 3 | £0.17, 1 click |
| `AD \| Static \| Restaurant \| EN \| v2` | `120249683543760743` | `PENDING_REVIEW` | 0 | £0 |

Campaign `COLD | EPOS | Static | NW | 2026-09` (`120249624005110743`): active, `OUTCOME_LEADS`, **£11/day**,
highest volume, started 21 Sep, **ends 5 Oct 2026**, £3.92 spent. The video campaign
`COLD | Terminal | Video | GM | 2026-09` stays paused at £143.41 lifetime. £11/day is about £335/month,
inside the £500 with room.

Ad set `AS | Static | Instant form | 25-65 | North West` (`120249664926490743`): active,
`LEAD_GENERATION`, billed on impressions, ages 25–65, no pixel (lead form, so none needed).

### Three findings, ranked

1. **The geo radius is 80 km** around Manchester city centre (53.4808, −2.2426). That reaches Liverpool,
   Leeds, Sheffield, Stoke and Preston — against a territory of Rusholme–Longsight–Levenshulme, Cheetham
   Hill and Stretford, worked by field days from Manchester. It buys impressions against merchants nobody
   will visit, on a budget too small to cover Manchester properly. **Recommended 15–20 km.** The single
   biggest lever on cost per lead and on whether a lead is worth anything.
2. **Audience Network is on, including `rewarded_video`** — a placement where people tap ads for a game
   reward, and the classic source of junk leads. Placements are currently everything: FB feed, IG stream /
   story / reels / profile, Marketplace, Search, Notifications, in-stream video, Audience Network classic
   and rewarded. Faisal chose **feed only** when this was set up; the live state is the opposite.
   `advantage_audience: 1` compounds it by expanding past the stated targeting.
3. **End date 5 Oct 2026.** Thirteen days out. Fine if deliberate, flagged so delivery stopping is not a
   surprise.

Also: the restaurant ad is named **v2** while the other two are v1. Cosmetic, but it confuses reporting
later, and name is the one field an ad always accepts.

### What not to read into the early numbers

At £11/day across three ads this ad set **will not exit the learning phase**: roughly 50 conversions a week
would need leads at about £1.50 against a historical best of £6.89. Meta will concentrate spend on whichever
ad gets early traction — which is why the café has 252 impressions and the takeaway 3. So results will be
noisy, optimisation weak, and **the first week says nothing about which creative won**, because the budget
never gave all three a fair run.

Verdict given: fine to continue, nothing broken, no rail breached, form attached, copy clean. Fix the radius
first.

## 22. Boosting is paid Meta — 22 Sep 2026

MG02 went out organically on Facebook and Instagram on 22 Sep and is refused for paid Meta under Route C.
Faisal confirmed he is only posting it to the grid. That is exactly what its `clearedFor` allows.

**The trap: "Boost post" is not an organic action.** It converts the post into a paid ad using the same
creative, routes it through the ad account, and puts it in front of the ad classifier. A video cleared for
organic and refused for paid can breach Route C with one tap, from a button that sits next to the organic
ones in Business Suite.

So for anything whose `notCleared` names `paid-meta` — MG02 today, and structurally every Small Print and
The Maths episode, because their premise is a regulation or arithmetic on a rate and no rewrite fixes that:

- Never boost the post.
- Ignore the "your post is performing well, boost it" prompts. They appear *because* it is doing well
  organically, which is not a reason to change what it is.
- Check the Page's **automatic boosting / Advantage+ for Pages** setting is **off**. Meta has been enabling
  auto-promotion of well-performing posts by default, which can boost a post with no tap at all.

This is the operational edge of `CLAUDE.md` rail 9 — write organic to ad standards, because any post might
be boosted later. Where a piece cannot meet ad standards, the control is not the copy, it is never letting
it become an ad.
