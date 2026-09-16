/* NeroPay Content Warehouse — the motion graphics videos.

   Faceless, rendered short-form. Attention grab first, explainer second. Every video: the hook is a
   claim the viewer can't ignore, the maths or the law comes after, and it concedes a case where the
   viewer should do nothing. Each carries a `narrator` block — the performance is part of the brief,
   not left to the voice model. Style and rails: motion/CLAUDE.md. Figures: figures.json.

   ground: white | charcoal   format: board | editorial | plate   status: ready | flagged | brief | blocked */
window.MOTION = {

  /* One voice across every series. Verity — chosen by Faisal 15 Sep 2026 from five eleven_v3 samples
     on the MG02 hook. Every narrator block below is performed by this voice. */
  voice: { id: 'oW8bn5YtBB89X2nJ0DT9', name: 'Verity', model: 'eleven_v3', chosen: '2026-09-15' },

  series: [
    { id: 'MATHS', name: 'The Maths', status: 'production', pillar: 'Statement', channel: 'Reels, Shorts, TikTok 9:16 · 4:5 feed · 16:9 YouTube',
      cadence: 'One a fortnight', input: 'Its own committed input — the figure register and the ElevenLabs take; no shoot',
      premise: 'One number out of a merchant\'s life, worked out on screen, including the cases where we lose. The concession is the format.',
      folder: 'motion/maths/' },
    { id: 'PRINT', name: 'Small Print', status: 'brief', pillar: 'Statement', channel: 'Reels, Shorts, TikTok 9:16 · LinkedIn 16:9',
      cadence: 'One a fortnight, alternating with The Maths', input: 'Its own committed input — regulation and deadlines a card machine touches, each dated and sourced in figures.json',
      premise: 'The law, the deadline and the rule an owner-operator hasn\'t been told about — tips, contracts, surcharges, disputes, HMRC. White editorial, a stamp on the date, and the honest "if this doesn\'t apply to you, do nothing".',
      unique: 'Nobody selling card machines tells merchants the regulator makes providers say when they can leave. We can, because it applies to us too.',
      folder: 'motion/print/' }
  ],

  videos: [

    { id: 'MG01', series: 'MATHS', title: 'Don\'t switch to us.', status: 'flagged', ground: 'charcoal', format: 'board', secs: 38,
      hook: 'Don\'t switch to us. Not for a four-pound coffee.',
      need: 'A takeaway or café with a small average ticket is worse off on a rate-plus-pence tariff, and nobody selling one says so. The crossover is the only number that decides it.',
      source: 'figures.json · neropay_workhorse_rate, benchmark_flat_no_fee · checks in motion/maths/ep01/checks.py',
      figures: ['neropay_workhorse_rate', 'benchmark_flat_no_fee'],
      concession: 'Under about twenty pounds a sale, stay put. Above it, we\'re cheaper. Work it out before anyone quotes you — us included.',
      blocked: 'Two things open before publish: the internal standard says 1.30% + 15p, not + 8p, and "no contract" collides with the 18-month-agreement question. Recorded in figures.json.',
      board: 'A receipt board: four stations left to right — a £4 coffee receipt, the same receipt with our line on it, a £40 table receipt, and the crossover as a single ruled line. Camera: push into the coffee, slide right to the £40, pull back to show both receipts and the line between them.',
      higgsfield: 'One plate for station one — a paper coffee-shop receipt on a wooden counter, 9:16, no text on it (we set the figures), sharp, no people.',
      narrator: { model: 'eleven_v3', energy: 'Flat and sure on the hook · lifts on the maths · drops to an aside on "we lose" · the turn is the only excitement · the close is direct',
        tags: '[deadpan] on the hook so it lands as a fact not a joke; [curious] into the stack; [sighs] before "we lose"; [excited] once, on "now we\'re the cheaper one"; nothing on the close',
        hits: 'us · THIRTEEN · lose · CHEAPER · twenty' },
      shots: [
        { id: 'MG01-1', secs: 4, screen: 'Charcoal. Small serif top-left: "The Maths". Large Chivo across the middle: DON\'T SWITCH TO US. The full stop is yellow.', say: '[deadpan] Don\'t switch to us. … Not for a four-pound coffee.', camera: 'Locked on station one' },
        { id: 'MG01-2', secs: 7, screen: 'Receipt plate. Rows stamp in on the beat: 1.30% × £4.00 → 5.2p · + 8p → 13.2p · = 3.30% in Martian Mono, the 3.30% yellow and larger.', say: '[curious] One point three percent, plus eight pence. On four pounds that\'s THIRTEEN pence — which is three point three percent.', camera: 'Push into the receipt' },
        { id: 'MG01-3', secs: 6, screen: 'Second station: the same receipt, our line grey and long; beneath it a shorter grey line labelled "a flat rate, no fixed fee · 6.8p". Serif italic, small, bottom-right: we lose.', say: 'A flat rate with no fixed fee would charge you half that. [sighs] On a four-pound sale… we lose.', camera: 'Slide right' },
        { id: 'MG01-4', secs: 7, screen: 'Third station: a £40 table receipt. Our line redraws shorter than the flat line and turns yellow as it lands. Chivo: 1.50%.', say: 'Same rate card. Forty-pound sale. One point five percent. [excited] Now we\'re the CHEAPER one.', camera: 'Slide right, tighter' },
        { id: 'MG01-5', secs: 7, screen: 'Pull back: both receipts in frame, one ruled line between them with £20.51 stamped on it in yellow. Serif under it: where the fixed fee stops hurting.', say: 'The fixed fee is what moves. It stops hurting at about twenty pounds fifty a sale.', camera: 'Pull back to the whole board' },
        { id: 'MG01-6', secs: 7, screen: 'End card on the board\'s empty corner: NERO white / PAY yellow · serif: Under £20 a sale? Stay put. · neropay.app · the source footer.', say: 'Our rate isn\'t one number. It depends what you sell things for. [warmly] So work that out before anyone quotes you anything. Us included.', camera: 'Still' }
      ] },

    { id: 'MG02', series: 'PRINT', title: 'They have to tell you.', status: 'production', ground: 'white', format: 'board', secs: 51,
      build: 'motion/print/mg02/ — v3, 16 Sep 2026: new Verity take (49 s), 3D terminal, calendar tiles, envelope and month tiles on a 2×2 board, Eleven Music bed on a 117 bpm grid, both CTAs; rendered in four crops, awaiting Faisal\'s review',
      hook: 'Quick one. Your card machine company has to tell you when you can walk away. Did they?',
      need: 'Since July 2023 the fourteen biggest acquirers must send a "your minimum term is ending, shop around" message, and terminal leases are capped at 18 months then 31-day rolling. Most owner-operators have never heard this.',
      source: 'PSR PS22/2, Card-acquiring market remedies, final decision, October 2022 — psr.org.uk. POS remedy from Jan 2023; trigger messages and summary boxes from July 2023.',
      figures: ['psr_terminal_lease_cap', 'psr_trigger_messages'],
      concession: 'If your deal\'s decent, ignore all this. Plenty are. But find that letter and check the date — it\'s your call, not theirs.',
      cta: 'Follow us for more of this · neropay.app',
      board: 'A 2×2 board. Station one: the card terminal (real 3D, three.js) under the hook. Two: forty-eight month tiles in four rows of twelve — the first eighteen turn gold, years three and four are struck and fall away. Three: an envelope that opens; the glass letter rises out of it. Four: thirty-one day tiles that ripple on "rolls" and fall away on "out". Pull back to the whole board for the concession, then the end card with the terminal back for the bow.',
      higgsfield: 'None — every object is built from primitives in motion/lib/objects3d.js, so nothing is synthetic imagery and rail 4 does not bite.',
      narrator: { model: 'eleven_v3', energy: 'Opens high — "Quick one" is a tap on the shoulder · the rule is said plainly but quick · "eighteen" is the hit · "OUT" is the release · the concession is warm and fast · the close is a smile, not a sell',
        tags: '[excited] on the hook and again on the close; [serious] on the regulator line; [warmly] on the concession; nothing on the middle, the words carry it',
        hits: 'EIGHTEEN · OUT · neropay dot app' },
      shots: [
        { id: 'MG02-1', secs: 8, screen: 'Off-white. The terminal drops in on beat 0. QUICK ONE stamps on beat 1; THEY HAVE / TO TELL YOU. on beats 2 and 3; serif "when you can", Chivo yellow WALK AWAY.; serif "…did they?"', say: '[excited] Quick one. Your card machine company has to tell you when you can walk away. Did they?', camera: 'Station one' },
        { id: 'MG02-2', secs: 10, screen: 'JAN 2023 stamps. 48 month tiles drop in as a run, year 1–4 labelled. Small: Payment Systems Regulator · PS22/2. On "eighteen" the first 18 turn gold and a Martian Mono 18 / months stamps top right. On "three years" a strike draws through year 3 and its tiles fall; on "four", year 4.', say: '[serious] Since January twenty twenty-three, the regulator caps a terminal lease at EIGHTEEN months. Not three years. Not four.', camera: 'Slide right to the calendar' },
        { id: 'MG02-3', secs: 9, screen: 'The envelope lands with a thud; the flap opens on "term ends". Small: 14 largest providers · July 2023. On "write" Chivo IN WRITING. and the glass letter rises out of the envelope: Minimum term ends on / DD · MM · YYYY. The date underlines on "date"; "shop around" ticks on "shop".', say: 'And when that term ends, the big providers must write to you. The date it ends… and a nudge to shop around.', camera: 'Down-left to the letter' },
        { id: 'MG02-4', secs: 6, screen: '31 day tiles drop in. Small: 31-day rolling. The tiles ripple on "rolls". Chivo ONE MONTH\'S / NOTICE. On "out" a solid yellow OUT stamps and every tile falls away.', say: 'After that, it rolls monthly. One month\'s notice — and you\'re OUT.', camera: 'Slide right to the month' },
        { id: 'MG02-5', secs: 9, screen: 'Pull back to the whole board at 35%. Serif, one line each, staying up: Deal\'s decent? Ignore this. · Plenty are. · Find the letter. Check the date. · Your call. Not theirs.', say: '[warmly] Now, if your deal\'s decent, ignore all this. Plenty are. But find that letter, check the date. It\'s your call, not theirs.', camera: 'Pull back, on a beat' },
        { id: 'MG02-6', secs: 9, screen: 'The board fades. Nero/Pay mark on "NeroPay"; serif Card machines, from Manchester.; a FOLLOW US FOR MORE pill; Chivo neropay.app with a yellow underline drawing. The terminal drops back in, bottom right.', say: '[excited] We\'re NeroPay. Card machines, from Manchester. Follow us for more of this — and have a look at neropay dot app.', camera: 'Still' }
      ] },

    { id: 'MG03', series: 'PRINT', title: 'The tip isn\'t yours.', status: 'ready', ground: 'white', format: 'editorial', secs: 30,
      hook: 'A customer tips on the card machine. You keep none of it. Not even the card fee.',
      need: 'The Employment (Allocation of Tips) Act has been in force since 1 October 2024: card tips go to staff in full, no deduction for the processing fee, paid by the end of the following month, written policy, records kept three years. Restaurants and barbers on the corridor are the audience.',
      source: 'Employment (Allocation of Tips) Act 2023, in force 1 Oct 2024 (England, Scotland, Wales); statutory Code of Practice. Summaries: Charles Russell Speechlys 2026, BrightHR, DavidsonMorris.',
      figures: ['tips_act_in_force', 'tips_act_payment_deadline', 'tips_act_records'],
      concession: 'Never take tips through the machine? Nothing changes. Cash tips your staff pocket directly were never yours either.',
      board: null,
      higgsfield: 'One plate for the hook: a card terminal on a restaurant table with a "tip?" screen visible but blank — no wording (we set it), sharp, no people, no brand on the terminal.',
      narrator: { model: 'eleven_v3', energy: 'Hook is level and slightly stern · the rule is a list, said with rhythm · "not even the card fee" is the hit · the concession is a relief',
        tags: '[serious] on the hook; nothing on the list, let the ticks do it; [warmly] on the concession',
        hits: 'NONE · fee · month · three' },
      shots: [
        { id: 'MG03-1', secs: 5, screen: 'Plate: the terminal on the table. Over it, Chivo top-left small: "a customer tips". Then large across the middle: YOU KEEP NONE OF IT. Serif beneath: not even the card fee.', say: '[serious] A customer tips on the card machine. You keep NONE of it. … Not even the card fee.', camera: 'Still' },
        { id: 'MG03-2', secs: 6, screen: 'White. A date stamps: 1 October 2024. Small under it: Employment (Allocation of Tips) Act.', say: 'Since the first of October twenty twenty-four, that\'s the law. Tips, gratuities, service charges — the lot.', camera: 'Still' },
        { id: 'MG03-3', secs: 9, screen: 'A ledger of four rows ticks in: 100% to staff · no deduction for the card fee · paid by the end of the next month · records kept 3 years. Each row a dry tick; the yellow moves down the list.', say: 'One hundred percent to your staff. The card processing fee comes out of your side, not theirs. Paid by the end of the following month. And you keep the records — for THREE years.', camera: 'Still' },
        { id: 'MG03-4', secs: 5, screen: 'Serif italic, large: a written policy, if tips are more than occasional.', say: 'If tips are more than occasional, you need a written policy. Staff can ask to see the records, and you\'ve got four weeks to answer.', camera: 'Still' },
        { id: 'MG03-5', secs: 5, screen: 'Serif alone on white: Never take tips through the machine? Nothing changes. End: NERO/PAY · footer with the Act and the date.', say: '[warmly] Never take tips through the machine? Nothing changes. … But if the screen asks — the answer\'s theirs.', camera: 'Still' }
      ] },

    { id: 'MG04', series: 'PRINT', title: 'Four times a year.', status: 'ready', ground: 'white', format: 'board', secs: 34,
      hook: 'Sole trader? Over fifty grand? HMRC wants to hear from you four times a year now.',
      need: 'Making Tax Digital for Income Tax started 6 April 2026 for sole traders and landlords with qualifying income over £50,000 — quarterly updates through software plus the annual return; £30,000 from April 2027, £20,000 from April 2028. The first quarterly update was due 7 August 2026; the next 7 November. No penalty points in year one.',
      source: 'HMRC, Making Tax Digital for Income Tax; thresholds and the 6 Apr–5 Jul first quarter per gov.uk. Summaries: Sage, IBTimes UK (7 Aug deadline), HMRC press (864,000 taxpayers).',
      figures: ['mtd_itsa_threshold_2026', 'mtd_itsa_thresholds_later', 'mtd_itsa_first_deadline'],
      concession: 'Under thirty thousand? Nothing changes until 2027 at the earliest. And this is a video, not your accountant — ask them.',
      board: 'A year board: twelve months in a strip, the four quarters bracketed, a stamp on each "7th" deadline. Station one is the £50k line; the camera walks the year; the pull-back shows the till\'s daily total feeding the quarter.',
      higgsfield: 'None — the year is drawn. Optional plate for the last station: a till printout curling on a counter, no legible text.',
      narrator: { model: 'eleven_v3', energy: 'Hook is brisk, almost a question at a counter · the dates are said like appointments · the product line is thrown away, not sold · the concession is kind',
        tags: '[curious] on the hook; [serious] on "seventh of November"; [deadpan] on "this is a video, not your accountant"',
        hits: 'FOUR · fifty · seventh · button' },
      shots: [
        { id: 'MG04-1', secs: 5, screen: 'Off-white. Chivo: FOUR TIMES A YEAR. Small above it: HMRC, since April. Serif under: if you\'re a sole trader over £50,000.', say: '[curious] Sole trader? Over fifty grand? HMRC wants to hear from you FOUR times a year now.', camera: 'Station one' },
        { id: 'MG04-2', secs: 7, screen: 'The year strip. April stamps; the first quarter brackets 6 April to 5 July; a stamp lands on 7 August, then 7 November in yellow. Small: Making Tax Digital for Income Tax.', say: 'It started in April. Every quarter, a digital update through software — the first one was due the seventh of August. [serious] The next is the SEVENTH of November.', camera: 'Slide along the year' },
        { id: 'MG04-3', secs: 6, screen: 'Three thresholds stack: £50,000 · 2026 (yellow) · £30,000 · 2027 · £20,000 · 2028.', say: 'Fifty thousand this year. Thirty next year. Twenty the year after. It\'s coming down, not going away.', camera: 'Push' },
        { id: 'MG04-4', secs: 7, screen: 'Pull back: the till\'s daily total (a Z-report line) feeds an arrow into the quarter bracket. Chivo small: the quarterly number is a button. Serif: if the till already talks to Xero or QuickBooks.', say: 'Here\'s the bit that matters for the counter: if the till already talks to Xero or QuickBooks, the quarterly number is a BUTTON. If it doesn\'t… it\'s a weekend.', camera: 'Pull back' },
        { id: 'MG04-5', secs: 6, screen: 'Serif alone: Under £30,000? Nothing changes until 2027. Then smaller: no penalty points in the first year. End: NERO/PAY · footer: HMRC, MTD for Income Tax, thresholds as of Sep 2026.', say: 'Under thirty thousand? Nothing changes until twenty twenty-seven. [deadpan] And this is a video, not your accountant. Ask them.', camera: 'Still' }
      ] },

    { id: 'MG05', series: 'PRINT', title: 'That sign.', status: 'ready', ground: 'white', format: 'editorial', secs: 28,
      hook: '"Fifty pee for cards." That sign has been illegal since the thirteenth of January… 2018.',
      need: 'Adding a charge for paying by consumer card has been banned since 13 January 2018 (Consumer Rights (Payment Surcharges) Regulations 2012, as amended). A minimum spend is lawful. Business cards can be surcharged at cost. Signs are still up on the corridor.',
      source: 'Consumer Rights (Payment Surcharges) Regulations 2012, amended by the Payment Services Regulations 2017, in force 13 Jan 2018. ACS guidance on payment surcharging; Sprintlaw on minimum spends.',
      figures: ['surcharge_ban_date'],
      concession: 'A minimum spend is your call. Some people will walk. That\'s allowed too — check your provider\'s terms, because the card schemes don\'t love it.',
      board: null,
      higgsfield: 'One plate: a hand-written card taped inside a shop window, blank (we write "50p for cards" on it in the overlay), daylight, sharp, no people, no brand.',
      narrator: { model: 'eleven_v3', energy: 'Hook read like the sign — flat, a little amused · the date is the hit and it lands late · the rule is plain · the concession is fair and quick',
        tags: '[deadpan] reading the sign; [curious] before the date; [warmly] on "that\'s allowed too"',
        hits: 'ILLEGAL · 2018 · minimum · walk' },
      shots: [
        { id: 'MG05-1', secs: 6, screen: 'Plate: the blank card in the window. Overlay handwriting: 50p for cards. Then a strike draws through it and Chivo stamps below: ILLEGAL SINCE. Martian Mono, late: 13 · 01 · 2018.', say: '[deadpan] "Fifty pee for cards." … That sign has been ILLEGAL since the thirteenth of January… [curious] twenty eighteen.', camera: 'Still' },
        { id: 'MG05-2', secs: 6, screen: 'White. Serif large: You can\'t add a charge for a personal card. Small under: debit, credit, prepaid.', say: 'You can\'t add a charge for paying by card. Debit, credit, prepaid — any personal card. That was the rule change, and it never went back.', camera: 'Still' },
        { id: 'MG05-3', secs: 6, screen: 'Two columns tick in. Left, yellow tick: a MINIMUM SPEND is allowed. Right: a surcharge on a BUSINESS card, at cost, is allowed.', say: 'What you can do: set a minimum spend. Five pounds, ten pounds — your call. And a business card, a company card, can be charged — at cost, not a penny more.', camera: 'Still' },
        { id: 'MG05-4', secs: 5, screen: 'Serif italic alone: Some people will walk. That\'s allowed too. Small: check your provider\'s terms on minimums.', say: '[warmly] Some people will walk from a minimum. That\'s allowed too. Just check your provider\'s terms — the card schemes aren\'t keen on minimums either.', camera: 'Still' },
        { id: 'MG05-5', secs: 5, screen: 'End: the sign, un-struck, replaced by a small card: "Minimum card spend £5". NERO/PAY · footer with the regulation and the date.', say: 'Take the sign down. Put the honest one up. … That one\'s fine.', camera: 'Still' }
      ] },

    { id: 'MG06', series: 'MATHS', title: 'Nine days.', status: 'flagged', ground: 'charcoal', format: 'board', secs: 34,
      hook: 'A customer can take their money back four months after they ate. You get about nine days to argue.',
      need: 'Chargebacks: cardholders have up to 120 days to dispute; the scheme gives the merchant 30 (Visa) or 45 (Mastercard) days, but many acquirers pass on 9–18; miss it and you lose regardless; a fee of £15–£35 lands either way. Owner-operators rarely know what evidence to keep.',
      source: 'Visa and Mastercard dispute time limits (120-day cardholder window); acquirer response windows 9–18 days and UK fees £15–£35 per case are industry figures (Chargeflow 2026, MerchantHQ UK 2026) — confirm the exact window and fee against the acquirer\'s own terms before publish.',
      figures: ['chargeback_cardholder_window', 'chargeback_merchant_window', 'chargeback_fee_range'],
      concession: 'Most disputes are real. Refund the fair ones fast — it\'s cheaper than the fee and it ends there.',
      blocked: 'The 9–18 day response window and the £15–35 fee are industry ranges, not a regulation. Before publish, state our own dispute window and fee, or say "check your provider" on screen.',
      board: 'A timeline board: day 0 the meal (a receipt), a 120-day bar in grey stretching right, the dispute landing at day 118, then a tiny 9-day bar in yellow beside it. Station four is the evidence drawer. Camera: push to the meal, long slide along 120 days, hard stop on 9, pull back.',
      higgsfield: 'One plate for station four: an open till drawer with receipts and a signed card slip, sharp, no legible text, no people.',
      narrator: { model: 'eleven_v3', energy: 'Hook is slow and serious · the slide along 120 days is patient · "nine" is a hard stop · the evidence list is quick and practical · the concession is decent',
        tags: '[serious] on the hook; [urgent] on "nine days"; nothing on the list; [warmly] on "refund the fair ones"',
        hits: 'FOUR months · NINE · regardless · fair' },
      shots: [
        { id: 'MG06-1', secs: 5, screen: 'Charcoal. Small serif: a Tuesday in March. Chivo: FOUR MONTHS LATER. Then, stamped: 9 days.', say: '[serious] A customer can take their money back FOUR months after they ate. … You get about nine days to argue.', camera: 'Station one' },
        { id: 'MG06-2', secs: 8, screen: 'The timeline. Day 0: the receipt. A grey bar draws right for 120 days, Martian Mono ticking the days. At 118 a card lands: "I don\'t recognise this".', say: 'A card payment can be disputed up to a hundred and twenty days after the sale. That\'s the cardholder\'s window. Four months. They just have to say they don\'t recognise it.', camera: 'Long slide right' },
        { id: 'MG06-3', secs: 6, screen: 'Beside it, a tiny yellow bar: 9 DAYS. Small: often 9–18 days from your provider · miss it and it\'s an automatic loss.', say: '[urgent] Your window to answer is often NINE days. Sometimes eighteen. Miss it — and you lose. Regardless of who\'s right.', camera: 'Hard stop, push' },
        { id: 'MG06-4', secs: 8, screen: 'Station four: the drawer plate. Ticks: the itemised receipt · the signed or PIN\'d slip · the booking confirmation · the CCTV time-stamp · the delivery proof. Small: and a fee of £15–£35 either way.', say: 'So keep the things that win it: the itemised receipt. The PIN or the signature. The booking. The camera time-stamp. The delivery photo. … And know there\'s a fee — fifteen to thirty-five pounds — whether you win or not.', camera: 'Slide to the drawer' },
        { id: 'MG06-5', secs: 7, screen: 'Pull back to the whole timeline. Serif italic: Most disputes are real. Refund the fair ones fast. End: NERO/PAY · footer: scheme windows; provider windows and fees vary — check yours.', say: '[warmly] Most disputes are real. Refund the fair ones fast — it\'s cheaper than the fee, and it ends there. … Fight the ones that aren\'t. With the receipt.', camera: 'Pull back' }
      ] },

    { id: 'MG07', series: 'MATHS', title: 'Six a day.', status: 'ready', ground: 'charcoal', format: 'board', secs: 36,
      hook: 'Six hospitality businesses will close today. And tomorrow. Here\'s the three bills that changed in April.',
      need: 'UKHospitality models around six closures a day in 2026. April 2026 changed three bills at once: the 40% retail, hospitality and leisure rates relief ended (pubs got 15% and a freeze; restaurants, cafés, takeaways got neither); the National Living Wage went to £12.71 with the 18–20 rate up 8.5%; employer NI at 15% from a £5,000 threshold. Owners feel it and can\'t name it.',
      source: 'UKHospitality, closures modelling 2026; House of Lords Library, hospitality and retail sectors; April 2026 figures as recorded in CLAUDE.md (NLW £12.71, 18–20 rate +8.5%, employer NI 15% from £5,000, RHL relief ended).',
      figures: ['ukh_closures_per_day_2026', 'april_2026_cost_stack'],
      concession: 'Card fees are the smallest of these. Fix the big three first. Then ring us.',
      board: 'A ledger board: three bills as three tall columns — rates, wages, NI — each with its April change stamped on top; a fourth, short column at the end labelled "card fees", drawn deliberately small. Camera: down the first column, across, pull back to show the four together.',
      higgsfield: 'One plate for the hook: a shuttered shopfront at dusk on a Manchester parade, no signage legible, no people, sharp.',
      narrator: { model: 'eleven_v3', energy: 'Hook is quiet, not dramatic · each bill is named like reading a letter · the fourth column is a shrug · the close is on our side of the counter',
        tags: '[serious] on the hook; [sighs] before "and NI"; [deadpan] on "card fees are the smallest"; [warmly] on "then ring us"',
        hits: 'SIX · ended · TWELVE seventy-one · fifteen · smallest' },
      shots: [
        { id: 'MG07-1', secs: 6, screen: 'Plate: the shutter at dusk. Chivo over it: SIX A DAY. Serif: hospitality closures, 2026, UKHospitality\'s estimate.', say: '[serious] SIX hospitality businesses will close today. And tomorrow. … Here\'s the three bills that changed in April.', camera: 'Station one' },
        { id: 'MG07-2', secs: 7, screen: 'Column one, RATES: the 40% relief bar drawn, then struck through. Stamp: ended 31 March 2026. Small: pubs got 15% and a freeze; restaurants, cafés, takeaways got neither.', say: 'One. Business rates. The forty percent relief ENDED on the thirty-first of March. Pubs got fifteen percent and a freeze. Restaurants, cafés, takeaways — got neither.', camera: 'Down column one' },
        { id: 'MG07-3', secs: 6, screen: 'Column two, WAGES: £12.71 stamps; beside it, 18–20 rate ▲ 8.5%.', say: 'Two. Wages. Twelve pounds seventy-one an hour. And the eighteen-to-twenty rate went up eight and a half percent in one go.', camera: 'Across' },
        { id: 'MG07-4', secs: 6, screen: 'Column three, NI: 15% stamps; beneath it, from £5,000, the old threshold struck through.', say: '[sighs] Three. Employer National Insurance. Fifteen percent — from five thousand pounds a head, not nine. That one\'s the quiet one.', camera: 'Across' },
        { id: 'MG07-5', secs: 5, screen: 'Column four, CARD FEES: drawn short, grey, small. Serif: the smallest of these.', say: '[deadpan] And card fees. … The smallest of these. By a distance.', camera: 'Across, then pull back' },
        { id: 'MG07-6', secs: 6, screen: 'The four columns together. Serif italic: Fix the big three first. Then ring us. End: NERO/PAY · footer with the sources and dates.', say: '[warmly] Fix the big three first. Get the rates appeal in, get the rota right. … Then ring us. We\'ll still be here.', camera: 'Held on the whole board' }
      ] },

    { id: 'MG08', series: 'PRINT', title: 'The £100 tap.', status: 'ready', ground: 'white', format: 'editorial', secs: 26,
      hook: 'The hundred-pound contactless limit was scrapped in March. Nobody noticed. Here\'s why.',
      need: 'On 19 March 2026 the FCA stopped setting a single contactless cap and let issuers set their own; most banks have kept £100 for now; phone wallets never had a limit. Merchants ask why a big tap still declines.',
      source: 'FCA policy statement, 19 March 2026; coverage MLex, FStech, Computer Weekly; Handepay merchant note.',
      figures: ['contactless_cap_removed'],
      concession: 'Nothing to change on your machine. If a big tap gets declined, it\'s their bank, not you — ask them to use the phone.',
      board: null,
      higgsfield: 'One plate: a phone held near a terminal on a counter, screens blank, sharp, no hands if it can be avoided, no brand.',
      narrator: { model: 'eleven_v3', energy: 'Hook is light and curious · the rule is a one-liner · the "here\'s why" is the reveal · the close is practical',
        tags: '[curious] on the hook; [laughs softly] on "nobody noticed"; [deadpan] on "their bank, not you"',
        hits: 'scrapped · THEIR bank · phone' },
      shots: [
        { id: 'MG08-1', secs: 5, screen: 'Off-white. Martian Mono, huge: £100. A strike draws through it. Chivo: SCRAPPED. Small: FCA · 19 March 2026.', say: '[curious] The hundred-pound contactless limit was scrapped in March. [laughs softly] Nobody noticed. Here\'s why.', camera: 'Still' },
        { id: 'MG08-2', secs: 6, screen: 'Serif: the regulator stopped setting the number. Then Chivo: THE BANKS SET IT NOW. Small: each issuer, its own limit.', say: 'The regulator stopped setting the number. The banks set it now — each one, its own limit. Some can turn it off. Some can let you pick.', camera: 'Still' },
        { id: 'MG08-3', secs: 5, screen: 'Two rows: CARD · most banks still £100, for now. PHONE · no limit, never was.', say: 'And most of them have… kept it at a hundred. For now. Your phone never had a limit. Still doesn\'t.', camera: 'Still' },
        { id: 'MG08-4', secs: 5, screen: 'Plate: phone at the terminal. Serif: Nothing to change on your machine.', say: 'So on the counter: nothing to change on your machine. [deadpan] If a big tap gets declined, it\'s THEIR bank, not you.', camera: 'Still' },
        { id: 'MG08-5', secs: 5, screen: 'End: NERO/PAY · serif: ask them to use the phone · footer: FCA, 19 Mar 2026.', say: 'Ask them to use the phone. … That one always goes through.', camera: 'Still' }
      ] }
  ]
};
