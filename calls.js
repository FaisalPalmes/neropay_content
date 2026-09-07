/* NeroPay Content Warehouse — Behind the Counter (series C).

   A video-call montage, every other Thursday. One question from the NeroPay side,
   answered by six owner-operators in their own premises, cut together from "call
   bites". Everyone in it is AI-generated and every episode says so on screen in the
   first three seconds. The owners are composite characters, not customers: they
   describe situations, they never endorse NeroPay, and the host carries the product
   facts and the concession. That is what keeps this a dramatised explainer and not a
   fabricated testimonial (CAP Code 3.45–3.47; DMCC Act 2024 fake-review ban).

   This file is hand-edited data, like posts.js. Add an episode by copying one.
   Timecodes are worked out from `secs` on the page, so only durations need typing.   */
window.CALLS = (function () {
  "use strict";

  var series = {
    id: 'C',
    name: 'Behind the Counter',
    strap: 'One question. Six counters. Every other Thursday.',
    cadence: 'Fortnightly, Thursdays. Two a month. Skips the dead week of 26 October and goes dark 18 Dec – 3 Jan.',
    aspect: '16:9',
    layout: 'Owner full-frame. NeroPay host in a small rectangle top right, listening. Name plate bottom left. Disclosure over the first three seconds.',
    premise: 'The credibility job, not the acquisition job. A merchant who has met NeroPay at the counter searches that evening and finds people like them talking plainly about the same problems. Nothing in an episode asks for anything; the description carries the ask.'
  };

  var merchantGlobal =
'Video-call footage of a small business owner, filmed by the front camera of a laptop or phone propped at chest height inside their own premises, mid-shift. They talk straight down the lens like they are on a call with someone they get on with.\n\n' +
'REALISM: must read as a real webcam feed of a real person, not generated video. Slight webcam softness and neutral exposure are fine; no filter, no beauty smoothing, no cinematic grade. Skin keeps its texture and pores. Eyes blink irregularly, with natural moisture and catchlights. Small imperfections stay - a hair out of place, a crooked collar, a mark on the apron. Lips match the words precisely. Nothing smooths, morphs, drifts or resets.\n\n' +
'VOICE: British. A natural Greater Manchester accent, light and unforced, not performed. Not posh, not American, not transatlantic. British pronunciation and rhythm throughout, including numbers and money.\n\n' +
'WHO THEY ARE: a working owner-operator, warm, candid and a bit wry. Cheerful even when describing a problem - this is someone who likes their job. Talking to one person, not an audience. Even pace, no rising inflection at the end of sentences. Eye contact with the lens, held, with the occasional glance off as they think.\n\n' +
'MOVEMENT: subtle and alive. Natural blinking, small head movements, a lean in, a shrug, a laugh through the nose, hands coming up into frame when the words call for it and dropping again. Never stiff, never theatrical, never presenting.\n\n' +
'THE ROOM: exactly as the attached frame - same premises, layout, light and objects. Deep focus, everything sharp, no bokeh. Anything in the background stays consistent with the frame and only moves gently if it was already moving. No new people walk through. If a card terminal is in frame it carries no visible branding.\n\n' +
'CAMERA: the device is propped and does not move. No pan, tilt, zoom, drift or shake. First and last frame framed identically.\n\n' +
'DO NOT: second speaker, cutaway, on-screen text, caption, logo, watermark, graphic, music or sound effect.';

  var hostGlobal =
'Video-call footage of the NeroPay side of a call: one person at a desk in a quiet office, filmed by a laptop webcam at eye level, plain charcoal wall behind them, talking to a business owner they are interviewing.\n\n' +
'REALISM: must read as a real webcam feed of a real person, not generated video. Neutral exposure, no filter, no beauty smoothing, no cinematic grade. Skin keeps its texture. Eyes blink irregularly, with natural moisture and catchlights. Small imperfections stay. Lips match the words precisely. Nothing smooths, morphs, drifts or resets.\n\n' +
'VOICE: British. A natural, everyday UK accent, clear and neutral. Not American, not put-on posh. British pronunciation and rhythm throughout, including numbers and money. Any presenter, male or female, but the same one in every episode.\n\n' +
'WHO THEY ARE: calm, curious, on the owner\'s side. Asks the question, then genuinely listens. Never salesy, never hyped, never presenting. Even pace, no rising inflection at the end of sentences. Direct eye contact with the lens, held.\n\n' +
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
        { kind: 'host', id: 'C1-H1', secs: 8, delivery: 'Easy, conversational. A warm-up question, not a test.', gesture: 'A small open hand on "read it", then still.',
          spoken: 'Quick one to start. When did you last actually read your card statement? Not open it. Read it.' },
        { kind: 'title', id: '[TITLE]', secs: 4 },
        { kind: 'bite', id: 'C1-01', who: 'sam', secs: 7, delivery: 'Honest and amused at himself.', gesture: 'A shrug on "close it".',
          spoken: 'Honestly? I open it, look at the total, close it. It\'s a number I pay. That\'s the relationship.' },
        { kind: 'bite', id: 'C1-02', who: 'priya', secs: 8, delivery: 'Wry. She knows how this sounds.', gesture: 'Counts "four things" on her fingers, then drops the hand.',
          spoken: 'I read it once, properly, about a year ago. Found four things I didn\'t know I was paying for. Then I got busy again.' },
        { kind: 'bite', id: 'C1-03', who: 'marcus', secs: 7, delivery: 'Deadpan. The drawer is a running joke he\'s made before.', gesture: 'A glance down and to the side towards the drawer.',
          spoken: 'It comes in the post. It goes in the drawer with the other post. The drawer\'s quite full.' },
        { kind: 'bite', id: 'C1-04', who: 'dilek', secs: 9, delivery: 'Warm, a little exasperated with herself. Not a complaint about her son.', gesture: 'Hand marks "the food", "the staff", then an open palm on "that one".',
          spoken: 'My son reads it. He says, "Mum, it\'s fine." I don\'t know what fine means. I know what the food cost. I know what the staff cost. That one, I don\'t know.' },
        { kind: 'host', id: 'C1-H2', secs: 7, delivery: 'Light. Genuinely curious what they\'ll say.', gesture: 'A small nod on "fair", then still.',
          spoken: 'Fair. Second question. What rate do you think you\'re on? Just the number in your head.' },
        { kind: 'bite', id: 'C1-05', who: 'tomasz', secs: 8, delivery: 'Thinking out loud, half laughing.', gesture: 'A vague wave on "nought point something".',
          spoken: 'Nought point something. It was the number on the leaflet. Whether that\'s what\'s coming out, I couldn\'t tell you.' },
        { kind: 'bite', id: 'C1-06', who: 'aisha', secs: 7, delivery: 'Sharp, matter of fact. She has actually tried the sum.', gesture: 'A quick tap on the counter on "never matches".',
          spoken: 'I know what I was quoted. I\'m fairly sure it\'s not what I pay, because the total never matches when I do the sum.' },
        { kind: 'bite', id: 'C1-07', who: 'sam', secs: 7, delivery: 'Listing, stepping up each time, amused.', gesture: 'Hand climbs a little with each "and then".',
          spoken: 'There\'s the rate. Then there\'s the other rate for the other cards. And then there\'s a page of fees.' },
        { kind: 'bite', id: 'C1-08', who: 'marcus', secs: 8, delivery: 'Dry, then a beat of real thought on the last line.', gesture: 'A shrug on "don\'t hold me to it".',
          spoken: 'I\'d say one per cent. Don\'t hold me to it. Nobody\'s ever asked me that before, which tells you something.' },
        { kind: 'host', id: 'C1-H3', secs: 7, delivery: 'Plain and level. This is the useful bit, not the sell.', gesture: 'One hand over the other on "divided by", then rest.',
          spoken: 'Here\'s the honest bit. One number tells you the truth: everything on the statement, divided by what you took on cards.' },
        { kind: 'host', id: 'C1-H4', secs: 7, delivery: 'Even. The concession first, then the nudge.', gesture: 'An open palm on "stay put", a small tap on "do the sum".',
          spoken: 'Some people do that sum and find they\'re already on a good deal. Then stay put. Most haven\'t done the sum. Do the sum.' },
        { kind: 'end', id: '[END]', secs: 6 }
      ] },

    { id: 'C2', ep: 2, date: 'Thu 1 Oct', title: 'Friday night, and the card machine\'s down',
      question: 'Friday, half seven, queue out the door, and the card machine says no connection. What happens next?',
      desc: 'If your terminal drops out when the wi-fi does, tell us how often. We\'ll tell you honestly whether it\'s the connection or the box. neropay.app',
      shots: [
        { kind: 'host', id: 'C2-H1', secs: 8, delivery: 'Setting a scene, a little playful.', gesture: 'A small "picture it" gesture, then still.',
          spoken: 'Picture it. Friday, half seven, queue out the door, and the card machine says "no connection". What happens next?' },
        { kind: 'title', id: '[TITLE]', secs: 4 },
        { kind: 'bite', id: 'C2-01', who: 'sam', secs: 8, delivery: 'Fast, reliving it, laughing at the end.', gesture: 'Mimes writing the sign, then a thumb over the shoulder on "next door".',
          spoken: 'Panic. Then a sign on the counter: "cash only". Half the queue hasn\'t carried cash since 2019. They go next door.' },
        { kind: 'bite', id: 'C2-02', who: 'tomasz', secs: 7, delivery: 'Rueful. It has happened more than once.', gesture: 'A nod towards the street.',
          spoken: 'I\'ve walked a customer to the cash machine. Stood outside my own shop, waiting. That\'s a Friday for you.' },
        { kind: 'bite', id: 'C2-03', who: 'priya', secs: 8, delivery: 'The tone of someone who solved a mystery too late.', gesture: 'Points back towards the café on "microwave".',
          spoken: 'The wi-fi drops when the kitchen microwave\'s on. I only worked that out after a month of Saturday-morning outages.' },
        { kind: 'bite', id: 'C2-04', who: 'marcus', secs: 8, delivery: 'Flat, resigned, funny.', gesture: 'Phone-to-ear mime on "helpline".',
          spoken: 'Rang the helpline. Twenty-five minutes of music. By the time someone answered, the machine had come back on its own.' },
        { kind: 'host', id: 'C2-H2', secs: 7, delivery: 'Practical. Moving from the story to the need.', gesture: 'A small point downwards on "the box on the counter".',
          spoken: 'So what do you actually need from the box on the counter at that moment?' },
        { kind: 'bite', id: 'C2-05', who: 'dilek', secs: 9, delivery: 'Firm, clear. She has thought about this.', gesture: 'Hand pushes forward gently on "keep working".',
          spoken: 'It needs to keep working. That\'s all. Take the card, put it in a queue, send it when it\'s back. Don\'t make my customers wait.' },
        { kind: 'bite', id: 'C2-06', who: 'aisha', secs: 8, delivery: 'Direct, a bit tired of ticket numbers.', gesture: 'Shakes her head slightly on "ticket number".',
          spoken: 'Someone who answers. Not a ticket number. A person who knows my shop and rings back the same evening.' },
        { kind: 'bite', id: 'C2-07', who: 'priya', secs: 7, delivery: 'Hopeful, simple.', gesture: 'Holds up her phone briefly, then puts it down.',
          spoken: 'If it can fall back to the phone signal without me doing anything, that\'s most of my problem gone.' },
        { kind: 'bite', id: 'C2-08', who: 'tomasz', secs: 7, delivery: 'Grinning. He likes this line.', gesture: 'Palms flat and level on "boring".',
          spoken: 'Honestly, I want it boring. Boring is the dream. Nobody talks about their card machine when it\'s boring.' },
        { kind: 'host', id: 'C2-H3', secs: 8, delivery: 'Plain, unhurried. Facts only.', gesture: 'One finger up on "two things", then still.',
          spoken: 'Two things solve most of it. A terminal that runs on wi-fi, 4G or offline, so the card goes through when the signal comes back. NeroPay Flex does that.' },
        { kind: 'host', id: 'C2-H4', secs: 8, delivery: 'Warm, then the concession, plainly.', gesture: 'A second finger on "a person", an open palm on "that\'s fine".',
          spoken: 'And a person fifteen minutes down the road who picks up. If your connection has never once dropped, this isn\'t your problem, and that\'s fine.' },
        { kind: 'end', id: '[END]', secs: 6 }
      ] },

    { id: 'C3', ep: 3, date: 'Thu 15 Oct', title: 'The six weeks before Christmas',
      question: 'The six weeks before Christmas. What actually changes on your counter?',
      desc: 'Doing a stall, a market or a big-table December? Tell us what you\'re working with and we\'ll say whether a portable terminal actually helps or whether the one you\'ve got is fine. neropay.app',
      shots: [
        { kind: 'host', id: 'C3-H1', secs: 7, delivery: 'Bright, seasonal, straight in.', gesture: 'A small open hand on "your counter".',
          spoken: 'The six weeks before Christmas. What actually changes on your counter?' },
        { kind: 'title', id: '[TITLE]', secs: 4 },
        { kind: 'bite', id: 'C3-01', who: 'aisha', secs: 9, delivery: 'Energised, slightly overwhelmed in a good way.', gesture: 'Hands show "same counter" width, then a wave over her shoulder at the queue.',
          spoken: 'Everything doubles and nothing gets bigger. Same counter, same two of us, twice the queue. The queue is the whole business in December.' },
        { kind: 'bite', id: 'C3-02', who: 'dilek', secs: 9, delivery: 'Fond and weary about big tables.', gesture: 'Points down the imaginary long table on "far end".',
          spoken: 'Bookings. Big tables. Office parties who want to split the bill six ways, and someone always wants to pay from the far end of the table.' },
        { kind: 'bite', id: 'C3-03', who: 'marcus', secs: 8, delivery: 'Plain observation, a small smile on "twenty quid".', gesture: 'Taps the counter on "cards, always cards".',
          spoken: 'Late nights. People buying at eleven at night when the big shops are shut. Cards, always cards. Nobody\'s got twenty quid on them.' },
        { kind: 'bite', id: 'C3-04', who: 'priya', secs: 8, delivery: 'Excited about the stall, exasperated by the socket.', gesture: 'A shrug with both hands on "no plug socket".',
          spoken: 'The Christmas market. We do a stall for three weeks. Different till, different everything, and no plug socket.' },
        { kind: 'host', id: 'C3-H2', secs: 6, delivery: 'Simple, practical.', gesture: 'Still, a small nod.',
          spoken: 'What would make December easier, just on the payment side?' },
        { kind: 'bite', id: 'C3-05', who: 'sam', secs: 9, delivery: 'Emphatic, friendly.', gesture: 'Hands show a metre on "a metre wide".',
          spoken: 'Take the machine to the customer. Not the customer to the machine. My counter\'s a metre wide and it\'s got a queue on it.' },
        { kind: 'bite', id: 'C3-06', who: 'priya', secs: 8, delivery: 'Specific. She has been here before.', gesture: 'Mimes tearing off a receipt.',
          spoken: 'Something that works on a stall with no wi-fi and prints a receipt, because people want receipts in December. Work expenses.' },
        { kind: 'bite', id: 'C3-07', who: 'dilek', secs: 8, delivery: 'Decisive.', gesture: 'Six fingers, then a flat hand on "done".',
          spoken: 'Split the bill at the table, without a walk back to the till every time. Six cards, one machine, done at the table.' },
        { kind: 'bite', id: 'C3-08', who: 'aisha', secs: 6, delivery: 'Firm, funny.', gesture: 'Shakes her head on "two in the afternoon".',
          spoken: 'A battery that lasts a Saturday. I\'m not charging anything at two in the afternoon.' },
        { kind: 'host', id: 'C3-H3', secs: 10, delivery: 'Clear and level. Product facts, stated once.', gesture: 'A hand shape for the terminal on "carry", then rest.',
          spoken: 'That\'s mostly one thing: a terminal you can carry. NeroPay Flex has a five-and-a-half-inch screen, a printer built in, and runs on wi-fi, 4G or offline, so a stall or a far table isn\'t a problem.' },
        { kind: 'host', id: 'C3-H4', secs: 8, delivery: 'The honest exception, then the date, plainly.', gesture: 'An open palm on "probably fine", a small nod on "before then".',
          spoken: 'If you\'re one counter, one queue and good wi-fi, the one you\'ve got is probably fine. The markets open around the sixth of November. Sort it before then.' },
        { kind: 'end', id: '[END]', secs: 6 }
      ] },

    { id: 'C4', ep: 4, date: 'Thu 5 Nov', title: 'How many screens are you running?',
      question: 'How many separate systems are on your counter right now?',
      desc: 'Adding up printouts at the end of the night? Send us a photo of your counter - honestly, just the counter - and we\'ll tell you what could be one screen. neropay.app',
      shots: [
        { kind: 'host', id: 'C4-H1', secs: 8, delivery: 'Playful. A challenge.', gesture: 'Counts in the air on "screens, tablets, notebooks".',
          spoken: 'Count for me. How many separate systems are on your counter right now? Screens, tablets, notebooks, the lot.' },
        { kind: 'title', id: '[TITLE]', secs: 4 },
        { kind: 'bite', id: 'C4-01', who: 'sam', secs: 9, delivery: 'Counting, getting more amused as he goes.', gesture: 'Fingers up one at a time, ends on six.',
          spoken: 'Till. Card machine. Two tablets for two delivery apps. A printer that only talks to one of them. And a notebook. Six.' },
        { kind: 'bite', id: 'C4-02', who: 'tomasz', secs: 8, delivery: 'Proud of the diary, aware it\'s absurd.', gesture: 'Holds up an imaginary diary.',
          spoken: 'A diary. A paper one. And a card machine. Bookings by phone, WhatsApp, Instagram, and a lad who walks in. All in the diary.' },
        { kind: 'bite', id: 'C4-03', who: 'marcus', secs: 8, delivery: 'Dry, self-correcting at the end.', gesture: 'Taps twice on the counter on "type it twice".',
          spoken: 'Till and card machine, and they don\'t talk to each other. Every sale I type twice. Twice, for forty years. Well. Since cards.' },
        { kind: 'bite', id: 'C4-04', who: 'aisha', secs: 8, delivery: 'Brisk. This is her nightly routine.', gesture: 'Mimes a calculator with one thumb.',
          spoken: 'Three. Till, card machine, and the tablet for online orders. End of the night I add up three printouts with a calculator.' },
        { kind: 'host', id: 'C4-H2', secs: 6, delivery: 'Gentle. Not judging.', gesture: 'A small tilt of the head.',
          spoken: 'And the end-of-day sum. How long does that take you, honestly?' },
        { kind: 'bite', id: 'C4-05', who: 'dilek', secs: 8, delivery: 'Matter of fact, a sigh in it.', gesture: 'Lists on her fingers, then an open hand on "never match".',
          spoken: 'An hour after close. The till report, the card machine total, the cash, the bookings. They never match first time.' },
        { kind: 'bite', id: 'C4-06', who: 'priya', secs: 8, delivery: 'Wry, logical.', gesture: 'A small shrug on "busy means mistakes".',
          spoken: 'Twenty minutes if it\'s right. An hour if it\'s wrong. It\'s wrong on Saturdays, because Saturdays are busy and busy means mistakes.' },
        { kind: 'bite', id: 'C4-07', who: 'sam', secs: 7, delivery: 'Fond, a bit guilty.', gesture: 'Mimes handing over a bag.',
          spoken: 'My accountant gets a carrier bag in January. She\'s very patient. She shouldn\'t have to be.' },
        { kind: 'bite', id: 'C4-08', who: 'tomasz', secs: 7, delivery: 'Sheepish grin. "I know, I know" to the lens.', gesture: 'Palms up on "that\'s my accounts".',
          spoken: 'I don\'t do a sum. I look at the bank on Monday. That\'s my accounts. I know. I know.' },
        { kind: 'host', id: 'C4-H3', secs: 10, delivery: 'Plain. Product facts stated once.', gesture: 'A hand flat on the desk on "already", then rest.',
          spoken: 'The card terminal we install has the till on it already. NeroPOS: products, staff, a kitchen screen, the Z-report at the end of the night, and it books straight into Xero or QuickBooks. No monthly software fee.' },
        { kind: 'host', id: 'C4-H4', secs: 7, delivery: 'The exception first, then the nudge.', gesture: 'An open palm on "keep it", a small tap on "change first".',
          spoken: 'If your till does all that and talks to your accountant, keep it. If you\'re adding up printouts, that\'s the thing to change first.' },
        { kind: 'end', id: '[END]', secs: 6 }
      ] },

    { id: 'C5', ep: 5, date: 'Thu 19 Nov', title: 'Who gets paid before you do?',
      question: 'Every time an online order comes in, who gets paid before you do?',
      desc: 'Want your regulars ordering direct? We\'ll set up an ordering page with no commission per order and show you where it lands in the kitchen. Keep the apps for new customers. neropay.app',
      shots: [
        { kind: 'host', id: 'C5-H1', secs: 7, delivery: 'Straight question, no edge.', gesture: 'A small circling gesture on "comes in".',
          spoken: 'Online orders. Every time one comes in, who gets paid before you do?' },
        { kind: 'title', id: '[TITLE]', secs: 4 },
        { kind: 'bite', id: 'C5-01', who: 'sam', secs: 9, delivery: 'Counting off, resigned but not bitter.', gesture: 'Three fingers, then a pinch on "isn\'t a twenty-pound order".',
          spoken: 'The app. Then the driver. Then the card. By the time it gets to me, a twenty-pound order isn\'t a twenty-pound order.' },
        { kind: 'bite', id: 'C5-02', who: 'aisha', secs: 9, delivery: 'Balanced, fair to the apps, then the sting.', gesture: 'An open palm on "not knocking them", a hand to the chest on "regulars".',
          spoken: 'The apps brought me customers I\'d never have had. I\'m not knocking them. But regulars order through them too, and that\'s the bit that hurts.' },
        { kind: 'bite', id: 'C5-03', who: 'dilek', secs: 9, delivery: 'Wry acceptance.', gesture: 'Points at the window on "QR code", then taps her own phone.',
          spoken: 'We put a QR code in the window. People still order through the app. Habit. The app\'s on their phone. My website isn\'t.' },
        { kind: 'bite', id: 'C5-04', who: 'marcus', secs: 6, delivery: 'Plain, unbothered, a hint of "watch this space".', gesture: 'A shrug.',
          spoken: 'I don\'t do online. My customers walk in. That might change. It hasn\'t yet.' },
        { kind: 'host', id: 'C5-H2', secs: 8, delivery: 'Curious, constructive.', gesture: 'A small "straight line" gesture on "straight from you".',
          spoken: 'If a regular could order straight from you, without an app in the middle, what would need to be true?' },
        { kind: 'bite', id: 'C5-05', who: 'priya', secs: 8, delivery: 'Clear conditions, counted.', gesture: 'One finger on "one link", a flat hand on "no account".',
          spoken: 'It has to be easy. One link, no account, pay on the phone. If they have to sign up for anything, they go back to the app.' },
        { kind: 'bite', id: 'C5-06', who: 'sam', secs: 8, delivery: 'Firm, kitchen-practical.', gesture: 'Thumb over the shoulder at the pass on "the kitchen".',
          spoken: 'It has to land in the kitchen the same way the app orders do. I\'m not checking a second screen at eight on a Friday.' },
        { kind: 'bite', id: 'C5-07', who: 'aisha', secs: 7, delivery: 'Reasonable, both hands.', gesture: 'One hand for "new people", the other for "regulars".',
          spoken: 'Keep the apps for new people. Give the regulars a way to come direct. Both. Not one or the other.' },
        { kind: 'bite', id: 'C5-08', who: 'dilek', secs: 7, delivery: 'Final, decisive.', gesture: 'A slicing gesture on "slice of every plate".',
          spoken: 'And no cut per order. A fee I can see, once. Not a slice of every plate.' },
        { kind: 'host', id: 'C5-H3', secs: 9, delivery: 'Level. Facts only.', gesture: 'A hand drawing a straight line on "direct", then rest.',
          spoken: 'NeroWeb is the direct route: your own ordering page, paid on the phone, landing on the same kitchen screen as everything else. No commission per order.' },
        { kind: 'host', id: 'C5-H4', secs: 9, delivery: 'The concession for app-dependent places, fairly, then the line.', gesture: 'One hand beside the other on "alongside", an open palm on "worth their cut".',
          spoken: 'It sits alongside Deliveroo and Uber Eats. It doesn\'t replace them, and for a place that lives on new customers the apps are still worth their cut. For regulars, go direct.' },
        { kind: 'end', id: '[END]', secs: 6 }
      ] },

    { id: 'C6', ep: 6, date: 'Thu 3 Dec', title: 'What did you actually sign?',
      question: 'Do you know how long your card machine agreement runs for, and what it costs to leave?',
      desc: 'Not sure what you signed? Send us the agreement and we\'ll tell you the term, the exit fee as a number, and what can change without you. neropay.app',
      shots: [
        { kind: 'host', id: 'C6-H1', secs: 8, delivery: 'Calm, direct. Not a gotcha.', gesture: 'A small open hand on "leave".',
          spoken: 'The agreement for your card machine. Do you know how long it runs for, and what it costs to leave?' },
        { kind: 'title', id: '[TITLE]', secs: 4 },
        { kind: 'bite', id: 'C6-01', who: 'marcus', secs: 9, delivery: 'Flat, with a raised eyebrow on "more than staying".', gesture: 'Four fingers, then a shrug.',
          spoken: 'Four years. I found out when I tried to leave in year two. There was a number to get out that was more than staying.' },
        { kind: 'bite', id: 'C6-02', who: 'tomasz', secs: 8, delivery: 'Laughing at himself.', gesture: 'Mimes signing with a finger on a tablet.',
          spoken: 'I signed it on a tablet in the shop, on a Tuesday, between two haircuts. I\'ve never seen it since. It\'s in an email somewhere.' },
        { kind: 'bite', id: 'C6-03', who: 'priya', secs: 8, delivery: 'Sarcastic on "nice timing", but light.', gesture: 'Mimes opening a letter.',
          spoken: 'Mine renews on its own. Every year. I got a letter saying it had renewed, dated the week after it renewed. Nice timing.' },
        { kind: 'bite', id: 'C6-04', who: 'dilek', secs: 7, delivery: 'Warm, a little rueful.', gesture: 'A hand to the chest on "lovely", then an open palm on "the term".',
          spoken: 'The rep was lovely. Very lovely. I remember the rep. I don\'t remember the term.' },
        { kind: 'host', id: 'C6-H2', secs: 7, delivery: 'Constructive. Turning it forward.', gesture: 'A small nod, then still.',
          spoken: 'If you were signing again tomorrow, what would you ask before you put your name on it?' },
        { kind: 'bite', id: 'C6-05', who: 'sam', secs: 9, delivery: 'Emphatic, each word landing.', gesture: 'A flat hand on "months", again on "pounds".',
          spoken: 'How long, in months. Not "standard term". Months. And what\'s the number to leave, in pounds. Not "a fee". Pounds.' },
        { kind: 'bite', id: 'C6-06', who: 'aisha', secs: 8, delivery: 'Sharp, thinking it through.', gesture: 'A hand on the counter on "own it", then a hand out on "want it back".',
          spoken: 'Do I own the machine, or am I renting it? Because if I\'m renting it, someone\'s going to want it back, and it\'ll be my problem.' },
        { kind: 'bite', id: 'C6-07', who: 'marcus', secs: 8, delivery: 'Plain, a lesson learned.', gesture: 'A finger up on "without me saying yes".',
          spoken: 'What can go up without me saying yes. Because something did, and I only saw it on the statement three months later.' },
        { kind: 'bite', id: 'C6-08', who: 'tomasz', secs: 7, delivery: 'Almost pleading, funny.', gesture: 'Hands open on "just stop", then a flat "done".',
          spoken: 'Can I just stop? One month\'s notice, hand it back, done. That\'s the whole question.' },
        { kind: 'host', id: 'C6-H3', secs: 8, delivery: 'Clear, counted. This is the B3 material, compressed.', gesture: 'Four fingers, one at a time.',
          spoken: 'Four questions. How long. Do I own it. What\'s the exit fee, as a number. And what can change without me.' },
        { kind: 'host', id: 'C6-H4', secs: 8, delivery: 'Sourced and plain. A fact, not a pitch.', gesture: 'Still, a small nod on "eighteen months".',
          spoken: 'Since January 2023 the regulator caps new terminal hire at eighteen months, then monthly. Payment Systems Regulator, Specific Direction 16.' },
        { kind: 'host', id: 'C6-H5', secs: 8, delivery: 'The concession, warmly. Ending on the honest line.', gesture: 'An open palm on "isn\'t a problem", then rest.',
          spoken: 'And if you\'re two years into a deal that\'s working, a long term isn\'t a problem. Being tied in only matters when it stops working.' },
        { kind: 'end', id: '[END]', secs: 6 }
      ] }
  ];

  /* build the paste-able prompts and the timecodes */
  var byKey = {}; cast.forEach(function (c) { byKey[c.key] = c; });
  function tc(s) { var m = Math.floor(s / 60), r = s - m * 60; return m + ':' + (r < 10 ? '0' : '') + (Number.isInteger(r) ? r : r.toFixed(1)); }
  episodes.forEach(function (e) {
    var t = 0;
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

  return { series: series, merchantGlobal: merchantGlobal, hostGlobal: hostGlobal, cast: cast, host: host, listen: listen, episodes: episodes };
})();
