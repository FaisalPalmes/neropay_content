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
