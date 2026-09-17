# NC01 — proposal (draft for Faisal, 17 Sep 2026 — nothing generated until approved)

> **Superseded in part, 17 Sep 2026 (v2).** The two-modes passage below carried the June playbook's story; the video now says what the September docs say (who pays NeroPay's processing fee, merchant pricing the platform's in both) and names neither mode. `script.md` is the record of what ships.

The NeroConnect intro. The white world, ink type, the yellow accent, Poppins, Olivia, captions in the picture on the
social crops, none on the 16:9 LinkedIn master. About 80 seconds. No number in it.

## The angle: the payments company already exists

Faisal's framing, 17 Sep: this is for business-minded people, and what we are selling is the network model — software,
hardware, structure, all built and ready to run under someone else's name. So the video does not open with a question. It
opens with a statement a stranger has to think about: **you don't have to build a payments company to run one.** Then it
shows the company that already exists, piece by piece, puts the viewer's name on it, and shows what is underneath.

Two words from the brief are not in it and I want to say why before you read the script. "Effortless" and "no startup
cost" are the register that got a NeroPay profile restricted in August — the classifier reads "no effort / no cost" as the
scam pattern whatever the product. The feeling of ease is carried by the pictures instead: the stack is already standing
before she finishes the first sentence, and the name changes on a nameplate. If "free to set up" is true for every
platform and public, one sentence can go in (see the questions at the end). Nothing else about cost goes in.

## The script — one continuous read, Olivia, eleven_v3, about 80 seconds

> [warmly] You don't have to build a payments company to run one. Everything it takes already exists. The card terminals.
> The till software. The settlement, the compliance, the support desk. We built all of it for NeroPay, and NeroConnect
> lets you run it under your own name. Here's how it works. You sign up as a platform and you get one dashboard for every
> merchant you look after. Your logo on the dashboard, your domain in the address bar, and if you want it, your branding
> on the terminal itself. You bring the merchants. [curious] And underneath, it's us: the card acquiring, the money landing
> in their account, the paperwork, the support. There are two ways to run it. Connected mode: you work under the NeroPay
> name, we set the merchant rates and we handle the disputes. It's the simpler start. Platform mode: your brand, your
> pricing, and more of the responsibility, disputes included. It's for when you want your own name on everything. Who
> it's for: EPOS installers. Software companies with restaurants or salons on their platform. Anyone looking after a
> group of merchants. [softer] And who it isn't for. If you look after three cafés, the partner programme is the right
> door, one introduction and nothing to run. And platform mode can need its own regulatory permissions, so that's a
> conversation we have before a contract, not after. [warmly] The documentation is public. Read it at docs dot neropay
> dot app, then talk to us. That's it for today. Follow us for more of this.

Word count about 230, which reads at Olivia's pace in 78–85 seconds before tightening. "We" throughout, nobody named,
no figure, no cost, no rate. The concession is two-part (the wrong door, the permissions) and it is the honest core of the
piece: the reason a business-minded viewer believes the rest.

**Claims in the take and where each comes from** (`claims.md` will carry this table with dates):

| Claim | Source |
|---|---|
| One dashboard for every merchant; your logo; your domain | Partner Operational Handbook v1 §3 (custom subdomain, branding upload); docs build plan article 4 |
| Your branding on the terminal itself | Faisal, 17 Sep 2026 ("custom branding for terminals available") |
| Card acquiring, settlement, compliance, support underneath | Partner Playbook v1 §1 |
| Connected mode: NeroPay name, we set merchant rates, we handle disputes | Playbook v1 §2 table |
| Platform mode: own brand, own pricing, more responsibility incl. disputes; may need own regulatory permissions | Playbook v1 §2 and its warning |
| Who it's for: installers, software platforms, groups | Playbook v1 §1 "Who NeroConnect is for" |
| Partner programme for the small case | `motion/partner/BRIEF.md` Part 1 |
| docs.neropay.app | Faisal, 17 Sep 2026 |

## How it looks — six sections, one world, the camera travels

One three.js world (`motion/lib/world3d.js`) on paper, the camera never still: a slow orbit and breath at rest, a
flight between sections that climbs and pulls back so the viewer sees the whole thing laid out, then lands. Type stands in
the scene as signs. Every phrase that can be a graphic is one. One real payment card at the edge of a section at most,
half out of frame, never the focus. Nothing enters from above: everything rises out of the paper.

| Section | Words | On screen |
|---|---|---|
| **S0 The statement** | "You don't have to build a payments company to run one." | Empty paper. The line rises word by word, tracking settling from wide to tight; "to run one." lands on the beat with a soft thud. As it lands the ground behind it starts to lift. |
| **S1 The stack** | "Everything it takes already exists. The card terminals. The till software. The settlement, the compliance, the support desk." | The signature shot. Out of the paper, one on each phrase, rises a *skyline of the company*: our terminal, a till screen (a glass slab showing a product grid, demo data only), a ledger strip that ticks a row and stamps SETTLED, a document that takes a stamp, a headset-shaped phone. They stand in a row like a model on a table, each casting one contact shadow, each swaying a degree. Mono kickers hang under each: TERMINALS · TILL · SETTLEMENT · COMPLIANCE · SUPPORT. |
| **S2 The name** | "We built all of it for NeroPay, and NeroConnect lets you run it under your own name." | A nameplate hangs in over the stack reading **NeroPay.**; on "your own name" its letters roll like an odometer to **YOUR BRAND** with a caret. At the same moment the wordmark on the terminal's screen crossfades to the placeholder mark, and the dashboard slab's logo slot follows. The yellow head of the terminal stays yellow — we don't recolour the hardware, we re-badge it. |
| **S3 How it works** | "You sign up as a platform… one dashboard for every merchant… your logo… your domain… your branding on the terminal… You bring the merchants." | The camera flies to a large glass dashboard slab standing on the paper. An address bar types **pay.yourbrand.co.uk** with the caret. A logo slot fills. Merchant rows tick in one after another as a run of shopfronts (`street()`, trading types only) lights along the floor behind it, and a re-badged terminal rises at each lit door. The dashboard is a *drawing* of a dashboard — glass, type, rows — never a screenshot. |
| **S4 Underneath** | "And underneath, it's us: the card acquiring, the money landing in their account, the paperwork, the support." | The camera drops below the dashboard's level. Four pillars grow from the ground under it: ACQUIRING · SETTLEMENT · COMPLIANCE · SUPPORT. A yellow payment path draws from a card tap at a shop, along the floor, through the pillars, to a bank-shaped tile that lights on "landing". The small **NeroPay.** mark sits low on the pillars, the only place our name appears in this section. |
| **S5 Two modes** | "Connected mode… It's the simpler start. Platform mode… your own name on everything." | Two glass slabs side by side, CONNECTED left and PLATFORM right, each with a small terminal beside it: Connected's carries our wordmark, Platform's the placeholder. Four rows tick in on both at once as she reaches each: **Brand** (NeroPay / Yours) · **Merchant pricing** (NeroPay sets / You set) · **Disputes** (NeroPay / You) · **Best for** (the simpler start / your name on everything). A serif aside rises under Platform half a beat late: *may need its own regulatory permissions* — anticipating S6. |
| **S6 For, and not for** | "Who it's for… Anyone looking after a group of merchants. And who it isn't for…" | Three things light in turn: a van with a ladder rack (the installer), a stack of software tiles (the platform), a cluster of shops under one roofline (the group). Then, off to the side, three small cafés; a hanging sign over them swings to **PARTNER PROGRAMME →** and the serif line: *one introduction and nothing to run.* Then a document rises and takes a stamp: PERMISSIONS · BEFORE A CONTRACT, with the aside in serif under it. |
| **S7 The docs** | "The documentation is public. Read it at docs dot neropay dot app, then talk to us. That's it for today. Follow us for more of this." | A street nameplate hangs in: **docs.neropay.app**, the underline drawing. The camera pulls all the way back: the whole world in one frame — the stack, the dashboard, the pillars, the two modes, the shops — with the re-badged terminal nearest the lens. End card in the house shape: the mark, one line ("Card payments under your own brand. NeroConnect, from NeroPay."), the FOLLOW pill, the URL. The footer line held to the end: *NeroConnect is provided by NeroPay, the trading name of Nero Panda Ltd. Platform mode may require your own regulatory permissions.* |

## The motion vocabulary — what makes it "grand, modern, effortless"

Everything from PP02 stays: word-by-word rise with a 50 ms stagger and a tracking settle, a typewriter whose caret follows
the last character, odometers in tabular mono, the highlighter drawing under the hit word, signs that hang in and settle
without overshoot, captions that pop on the word. New for NC01:

- **The stack rising.** Five objects out of the paper in sequence, each on its phrase, each with its own material and a
  contact shadow that grows with it. The camera drifts along the row as they appear. This is the shot people remember.
- **The name roll.** A nameplate whose letters roll odometer-style from one name to another, and a wordmark texture on the
  terminal screen that crossfades in sync. Re-badging, not repainting.
- **The pull-under.** A camera move that drops below a floating slab to reveal what holds it up. A flight, not a cut.
- **The payment path.** A yellow line that draws along the floor from a tap to a bank tile, through the pillars, with a
  dot running it. The abstract version of "the money landing".
- **Twin tables.** Two slabs whose rows tick in together, so the difference between the modes is read in one glance.
- **The pull-back to the whole world.** The last flight climbs until every section is in frame at once. The viewer sees
  the argument as one object.

Transitions are all camera flights, 0.8 s, eased in and out, starting just after the last word of a section; the next
heading rises mid-flight so it is up on landing. No cuts, no wipes, no fades between sections. A blurred element never
moves; there is no blur here except the soft shadows.

## Objects — what exists and what is new

Existing (`motion/lib/objects3d.js`, `glass.js`): `neroTerminal()`, `street()`, `pillars()`, `tiles()`, `phone()`,
`van()`, `paymentCard()`, the glass slab material, `rise()` / `sink()`.

New for NC01: `brandTerminal()` — `neroTerminal()` with a swappable screen texture (wordmark → placeholder mark, never a
real brand); `dashboardSlab()` — a large glass slab with an address bar, a logo slot and ticking merchant rows drawn to a
canvas texture; `ledgerStrip()` — a strip that ticks a row and takes a SETTLED stamp; `docStamp()` — a sheet that rises and
takes a stamp; `nameplate()` — the hanging sign with odometer letters (PP02's street nameplate, generalised); `pathLine()`
— the yellow payment path drawn along the floor. The van gets a ladder rack option. All matte, soft-lit, one shadow each.

## Sound

A new bed: modern, light, a pulse rather than a strum, about 100 bpm, no vocals, no hook, constant tempo (Eleven Music
v2, one generation, ledger row). Effects from `video/library/sfx/`: five soft rises for the stack, the odometer roll,
the typewriter under the address bar, the row ticks, the stamp thuds, the pillars growing, the path's dot arriving, the
nameplate's hinge. None twice in a row. Master −14 LUFS / −1.5 dBTP.

## Crops and length

About 80 s after tightening. **16:9 first** for LinkedIn, rendered without captions (`?caps=0`), then 4:5 with captions
for Meta, then 1:1 if wanted. Each crop is around 35 minutes of render on this box; they run one after another.

## The LinkedIn post that carries it (goes into `posts.js` as L12 on approval)

> You don't have to build a payments company to run one.
>
> The terminals, the till software, the settlement, the compliance and the support desk already exist. We built them for
> NeroPay. NeroConnect lets a software company, an EPOS installer or anyone looking after a group of merchants run all of
> it under their own name: one dashboard, your logo, your domain, your branding on the terminal.
>
> Two ways in. Connected mode, under the NeroPay name, is the simpler start. Platform mode is your brand and your pricing,
> with more of the responsibility.
>
> Who it isn't for: three cafés. That's the partner programme, one introduction and nothing to run. And platform mode can
> need its own regulatory permissions, which is a conversation before a contract, not after.
>
> Eighty seconds on how it fits together. The documentation is public at docs.neropay.app.
>
> Voice generated with AI.

Tue–Thu before 9. Native upload. The disclosure line is the last line of the post, per rail 4 at upload.

## What I need from Faisal

1. **The script**, or edits to it. Read it aloud once; anything that would sound odd across a desk gets cut.
2. **"Free to set up" — in or out?** If there is no fee to become a NeroConnect platform and that is public and true for
   every platform, one sentence goes in after "You sign up as a platform". If it is negotiated per platform, it stays out
   (rail 10).
3. **The placeholder brand.** The terminal and dashboard will carry a neutral mark reading YOUR BRAND. If you would rather
   see a made-up example brand (a fictional café group, say), name it and I'll draw it — never a real one.
4. **Credits.** The take is about 1,100–1,300 credits; a 90-second bed about 1,500–2,500. Together that is over the 3,000
   line the spec asks me to check before spending, so this is the check.
5. **The whole-world pull-back at the end, or the end card straight after the nameplate?** I've written the pull-back; it
   costs about eight seconds and it is the shot that says "everything, in one place".
