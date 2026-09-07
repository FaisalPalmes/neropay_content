/* NeroPay — social posts.
   Add a new post by copying an object and changing the fields.
   channel: "linkedin" | "meta"   pillar: Statement | Street | Product | Merchant | Partner
   blocked: false, or a string explaining what must happen first.
   sketch.type: reel | carousel | statcard | photo | none
   assets: the creative drawn for this post, rendered by overlays.js and downloadable on social.html.
     { t:"stat",  big, line, src, size }            one figure, one line, a source
     { t:"quote", text, sub, size }                 a pull line — optional for text-only posts
     { t:"cards", cards:[{h, b}], size }            a carousel, one asset per card (4:5)
     { t:"cover", title, sub, ai:true, size }       a Reel cover / opening frame (9:16)
     { t:"ref",   id }                              an asset that already exists on youtube.html
   size: "sq" 1080×1080 · "pt" 1080×1350 · "st" 1080×1920. Charcoal ground, white type, yellow accent,
   wordmark bottom-left. No money figure ever dominates an image.                                   */

window.POSTS = [

/* ============================ LINKEDIN — posted as NeroPay ============================ */
{
  id: "L1", channel: "linkedin", pillar: "Street", format: "Photo + text",
  date: "Thu 10 Sep", blocked: false,
  title: "98 in 800 metres",
  copy: "98 food businesses in 800 metres of Wilmslow Road. We counted.\n\nJordanian, Lebanese, Kurdish, Iranian, Afghan, and the Pakistani places that were there before any of them.\n\nWe work in payments, so we notice card machines. Six or seven providers on one road. Almost nobody has changed theirs in years.\n\nNot because they're locked in. Most aren't. They've got forty things to do before the card machine, and nobody's ever sat down and read the bill with them.\n\nThat's most of the job. Not selling. Reading a statement out loud until the number makes sense.\n\nWe're on that road most weeks.",
  creative: "One photograph taken on the day, of the actual street. Not stock, not a graphic. Phone camera, landscape, mid-morning when the shutters are up and the light is flat. Slightly imperfect beats polished — the post depends on being believed. The stat card below is the fallback if the photo doesn't land, not the plan.",
  why: "Opens with a number nobody else has. Local knowledge before product. The offer is one line at the bottom, framed as something we do anyway.",
  sketch: { type: "photo", alt: "Wilmslow Road shopfronts, landscape",
    shapes: [[10,44,42,58],[58,32,52,70],[116,48,40,54],[162,40,32,62]],
    focus: [84,60], note: "shopfronts fill the frame · no sky · sign text legible",
    cap: "Landscape. Row of shopfronts, camera at eye level, no sky. Signage legible — that's what makes it Rusholme rather than anywhere." },
  assets: [
    { t: "stat", size: "sq", big: "98", line: "food businesses in 800 metres of Wilmslow Road", src: "NeroPay count · August 2026" }
  ]
},
{
  id: "L2", channel: "linkedin", pillar: "Statement", format: "Stat card + text",
  date: "Mon 14 Sep", blocked: false,
  title: "The pub got a cut. The takeaway didn't.",
  copy: "In April the 40% rates relief ended.\n\nPubs got a 15% cut and a three-year freeze. Restaurants, cafés, bars and takeaways got nothing.\n\nSame street, same customers, different year.\n\nAdd the Living Wage at £12.71, the 18-to-20 rate up 8.5%, employer NI at 15% from £5,000.\n\nResult: 16% of independent operators call themselves optimistic. In February it was 51%.\n\nNobody in payments can fix rates or wages. Anyone who says they can is selling something.\n\nBut of every line on a small hospitality cost base, card processing is one of the few that's negotiable. And one of the few nobody's looked at.\n\nSmall and available beats large and impossible.",
  creative: "Single stat card, 1:1. Charcoal ground, one yellow figure, one hairline rule. '51% → 16%' and the caption. No logo lockup beyond the wordmark, no stock photo, no icons. The number is the whole design.",
  why: "Useful industry commentary that happens to end where the product is. The disclaimer in the middle is what buys permission for the last two lines.",
  sketch: { type: "statcard", big: "51% → 16%", line1: "Independent operators describing", line2: "themselves as optimistic · Feb → Aug 2026", src: "Correct as of 18 Aug 2026",
    cap: "1:1 stat card. Charcoal, one yellow number, everything else grey. Works at thumbnail size, which is the only size that matters in a feed." },
  assets: [
    { t: "stat", size: "sq", big: "51% → 16%", line: "independent hospitality operators describing themselves as optimistic, February to August 2026", src: "Correct as of 18 Aug 2026" }
  ]
},
{
  id: "L3", channel: "linkedin", pillar: "Statement", format: "Text only",
  date: "Thu 17 Sep", blocked: false,
  title: "We tell some merchants to stay put",
  copy: "We tell some merchants to stay put.\n\nMost weeks someone sends a statement, we work out what they're actually paying, and it's already good. Nothing useful to add. We say so.\n\nSometimes it's worse than that for us. If your average sale is under about £18, a flat-rate provider usually beats our standard pricing. A fixed pence charge lands harder on a £6 coffee than a £60 dinner. SumUp's 0.99% plan beats what we'd quote most merchants at volume. Correct as of 18 August 2026.\n\nWe could keep quiet about that.\n\nWe don't, because if we win a merchant who was always going to be cheaper elsewhere, they work it out in four months, leave, and tell people.\n\nIn Rusholme everyone knows everyone. There's no version of this that survives being clever with people who talk to each other every day.",
  creative: "Nothing. No image. An image makes it look produced rather than said, and that undercuts the point. The quote card exists only if the post gets reused later as a carousel opener.",
  why: "The highest-trust post available, and every word is true — the video scripts concede the same points. Naming a competitor's better plan is the proof the rest isn't marketing.",
  sketch: { type: "none", cap: "Text only. Deliberately." },
  assets: [
    { t: "quote", size: "sq", text: "We tell some merchants to stay put.", sub: "Most weeks. On purpose." }
  ]
},
{
  id: "L4", channel: "linkedin", pillar: "Partner", format: "Video + text",
  date: "Mon 28 Sep", blocked: "Eray must sign off the partner incentive model, and the Stripe agreement question on third-party introducers is still open. No figures in the post either way.",
  title: "The objection nobody says out loud",
  copy: "A question we ask wholesalers: what happens to your customer after you introduce them to a supplier?\n\nIt's the objection nobody says out loud. Fifteen-year accounts. The money isn't the worry. Losing the relationship is.\n\nSo, plainly:\n\nYou make an introduction. That's the whole ask. No selling, no paperwork.\n\nWe talk to them. If their current deal is good, we tell them and they stay put. We don't get paid for those. We do it anyway.\n\nIf they move, they're still yours. We don't see who else you supply, we don't market to your list, we never contact anyone you haven't introduced.\n\nTerms and the numbers are at partners.neropay.app. Better read at your own pace than in a post.\n\nSupply independent hospitality in Greater Manchester? Message us.",
  creative: "Video A3, vertical cut, 60–90s. That video was built for exactly this objection. AI-presenter caption visible in the first three seconds. Native upload, not a YouTube link — LinkedIn buries external links. The cover below is the opening frame.",
  why: "Leads with the partner's real fear instead of the incentive. Every number lives behind a link, which is both better persuasion and the compliance position.",
  sketch: { type: "reel", subject: "presenter", alt: "presenter to camera, partner objection",
    beats: ["hook: what happens to your customer", "the honest answer", "you keep the relationship", "link, no figures"],
    cap: "Vertical cut of A3. Presenter centred, eyes to lens. No figures on screen anywhere — they live behind the link." },
  assets: [
    { t: "cover", size: "st", ai: true, title: "What happens to your customer after you introduce them?", sub: "Explained by NeroPay · partners" },
    { t: "ref", id: "AI/9x16" }
  ]
},
{
  id: "L5", channel: "linkedin", pillar: "Street", format: "Text only",
  date: "Mon 7 Sep", blocked: false,
  title: "Awards week",
  copy: "Thirty Greater Manchester businesses are shortlisted at the Asian Restaurant Awards today. The British Kebab Awards semi-finals are tomorrow.\n\nTwo things about that.\n\nOne: this sector spent the year being told how bad things are. Thirty businesses from one city region still made a national shortlist.\n\nTwo: almost none of them will post about it. We checked. Most have a Facebook page last touched in 2023 and no website.\n\nIf you're on that list, or know someone who is: one photo, one post. Your customers want to know. It's free, and it's what fills tables on a wet Tuesday in November.\n\nCongratulations to everyone on it.",
  creative: "No image before the event. Post a photo of the room afterwards as a follow-up — the venue and the crowd, not a posed shot of anyone from NeroPay.",
  why: "Zero selling, timed to a week when the exact target segment is paying attention. The advice in the middle is real advice they can act on today.",
  sketch: { type: "none", cap: "Text only on the day. Follow up with one room photo." },
  assets: [
    { t: "quote", size: "sq", text: "Thirty from one city region. Post about it.", sub: "Asian Restaurant Awards · British Kebab Awards · September 2026" }
  ]
},
{
  id: "L6", channel: "linkedin", pillar: "Statement", format: "Image + text",
  date: "Wed 23 Sep", blocked: false,
  title: "The ninety-second calculation",
  copy: "Most merchant statements are designed to be filed, not read.\n\nHere's how to read one. Ignore every percentage on the page. Take the total you were charged. Divide by what you took on cards. Multiply by a hundred.\n\nThat's your effective rate. The only number that compares one provider to another. Almost never the number on the front.\n\nOn this example (illustrative, not a real merchant) the advertised rate is \"from 0.50%\". The effective rate is 1.09%.\n\nThe gap: 4p per transaction to authorise, terminal rental, a PCI charge, a fee per payout. Small lines. £308 on the month.\n\nNinety seconds. Last statement in your inbox. Go.",
  creative: "The Northwick specimen statement, exported as a still. Crop to the charges block so the small lines are legible at feed size. The SPECIMEN strip must stay in frame. Never a real one, even redacted. The 0.50% → 1.09% card is the alternative if the crop is unreadable on a phone.",
  why: "Gives the whole method away. A reader who does the sum and finds a good number isn't a lost lead — they're someone who now trusts where the method came from.",
  sketch: { type: "photo", alt: "specimen statement crop",
    shapes: [[14,12,172,26],[14,44,172,12],[14,60,172,12],[14,76,172,12],[14,92,172,14]],
    focus: [170,99], note: "crop to the charges block · specimen banner must stay in frame",
    cap: "Crop of the specimen statement. The total in the bottom right is the focal point. Specimen banner stays visible — non-negotiable." },
  assets: [
    { t: "ref", id: "STATEMENT/TIERED" },
    { t: "stat", size: "sq", big: "0.50% → 1.09%", line: "advertised rate → what was actually paid, on one illustrative month", src: "Specimen statement · not a real merchant · Aug 2026" }
  ]
},
{
  id: "L7", channel: "linkedin", pillar: "Partner", format: "Text only",
  date: "Fri 2 Oct", blocked: false,
  title: "Writing down what's in our heads",
  copy: "We're building a remote team this quarter. Writing the job descriptions has been humbling.\n\nTo hire someone you have to explain the job. To explain the job you have to admit what lives in one person's head and nowhere else.\n\nFor us: how a terminal gets set up for a white-label partner versus a standard merchant. How a flagged payout gets reviewed. What happens between a lead arriving and a first payment.\n\nAll fine while three people did everything. None of it survives a fourth.\n\nSo this week's work is writing down things we already know, in the order someone else would need them.\n\nNot glamorous. Probably the most valuable thing we'll do this month.",
  creative: "Text only, or one plain photo of a whiteboard with a process sketch on it. Nothing legible that touches a real merchant, a real payout or a real account.",
  why: "Signals growth without claiming it, which is what an investor-adjacent audience actually reads. Doubles as a soft recruitment post.",
  sketch: { type: "none", cap: "Text only, or a whiteboard photo with nothing real on it." },
  assets: [
    { t: "quote", size: "sq", text: "All fine while three people did everything. None of it survives a fourth.", sub: "" }
  ]
},
{
  id: "L8", channel: "linkedin", pillar: "Statement", format: "Text only",
  date: "Wed 7 Oct", blocked: false,
  title: "Correcting ourselves",
  copy: "We've been saying something slightly wrong. Here's the correction.\n\nThe line: competitors charge for POS software and we don't. Sounds great on a doorstep.\n\nIt isn't accurate. Square, SumUp and PayPal all have free POS tiers, and they work. Plenty of businesses run on them and never pay a penny.\n\nThe accurate version is narrower. Growing restaurants tend to end up on the paid tiers. Square for Restaurants Plus is £69 a month per location, SumUp POS Plus £39 plus VAT. That's the comparison worth making. Ours is included with the terminal at every tier.\n\nNarrower. Less punchy. True.\n\nWhy say it publicly: the person we'd be overstating it to is already on Square's free tier. They'd know in four seconds, and everything else we said would go in the bin with it.\n\nFigures correct as of 18 August 2026, from each provider's pricing page.",
  creative: "Text only.",
  why: "Publicly correcting your own sales claim is rare and highly legible. It also pre-empts the exact objection a knowledgeable merchant would raise.",
  sketch: { type: "none", cap: "Text only." },
  assets: [
    { t: "quote", size: "sq", text: "Narrower. Less punchy. True.", sub: "Correcting ourselves · October 2026" }
  ]
},

/* ============================ INSTAGRAM + FACEBOOK ============================ */
{
  id: "M1", channel: "meta", pillar: "Statement", format: "Reel · 45s",
  date: "Tue 8 Sep", blocked: false,
  title: "The only number that compares",
  copy: "The rate on the front of your statement isn't what you pay.\n\nTotal charged ÷ total card takings × 100. That's your effective rate. The only number that compares one provider to another.\n\nLine by line on YouTube. Link in bio.\n\nIllustrative example, not a real statement. Correct as of 18 Aug 2026.",
  creative: "Vertical cut from B1. Open on the cover frame, presenter enters at 3s. Burned-in subtitles — most of this is watched on mute. AI-presenter disclosure in the first three seconds. No music bed under the presenter. The formula overlay from B1 is the end frame.",
  why: "Lead Reel of the whole plan. Publish the week B1 goes live so 'link in bio' actually resolves to something.",
  sketch: { type: "reel", subject: "graphic", alt: "statement figures building",
    beats: ["hook: not what you're paying", "the sum, on screen", "effective rate revealed", "link in bio"],
    cap: "9:16. Statement fills the frame, figures build row by row, presenter cuts in at 3s. Subtitles always on." },
  assets: [
    { t: "cover", size: "st", ai: true, title: "The rate on the front isn't the rate you pay.", sub: "Explained by NeroPay" },
    { t: "ref", id: "B1/OV-4" },
    { t: "ref", id: "AI/9x16" }
  ]
},
{
  id: "M2", channel: "meta", pillar: "Statement", format: "Carousel · 5 cards",
  date: "Wed 16 Sep", blocked: false,
  title: "Four things to find on your statement",
  copy: "Four things to find on your statement.\n\n1. The effective rate. Total charged ÷ total card takings × 100.\n2. Authorisation fees. Pence per transaction. Never in the headline.\n3. Terminal rental. Do you own it, or are you hiring it? What happens to it if you leave?\n4. The monthly extras. PCI, statement fee, minimum monthly charge. Small each. Not small yearly.\n\nSave it for the next statement.\n\nIllustrative figures. Correct as of 18 Aug 2026.",
  creative: "Five cards at 4:5, drawn below. Card 1 the title, cards 2–5 one item each. Charcoal ground, white type, yellow as the only accent. This is the house carousel template — everything after it reuses the same grid.",
  why: "Mirrors the 'four things' section already on the merchant landing page, so print QR traffic and social land on the same framing.",
  sketch: { type: "carousel", cards: ["title", "effective rate", "auth fees", "rental"],
    cap: "Card 1 title, cards 2–5 one item each. Yellow underline marks the line being discussed." },
  assets: [
    { t: "cards", size: "pt", cards: [
      { h: "Four things to find on your statement", b: "Swipe. Then open last month's." },
      { n: "1", h: "The effective rate", b: "Total charged ÷ total card takings × 100. The only number that compares one provider to another." },
      { n: "2", h: "Authorisation fees", b: "Pence per transaction. Never in the headline rate. Ask for it in pence." },
      { n: "3", h: "Terminal rental", b: "Do you own it, or hire it? What happens to the machine if you leave?" },
      { n: "4", h: "The monthly extras", b: "PCI. Statement fee. Minimum monthly charge. Small each. Not small yearly." }
    ] }
  ]
},
{
  id: "M3", channel: "meta", pillar: "Product", format: "Reel · 15s",
  date: "Fri 11 Sep", blocked: false,
  title: "Terminal on a counter",
  copy: "Card machine. Full till software. No monthly software fee.\n\nProduct grid, staff logins, kitchen screen, Z-reports, online ordering, table bookings. Included.\n\nneropay.app",
  creative: "Locked-off static shot. Terminal on a real counter in a real independent business, mid-service. Everything sharp front to back — no bokeh anywhere. Natural light. The terminal is the only branded object in frame. Hands enter, one tap completes, hands leave. That's the whole action. The cover below is the frame before the hands arrive.",
  why: "Deliberately short and unglamorous. This is the post that makes the grid look like a working company rather than a content channel.",
  sketch: { type: "reel", subject: "product", alt: "terminal on counter, locked off",
    beats: ["one tap", "receipt or screen confirm", "hands leave frame", "neropay.app"],
    cap: "Locked-off, everything sharp, terminal is the only branded object. 15 seconds, one action." },
  assets: [
    { t: "cover", size: "st", title: "No monthly software fee.", sub: "Till, staff, kitchen screen, Z-reports, ordering, bookings. Included." }
  ]
},
{
  id: "M4", channel: "meta", pillar: "Statement", format: "Reel · 60s",
  date: "Mon 21 Sep", blocked: false,
  title: "A £6 coffee and a £60 dinner",
  copy: "A £6 coffee and a £60 dinner are not the same transaction. They shouldn't be priced like they are.\n\nA fixed pence charge barely touches sixty pounds. On six, it's most of the cost.\n\nWhich is why the right pricing depends on your average sale, and why some businesses are genuinely better off on a flat rate somewhere else.\n\nFull version on YouTube. Link in bio.\n\nCorrect as of 18 Aug 2026.",
  creative: "Vertical cut from B2. The coffee overlay and the crossover figure are the whole visual. Hold on the crossover for a full two seconds; that's the frame people screenshot.",
  why: "Concedes a competitor advantage inside a Reel. Intentional, and the reason this one gets shared rather than scrolled.",
  sketch: { type: "reel", subject: "graphic", alt: "two-column comparison building",
    beats: ["£6 vs £60 side by side", "fixed fee added to both", "effective rates diverge", "crossover figure held"],
    cap: "Two columns, figures climbing on one side. Hold the crossover number for two full seconds." },
  assets: [
    { t: "cover", size: "st", ai: true, title: "A £6 coffee and a £60 dinner are not the same transaction.", sub: "Explained by NeroPay" },
    { t: "ref", id: "B2/OV-2" },
    { t: "ref", id: "B2/OV-3" }
  ]
},
{
  id: "M5", channel: "meta", pillar: "Product", format: "Carousel · 8 cards",
  date: "Fri 25 Sep", blocked: false,
  title: "Everything included",
  copy: "Everything that comes with a NeroPay terminal. No extra monthly software cost.\n\nNeroPOS. Till, product grid, staff, kitchen display, Z-reports.\nNeroWeb. Your own online ordering. No commission per order.\nNeroBooking. Tables and appointments.\nNero QR Pay. Pay by QR.\nNeroAI. Tax and payment analytics.\nNeroTrade. Wholesale and trade accounts.\nNeroGym. Memberships and classes.\n\nOne machine. All of it.\n\nneropay.app",
  creative: "Eight cards at 4:5, drawn below. Card 1 the title, one product per card, card 8 closes on the terminal — swap that card for the terminal photograph. Demo-account screenshots can sit under the type on cards 2–7 if you want them; never the live dashboard, never real transactions.",
  why: "The most saveable post in the plan and the most likely to be forwarded between business owners. Worth pinning to the profile.",
  sketch: { type: "carousel", cards: ["title", "NeroPOS", "NeroWeb", "…+5"],
    cap: "Eight cards. Demo-account screenshots only. Card 8 closes on the terminal itself." },
  assets: [
    { t: "cards", size: "pt", cards: [
      { h: "Everything that comes with the terminal", b: "No extra monthly software cost." },
      { n: "NeroPOS", h: "The till", b: "Product grid, staff, kitchen display, Z-reports." },
      { n: "NeroWeb", h: "Your own online ordering", b: "No commission per order." },
      { n: "NeroBooking", h: "Tables and appointments", b: "Bookings land on the terminal." },
      { n: "Nero QR Pay", h: "Pay by QR", b: "From the far end of the table." },
      { n: "NeroAI", h: "Tax and payment analytics", b: "What sold, when, and what it cost to take." },
      { n: "NeroTrade · NeroGym", h: "Trade accounts. Memberships.", b: "Wholesale customers. Classes and passes." },
      { h: "One machine. All of it.", b: "neropay.app  ·  swap this card for the terminal photo" }
    ] }
  ]
},
{
  id: "M6", channel: "meta", pillar: "Street", format: "Reel · 20s",
  date: "Fri 18 Sep", blocked: false,
  title: "Wilmslow Road, Tuesday",
  copy: "98 food businesses in 800 metres.\n\nRusholme, Tuesday afternoon. Probably the densest food strip in the North.\n\nWe're out on it most weeks.",
  creative: "Phone footage, walking, vertical, no narration. Shopfronts, signage, the texture of the street. Ambient sound only — traffic and voices. No music, no captions beyond the single opening title below. Shot on a field day; costs nothing but remembering to film.",
  why: "No competitor with a national marketing budget can produce this. Cheapest and most defensible content NeroPay owns.",
  sketch: { type: "reel", subject: "street", alt: "walking past shopfronts",
    beats: ["opening title: 98 in 800m", "walk, no narration", "ambient sound only", "no CTA"],
    cap: "Handheld, walking, vertical. Ambient audio. One title card and nothing else." },
  assets: [
    { t: "cover", size: "st", title: "98 in 800 metres.", sub: "Wilmslow Road · Tuesday" }
  ]
},
{
  id: "M7", channel: "meta", pillar: "Statement", format: "Carousel · 7 cards",
  date: "Mon 5 Oct", blocked: false,
  title: "Before you sign anything",
  copy: "Five questions before you sign a card processing agreement.\n\n1. How long is the minimum term?\n2. What's the exact figure to leave early? In writing.\n3. Do I own the terminal, or am I hiring it?\n4. What happens to the machine if I close the account? What's the charge if it isn't returned?\n5. Can the rate change mid-term, and how would I find out?\n\nA contract isn't automatically a bad deal. Not knowing the exit number is.\n\nCorrect as of 18 Aug 2026.",
  creative: "Seven cards, same template, drawn below. Title, one question per card, and the concession on its own card at the end — it's the payoff, so give it the space.",
  why: "From B3. No competitor named in the caption on purpose — the video does that with dated, sourced citations, and a caption can't carry the substantiation.",
  sketch: { type: "carousel", cards: ["title", "Q1", "Q2", "…+4"],
    cap: "One question per card, big type, lots of air. Last card is the concession." },
  assets: [
    { t: "cards", size: "pt", cards: [
      { h: "Five questions before you sign", b: "Ask them in writing. Keep the answers." },
      { n: "1", h: "How long is the minimum term?", b: "In months. Not \"standard\"." },
      { n: "2", h: "What's the exact figure to leave early?", b: "In pounds. In writing." },
      { n: "3", h: "Do I own the terminal, or hire it?", b: "If you hire it, someone will want it back." },
      { n: "4", h: "What happens to the machine if I close the account?", b: "And what's the charge if it isn't returned?" },
      { n: "5", h: "Can the rate change mid-term?", b: "And how would you find out?" },
      { h: "A contract isn't automatically a bad deal.", b: "Not knowing the exit number is." }
    ] }
  ]
},
{
  id: "M8", channel: "meta", pillar: "Merchant", format: "Reel · 60s",
  date: "Wed 30 Sep", blocked: "Written consent from Arman covering filming, his name, the business name and every channel it appears on — signed before the shoot, not after. No negotiated rate, no commercial terms, no transaction data in the video or caption.",
  title: "Armenian Taverna",
  copy: "Arman runs the Armenian Taverna on Albert Square.\n\nTwo terminals, the full till, and a menu we built with him item by item.\n\nFilmed in his restaurant, in his words.",
  creative: "The mid-September shoot. Real filming, real merchant, real premises — the one asset in the whole plan that isn't generated. Keep the caption short: the video is the content. The cover below carries his name only once the form is signed.",
  why: "The single most valuable post available. First real social proof the company has ever had. Everything else here is an argument; this is evidence.",
  sketch: { type: "reel", subject: "presenter", alt: "merchant to camera in his restaurant",
    beats: ["merchant introduces himself", "what changed", "one specific detail", "no hard CTA"],
    cap: "Real footage, real merchant. Shot in his restaurant during quiet service. No script — questions off camera." },
  assets: [
    { t: "cover", size: "st", title: "In his words.", sub: "Armenian Taverna · Albert Square · with consent" }
  ]
},
{
  id: "M9", channel: "meta", pillar: "Product", format: "Reel · 20s",
  date: "Mon 12 Oct", blocked: "Flex pricing is unconfirmed and must not be quoted. The caption deliberately carries no price — keep it that way until Eray signs it off.",
  title: "Flex, for markets and stalls",
  copy: "Built for trading where there's no counter and no reliable wi-fi.\n\nNeroPay Flex. 5.5in screen, receipt printer built in, wi-fi, 4G and offline.\n\nMarkets open in November. Kit gets decided in October.\n\nneropay.app",
  creative: "Flex held in one hand, outdoors, overcast Manchester light. Receipt printing is the hero shot — it's the feature a market trader actually needs. Everything sharp, locked off, NeroPay branding only. Never reference Verifone or Stripe. No price on screen.",
  why: "Timed for October because Manchester's market stalls finalise kit in September–October, before the ~6 Nov opening.",
  sketch: { type: "reel", subject: "product", alt: "Flex in hand outdoors, receipt printing",
    beats: ["held in one hand", "tap completes", "receipt prints — hero shot", "neropay.app"],
    cap: "Outdoors, overcast. The receipt emerging is the money shot. No price on screen." },
  assets: [
    { t: "cover", size: "st", title: "Built for stalls.", sub: "NeroPay Flex · wi-fi, 4G, offline · prints a receipt" }
  ]
},
{
  id: "M10", channel: "meta", pillar: "Street", format: "Reel or carousel",
  date: "Fri 16 Oct", blocked: "Posts from the NeroPay Page only. Elif's personal profile is restricted until 18 September and nothing commercial goes out from a personal profile regardless. Product-led only — no earnings figures, no partner-programme content in any language.",
  title: "Turkish-language product post",
  copy: "Kart ödeme terminali ve ücretsiz yazarkasa yazılımı.\n\nÜrün ekranı, personel yönetimi, mutfak ekranı, Z raporu, online sipariş ve rezervasyon — terminale dahil, aylık yazılım ücreti yok.\n\nManchester ve çevresindeki işletmelere kurulum ve destek sağlıyoruz.\n\nneropay.app",
  creative: "Same product footage as M3 or M5 with Turkish burned-in subtitles. No separate shoot. Elif reviews terminology before publishing — POS cihazı, yazarkasa yazılımı, ekstre. The cover below is the Turkish opening frame; Elif checks it too.",
  why: "Language is one of the few hard targeting constraints Meta still honours, and the Turkish-Cypriot cluster around Stretford and Moss Side is the least-worked lead in the territory list.",
  sketch: { type: "reel", subject: "product", alt: "product footage with Turkish subtitles",
    beats: ["same footage as M3", "Turkish burned-in subs", "no new shoot", "Page only"],
    cap: "Reuse M3 or M5 footage. Only the subtitles change. Elif checks terminology first." },
  assets: [
    { t: "cover", size: "st", title: "Aylık yazılım ücreti yok.", sub: "Kart terminali · yazarkasa yazılımı dahil" }
  ]
}

];
