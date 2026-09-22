# Static ad cards — the brief for a creative session

Written 22 Sep 2026 by the Meta ads session, for whichever session generates the static card images that
go into Meta ads. Hand this over whole. It describes one card system, three verticals, and the rails that
decide what may appear in a frame that Meta will scan.

`BRAND.md` is the authority on the mark and the colour values and wins over anything here. `CLAUDE.md`
carries the rails. `META-ADS.md` §5 carries Route C, which is the one that bites creative.

---

## 1. What already exists

Three cards have been made. One is live and approved and **is not to be changed**:

| Card | State |
|---|---|
| Café — "Coffee, cake, card. One machine." | **Live, approved, delivering. Do not regenerate.** |
| Takeaway — "Three tablets. One machine." | Live. A regeneration becomes a `v2` ad, not an edit |
| Restaurant | Not yet built. Blank slate |

The café card is the reference for the system. Match it.

## 2. The card

4:5, 1080 × 1350. Meta's feed and the 4:5 ad placement.

Top to bottom:

1. **Symbol** top-left — the yellow rounded square with the slash `N`, from `brand/favicon/`. Not the
   wordmark, and never typeset.
2. **Short yellow rule** under it, about the width of the symbol.
3. **Eyebrow** — `FOR TAKEAWAYS` / `FOR RESTAURANTS` / `FOR CAFÉS & BAKERIES`. Uppercase, `#6d6c68`,
   `letter-spacing: 0.36em`, weight 600.
4. **Terminal** — the NeroPay Flex, angled, bleeding off the top-right edge. The only branded object in
   frame. No cards, pens, mugs, props.
5. **Photo band** — a full-bleed horizontal strip of real photography, roughly a fifth of the height.
   Real food, real hands, real counters.
6. **Headline** — two lines. Ink `#111114`, heavy, tight. The **second line carries a yellow marker
   highlight** behind it, `#FFCF24`. This is the one place yellow appears as a block.
7. **Sub-line** — one or two lines, `#4d4c48`. This is where the proof lives.
8. **CTA chip** — black pill, small yellow dot, white text. **Always `Book a free demo`.**
9. **`T&Cs apply`** bottom-right, small, grey.

Ground is `#fbfaf7`. Never pure white, never grey. Everything sharp — no bokeh anywhere, deep depth of
field, locked-off framing. Poppins sets everything that is not the logo.

**Keep all critical text at least 90px from every edge.** Meta's multi-advertiser and Advantage+ placements
crop and resize creative, and a typographic card loses its meaning when the headline is clipped.

## 3. What the terminal screen shows

The keypad / CHARGE screen is **vertical-neutral and always safe**. Use it when nothing better exists.

A POS screen is **stronger when it matches the vertical**, because the keypad is a card machine and every
competitor has a card machine — the software is the differentiator and the headline usually claims it. But
a café product grid on a takeaway card is worse than a keypad: the owner sees somebody else's business and
scrolls.

So: per-vertical POS screens are the target. A takeaway wants an **orders** view (delivery-app orders
landing in one list), a restaurant wants a **kitchen display** or table view, a café has its grid already.
Demo data only — invented items, invented prices, never the live dashboard, never a real transaction,
never KYC. Item prices may appear small and incidental; **no money figure may be the dominant element of
the frame.**

## 4. The rails, as they apply to a frame

Two of these have criminal or account-ending consequences. One has already cost NeroPay a restricted
Facebook profile.

**Never in a frame, in any size:**

- Any **percentage**, any **transaction rate**, any **terminal price**, any fee figure.
- **Switching framing** of any kind — "switch", "switch in 24 hours", "move to us", "leave your provider".
  This is the one thing this ad account has had **permanently rejected**. It is not a judgement call.
- **Credit or lending language** — finance, funding, advance, lending, credit, "apply", "application",
  "approval", "eligibility". s.21 FSMA; unauthorised financial promotion is capable of being a criminal
  offence. This also rules out `Apply now` as a CTA.
- **`Get your quote`** as a CTA. A quote invites the rate conversation Route C exists to prevent.
- **Earnings or savings claims** — "save", "cheaper", "passive", "risk-free", "no effort", or a large money
  figure as the dominant element. The terms being true is not a defence; the classifier matches patterns.
- **Competitor names.** Square, SumUp, Zettle, PayPal, Verifone, Stripe — none of them, ever, including on
  the terminal itself.
- **A named merchant**, or a real business's signage legible in the photo band. Only the Armenian Taverna
  is consented and only once the form is signed.
- **AI-generated people, streets, shopfronts, merchants or customers.** Real photography only.
- Any feature not on the approved list below.

**Safe to say:**

- Card terminal with **EPOS software included**, no monthly software fee.
- **No contracts** — confirmed public-facing 22 Sep 2026; contracts are bespoke-only.
- NeroPOS: till, product grid, staff, kitchen display, Z-reports.
- NeroWeb: online ordering, **no per-order commission**. NeroBooking. Nero QR Pay.
- Integrations: Xero, QuickBooks, WooCommerce, Deliveroo, Uber Eats.
- Flex hardware: 5.5in screen, built-in printer, wi-fi / 4G / offline.
- **We come to you** — Greater Manchester, set up on your counter, staff shown.

Two notes on the edges of that list. **"Table plans" is not on it** — a card claimed it once and the claim
is unverified; leave it out until Eray confirms the feature exists. **"No rental" is untested**: Faisal has
asked for it, but the live approved card says "EPOS software included, no contracts" and stops there, so
that phrasing is the proven-safe one. Anything naming a cost, even to deny it, is closer to the Route C
line than it looks.

## 5. How the copy works

The headline states a problem the owner already has, in their own words, in four or five words. The
sub-line proves it with one specific mechanism. Nothing is claimed that the image cannot back.

The strongest line in the set is a **concession** — the live restaurant primary text opens "A restaurant
happy with its POS should keep it." Conceding a case where the reader should stay put is what makes the
rest believable, and it is the register of the best posts in `posts.js` (L1, L3, L8). Carry it where it fits.

Cut the first sentence of every draft and see if it still works. No hashtags, no emoji, no adjective piles,
no LinkedIn cadence. Third person, product-focused — never a personal attribute like "struggling with fees?".
Every card is a financial promotion.

Run every line through `/slopmonster` before it ships.

## 6. The two cards to build

### Takeaway

Headline: **Three tablets. / One machine.** — names what is physically on a takeaway counter (the Deliveroo
tablet, the Uber Eats tablet, the till) and resolves it in four words.

Sub-line, in preference order:

1. `Deliveroo, Uber Eats, phone and counter orders land in the same place.`
2. `One screen for the delivery apps, the phone orders and the counter.`
3. `The order lands, the receipt prints, the card goes through. One device.`

Take 1. The headline says "three tablets" and the sub-line names them, so the two halves do different work.

Photo band: hands making food at a counter, real prep, real trays.

### Restaurant

Headline: **The kitchen sees / every order.**

Sub-line, in preference order:

1. `The order goes in at the table. The kitchen has it before the waiter walks back.`
2. `Orders go from the terminal straight to the kitchen screen. Nothing shouted across the pass.`
3. `Front of house and the pass on one device.`

Take 1. It is a scene rather than a feature, and the reader supplies the benefit themselves.

Photo band: a pass, a kitchen line, or a table being served. No faces identifiable enough to need a release.

### Rejected, and why — so they are not regenerated

| Card | Why |
|---|---|
| Takeaway "Friday night. One screen." | Good headline, worth reusing. Rejected only for its `Get your quote` CTA and a photo band cut off at the frame edge |
| Takeaway "Switch in 24 hours." | **Switching framing.** Permanently rejected category on this account. Cannot run |
| Restaurant "One machine is all you need." | `Get your quote` CTA, and it prints "table plans", which is not an approved feature |
| Restaurant "Take the order. Take the card." | Compliant but describes the payments category, not NeroPay. Its sub-line "Set up by someone who turns up" is the real differentiator and deserves to be a headline one day |

## 7. Deliver

PNG, 1080 × 1350, sRGB. One file per card. A contact sheet of every variant for review before anything is
sent for publishing — no card goes near the ad account unseen.
