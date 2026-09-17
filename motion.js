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
      folder: 'motion/print/' },
    { id: 'PARTNER', name: 'Partner Programme', status: 'production', pillar: 'Partner', channel: 'Meta and TikTok 9:16 · 1:1 and 4:5 feed · LinkedIn and YouTube 16:9',
      cadence: 'One complete video first; then the hook library on a shared body, then the long-form',
      input: 'Faisal\'s brief of 16 Sep 2026 (motion/partner/BRIEF.md) — the programme, the five hard rules, the compliance line, the two modules and the hook library',
      premise: 'What a partner earns and the condition, said condition-first, as an animated diagram: the street of shopfronts that light when introduced, the ledger row that goes live, the Bonus Dial, the Rate Climb. Every number on screen sits with the volume or count that earns it, at every frame.',
      unique: 'We volunteer the three-a-month condition before the offer. The honesty is the hook, and it is what survives Meta\'s classifier and the ASA.',
      voice: 'Olivia — Warm, British Female (pPoztmvzd5p26S3MsNrV), Faisal\'s choice for this series, 16 Sep 2026',
      note: 'Figures confirmed final by Faisal on 17 Sep 2026 (BRIEF.md v4). Light mode only — the dark-ground first cut was rejected the same day.',
      folder: 'motion/partner/' }
  ],

  videos: [

    { id: 'PP02', series: 'PARTNER', title: 'How many of the business owners on your road actually know your name?', status: 'production', ground: 'white', format: 'world', secs: 49,
      build: 'motion/partner/pp02/ — 17 Sep 2026: the network angle as one walk down one English high street, no place named (one build for every Meta location); Olivia, the approved v3 script, tightened gently; the street, a lamp post, a phone, a receipt that prints, a van, all new objects; word-by-word type, a typewriter, an odometer, strikes, hanging signs, captions that pop; a new acoustic bed at 108 bpm; 4:5 first',
      hook: 'How many of the business owners on your road actually know your name? (On screen: a tally rolling up as the shops pass, then "?", the question typed in under it)',
      need: 'Faisal, 17 Sep 2026: every partner video portrays how little the partner does — we handle everything, a name and a number is enough and we close it — and the bonus is said as paid after 30 days, never as conditional in the sentence. The network angle for the people who walk past twenty card machines a day.',
      source: 'motion/partner/BRIEF.md v4 final, Part 1 and Part 4 variant 2; the two rulings in motion/partner/CLAUDE.md; "we\'ll close it for you" stated by Faisal 17 Sep 2026 (claims.md).',
      figures: ['partner_bonus_tiers', 'partner_revenue_share_tiers', 'partner_active_gate'],
      concession: 'And if a month\'s quiet and you only bring one, that bonus is still yours.',
      cta: 'neropay.app/partners on a street nameplate · Free to join · Your own link · compliance super: £100–£300 per merchant, paid after 30 days with us. Revenue share needs 3+ new active merchants per calendar month. Terms: neropay.app/partners',
      board: 'Seven stops along one straight street, the camera dollying between them and facing alternately left and right: your road (the tally, the question, the three named shops) · paid (the receipt out of the door, £100–£300 per merchant, the 30-day strip) · you don\'t (three strikes) · a name and a number (the phone, SENT, the van, the terminal at the door) · Active Partner (bunting, the lamp-post signs, the climb to 111+ · 40%) · the quiet month (shutters down but one, its receipt prints) · the end of the road (nameplate, terminal at the kerb, compliance line).',
      higgsfield: 'None — everything is built from primitives; the voice and the bed are generated and declared in the description.',
      narrator: { model: 'eleven_v3', voice: 'Olivia — Warm, British Female (pPoztmvzd5p26S3MsNrV)', energy: 'A question to open, curious · plain and quick on the three shops · warm and certain on "pays you" · the three "you don\'t"s said like relief · light on the hand-off · lifts on Active Partner · drops warm on the quiet month · the address like a nudge',
        tags: '[curious] on the opening; [warmly] on "Do it three times"; nothing else',
        hits: 'name · pays · thirty · sell · number · close · Active Partner · yours · partners' },
      shots: [
        { id: 'PP02-1', secs: 7, screen: 'A long paper high street. The tally rolls 1 → 14 on the pavement and flips to "?" · the question types in · Café, Barber, Takeaway light on their words with labels hanging in', say: '[curious] How many of the business owners on your road actually know your name? The café, the barber, the takeaway.', camera: 'Stop 0, facing right' },
        { id: 'PP02-2', secs: 9, screen: 'pays you (word by word) · £100–£300 on the marker · PER MERCHANT · the shop\'s door prints a receipt: paid after 30 days of card payments with us, £100 · £200 · £300 by their first 30 days\' takings · a 30-day strip fills', say: 'Because every one of them you introduce to NeroPay pays you a hundred to three hundred pounds, once they\'ve been taking card payments with us for thirty days.', camera: 'Stop 1, facing left' },
        { id: 'PP02-3', secs: 5, screen: 'You don\'t · sell anything. · set anything up. · make the call. — each struck through as it is said; a lamp post at the edge', say: 'And you don\'t sell anything. You don\'t set anything up. You don\'t even have to make the call.', camera: 'Stop 2, facing right' },
        { id: 'PP02-4', secs: 5, screen: 'Send us a name and a number. · a phone stands up on the pavement: NAME Café, NUMBER 07··· ··· ···, SENT · the van drives in and a terminal rises at the shop door', say: 'Send us a name and a number, and we\'ll close it for you.', camera: 'Stop 3, facing left' },
        { id: 'PP02-5', secs: 6, screen: 'Week bunting, three ticks · three shops light · ACTIVE PARTNER hangs from the lamp post · the badge climbs 3 · 20% → 111+ · 40% and rests on "Most partners start at 20%: three a month."', say: '[warmly] Do it three times in a month and you\'re an Active Partner, with a share of what all your merchants\' card payments earn us, every month you hit it.', camera: 'Stop 4, facing right' },
        { id: 'PP02-6', secs: 5, screen: 'Shutters roll down on every shop but one · that one lights and its receipt prints · Your bonus is yours either way.', say: 'And if a month\'s quiet and you only bring one, that bonus is still yours.', camera: 'Stop 5, facing left' },
        { id: 'PP02-7', secs: 12, screen: 'FREE TO JOIN · the street nameplate neropay.app/partners · YOUR OWN LINK · our terminal at the kerb · the compliance line held to the end', say: 'It\'s free to join. Go to NeroPay dot app slash partners and get your link.', camera: 'Stop 6, the end of the road' }
      ] },
    { id: 'PP01', series: 'PARTNER', title: 'You could be earning £100–£300 for every business you introduce.', status: 'production', ground: 'white', format: 'world', secs: 70,
      build: 'motion/partner/pp01/ — v3, 17 Sep 2026: the earnings hook (the brief\'s "you could be earning" shape, condition on the same frame), who we are, the Bonus Dial and the Rate Climb as glass, the quiet month, a new close on neropay.app/partners; Olivia take tightened gently at 1.03x with a lenient gate; the white world, a camera that never stops, one real payment card per section at the edge, half out of frame (v4.1: the spheres and the glass shapes are gone), generated plates to come under certain beats, the view swinging left, right and centre, phrases as graphics, an upbeat generated bed, 42 cues; 4:5 first, awaiting review',
      hook: 'You could be earning a hundred to three hundred pounds for every café, takeaway or barber you introduce to a card machine company. (On screen: You could be earning · £100–£300 · for every business you introduce. · per merchant · based on their first 30 days · How it works, and why you don\'t sell anything.)',
      need: 'Most people who could introduce a business have never heard of NeroPay. One video that leads with what an introduction pays, per merchant with its condition on the same frame, then who we are and why there is nothing to sell, then the whole programme in plain words, every figure beside the condition that earns it.',
      source: 'motion/partner/BRIEF.md v4 final, Part 1 (Faisal, 17 Sep 2026). Figures in figures.json as partner_bonus_tiers, partner_revenue_share_tiers, partner_active_gate — confirmed.',
      figures: ['partner_bonus_tiers', 'partner_revenue_share_tiers', 'partner_active_gate'],
      concession: 'And if you only bring one that month, you still get your bonus, it\'s yours either way.',
      cta: 'neropay.app/partners · Free to join · Your own link to share · Who would you introduce first? · compliance super: £100–£300 per merchant. Revenue share needs 3+ new active merchants per calendar month. Terms: neropay.app/partners',
      board: 'Six sections on the arc in the white world, the view swinging left, right and centre, two very large pale spheres half in the frame at every section. The hook (You could be earning · £100–£300 on the marker · for every business you introduce · the condition kicker; café, takeaway and barber light on their words); who we are (the mark, Card terminals. Free till software., the shops rise, paths from YOU to each shop, YOU INTRODUCE · WE SET UP · WE SUPPORT, a terminal lands beside each shop); the bonus (a ledger row goes LIVE, the Bonus Dial runs £100 → £200 at £20,000 → £300 at £40,000 and rests with its condition; three steps rise on the floor); the share (the Rate Climb 0 → 3 → 20% … 111+ → 40%, "Most partners start at 20%: three a month.", four month chips tick); either way (one shop, its £100 row, one of four weeks ticks, the serif line); the close (FREE TO JOIN · YOUR OWN LINK TO SHARE, neropay.app/partners with the marker drawing, the shops light one by one, our terminal, the compliance line held).',
      higgsfield: 'None — everything is built from primitives; nothing generated but the voice and the bed, both declared in the description ("Voice generated with AI").',
      narrator: { model: 'eleven_v3', voice: 'Olivia — Warm, British Female (pPoztmvzd5p26S3MsNrV)', energy: 'One person talking, start to finish: up from the first word on the potential · plain and quick on who we are and the whole job · warm on the bonus and rides the numbers · lifts on Active Partner · drops warm on the quiet-month line · the address said like a nudge, and the question left hanging',
        tags: '[excited] on the opening; [warmly] on "When they go live"; nothing else',
        hits: 'earning · three hundred · sell · introduce · hundred · Active Partner · yours · partners' },
      shots: [
        { id: 'PP01-1', secs: 11, screen: 'White world. Serif: You could be earning · £100–£300 on the yellow marker · for every business you introduce. · kicker: per merchant · based on their first 30 days · café, takeaway, barber light on their words · How it works, and why you don\'t sell anything.', say: '[excited] You could be earning a hundred to three hundred pounds for every café, takeaway or barber you introduce to a card machine company. Here\'s how it works, and why you don\'t need to sell anything.', camera: 'Section 0' },
        { id: 'PP01-2', secs: 13, screen: 'NeroPay mark · Card terminals. Free till software. · the three shops rise on "business that takes card payments" · paths draw from a YOU pill to each shop on "introduce them to us" · pills YOU INTRODUCE · WE SET UP · WE SUPPORT · a terminal lands beside each shop on "set them up" · serif: that\'s your whole job.', say: 'We\'re NeroPay, we do card terminals with free till software for UK businesses. You know a business that takes card payments, you introduce them to us, and that\'s your whole job, because we go and set them up and we do the support.', camera: 'Right, to who we are' },
        { id: 'PP01-3', secs: 15, screen: 'Row Café · Stockport · went live flips to LIVE · the Bonus Dial: £100 at £0, the marker passes £20,000 (£200) on "two hundred", £40,000 (£300) on "three hundred", rests on £300 · £40,000+ in their first 30 days · "up to £300 per merchant — £40,000+ in their first 30 days" · three steps rise with £100 · £200 · £300 · NOTHING TO UNLOCK', say: '[warmly] When they go live you get a bonus for that one business, a hundred pounds if they take up to twenty thousand in their first month, two hundred over that, and three hundred once they\'re over forty thousand. Every one you introduce pays you, and there\'s nothing to unlock.', camera: 'Left, to the bonus' },
        { id: 'PP01-4', secs: 11, screen: 'ACTIVE PARTNER badge · the Rate Climb: 1-2-3, 20% at 3, the count climbs past 21 · 25%, 36 · 30%, 61 · 35% to 111+ · 40%, rests with "111+ new active merchants in one month" and "Most partners start at 20%: three a month." · four month chips tick on "every month"', say: 'Then if you bring three or more in the same month, you\'re an Active Partner, and you also get a share of what all your merchants\' card payments earn us, not just the new three, every month you hit it.', camera: 'Right, to the share' },
        { id: 'PP01-5', secs: 5, screen: 'One shop · row Barber · Longsight · went live flips to LIVE · one of four weeks ticks on "only bring one" · £100 · serif: Your bonus is yours either way. — underline on "yours"', say: 'And if you only bring one that month, you still get your bonus, it\'s yours either way.', camera: 'Left, to the quiet month' },
        { id: 'PP01-6', secs: 13, screen: 'FREE TO JOIN · YOUR OWN LINK TO SHARE · neropay.app/partners with the marker drawing on "slash partners" · serif: Who would you introduce first? · the three shops come back and light one by one · our terminal at the right · the compliance super with the link, held to the end', say: 'It\'s free to join, and you get your own link to share. Go to NeroPay dot app slash partners, and think about who you\'d introduce first.', camera: 'Right, to the close' }
      ] },

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

    { id: 'MG02', series: 'PRINT', title: 'The 18-month rule.', status: 'production', ground: 'white', format: 'world', secs: 56,
      build: 'motion/print/mg02/ — v4, 16 Sep 2026: script rewritten with Faisal, Verity take 58.7 s, the NeroPay terminal modelled from the product photos and a generic old machine for the switch, five stations, looped bed, contact and follow CTAs; four crops, awaiting review',
      hook: 'If you rent your card machine, there\'s a rule you should know about. (On screen: When does your card machine contract actually end?)',
      need: 'Since July 2023 the fourteen biggest acquirers must send a "your minimum term is ending, shop around" message, and terminal leases are capped at 18 months then 31-day rolling. Most owner-operators have never heard this.',
      source: 'PSR PS22/2, Card-acquiring market remedies, final decision, October 2022 — psr.org.uk. POS remedy from Jan 2023; trigger messages and summary boxes from July 2023.',
      figures: ['psr_terminal_lease_cap', 'psr_trigger_messages'],
      concession: 'Some deals are fine as they are. But you won\'t know until you compare.',
      cta: 'Get a quote in minutes — message us or call us · neropay.app · Give us a follow to keep up with more videos like this',
      board: 'Five stations, no pull-back. The question with the old machine; the rule as three pillars (3 years and 4 years sink, 18 months stays gold); the envelope and the letter, and the old machine sliding out as ours slides in on "switch"; the 31-day month that ripples on "stay" and falls on "leave"; both machines side by side and twelve months turning gold on "adds up over a year". End card on the stage: the NeroPay terminal, the offer, the two ways to reach us, the sign-off.',
      higgsfield: 'None — both terminals are built from primitives in motion/lib/objects3d.js (neroTerminal from the product photos, oldTerminal generic). Nothing generated, so rail 4 does not bite; no maker named anywhere.',
      narrator: { model: 'eleven_v3', energy: 'Opens bright and stays there · the rule is said plainly · the letter beat is explanatory · the concession is a warm half-line, then straight into the push to compare · the offer is direct · the sign-off is a smile',
        tags: '[excited] on the opening line and again on "Comparing terminal rates"; [serious] on the regulator line; [warmly] on "Some deals are fine"; nothing else — the words carry it',
        hits: 'eighteen · write · switch · compare · minutes' },
      shots: [
        { id: 'MG02-1', secs: 4, screen: 'Off-white. Serif question types in word by word: When does your card machine contract actually end? The old grey machine drops in beside it.', say: '[excited] If you rent your card machine, there\'s a rule you should know about.', camera: 'Station 0' },
        { id: 'MG02-2', secs: 10, screen: 'SINCE JAN 2023 stamps. Chivo: The 18-month rule. — highlighter behind "18-month" on "eighteen". Kicker: Payment Systems Regulator · PS22/2. Three pillars: 3 years and 4 years rise grey on "tie you in", 18 months rises gold on "eighteen"; the tall two sink on "not three years" and "not four".', say: '[serious] Since January twenty twenty-three, the payments regulator says a terminal lease can only tie you in for eighteen months. Not three years. Not four.', camera: 'Right, to the rule' },
        { id: 'MG02-3', secs: 11, screen: 'Chivo: They have to write to you. — highlighter on "write". Kicker: 14 largest providers · from July 2023. The envelope lands, opens on "up"; the glass letter rises on "write": Your minimum term ended on DD · MM · YYYY, ✓ free to switch provider. On "switch" the old machine slides out and the NeroPay terminal slides in.', say: 'When those eighteen months are up, the big providers have to write and tell you. The letter gives the date your minimum term ended, and that you\'re free to switch to another card machine provider.', camera: 'Down-left, to the letter' },
        { id: 'MG02-4', secs: 7, screen: 'Chivo: One month\'s notice. Kicker: if you choose to stay. 31 day tiles drop in, ripple on "stay", fall away on "leave". 1 MONTH pill and the highlighter on "notice" on "one month\'s".', say: 'If you choose to stay, you can still leave at any time after that, as long as you give them one month\'s notice.', camera: 'Right, to the month' },
        { id: 'MG02-5', secs: 12, screen: 'Serif: Some deals are fine as they are. / But you won\'t know until you compare. Chivo: Compare your rates. — highlighter on "Compare". Both machines side by side. Twelve month tiles turn gold in a run; kicker: the difference, over a year. No figure anywhere.', say: '[warmly] Some deals are fine as they are. But you won\'t know until you compare. [excited] Comparing terminal rates is easy, it doesn\'t take long, and the difference between providers adds up over a year.', camera: 'Down, to compare' },
        { id: 'MG02-6', secs: 14, screen: 'Board leaves. The NeroPay terminal drops in bottom right. Chivo: Get a quote in minutes. — highlighter on "minutes". Pills MESSAGE US and CALL US on the words. neropay.app small. Serif: That\'s it for today. Solid pill: FOLLOW FOR MORE VIDEOS LIKE THIS on "follow".', say: 'Here at NeroPay you can get a quote in minutes. Drop us a message or give us a call and speak to someone from our team. That\'s it for today. Give us a follow to keep up with more videos like this.', camera: 'Still' }
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
