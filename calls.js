/* NeroPay Content Warehouse — Behind the Counter (series C).

   A video-call montage, every other Thursday. One question from the NeroPay side,
   answered by six owner-operators in their own premises, cut together from "call
   bites". Everyone in it is AI-generated and every episode says so on screen in the
   first three seconds. The owners are composite characters, not customers: they
   describe situations, they never endorse NeroPay, and the host carries the product
   facts and the concession. That is what keeps this a dramatised explainer and not a
   fabricated testimonial (CAP Code 3.45–3.47; DMCC Act 2024 fake-review ban).

   This file is hand-edited data, like posts.js. Add an episode by copying one.
   Timecodes are worked out from `secs` on the page, so only durations need typing.
   `cold: true` marks the bite that opens the episode as a three-second cold open,
   before the host's question — always the funniest or most recognisable line.        */
window.CALLS = (function () {
  "use strict";

  var series = {
    id: 'C',
    name: 'Behind the Counter',
    strap: 'One question. Six counters. Every other Thursday.',
    cadence: 'Fortnightly, Thursdays. Two a month. Skips the dead week of 26 October and goes dark 18 Dec – 3 Jan.',
    aspect: '16:9',
    layout: 'Cold open: three seconds of the best bite, no plate. Then the host question, title, question card, and the owners full-frame with the host listening in a small box top right. Name plate bottom left on every bite. Disclosure over the first three seconds.',
    premise: 'The credibility job, not the acquisition job. A merchant who has met NeroPay at the counter searches that evening and finds people like them talking plainly about the same problems. Nothing in an episode asks for anything; the description carries the ask.'
  };

  var merchantGlobal =
'Video-call footage of a small business owner, filmed by the front camera of a laptop or phone propped at chest height inside their own premises, mid-shift. They talk straight down the lens like they are on a call with someone they get on with.\n\n' +
'REALISM: must read as a real webcam feed of a real person, not generated video. Slight webcam softness and neutral exposure are fine; no filter, no beauty smoothing, no cinematic grade. Skin keeps its texture and pores. Eyes blink irregularly, with natural moisture and catchlights. Small imperfections stay - a hair out of place, a crooked collar, a mark on the apron. Lips match the words precisely. Nothing smooths, morphs, drifts or resets.\n\n' +
'VOICE: British. A natural Greater Manchester accent, light and unforced, not performed. Not posh, not American, not transatlantic. British pronunciation and rhythm throughout, including numbers and money.\n\n' +
'WHO THEY ARE: a working owner-operator, warm, candid and a bit wry. Cheerful even when describing a problem - this is someone who likes their job and is enjoying being asked. Talking to one person, not an audience. Even pace, no rising inflection at the end of sentences. Eye contact with the lens, held, with the occasional glance off as they think, and the odd laugh at their own line.\n\n' +
'MOVEMENT: subtle and alive. Natural blinking, small head movements, a lean in, a shrug, a laugh through the nose, hands coming up into frame when the words call for it and dropping again. Never stiff, never theatrical, never presenting.\n\n' +
'THE ROOM: exactly as the attached frame - same premises, layout, light and objects. Deep focus, everything sharp, no bokeh. Anything in the background stays consistent with the frame and only moves gently if it was already moving. No new people walk through. If a card terminal is in frame it carries no visible branding.\n\n' +
'CAMERA: the device is propped and does not move. No pan, tilt, zoom, drift or shake. First and last frame framed identically.\n\n' +
'DO NOT: second speaker, cutaway, on-screen text, caption, logo, watermark, graphic, music or sound effect.';

  var hostGlobal =
'Video-call footage of the NeroPay side of a call: one person at a desk in a quiet office, filmed by a laptop webcam at eye level, plain charcoal wall behind them, talking to a business owner they are interviewing.\n\n' +
'REALISM: must read as a real webcam feed of a real person, not generated video. Neutral exposure, no filter, no beauty smoothing, no cinematic grade. Skin keeps its texture. Eyes blink irregularly, with natural moisture and catchlights. Small imperfections stay. Lips match the words precisely. Nothing smooths, morphs, drifts or resets.\n\n' +
'VOICE: British. A natural, everyday UK accent, clear and neutral. Not American, not put-on posh. British pronunciation and rhythm throughout, including numbers and money. Any presenter, male or female, but the same one in every episode.\n\n' +
'WHO THEY ARE: calm, curious, on the owner\'s side. Asks the question, then genuinely listens. Never salesy, never hyped, never presenting. Even pace, no rising inflection at the end of sentences. Direct eye contact with the lens, held. A small smile when the owner is funny.\n\n' +
'MOVEMENT: small and natural. Blinks, nods, a tilt of the head, a hand coming up briefly on a point and settling. Engaged and warm, never stiff.\n\n' +
'THE ROOM: exactly as the attached frame. Plain charcoal wall, nothing on it, no logo in shot. Deep focus, no bokeh. Only the presenter moves.\n\n' +
'CAMERA: locked off at eye level. No pan, tilt, zoom, drift or shake. First and last frame framed identically.\n\n' +
'DO NOT: second speaker, cutaway, on-screen text, caption, logo, watermark, graphic, music or sound effect.';

  /* the recurring cast — composite characters, first names only, no real business named */
  var cast = [
    { key: 'sam',    name: 'Sam',    trade: 'Takeaway',        area: 'Rusholme',      where: 'kitchen pass',
      look: 'Black British man, late 30s, shaved head, short beard, black chef\'s T-shirt, striped apron, a tea towel over one shoulder',
      frame: 'Photo taken by a laptop front camera propped on the stainless-steel pass of a small takeaway kitchen in Manchester, mid-afternoon between services. Sam - Black British man, late 30s, shaved head, short beard, black chef\'s T-shirt, striped apron, tea towel over one shoulder - stands at the pass looking straight into the camera, relaxed half-smile. Behind him: a six-burner range, a steel extractor hood, a rack of clean pans, a wall clock, a whiteboard with the day\'s prep list in marker. Fluorescent tube light mixed with daylight from a side door. Everything in focus. No text legible, no brand names, no logos anywhere. Aspect 16:9, webcam framing, chest up, a little headroom.' },
    { key: 'priya',  name: 'Priya',  trade: 'Café',            area: 'Levenshulme',   where: 'pavement tables outside',
      look: 'British-Indian woman, mid 40s, dark hair tied back, navy denim apron over a white T-shirt, a pen behind one ear',
      frame: 'Photo taken by a phone front camera propped against a sugar pot on a small pavement table outside an independent café on Stockport Road, Levenshulme, on an overcast bright morning. Priya - British-Indian woman, mid 40s, dark hair tied back, navy denim apron over a white T-shirt, a pen behind one ear - sits at the table looking straight into the camera, easy smile. Behind her: two more metal tables, the café window with a plain chalkboard, a bike leaning on a lamppost, a red-brick terrace across the road, a bus stop. Flat daylight, no shadows. Everything in focus. No legible text, no brand names, no logos. Aspect 16:9, webcam framing, chest up.' },
    { key: 'tomasz', name: 'Tomasz', trade: 'Barber',          area: 'Longsight',     where: 'the chair, mirror behind',
      look: 'Polish-Mancunian man, early 30s, slicked-back hair, trimmed beard, black short-sleeve shirt, tattooed forearms',
      frame: 'Photo taken by a phone front camera propped on the counter of a small barber shop in Longsight, Manchester, on a quiet weekday. Tomasz - Polish-Mancunian man, early 30s, slicked-back hair, trimmed beard, black short-sleeve shirt, tattooed forearms - sits in his own barber chair turned to face the camera, grinning slightly. Behind him: a long mirror reflecting the shop, two more chairs, clippers on hooks, a shelf of unbranded bottles, a window onto the street with the shop name backwards in plain vinyl and unreadable. Warm ceiling spots. Everything in focus. No legible text, no brand names, no logos. Aspect 16:9, webcam framing, chest up.' },
    { key: 'dilek',  name: 'Dilek',  trade: 'Restaurant',      area: 'Stretford',     where: 'empty seating area between services',
      look: 'Turkish-Cypriot woman, early 50s, dark bob, reading glasses pushed up, black blouse, small gold earrings',
      frame: 'Photo taken by a laptop front camera on a restaurant table in Stretford, Manchester, in the empty dining room between lunch and dinner service. Dilek - Turkish-Cypriot woman, early 50s, dark bob, reading glasses pushed up on her head, black blouse, small gold earrings - sits at the table looking straight into the camera, warm and composed. Behind her: rows of set tables with folded napkins, dark wood chairs, a charcoal grill counter at the back, pendant lights off, daylight from a big front window. Everything in focus. No legible text, no brand names, no logos. Aspect 16:9, webcam framing, chest up.' },
    { key: 'marcus', name: 'Marcus', trade: 'Corner shop',     area: 'Cheetham Hill', where: 'behind the till',
      look: 'White Mancunian man, late 50s, grey stubble, glasses, a green fleece over a checked shirt',
      frame: 'Photo taken by a phone front camera propped on the counter of a corner shop in Cheetham Hill, Manchester, mid-morning. Marcus - white Mancunian man, late 50s, grey stubble, glasses, green fleece over a checked shirt - stands behind the till looking into the camera, dry half-smile. Behind him: shelves of tins and packets with labels turned or blurred so nothing is legible, a chiller cabinet, a stack of newspapers with no readable masthead, a security mirror in the corner. Strip lighting. Everything in focus. No legible text, no brand names, no logos. Aspect 16:9, webcam framing, chest up.' },
    { key: 'aisha',  name: 'Aisha',  trade: 'Dessert lounge',  area: 'Wilmslow Road', where: 'the counter, cake display beside her',
      look: 'British-Pakistani woman, late 20s, dark hijab, plain black apron over a grey long-sleeve top',
      frame: 'Photo taken by a phone front camera propped on the counter of a small dessert lounge on Wilmslow Road, Manchester, early evening before the rush. Aisha - British-Pakistani woman, late 20s, dark hijab, plain black apron over a grey long-sleeve top - stands behind the counter looking straight into the camera, bright smile. Beside her: a glass display of cakes and waffles, a milkshake machine, a tip jar. Behind: a pink-and-white tiled wall, a menu board with the writing too small to read, a neon sign switched off. Soft even light. Everything in focus. No legible text, no brand names, no logos. Aspect 16:9, webcam framing, chest up.' }
  ];

  var host = { key: 'host', name: 'NeroPay', trade: 'Host', area: '', where: 'desk, charcoal wall',
    look: 'the same presenter in every episode, 30s, plain dark crewneck, no jewellery',
    frame: 'Photo taken by a laptop webcam at eye level in a quiet office: one person, 30s, plain dark crewneck, no jewellery, sitting at a desk against a flat charcoal wall with nothing on it, looking straight into the camera with a calm, open expression. A closed notebook and a mug on the desk, both plain. Soft even light from a window to the left. Everything in focus. No text, no brand names, no logos. Aspect 16:9, webcam framing, chest up.' };

  /* host listening loops — generated once, reused in the top-right box in every episode */
  var listen = [
    { id: 'LISTEN-1', secs: 10, prompt: 'HOST LISTENING LOOP - 10s\nNo speech. Listening to someone talk. Two slow nods a few seconds apart, a small smile at the end, eyes on the lens throughout. Mouth stays closed. The final frame matches the first so the clip loops.' },
    { id: 'LISTEN-2', secs: 10, prompt: 'HOST LISTENING LOOP - 10s\nNo speech. Listening, then a short amused exhale and a nod, as if the other person said something wry. Eyes on the lens, one brief glance down to the notebook and back. Mouth stays closed. The final frame matches the first so the clip loops.' },
    { id: 'LISTEN-3', secs: 10, prompt: 'HOST LISTENING LOOP - 10s\nNo speech. Listening closely, a slight lean in, a small tilt of the head, one slow nod near the end. Eyes on the lens throughout. Mouth stays closed. The final frame matches the first so the clip loops.' }
  ];

  /* the episodes — shots in order. kind: host | bite | title | end */
  var episodes = [
    { id: 'C1', ep: 1, date: 'Thu 17 Sep', title: 'What did your last statement actually say?',
      question: 'When did you last actually read your card statement?',
      desc: 'Want the one number that tells you what you\'re really paying? Send us last month\'s statement and we\'ll work it out - including if the answer is that you\'re already on a good deal. neropay.app',
      shots: [
        { kind: 'host', id: 'C1-H1', secs: 7, delivery: 'Easy, conversational. A warm-up, not a test.', gesture: 'A small open hand on "read it", then still.',
          spoken: 'Honest answer. When did you last actually read your card statement? Not open it. Read it.' },
        { kind: 'title', id: '[TITLE]', secs: 4 },
        { kind: 'bite', id: 'C1-01', who: 'sam', secs: 8, delivery: 'Honest and amused at himself. The gas bill line is a shrug, not a joke he\'s proud of.', gesture: 'A shrug on "close it", a small wave on "survive it".',
          spoken: 'Read it? I open it, look at the big number, close it. It\'s like the gas bill. You don\'t read the gas bill. You survive it.' },
        { kind: 'bite', id: 'C1-02', who: 'priya', secs: 9, delivery: 'Wry. She knows exactly how this sounds.', gesture: 'Counts four on her fingers, then a flat hand on "Monday happened".',
          spoken: 'Once. Properly. About a year ago, on a Sunday, with a coffee. Found four things I was paying for that I\'d never heard of. Then Monday happened.' },
        { kind: 'bite', id: 'C1-03', who: 'marcus', secs: 8, cold: true, delivery: 'Deadpan. The drawer is a bit he has done before and he still likes it.', gesture: 'A glance down and to the side, towards the drawer.',
          spoken: 'It comes in the post. It goes in the drawer with the other post. The drawer\'s quite full now. I\'d need a bigger drawer.' },
        { kind: 'bite', id: 'C1-04', who: 'dilek', secs: 9, delivery: 'Warm, a little exasperated with herself. Not a complaint about her son.', gesture: 'Hand marks "the lamb", "the staff", then an open palm on "that one".',
          spoken: 'My son reads it. He says, "Mum, it\'s fine." Fine. I know what the lamb costs. I know what the staff cost, to the penny. That one? I couldn\'t tell you.' },
        { kind: 'host', id: 'C1-H2', secs: 7, delivery: 'Light. Genuinely curious what they\'ll say.', gesture: 'A small nod on "fair", a finger to the temple on "in your head".',
          spoken: 'Fair. Second one. What rate do you think you\'re on? Just the number in your head. No looking.' },
        { kind: 'bite', id: 'C1-05', who: 'tomasz', secs: 8, delivery: 'Thinking out loud, half laughing.', gesture: 'A vague wave on "nought point something", finger and thumb close together on "tiny writing".',
          spoken: 'Nought point something. It was on the leaflet. Big number, tiny writing underneath. Whether that\'s what leaves the account, no idea.' },
        { kind: 'bite', id: 'C1-06', who: 'aisha', secs: 8, delivery: 'Sharp, matter of fact. She has actually tried the sum.', gesture: 'Mimes scribbling on the counter on "napkin".',
          spoken: 'I know what I was quoted. I also know it\'s not what I pay, because I did the sum on the back of a napkin and it didn\'t match.' },
        { kind: 'bite', id: 'C1-07', who: 'sam', secs: 8, delivery: 'Listing, stepping up each time, amused.', gesture: 'Hand climbs with each "then", then a thumb flick on "page two".',
          spoken: 'There\'s the rate. Then there\'s the rate for the other cards. Then there\'s a page of things that aren\'t rates at all. Page two is where it lives.' },
        { kind: 'bite', id: 'C1-08', who: 'marcus', secs: 9, delivery: 'Dry, then a beat of real thought on the last line. He means it.', gesture: 'A shrug on "don\'t quote me", then still on "nobody\'s asked".',
          spoken: 'One per cent? Don\'t quote me. You know what, nobody\'s ever asked me that. Forty years behind this counter. Nobody\'s asked.' },
        { kind: 'host', id: 'C1-H3', secs: 7, delivery: 'Plain and level. This is the useful bit, not the sell.', gesture: 'One hand over the other on "divided by", then rest.',
          spoken: 'Here\'s the useful bit. One number tells the truth. Everything on the statement, divided by what you took on cards.' },
        { kind: 'host', id: 'C1-H4', secs: 7, delivery: 'Even. The concession first, then the nudge.', gesture: 'An open palm on "stay put", a small tap on "do the sum".',
          spoken: 'Some people do that sum and it\'s already a good deal. Stay put. Most people have never done the sum. Do the sum.' },
        { kind: 'end', id: '[END]', secs: 6 }
      ] },

    { id: 'C2', ep: 2, date: 'Thu 1 Oct', title: 'Friday night, and the card machine\'s down',
      question: 'Friday, half seven, queue out the door, and the card machine says no connection. What happens next?',
      desc: 'If your terminal drops out when the wi-fi does, tell us how often. We\'ll tell you honestly whether it\'s the connection or the box. neropay.app',
      shots: [
        { kind: 'host', id: 'C2-H1', secs: 8, delivery: 'Setting a scene, a little playful.', gesture: 'A small "picture it" gesture, then still.',
          spoken: 'Picture it. Friday, half seven. Queue out the door. The card machine says: no connection. What happens next?' },
        { kind: 'title', id: '[TITLE]', secs: 4 },
        { kind: 'bite', id: 'C2-01', who: 'sam', secs: 9, cold: true, delivery: 'Fast, reliving it, laughing by the end.', gesture: 'Mimes writing the sign, then a thumb over the shoulder on "next door".',
          spoken: 'Panic. Then a bit of cardboard: "CASH ONLY". Half the queue hasn\'t carried cash since about 2019. They go next door. Next door loves me on Fridays.' },
        { kind: 'bite', id: 'C2-02', who: 'tomasz', secs: 8, delivery: 'Rueful. It has happened more than once.', gesture: 'A nod towards the street, a glance up at the imaginary rain.',
          spoken: 'I\'ve walked a customer to the cash machine. Stood outside my own shop in the rain, waiting for him. That\'s a Friday in Longsight.' },
        { kind: 'bite', id: 'C2-03', who: 'priya', secs: 9, delivery: 'The tone of someone who solved a mystery far too late.', gesture: 'Points back towards the café on "microwave".',
          spoken: 'Ours dropped every Saturday morning for a month. Turned out it was the microwave in the kitchen. Someone heats a croissant, the card machine dies.' },
        { kind: 'bite', id: 'C2-04', who: 'marcus', secs: 9, delivery: 'Flat, resigned, funny. "Thanked her anyway" is the whole man.', gesture: 'Phone-to-ear mime on "helpline", a small shrug at the end.',
          spoken: 'Rang the helpline. Twenty-five minutes of music. Bit of Vivaldi. By the time a human answered, it had come back on its own. Thanked her anyway.' },
        { kind: 'host', id: 'C2-H2', secs: 7, delivery: 'Practical. Moving from the story to the need.', gesture: 'A small point downwards on "the box on the counter".',
          spoken: 'So, in that moment, what do you actually need from the box on the counter?' },
        { kind: 'bite', id: 'C2-05', who: 'dilek', secs: 9, delivery: 'Firm, clear. She has thought about this.', gesture: 'Hand pushes forward gently on "keep working", a wave across the room on "forty people".',
          spoken: 'Keep working. That\'s it. Take the card, hold it, send it when the signal\'s back. Don\'t make forty people watch me press buttons.' },
        { kind: 'bite', id: 'C2-06', who: 'aisha', secs: 9, delivery: 'Direct, tired of ticket numbers.', gesture: 'Shakes her head slightly on "ticket number", a flat hand on "not Tuesday".',
          spoken: 'A person who answers. Not a ticket number. Someone who knows it\'s me, knows the shop, and rings back the same night. Not Tuesday.' },
        { kind: 'bite', id: 'C2-07', who: 'priya', secs: 7, delivery: 'Hopeful, simple.', gesture: 'Holds up her phone briefly, then puts it down.',
          spoken: 'If it can flip to the phone signal on its own, without me doing anything, that\'s most of my Saturdays back.' },
        { kind: 'bite', id: 'C2-08', who: 'tomasz', secs: 8, delivery: 'Grinning. He likes this line and delivers it to the lens.', gesture: 'Palms flat and level on "boring".',
          spoken: 'Honestly? Boring. I want it boring. Nobody\'s ever said "ooh, tell me about your card machine" to a happy man.' },
        { kind: 'host', id: 'C2-H3', secs: 8, delivery: 'Plain, unhurried. Facts only.', gesture: 'One finger up on "two things", then still.',
          spoken: 'Two things solve most of it. A terminal that runs on wi-fi, 4G or offline, so the card goes through when the signal comes back. NeroPay Flex does that.' },
        { kind: 'host', id: 'C2-H4', secs: 8, delivery: 'Warm, then the concession, plainly. "Carry on" is kind, not dismissive.', gesture: 'A second finger on "a person", an open palm on "carry on".',
          spoken: 'And a person fifteen minutes down the road who picks up. If your connection has never once dropped, this isn\'t your problem. Genuinely. Carry on.' },
        { kind: 'end', id: '[END]', secs: 6 }
      ] },

    { id: 'C3', ep: 3, date: 'Thu 15 Oct', title: 'The six weeks before Christmas',
      question: 'The six weeks before Christmas. What actually changes at your counter?',
      desc: 'Doing a stall, a market or a big-table December? Tell us what you\'re working with and we\'ll say whether a portable terminal actually helps or whether the one you\'ve got is fine. neropay.app',
      shots: [
        { kind: 'host', id: 'C3-H1', secs: 7, delivery: 'Bright, seasonal, straight in.', gesture: 'A small open hand on "your counter".',
          spoken: 'The six weeks before Christmas. What actually changes at your counter?' },
        { kind: 'title', id: '[TITLE]', secs: 4 },
        { kind: 'bite', id: 'C3-01', who: 'aisha', secs: 9, cold: true, delivery: 'Energised, slightly overwhelmed in a good way. The last line is a joke she\'s pleased with.', gesture: 'Hands show "same counter" width, then a wave over her shoulder at the queue.',
          spoken: 'Everything doubles and nothing gets bigger. Same counter, same two of us, twice the queue. December\'s not a month. It\'s a queue with a calendar.' },
        { kind: 'bite', id: 'C3-02', who: 'dilek', secs: 9, delivery: 'Fond and weary about big tables. The taxi line gets a small laugh from her.', gesture: 'Points down the imaginary long table, then a little hailing wave on "taxi".',
          spoken: 'Big tables. Office parties. Twelve people, one bill, six ways, and there\'s always one at the far end waving a card like he\'s hailing a taxi.' },
        { kind: 'bite', id: 'C3-03', who: 'marcus', secs: 9, delivery: 'Plain observation, a small smile on "twenty quid".', gesture: 'Taps the counter on "cards, always cards".',
          spoken: 'Late nights. People in at eleven when the big shops are shut, buying wrapping paper and a bottle of something. Cards, always cards. Nobody\'s got twenty quid on them.' },
        { kind: 'bite', id: 'C3-04', who: 'priya', secs: 8, delivery: 'Excited about the stall, exasperated by the socket.', gesture: 'A shrug with both hands on "half a mile".',
          spoken: 'The Christmas market. Three weeks on a stall. Different till, different everything, and not a plug socket for half a mile.' },
        { kind: 'host', id: 'C3-H2', secs: 6, delivery: 'Simple, practical.', gesture: 'Still, a small nod.',
          spoken: 'What would make December easier, just on the payment side?' },
        { kind: 'bite', id: 'C3-05', who: 'sam', secs: 9, delivery: 'Emphatic, friendly.', gesture: 'Hands show a metre on "a metre wide", then a flat hand hovering over it on "living on it".',
          spoken: 'Take the machine to the customer, not the customer to the machine. My counter\'s a metre wide and there\'s a queue living on it.' },
        { kind: 'bite', id: 'C3-06', who: 'priya', secs: 8, delivery: 'Specific. She has been here before. Air quotes on "expenses".', gesture: 'Mimes tearing off a receipt, then air quotes.',
          spoken: 'Something that works on a stall with no wi-fi and prints a receipt. People want receipts in December. It\'s all "expenses".' },
        { kind: 'bite', id: 'C3-07', who: 'dilek', secs: 8, delivery: 'Decisive.', gesture: 'Six fingers, then a flat hand on "done", a thumb back on "kitchen".',
          spoken: 'Split the bill at the table. Six cards, one machine, done at the table. Not six trips to the till while the kitchen\'s on fire.' },
        { kind: 'bite', id: 'C3-08', who: 'aisha', secs: 7, delivery: 'Firm, funny.', gesture: 'Shakes her head on "two in the afternoon", a hand on the counter on "it\'s the shop".',
          spoken: 'A battery that lasts a Saturday. I\'m not charging anything at two in the afternoon. It\'s not a phone. It\'s the shop.' },
        { kind: 'host', id: 'C3-H3', secs: 10, delivery: 'Clear and level. Product facts, stated once.', gesture: 'A hand shape for the terminal on "carry", then rest.',
          spoken: 'Mostly one thing: a terminal you can carry. NeroPay Flex has a five-and-a-half-inch screen, a printer built in, and runs on wi-fi, 4G or offline. A stall or a far table stops being a problem.' },
        { kind: 'host', id: 'C3-H4', secs: 8, delivery: 'The honest exception, then the date, plainly.', gesture: 'An open palm on "probably fine", a small nod on "not during".',
          spoken: 'If you\'re one counter, one queue and solid wi-fi, the one you\'ve got is probably fine. Markets open around the sixth of November. Decide before then, not during.' },
        { kind: 'end', id: '[END]', secs: 6 }
      ] },

    { id: 'C4', ep: 4, date: 'Thu 5 Nov', title: 'How many screens are you running?',
      question: 'How many separate systems are on your counter right now?',
      desc: 'Adding up printouts at the end of the night? Send us a photo of your counter - honestly, just the counter - and we\'ll tell you what could be one screen. neropay.app',
      shots: [
        { kind: 'host', id: 'C4-H1', secs: 8, delivery: 'Playful. A challenge.', gesture: 'Counts in the air on "screens, tablets, notebooks".',
          spoken: 'Count for me. How many separate systems are on your counter right now? Screens, tablets, notebooks. The lot.' },
        { kind: 'title', id: '[TITLE]', secs: 4 },
        { kind: 'bite', id: 'C4-01', who: 'sam', secs: 10, cold: true, delivery: 'Counting, getting more amused as he goes. "Six" lands flat.', gesture: 'Fingers up one at a time, ends on six held up.',
          spoken: 'Till. Card machine. Two tablets for two delivery apps. A printer that only talks to one of them. And a notebook, for when none of them talk to each other. Six.' },
        { kind: 'bite', id: 'C4-02', who: 'tomasz', secs: 9, delivery: 'Proud of the diary, aware it\'s absurd.', gesture: 'Holds up an imaginary diary, mimes a pencil on "in pencil".',
          spoken: 'A diary. Paper. And a card machine. Bookings come by phone, WhatsApp, Instagram, and a lad who just walks in. All of it ends up in the diary. In pencil.' },
        { kind: 'bite', id: 'C4-03', who: 'marcus', secs: 9, delivery: 'Dry, self-correcting at the end.', gesture: 'Taps twice on the counter on "type it twice".',
          spoken: 'Till and card machine, and they\'ve never been introduced. Every sale I type twice. Twice. Forty years. Well, since cards. Before that it was just the once.' },
        { kind: 'bite', id: 'C4-04', who: 'aisha', secs: 9, delivery: 'Brisk. This is her nightly routine and she\'s over it.', gesture: 'Three fingers, then mimes a calculator with one thumb.',
          spoken: 'Three. Till, card machine, tablet for the online orders. End of the night it\'s three printouts, a calculator, and me, doing maths at midnight.' },
        { kind: 'host', id: 'C4-H2', secs: 6, delivery: 'Gentle. Not judging.', gesture: 'A small tilt of the head.',
          spoken: 'And the end-of-day sum. How long does that take, honestly?' },
        { kind: 'bite', id: 'C4-05', who: 'dilek', secs: 9, delivery: 'Matter of fact, a sigh in it. "Sometimes second time" with a small smile.', gesture: 'Lists on her fingers, then an open hand on "never match".',
          spoken: 'An hour after close. Till report, card total, the cash, the bookings. They never match first time. Sometimes second time.' },
        { kind: 'bite', id: 'C4-06', who: 'priya', secs: 8, delivery: 'Wry, logical.', gesture: 'A small shrug on "busy means mistakes".',
          spoken: 'Twenty minutes if it\'s right. An hour if it\'s wrong. It\'s wrong on Saturdays, because Saturdays are busy and busy means mistakes.' },
        { kind: 'bite', id: 'C4-07', who: 'sam', secs: 8, delivery: 'Fond, a bit guilty.', gesture: 'Mimes handing over a bag.',
          spoken: 'My accountant gets a carrier bag in January. An actual bag. She\'s very patient. She shouldn\'t have to be.' },
        { kind: 'bite', id: 'C4-08', who: 'tomasz', secs: 7, delivery: 'Sheepish grin. "I know, I know" straight to the lens.', gesture: 'Palms up on "that\'s my accounts".',
          spoken: 'I don\'t do a sum. I look at the bank on Monday morning. That\'s my accounts. I know. I know.' },
        { kind: 'host', id: 'C4-H3', secs: 10, delivery: 'Plain. Product facts stated once.', gesture: 'A hand flat on the desk on "already", then rest.',
          spoken: 'The terminal we install has the till on it already. NeroPOS: products, staff, a kitchen screen, the Z-report at the end of the night, and it posts straight into Xero or QuickBooks. No monthly software fee.' },
        { kind: 'host', id: 'C4-H4', secs: 7, delivery: 'The exception first, then the nudge.', gesture: 'An open palm on "keep it", a small tap on "fix first".',
          spoken: 'If your till already does all that and talks to your accountant, keep it. If you\'re adding up printouts at midnight, that\'s the thing to fix first.' },
        { kind: 'end', id: '[END]', secs: 6 }
      ] },

    { id: 'C5', ep: 5, date: 'Thu 19 Nov', title: 'Who gets paid before you do?',
      question: 'Every time an online order comes in, who gets paid before you do?',
      desc: 'Want your regulars ordering direct? We\'ll set up an ordering page with no commission per order and show you where it lands in the kitchen. Keep the apps for new customers. neropay.app',
      shots: [
        { kind: 'host', id: 'C5-H1', secs: 7, delivery: 'Straight question, no edge.', gesture: 'A small circling gesture on "comes in".',
          spoken: 'Online orders. Every time one comes in, who gets paid before you do?' },
        { kind: 'title', id: '[TITLE]', secs: 4 },
        { kind: 'bite', id: 'C5-01', who: 'sam', secs: 9, cold: true, delivery: 'Counting off, resigned but not bitter. "Same chicken though" is a shrug.', gesture: 'Three fingers, a pinch on "a lot less", a shrug on "same chicken".',
          spoken: 'The app. Then the driver. Then the card. By the time it lands with me, a twenty-pound order is a lot less than twenty pounds. Same chicken, though.' },
        { kind: 'bite', id: 'C5-02', who: 'aisha', secs: 10, delivery: 'Balanced, fair to the apps, then the sting.', gesture: 'An open palm on "not knocking them", a hand to the chest on "regulars".',
          spoken: 'The apps found me customers I\'d never have got. Not knocking them. But my regulars order through them too. Same people who could walk in. That\'s the bit that stings.' },
        { kind: 'bite', id: 'C5-03', who: 'dilek', secs: 9, delivery: 'Wry acceptance. "Somewhere" trails off with a smile.', gesture: 'Points at the window on "QR code", taps her own phone, then a vague wave on "somewhere".',
          spoken: 'We stuck a QR code in the window. People still order through the app. Habit. The app\'s on their phone. My website\'s... somewhere.' },
        { kind: 'bite', id: 'C5-04', who: 'marcus', secs: 7, delivery: 'Plain, unbothered, a hint of "watch this space".', gesture: 'A shrug, then a small point at the lens on "ask me again".',
          spoken: 'I don\'t do online. My customers walk in. That might change. It hasn\'t yet. Ask me again next Christmas.' },
        { kind: 'host', id: 'C5-H2', secs: 8, delivery: 'Curious, constructive.', gesture: 'A small "straight line" gesture on "straight from you".',
          spoken: 'If a regular could order straight from you, no app in the middle, what would have to be true?' },
        { kind: 'bite', id: 'C5-05', who: 'priya', secs: 9, delivery: 'Clear conditions, counted. The password line is the laugh.', gesture: 'One finger on "one link", a flat hand on "no account", an eye-roll on "password".',
          spoken: 'Easy. One link, no account, pay on the phone, done. If they have to make a password they\'re back on the app before it loads.' },
        { kind: 'bite', id: 'C5-06', who: 'sam', secs: 9, delivery: 'Firm, kitchen-practical.', gesture: 'Thumb over the shoulder at the pass on "same screen".',
          spoken: 'It has to land in the kitchen exactly like the app orders. Same screen, same ticket. I\'m not checking a second screen at eight on a Friday.' },
        { kind: 'bite', id: 'C5-07', who: 'aisha', secs: 7, delivery: 'Reasonable, both hands. "It\'s not a divorce" with a grin.', gesture: 'One hand for "new people", the other for "regulars", then both together.',
          spoken: 'Keep the apps for new people. Give the regulars a way to come direct. Both. It\'s not a divorce.' },
        { kind: 'bite', id: 'C5-08', who: 'dilek', secs: 8, delivery: 'Final, decisive.', gesture: 'A slicing gesture on "slice", a thumb back on "kitchen".',
          spoken: 'And no cut per order. A fee I can see, once. Not a slice off every plate that leaves the kitchen.' },
        { kind: 'host', id: 'C5-H3', secs: 9, delivery: 'Level. Facts only.', gesture: 'A hand drawing a straight line on "direct", then rest.',
          spoken: 'NeroWeb is the direct route: your own ordering page, paid on the phone, landing on the same kitchen screen as everything else. No commission per order.' },
        { kind: 'host', id: 'C5-H4', secs: 9, delivery: 'The concession for app-dependent places, fairly, then the line.', gesture: 'One hand beside the other on "alongside", an open palm on "worth their cut".',
          spoken: 'It sits alongside Deliveroo and Uber Eats. It doesn\'t replace them, and if you live on new customers the apps are still worth their cut. For regulars, go direct.' },
        { kind: 'end', id: '[END]', secs: 6 }
      ] },

    { id: 'C6', ep: 6, date: 'Thu 3 Dec', title: 'What did you actually sign?',
      question: 'Do you know how long your card machine agreement runs, and what it costs to leave?',
      desc: 'Not sure what you signed? Send us the agreement and we\'ll tell you the term, the exit fee as a number, and what can change without you. neropay.app',
      shots: [
        { kind: 'host', id: 'C6-H1', secs: 8, delivery: 'Calm, direct. Not a gotcha.', gesture: 'A small open hand on "leave".',
          spoken: 'The agreement for your card machine. Do you know how long it runs, and what it costs to leave?' },
        { kind: 'title', id: '[TITLE]', secs: 4 },
        { kind: 'bite', id: 'C6-01', who: 'marcus', secs: 10, delivery: 'Flat, with a raised eyebrow on "bigger than staying". "Grudgingly" to himself.', gesture: 'Four fingers, then a shrug, then folded arms on "grudgingly".',
          spoken: 'Four years. Found that out in year two, when I tried to leave. There was a number to get out that was bigger than staying. So I stayed. Grudgingly.' },
        { kind: 'bite', id: 'C6-02', who: 'tomasz', secs: 9, delivery: 'Laughing at himself. Each "somewhere, probably" a little less sure.', gesture: 'Mimes signing with a finger on a tablet, then a vague wave.',
          spoken: 'Signed it on a tablet, in the shop, on a Tuesday, between two haircuts. Never seen it since. It\'s in an email. Somewhere. Probably.' },
        { kind: 'bite', id: 'C6-03', who: 'priya', secs: 8, delivery: 'Sarcastic on "lovely timing", but light.', gesture: 'Mimes opening a letter, then a slow clap of one hand on the table.',
          spoken: 'Mine renews itself. Every year. I got a letter saying it had renewed, dated the week after it renewed. Lovely timing, that.' },
        { kind: 'bite', id: 'C6-04', who: 'dilek', secs: 8, cold: true, delivery: 'Warm, a little rueful. The shoes line is fond, not bitter.', gesture: 'A hand to the chest on "lovely", a glance down on "shoes", an open palm on "the term".',
          spoken: 'The rep was lovely. Very lovely. I remember the rep. I remember his shoes. I don\'t remember the term.' },
        { kind: 'host', id: 'C6-H2', secs: 7, delivery: 'Constructive. Turning it forward.', gesture: 'A small nod, then still.',
          spoken: 'If you were signing again tomorrow, what would you ask before your name goes on it?' },
        { kind: 'bite', id: 'C6-05', who: 'sam', secs: 10, delivery: 'Emphatic, each word landing. "Give me numbers" is almost a plea.', gesture: 'A flat hand on "months", again on "pounds", both palms up on "give me numbers".',
          spoken: 'How long, in months. Not "standard term". Months. What\'s the number to leave, in pounds. Not "a fee". Pounds. I can read numbers. Give me numbers.' },
        { kind: 'bite', id: 'C6-06', who: 'aisha', secs: 9, delivery: 'Sharp, thinking it through. "It\'ll be a Saturday" with a knowing look.', gesture: 'A hand on the counter on "own it", a hand out on "coming for it".',
          spoken: 'Do I own the machine or am I renting it? Because if I\'m renting, someone\'s coming for it one day, and it\'ll be a Saturday.' },
        { kind: 'bite', id: 'C6-07', who: 'marcus', secs: 9, delivery: 'Plain, a lesson learned. Callback to the drawer with the smallest smile.', gesture: 'A finger up on "without me saying yes", a glance at the drawer on the last line.',
          spoken: 'What can go up without me saying yes. Because something did, and I found it on the statement three months later. In the drawer.' },
        { kind: 'bite', id: 'C6-08', who: 'tomasz', secs: 8, delivery: 'Almost pleading, funny. The last line to the lens.', gesture: 'Hands open on "just stop", a handshake mime, then palms up on "why is that hard".',
          spoken: 'Can I just... stop? One month\'s notice, hand it back, shake hands, done. That\'s the whole question. Why is that hard?' },
        { kind: 'host', id: 'C6-H3', secs: 8, delivery: 'Clear, counted. This is the B3 material, compressed.', gesture: 'Four fingers, one at a time.',
          spoken: 'Four questions. How long. Do I own it. What\'s the exit fee, as a number. And what can change without me.' },
        { kind: 'host', id: 'C6-H4', secs: 8, delivery: 'Sourced and plain. A fact, not a pitch.', gesture: 'Still, a small nod on "eighteen months".',
          spoken: 'Since January 2023 the regulator caps new terminal hire at eighteen months, then it rolls monthly. Payment Systems Regulator, Specific Direction 16.' },
        { kind: 'host', id: 'C6-H5', secs: 8, delivery: 'The concession, warmly. Ending on the honest line.', gesture: 'An open palm on "isn\'t a problem", then rest.',
          spoken: 'And if you\'re two years into a deal that\'s working, a long term isn\'t a problem. Being tied in only matters the day it stops working.' },
        { kind: 'end', id: '[END]', secs: 6 }
      ] }
  ];

  /* next episodes — briefs, not scripts yet. Same shape when they get written. */
  var ideas = [
    { id: 'C7', title: 'The five-pound minimum', when: 'January, the sprint',
      question: 'The "£5 minimum on card" sign. Why is it there, and does it work?',
      owners: 'Marcus (the sign has been up since 2011), Aisha (took hers down and nothing happened), Tomasz (a £9 trim on card, every time), Priya (the 80p flapjack problem).',
      host: 'A minimum spend is allowed. A surcharge for paying by card isn\'t — banned for consumer cards since January 2018 under the Payment Surcharges Regulations. Then the concession: if most of your sales are under a pound, a minimum might genuinely be right for you.',
      why: 'Every corner shop and café in the territory has one of these signs. Nobody has ever explained the rule behind it. Ends with a fact, not a pitch.' },
    { id: 'C8', title: 'The chargeback', when: 'January',
      question: 'A customer says they never made that payment. What happens next?',
      owners: 'Dilek (a table of eight, one card, one dispute, three months later), Sam (the driver said delivered, the customer said not), Tomasz (he keeps every receipt in a shoebox now), Marcus (won one, lost one, still not sure why).',
      host: 'What the bank asks for: the receipt, the time, the CCTV stamp if there is one. What the till keeps for you automatically. Then the concession: sometimes the customer is right, and the quickest way out is a refund and a cup of tea.',
      why: 'Genuinely frightening the first time it happens, and nobody talks about it in public. High save-and-share value on Facebook.' },
    { id: 'C9', title: 'Tips on the card machine', when: 'February, after the Ramadan window',
      question: 'When someone tips on the card machine, where does it go?',
      owners: 'Aisha (the tip jar versus the tip button), Dilek (twelve staff, one Saturday, one pot), Priya (the barista who only does Sundays), Sam (delivery drivers and the tip line nobody sees).',
      host: 'Since 1 October 2024 the Employment (Allocation of Tips) Act says every tip goes to staff, in full, by the end of the following month, with a written policy. What the till can do with that. Then the concession: in a two-person shop, a jar and a Friday split is still the simplest honest system there is.',
      why: 'A law most small operators have half-heard of. Explaining it plainly, with the owners\' real confusions first, is the whole Statement pillar in one episode.' },
    { id: 'C10', title: 'Ramadan at the counter', when: 'Late January, before the window closes ~5 Feb',
      question: 'Ramadan. What changes at the counter, and what do you wish you\'d sorted in January?',
      owners: 'Aisha (the iftar rush: forty covers arriving in the same eleven minutes), Sam (kitchen goes quiet all afternoon, then the phones melt), plus two owners written for this episode — a Rusholme grill and a Longsight sweet shop — because the regular cast is short on the businesses this is about.',
      host: 'Bookings and pre-orders for the rush, QR pay so a full room settles up without a queue, and the one honest line: if your setup worked last Ramadan, February is the wrong month to change anything. Sort it in January or leave it until after Eid.',
      why: 'The territory is Rusholme, Longsight, Cheetham Hill. This is the month that matters most to them and the one every national provider ignores. Respectful, practical, and timed to the calendar.' }
  ];

  /* build the paste-able prompts and the timecodes */
  var byKey = {}; cast.forEach(function (c) { byKey[c.key] = c; });
  function tc(s) { var m = Math.floor(s / 60), r = s - m * 60; return m + ':' + (r < 10 ? '0' : '') + (Number.isInteger(r) ? r : r.toFixed(1)); }
  episodes.forEach(function (e) {
    var t = 3; /* the three-second cold open comes first */
    e.cold = e.shots.filter(function (s) { return s.cold; })[0] || null;
    e.shots.forEach(function (s) {
      s.tc = tc(t) + '–' + tc(t + s.secs); t += s.secs;
      if (s.kind === 'bite') {
        var c = byKey[s.who];
        s.prompt = 'BITE ' + s.id + ' - ' + s.secs + 's\nWHO: ' + c.name + ' - ' + c.trade.toLowerCase() + ', ' + c.area + '. Attached frame: ' + c.where + '.\n' +
          'DELIVERY: ' + s.delivery + '\nGESTURE: ' + s.gesture + '\nSPEAKS: "' + s.spoken + '"';
      } else if (s.kind === 'host') {
        s.prompt = 'HOST ' + s.id + ' - ' + s.secs + 's\nDELIVERY: ' + s.delivery + '\nGESTURE: ' + s.gesture + '\nSPEAKS: "' + s.spoken + '"';
      } else if (s.kind === 'title') {
        s.prompt = 'Black screen · BEHIND THE COUNTER · episode ' + e.ep + ' · music in · then the question card';
      } else {
        s.prompt = 'Charcoal screen · wordmark · "New episode every other Thursday" · "Subscribe for more"\nFine print: Dramatised with AI-generated characters; not customer testimony. NeroPay is a trading name of Nero Panda Ltd.';
      }
    });
    e.runtime = tc(t);
  });
  cast.forEach(function (c) { c.framePrompt = 'STARTING FRAME - ' + c.name.toUpperCase() + ' - ' + c.trade + ', ' + c.area + '\n\n' + c.frame; });
  host.framePrompt = 'STARTING FRAME - HOST - NeroPay side\n\n' + host.frame;

  return { series: series, merchantGlobal: merchantGlobal, hostGlobal: hostGlobal, cast: cast, host: host, listen: listen, episodes: episodes, ideas: ideas };
})();
