/* NeroPay — social posts.
   Add a new post by copying an object and changing the fields.
   channel: "linkedin" | "meta"   pillar: Statement | Street | Product | Merchant | Partner
   blocked: false, or a string explaining what must happen first.
   sketch.type: reel | carousel | statcard | photo | none                     */

window.POSTS = [

/* ============================ LINKEDIN — posted as NeroPay ============================ */
{
  id: "L1", channel: "linkedin", pillar: "Street", format: "Photo + text",
  date: "Thu 10 Sep", blocked: false,
  title: "98 in 800 metres",
  copy: "There are 98 food businesses in 800 metres of Wilmslow Road.\n\nWe counted them. Roughly twelve every hundred metres — Jordanian, Lebanese, Kurdish, Iranian, Afghan, and the Pakistani restaurants that have been there thirty years.\n\nWe work in payments, so we notice card machines. Walk that road and you'll see six or seven different providers in a morning. Almost nobody has changed theirs in years.\n\nNot because they're locked in. Most aren't. They just have forty other things to deal with before the card machine, and nobody has ever sat down and gone through the bill with them.\n\nThat's most of the job, really. Not selling. Reading a statement out loud until the number makes sense.\n\nWe're on that road most weeks.",
  creative: "One photograph taken on the day, of the actual street. Not stock, not a graphic. Phone camera, landscape, mid-morning when the shutters are up and the light is flat. Slightly imperfect beats polished — the post depends on being believed, and a too-good photo reads as a library shot.",
  why: "Opens with a real number nobody else has. Local knowledge before product. The offer is one line at the bottom, framed as something we do anyway.",
  sketch: { type: "photo", alt: "Wilmslow Road shopfronts, landscape",
    shapes: [[10,44,42,58],[58,32,52,70],[116,48,40,54],[162,40,32,62]],
    focus: [84,60], note: "shopfronts fill the frame · no sky · sign text legible",
    cap: "Landscape. Row of shopfronts, camera at eye level, no sky. Signage legible — that's what makes it Rusholme rather than anywhere." }
},
{
  id: "L2", channel: "linkedin", pillar: "Statement", format: "Stat card + text",
  date: "Mon 14 Sep", blocked: false,
  title: "The pub got a cut. The takeaway didn't.",
  copy: "In April, the 40% retail, hospitality and leisure rates relief ended.\n\nWhat replaced it gave pubs a 15% cut and a three-year freeze. Restaurants, cafés, bars and takeaways were excluded.\n\nSo a pub and the takeaway forty yards away — same street, same customers — went into this year on completely different terms.\n\nAdd the National Living Wage at £12.71, the 18-to-20 rate up 8.5%, employer NI at 15% from a £5,000 threshold, and food inflation at 4–5%.\n\nResult: 16% of independent operators describe themselves as optimistic. In February it was 51%.\n\nNobody in payments can do anything about rates or wages, and anyone saying otherwise is selling something.\n\nBut of all the lines on a small hospitality cost base right now, card processing is one of the very few that's genuinely negotiable — and one of the very few most people have never looked at.\n\nSmall and available beats large and impossible.",
  creative: "Single stat card, 1:1. Charcoal ground, one yellow figure, one hairline rule. '51% → 16%' with the caption underneath. No logo lockup, no stock photo, no icons. The number is the whole design.",
  why: "Useful industry commentary that happens to end where the product is. The disclaimer in the middle is what buys permission for the last two lines.",
  sketch: { type: "statcard", big: "51% → 16%", line1: "Independent operators describing", line2: "themselves as optimistic · Feb → Aug 2026", src: "Correct as of 18 Aug 2026",
    cap: "1:1 stat card. Charcoal, one yellow number, everything else grey. Works at thumbnail size, which is the only size that matters in a feed." }
},
{
  id: "L3", channel: "linkedin", pillar: "Statement", format: "Text only",
  date: "Thu 17 Sep", blocked: false,
  title: "We tell some merchants to stay put",
  copy: "We tell some merchants to stay where they are.\n\nNot often, but it happens most weeks. Someone sends a statement, we work out what they're actually paying all-in, and it's already good. Under about 1.4% with no terminal rental is a fine deal and there's nothing useful we can add.\n\nSometimes it's worse than that for us. If your average sale is under about £18, a flat-rate provider usually beats our standard pricing — a fixed pence charge lands harder on a £6 coffee than a £60 dinner. SumUp publish a 0.99% plan that beats what we'd quote most merchants at volume.\n\nWe could say none of that and probably nobody would notice.\n\nThe reason we do: if we win a merchant who was always going to be cheaper elsewhere, they work it out in about four months, they leave, and they tell people.\n\nSmall business communities are small. In Rusholme, everyone knows everyone. There's no version of this that survives being clever with people who talk to each other every day.",
  creative: "Nothing. No image. An image makes it look produced rather than said, and that undercuts the entire point.",
  why: "The highest-trust post available, and every word is true — the video scripts concede the same points. Naming a competitor's better plan is the proof the rest isn't marketing.",
  sketch: { type: "none", cap: "Text only. Deliberately." }
},
{
  id: "L4", channel: "linkedin", pillar: "Partner", format: "Video + text",
  date: "Mon 28 Sep", blocked: "Eray must sign off the partner incentive model, and the Stripe agreement question on third-party introducers is still open. No figures in the post either way.",
  title: "The objection nobody says out loud",
  copy: "A question we've started asking wholesalers: what happens to your customer after you introduce them to a supplier?\n\nIt's the objection nobody says out loud. A cash-and-carry owner has had some of these accounts fifteen years. The money isn't the issue — handing over a relationship and losing control of it is.\n\nSo, plainly, how ours works:\n\nYou make an introduction. That's the whole ask. No selling, no paperwork, no explaining how card processing works.\n\nWe speak to them. If their current deal is already good, we tell them so and they stay put. We don't get paid for those. We do it anyway.\n\nIf they move, they're still your customer. We don't see who else you supply, we don't market to your customer list, and we never contact anyone you haven't introduced.\n\nTerms and the actual numbers are at partners.neropay.app — better read at your own pace than in a post.\n\nIf you supply independent hospitality in Greater Manchester, message us and we'll send it over.",
  creative: "Video A3, vertical cut, 60–90s. That video was built for exactly this objection. AI-presenter caption visible in the first three seconds. Native upload, not a YouTube link — LinkedIn buries external links.",
  why: "Leads with the partner's real fear instead of the incentive. Every number lives behind a link, which is both better persuasion and the compliance position.",
  sketch: { type: "reel", subject: "presenter", alt: "presenter to camera, partner objection",
    beats: ["hook: what happens to your customer", "the honest answer", "you keep the relationship", "link, no figures"],
    cap: "Vertical cut of A3. Presenter centred, eyes to lens. No figures on screen anywhere — they live behind the link." }
},
{
  id: "L5", channel: "linkedin", pillar: "Street", format: "Text only",
  date: "Mon 7 Sep", blocked: false,
  title: "Awards week",
  copy: "Thirty Greater Manchester businesses are shortlisted at the Asian Restaurant Awards today, and the British Kebab Awards semi-finals are at Speaker's House tomorrow.\n\nTwo things strike us about that.\n\nFirst: the independent restaurant sector spent this year being told how bad things are — 963 forecast closures, rates relief pulled, wages up — and thirty businesses from one city region are still good enough to be shortlisted nationally.\n\nSecond: almost none of them will post about it. We've been through the list. Most have a Facebook page untouched since 2023 and no website at all.\n\nIf you're on that shortlist, or you know someone who is — it's worth a photo and a post. Your customers want to know. It costs nothing, and it's the kind of thing that brings people through the door in November when it's raining.\n\nCongratulations to everyone on it.",
  creative: "No image before the event. Post a photo of the room afterwards as a follow-up — the venue and the crowd, not a posed shot of anyone from NeroPay.",
  why: "Zero selling, timed to a week when the exact target segment is paying attention. The advice in the middle is real advice they can act on today.",
  sketch: { type: "none", cap: "Text only on the day. Follow up with one room photo." }
},
{
  id: "L6", channel: "linkedin", pillar: "Statement", format: "Image + text",
  date: "Wed 23 Sep", blocked: false,
  title: "The ninety-second calculation",
  copy: "Most merchant statements are designed to be filed, not read.\n\nHere's what makes one readable. Ignore every percentage printed on the page. Take the total you were charged, divide by the total you took in card payments, multiply by a hundred.\n\nThat's your effective rate. It's the only number that compares one provider to another, and it's almost never the number on the front.\n\nOn this example — illustrative, not a real merchant — the advertised rate is 'from 0.50%'. The effective rate is 1.09%.\n\nThe gap is authorisation fees at 4p a transaction, terminal rental, a PCI charge and a settlement fee per payout. Individually small. £308 on the month.\n\nThe calculation takes about ninety seconds and you can do it on the last statement in your inbox.",
  creative: "The Northwick specimen statement, exported as a still. Crop to the charges block so the small lines are legible at feed size. Must carry 'SPECIMEN — illustrative example, not a real statement'. Never a real one, even redacted.",
  why: "Gives the whole method away. A reader who does the sum and finds a good number isn't a lost lead — they're someone who now trusts where the method came from.",
  sketch: { type: "photo", alt: "specimen statement crop",
    shapes: [[14,12,172,26],[14,44,172,12],[14,60,172,12],[14,76,172,12],[14,92,172,14]],
    focus: [170,99], note: "crop to the charges block · specimen banner must stay in frame",
    cap: "Crop of the specimen statement. The total in the bottom right is the focal point. Specimen banner stays visible — non-negotiable." }
},
{
  id: "L7", channel: "linkedin", pillar: "Partner", format: "Text only",
  date: "Fri 2 Oct", blocked: false,
  title: "Writing down what's in our heads",
  copy: "We're building out a remote team this quarter, and writing the role descriptions has forced a useful exercise.\n\nTo hire someone, you have to explain what the job is. To explain what the job is, you have to admit what's currently held in one person's head and written down nowhere.\n\nIn our case: how a terminal gets set up for a white-label partner versus a standard merchant. How a flagged payout gets reviewed. What actually happens between a lead arriving and a merchant taking their first payment.\n\nAll of it worked fine while three people did everything. None of it survives a fourth.\n\nSo the honest answer to 'what are you working on this week' is: writing down things we already know, in the order someone else would need them.\n\nNot glamorous. Probably the highest-value thing we'll do this month.",
  creative: "Text only, or one plain photo of a whiteboard with a process sketch on it. Nothing legible that touches a real merchant, a real payout or a real account.",
  why: "Signals growth without claiming it, which is what an investor-adjacent audience actually reads. Doubles as a soft recruitment post.",
  sketch: { type: "none", cap: "Text only, or a whiteboard photo with nothing real on it." }
},
{
  id: "L8", channel: "linkedin", pillar: "Statement", format: "Text only",
  date: "Wed 7 Oct", blocked: false,
  title: "Correcting ourselves",
  copy: "We've been saying something slightly wrong and we want to correct it.\n\nThe line we'd been using: competitors charge for their POS software and we don't. It sounds great on a doorstep.\n\nIt isn't accurate. Square, SumUp and PayPal all have a free POS tier, and those tiers work. Plenty of small businesses run on them happily and never pay a penny.\n\nThe accurate version is narrower. The paid tiers are where most growing restaurants end up — Square for Restaurants Plus is £69 a month per location, SumUp POS Plus £39 plus VAT — and that's the comparison worth making. Ours is included with the terminal at every tier.\n\nNarrower, less punchy, true.\n\nWhy correct it publicly: the person we'd be overstating it to is a restaurant owner already using Square's free tier. They'd know in four seconds, and everything else we said would go in the bin with it.\n\nFigures correct as of 18 August 2026, from each provider's own pricing page.",
  creative: "Text only.",
  why: "Publicly correcting your own sales claim is rare and highly legible. It also pre-empts the exact objection a knowledgeable merchant would raise.",
  sketch: { type: "none", cap: "Text only." }
},

/* ============================ INSTAGRAM + FACEBOOK ============================ */
{
  id: "M1", channel: "meta", pillar: "Statement", format: "Reel · 45s",
  date: "Tue 8 Sep", blocked: false,
  title: "The only number that compares",
  copy: "The rate on the front of a merchant statement is not what the business pays.\n\nTotal charged ÷ total card takings × 100. That's the effective rate — the only figure that compares one provider against another.\n\nFull breakdown, line by line, on YouTube. Link in bio.\n\nIllustrative example, not a real statement. Correct as of 18 Aug 2026.",
  creative: "Vertical cut from B1. Open on the specimen statement, presenter enters at 3s. Burned-in subtitles — most of this is watched on mute. AI-presenter caption in the first three seconds. No music bed under the presenter.",
  why: "Lead Reel of the whole plan. Publish the week B1 goes live so 'link in bio' actually resolves to something.",
  sketch: { type: "reel", subject: "graphic", alt: "statement figures building",
    beats: ["hook: not what you're paying", "the sum, on screen", "effective rate revealed", "link in bio"],
    cap: "9:16. Statement fills the frame, figures build row by row, presenter cuts in at 3s. Subtitles always on." }
},
{
  id: "M2", channel: "meta", pillar: "Statement", format: "Carousel · 5 cards",
  date: "Wed 16 Sep", blocked: false,
  title: "Four things to find on your statement",
  copy: "Four things worth finding on a merchant statement.\n\n1 — The effective rate. Total charged ÷ total card takings × 100.\n2 — Authorisation fees. Pence per transaction, rarely in the headline rate.\n3 — Terminal rental. Whether the machine is owned or hired, and what happens to it if the account closes.\n4 — Monthly extras. PCI, statement fees, minimum monthly charges. Small individually. Not small annually.\n\nSave this for the next time a statement lands.\n\nIllustrative figures. Correct as of 18 Aug 2026.",
  creative: "Five cards at 4:5. Card 1 the title. Cards 2–5 one item each, with the relevant fragment of the specimen statement enlarged and a yellow underline on the line in question. Charcoal ground, white type, yellow as the only accent. This becomes the house carousel template — build it once properly.",
  why: "Mirrors the 'four things' section already on the merchant landing page, so print QR traffic and social land on the same framing.",
  sketch: { type: "carousel", cards: ["title", "effective rate", "auth fees", "rental"],
    cap: "Card 1 title, cards 2–5 one item each. Yellow underline marks the line being discussed." }
},
{
  id: "M3", channel: "meta", pillar: "Product", format: "Reel · 15s",
  date: "Fri 11 Sep", blocked: false,
  title: "Terminal on a counter",
  copy: "Card machine, full EPOS software, no monthly software fee.\n\nProduct grid, staff logins, kitchen display, Z-reports, online ordering, table bookings. Included with the terminal.\n\nneropay.app",
  creative: "Locked-off static shot. Terminal on a real counter in a real independent business, mid-service. Everything sharp front to back — no bokeh anywhere. Natural light. The terminal is the only branded object in frame: no NeroPay cards, pens, mugs or props. Hands enter, one tap completes, hands leave. That's the whole action.",
  why: "Deliberately short and unglamorous. This is the post that makes the grid look like a working company rather than a content channel.",
  sketch: { type: "reel", subject: "product", alt: "terminal on counter, locked off",
    beats: ["one tap", "receipt or screen confirm", "hands leave frame", "neropay.app"],
    cap: "Locked-off, everything sharp, terminal is the only branded object. 15 seconds, one action." }
},
{
  id: "M4", channel: "meta", pillar: "Statement", format: "Reel · 60s",
  date: "Mon 21 Sep", blocked: false,
  title: "A £6 coffee and a £60 dinner",
  copy: "A £6 coffee and a £60 dinner are not the same transaction, and they shouldn't be priced as if they are.\n\nA fixed pence charge barely registers on sixty pounds. On six, it's most of the cost.\n\nWhich is why the right pricing shape depends on your average sale — and why some businesses are genuinely better off on a flat rate elsewhere.\n\nFull explanation on YouTube. Link in bio.\n\nCorrect as of 18 Aug 2026.",
  creative: "Vertical cut from B2. The two-column build — £6 coffee against £60 dinner, effective rate climbing on one side — is the whole visual. Hold on the crossover figure for a full two seconds; that's the frame people screenshot.",
  why: "Concedes a competitor advantage inside a Reel. Intentional, and the reason this one gets shared rather than scrolled.",
  sketch: { type: "reel", subject: "graphic", alt: "two-column comparison building",
    beats: ["£6 vs £60 side by side", "fixed fee added to both", "effective rates diverge", "crossover figure held"],
    cap: "Two columns, figures climbing on one side. Hold the crossover number for two full seconds." }
},
{
  id: "M5", channel: "meta", pillar: "Product", format: "Carousel · 8 cards",
  date: "Fri 25 Sep", blocked: false,
  title: "Everything included",
  copy: "Everything that comes with a NeroPay terminal, at no extra monthly software cost:\n\nNeroPOS — full till, product grid, staff management, kitchen display, Z-reports\nNeroWeb — your own online ordering site, no commission per order\nNeroBooking — tables and appointments\nNero QR Pay — collect by QR code\nNeroAI — tax and payment analytics\nNeroTrade — wholesale and trade accounts\nNeroGym — memberships and class scheduling\n\nOne card machine. All of it.\n\nneropay.app",
  creative: "Eight cards at 4:5, one product per card. Screenshots from a demo account with fake data — never the live dashboard, never real transactions. Same charcoal template as M2. Card 8 is the terminal photograph, closing the set.",
  why: "The most saveable post in the plan and the most likely to be forwarded between business owners. Worth pinning to the profile.",
  sketch: { type: "carousel", cards: ["title", "NeroPOS", "NeroWeb", "…+5"],
    cap: "Eight cards. Demo-account screenshots only. Card 8 closes on the terminal itself." }
},
{
  id: "M6", channel: "meta", pillar: "Street", format: "Reel · 20s",
  date: "Fri 18 Sep", blocked: false,
  title: "Wilmslow Road, Tuesday",
  copy: "98 food businesses in 800 metres.\n\nRusholme on a Tuesday afternoon — probably the densest food strip in the North of England.\n\nWe're out on it most weeks.",
  creative: "Phone footage, walking, vertical, no narration. Shopfronts, signage, the texture of the street. Ambient sound only — traffic and voices. No music, no captions beyond a single opening title. Shot on a field day; costs nothing but remembering to film.",
  why: "No competitor with a national marketing budget can produce this. Cheapest and most defensible content NeroPay owns.",
  sketch: { type: "reel", subject: "street", alt: "walking past shopfronts",
    beats: ["opening title: 98 in 800m", "walk, no narration", "ambient sound only", "no CTA"],
    cap: "Handheld, walking, vertical. Ambient audio. One title card and nothing else." }
},
{
  id: "M7", channel: "meta", pillar: "Statement", format: "Carousel · 6 cards",
  date: "Mon 5 Oct", blocked: false,
  title: "Before you sign anything",
  copy: "Five questions worth asking before signing a card processing agreement.\n\n1 — How long is the minimum term?\n2 — What's the exact figure to leave early? Ask for it in writing.\n3 — Do I own the terminal, or am I hiring it?\n4 — What happens to the machine if I close the account, and what's the charge if it isn't returned?\n5 — Can the rate change during the term, and how would I be told?\n\nA contract isn't automatically a bad deal. Not knowing the exit number is.\n\nCorrect as of 18 Aug 2026.",
  creative: "Six cards, same template. One question per card, large type, plenty of space. Final card carries the 'a contract isn't automatically bad' line — the concession is the payoff, so give it its own card.",
  why: "From B3. No competitor named in the caption on purpose — the video does that with dated, sourced citations, and a caption can't carry the substantiation.",
  sketch: { type: "carousel", cards: ["title", "Q1", "Q2", "…+3"],
    cap: "One question per card, big type, lots of air. Last card is the concession." }
},
{
  id: "M8", channel: "meta", pillar: "Merchant", format: "Reel · 60s",
  date: "Wed 30 Sep", blocked: "Written consent from Arman covering filming, his name, the business name and every channel it appears on — signed before the shoot, not after. No negotiated rate, no commercial terms, no transaction data in the video or caption.",
  title: "Armenian Taverna",
  copy: "Arman runs the Armenian Taverna on Albert Square.\n\nTwo terminals, the full till system, and a menu we built with him item by item.\n\nFilmed in his restaurant, in his words.",
  creative: "The mid-September shoot. Real filming, real merchant, real premises — the one asset in the whole plan that isn't generated. Keep the caption short: the video is the content and anything written over it dilutes it.",
  why: "The single most valuable post available. First real social proof the company has ever had. Everything else here is an argument; this is evidence.",
  sketch: { type: "reel", subject: "presenter", alt: "merchant to camera in his restaurant",
    beats: ["merchant introduces himself", "what changed", "one specific detail", "no hard CTA"],
    cap: "Real footage, real merchant. Shot in his restaurant during quiet service. No script — questions off camera." }
},
{
  id: "M9", channel: "meta", pillar: "Product", format: "Reel · 20s",
  date: "Mon 12 Oct", blocked: "Flex pricing is unconfirmed and must not be quoted. The caption deliberately carries no price — keep it that way until Eray signs it off.",
  title: "Flex, for markets and stalls",
  copy: "Built for trading where there's no counter and no reliable wi-fi.\n\nNeroPay Flex — 5.5in screen, built-in receipt printer, wi-fi, 4G and offline mode.\n\nChristmas market season starts in November. Kit gets decided in October.\n\nneropay.app",
  creative: "Flex held in one hand, outdoors, overcast Manchester light. Receipt printing is the hero shot — it's the feature the Pro doesn't have and the one a market trader actually needs. Everything sharp, locked off, NeroPay branding only. Never reference Verifone or Stripe.",
  why: "Timed for October because Manchester's 225+ market stalls across nine city sites finalise kit in September–October, before the ~6 Nov opening.",
  sketch: { type: "reel", subject: "product", alt: "Flex in hand outdoors, receipt printing",
    beats: ["held in one hand", "tap completes", "receipt prints — hero shot", "neropay.app"],
    cap: "Outdoors, overcast. The receipt emerging is the money shot. No price on screen." }
},
{
  id: "M10", channel: "meta", pillar: "Street", format: "Reel or carousel",
  date: "Fri 16 Oct", blocked: "Posts from the NeroPay Page only. Elif's personal profile is restricted until 18 September and nothing commercial goes out from a personal profile regardless. Product-led only — no earnings figures, no partner-programme content in any language.",
  title: "Turkish-language product post",
  copy: "Kart ödeme terminali ve ücretsiz yazarkasa yazılımı.\n\nÜrün ekranı, personel yönetimi, mutfak ekranı, Z raporu, online sipariş ve rezervasyon — terminale dahil, aylık yazılım ücreti yok.\n\nManchester ve çevresindeki işletmelere kurulum ve destek sağlıyoruz.\n\nneropay.app",
  creative: "Same product footage as M3 or M5 with Turkish burned-in subtitles. No separate shoot. Elif reviews terminology before publishing — POS cihazı, yazarkasa yazılımı, ekstre.",
  why: "Language is one of the few hard targeting constraints Meta still honours, and the Turkish-Cypriot cluster around Stretford and Moss Side is the least-worked lead in the territory list.",
  sketch: { type: "reel", subject: "product", alt: "product footage with Turkish subtitles",
    beats: ["same footage as M3", "Turkish burned-in subs", "no new shoot", "Page only"],
    cap: "Reuse M3 or M5 footage. Only the subtitles change. Elif checks terminology first." }
}

];
