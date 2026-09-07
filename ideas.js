/* NeroPay Content Warehouse — the video backlog.

   Series that exist, series proposed, and one-off ideas. Every idea is judged by the
   engine rule: it has to be a by-product of the weekly video or a field day. Where it
   isn't, `input` says so honestly and `status` is "needs shoot". Nothing here states a
   price or a rate, names a competitor without a dated figure, or puts words in a real
   merchant's mouth without consent.

   status: production | ready | brief | needs shoot | blocked                          */
window.IDEAS = {

  series: [
    { id: 'EB', name: 'Explained by NeroPay — business owners', code: 'B', status: 'production', pillar: 'Statement', channel: 'YouTube 16:9 → Reels, carousels, LinkedIn write-ups',
      cadence: 'Weekly from 7 September', input: 'The weekly long-form video',
      premise: 'Reading a statement, choosing a pricing shape, signing a contract. Three explainers with dated competitor figures and a concession in each. In production in Higgsfield — not to be changed.',
      link: 'youtube.html#EB' },
    { id: 'EA', name: 'Explained by NeroPay — partners', code: 'A', status: 'production', pillar: 'Partner', channel: 'YouTube 9:16 → LinkedIn native video',
      cadence: 'Interleaved with the B videos', input: 'The weekly long-form video',
      premise: 'What the programme is, what a partner actually does, what happens to their customer. A2 blocked until the incentive figure lands. In production — not to be changed.',
      link: 'youtube.html#EA' },
    { id: 'BC', name: 'Behind the Counter', code: 'C', status: 'ready', pillar: 'Statement', channel: 'YouTube 16:9 → Reels (vertical bites), Facebook',
      cadence: 'Every other Thursday from 17 September', input: 'Its own generation batch — all AI, no shoot',
      premise: 'One question, six owners, cut together like a call. Dramatised and disclosed; the owners never endorse. Scripted through C6, with C7–C10 briefed.',
      link: 'youtube.html#BC' },

    { id: 'SC', name: 'The Statement Clinic', code: 'D', status: 'ready', pillar: 'Statement', channel: 'YouTube Shorts + Reels, 9:16, 60–90s',
      cadence: 'Weekly Shorts, alternating with Behind the Counter bites', input: 'B1 material and the two specimen statements already built — a screen recording and the Explained presenter\'s voice',
      premise: 'One line of a statement per episode. The specimen statement fills the frame, one row gets the yellow underline, the host explains what it is, what it costs on the month, and whether it\'s worth arguing about. Ends with the honest verdict: sometimes "leave it, that one\'s fine".',
      unique: 'Nobody else will show a statement line by line, because their own statements have these lines on them.',
      episodes: [
        { title: 'The 4p that isn\'t in the headline', hook: 'Authorisation fees. 780 transactions, 4p each, £31.20. Not in the rate, not in the leaflet.', screen: 'Specimen statement, "Authorisation fees" row underlined in yellow.' },
        { title: 'What is a PCI fee, actually', hook: 'A £9.95 line most people assume is the law. It isn\'t. Here\'s what it\'s for and when it\'s fair.', screen: 'PCI DSS row underlined; a one-line card: "PCI = the card schemes\' security standard".' },
        { title: 'Minimum monthly service charge', hook: 'The line that says £0.00 in a good month and bites in a quiet one. February is a quiet month.', screen: 'The £0.00 row, then the same row in a quiet-month version.' },
        { title: 'The settlement fee', hook: '£3 every time your own money reaches your own bank. Four payouts, £12. Daily payouts, £90.', screen: 'Settlement row; a small ladder: weekly / daily.' },
        { title: '"From 0.50%"', hook: 'The word "from" is doing all the work. Which cards get the 0.50%, and which don\'t.', screen: 'The rate ladder overlay from B1, reused.' },
        { title: 'The only number that compares', hook: 'Total charges ÷ card turnover × 100. The whole series in one sum.', screen: 'The effective-rate formula overlay from B1, reused.' }
      ],
      script: {
        title: 'Episode 1 — The 4p that isn\'t in the headline',
        note: 'Screen recording of the tiered specimen statement (asset STATEMENT/TIERED) with the Explained presenter\'s voice recorded as a separate audio generation. No presenter on screen, so no starting frame; the AI-voice disclosure is a text card in the first three seconds.',
        shots: [
          { id: 'D1-01', secs: 3, screen: 'Black. Card: "AI-generated voice · illustrative statement".', voice: '' },
          { id: 'D1-02', secs: 6, screen: 'Statement fills the frame. Slow push into the charges block.', voice: 'This is a card statement. Not a real one. Real enough.' },
          { id: 'D1-03', secs: 8, screen: 'Yellow underline draws under "Authorisation fees · 780 at 4p · £31.20".', voice: 'Authorisation fees. Four pence, every time a card is tapped. Seven hundred and eighty taps. Thirty-one pounds twenty.' },
          { id: 'D1-04', secs: 8, screen: 'Cut to the header: "rates from 0.50%". Underline "from".', voice: 'It isn\'t in the rate. It isn\'t in the leaflet. It\'s a separate line, and on a busy takeaway it\'s bigger than the rate on some cards.' },
          { id: 'D1-05', secs: 9, screen: 'Card: "Authorisation fee · per transaction · ask for it in pence".', voice: 'What to do with it: ask what it is, in pence. Some providers charge it, some fold it in, some don\'t charge it at all. All three are fine. Not knowing is the only bad answer.' },
          { id: 'D1-06', secs: 7, screen: 'Back to the total. Effective rate tile: 1.09%.', voice: 'And if your statement hasn\'t got this line at all? Good. Leave it. That one\'s fine.' },
          { id: 'D1-07', secs: 5, screen: 'End card: wordmark · "The Statement Clinic" · "Send us yours".', voice: '' }
        ]
      } },

    { id: '800', name: 'The 800 Metres', code: 'E', status: 'needs shoot', pillar: 'Street', channel: 'YouTube 16:9, one film; cuts for Reels',
      cadence: 'One film in October, then one street a quarter', input: 'A field day — but a full one, with a phone on a gimbal and a morning set aside. Honestly its own shoot, on a day we\'d be on the road anyway.',
      premise: 'Walk Wilmslow Road from Platt Lane to Moss Lane East and count. Ninety-eight food businesses, one after another, with the number ticking up on screen and nothing said about payments until the last thirty seconds. Ambient sound, shutters going up, the 42 bus. A film about the street, not about us. Then Stockport Road, then Cheetham Hill Road, then Stretford.',
      unique: 'No national provider can make this. It is the most defensible piece of content NeroPay could own, and the one a Rusholme owner would actually forward.',
      episodes: [
        { title: 'Wilmslow Road', hook: '98 food businesses in 800 metres. We counted. Here\'s all of them.', screen: 'Counter ticks up top-left; ends on 98.' },
        { title: 'Stockport Road', hook: 'Longsight to Levenshulme. The road that feeds half of south Manchester and doesn\'t get a nickname.', screen: 'Same counter, new number.' },
        { title: 'Cheetham Hill Road', hook: 'Wholesale by day, takeaways by night. Where the partners are.', screen: 'Same format.' },
        { title: 'Stretford and Moss Side', hook: 'The Turkish-Cypriot corridor. Grills, bakeries, barbers.', screen: 'Same format. Turkish subtitle version for M10\'s audience.' }
      ] },

    { id: 'OS', name: 'One Screen', code: 'F', status: 'needs shoot', pillar: 'Product', channel: 'Reels + Shorts, 9:16, 30–45s',
      cadence: 'One a fortnight; batch eight in a single afternoon', input: 'Needs one tabletop shoot — a real counter, a demo account, a locked-off phone on a clamp. Not a by-product, so it\'s honest to call it a cost. The batch is what makes it cheap.',
      premise: 'The terminal does one thing, start to finish, in real time, hands only. No presenter, no voice, burned-in subtitles. Everything sharp, the terminal the only branded object, demo data only. The Product pillar without a single adjective.',
      unique: 'Shown, not described. The M3 rule — "unglamorous, working company" — as a series.',
      episodes: [
        { title: 'Z-report in 30 seconds', hook: 'End of the night. One button. Done.', screen: 'Hands, terminal, the report printing.' },
        { title: 'Split the bill six ways', hook: 'Six cards, one machine, at the table.', screen: 'Table-side. Six taps. Six receipts.' },
        { title: 'Pay by QR from the far end of the table', hook: 'Nobody waves a card like a taxi.', screen: 'QR on the table card; a phone; the terminal confirms.' },
        { title: 'The order lands in the kitchen', hook: 'From the website to the kitchen screen. Same ticket as everything else.', screen: 'Phone order placed; kitchen display updates.' },
        { title: 'A booking arrives', hook: 'Table for four, Saturday, 8pm. It just appears.', screen: 'NeroBooking on the terminal; the slot fills.' },
        { title: 'Flex prints a receipt on a stall', hook: 'No counter, no wi-fi, still a receipt.', screen: 'Outdoors, overcast, receipt emerging. No price anywhere.' },
        { title: 'Staff login', hook: 'Who sold what. By the end of the shift, not the end of the month.', screen: 'Two logins, two sales, the staff report.' },
        { title: 'Books to Xero', hook: 'The Z-report goes to the accountant on its own. No carrier bag.', screen: 'Terminal, then the Xero screen (demo account).' }
      ] },

    { id: 'PD', name: 'Partner Desk', code: 'G', status: 'brief', pillar: 'Partner', channel: 'LinkedIn native video, 9:16, 45–60s',
      cadence: 'One a fortnight, on the weeks Behind the Counter isn\'t out', input: 'The A-series scripts — every episode is one A-series point, re-cut as a single answer from the Explained presenter',
      premise: 'One partner question, one plain answer, no figures ever. The presenter at the desk, the question on a card first. Ends with partners.neropay.app. L4 stays blocked until the incentive is signed off, and nothing here changes that.',
      episodes: [
        { title: 'What do I actually have to do?', hook: 'Make an introduction. That\'s the whole ask.', screen: 'Question card; A2 material.' },
        { title: 'What happens to my customer?', hook: 'They stay yours. We don\'t see your list. We never contact anyone you didn\'t introduce.', screen: 'A3 material.' },
        { title: 'What if their current deal is good?', hook: 'We tell them. They stay put. We don\'t get paid. We do it anyway.', screen: 'A3 material.' },
        { title: 'Why would I put my name near a small company?', hook: 'You shouldn\'t, unless "fifteen minutes down the road" is worth more to you than a name your customers recognise.', screen: 'A3-08 to A3-10, verbatim.' }
      ] },

    { id: 'IW', name: 'In Their Words', code: 'M', status: 'blocked', pillar: 'Merchant', channel: 'YouTube 16:9 + Reels, 60–90s',
      cadence: 'One a month as consent lands', input: 'A real shoot at a real merchant — the one series that is not generated and cannot be',
      premise: 'A real owner, in their premises, answering questions asked from off camera. No script, no presenter, no numbers. Arman at the Armenian Taverna is first, once the consent form is signed. Every other episode waits for its own signature.',
      blocked: 'Written consent per merchant — filming, name, business name, every channel — signed before the shoot. No negotiated rate, no commercial terms, no transaction data.',
      episodes: [
        { title: 'Arman — Armenian Taverna', hook: 'Two terminals, the full till, a menu built item by item. In his words.', screen: 'Real footage. Name plate with the business name, by consent.' },
        { title: 'Merchant story 2', hook: 'Whoever signs next. Same questions, same off-camera voice.', screen: '—' },
        { title: 'Merchant story 3', hook: 'Booked for w/c 30 Nov in the calendar. Needs a signature by mid-November.', screen: '—' }
      ] }
  ],

  /* one-offs — each is a single video, tied to a date or a moment */
  loose: [
    { title: 'What a visit looks like', pillar: 'Street', channel: 'Reels, 45s', when: 'Any field day', status: 'ready',
      hook: 'Someone from NeroPay walks in, reads the statement out loud, and leaves. That\'s it. That\'s the visit.',
      creative: 'Phone footage from the NeroPay side of a real visit, shot over the shoulder, no merchant face or name without consent. The statement is the specimen, not theirs.',
      input: 'A field day. Costs nothing but filming.' },
    { title: 'Before Ramadan', pillar: 'Statement', channel: 'YouTube 16:9 + Reels', when: 'Mid-January', status: 'brief',
      hook: 'If you\'re going to change anything at the counter this year, January is the month. February isn\'t.',
      creative: 'Explained-format presenter piece, 90 seconds, with the C10 owners cut in. The calendar fact stated plainly: the window closes around 5 February and moves eleven days earlier every year.',
      input: 'The Explained presenter and the Behind the Counter cast — no new shoot.' },
    { title: 'Budget day, for a takeaway', pillar: 'Statement', channel: 'LinkedIn + YouTube', when: 'w/c 2 Nov — after the dead week, never during', status: 'brief',
      hook: 'What the 28 October Budget actually changed for a twelve-table restaurant. In one page, no opinion.',
      creative: 'One overlay-style card per change, in the Explained house style, read by the presenter. Only what\'s in the Budget documents; sourced and dated on screen.',
      input: 'The Explained presenter. Written the day after the Budget, published the following week.' },
    { title: 'The Christmas market kit', pillar: 'Product', channel: 'Reels, 20s', when: 'Mid-October', status: 'blocked',
      hook: 'A stall, a queue, no socket. What goes in the bag.',
      creative: 'Flex in one hand, outdoors, overcast. The receipt printing is the hero shot. No price on screen or in the caption until Eray confirms one.',
      input: 'The M9 shoot — this is M9\'s second cut, not a new one.' },
    { title: 'A year on Wilmslow Road', pillar: 'Street', channel: 'YouTube + LinkedIn', when: 'w/c 7 Dec', status: 'brief',
      hook: 'Every street photo from every field day since September, in order, ninety seconds, no words.',
      creative: 'A cut of the field-day photos and M6-style walking footage. Ambient sound. One title card. The year-in-review the calendar already has pencilled in.',
      input: 'Every field day. Nothing new.' },
    { title: 'Ask the Counter', pillar: 'Statement', channel: 'Behind the Counter spin-off, 60s', when: 'When the series has an audience', status: 'brief',
      hook: 'Flip it. The owners ask, the host answers. Same cast, same call, opposite direction.',
      creative: 'Four owner questions from real comments on the first episodes (paraphrased, never quoted with a name), answered in one host take each.',
      input: 'Behind the Counter\'s cast and frames — no new generation beyond the lines.' }
  ]
};
