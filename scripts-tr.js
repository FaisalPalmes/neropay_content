/* NeroPay Content Warehouse — Turkish scripts
   ------------------------------------------------------------------
   Hand-written, not machine-translated. B1 was worked through line by
   line with Elif on 10 September 2026; the rules she gave are kept in
   GUIDE below so every video after B1 reads in the same register.

   This file is data only. Every line here is a translation of an
   English line that already exists in videos.js or calls.js — the
   English stays the source of truth. If a figure changes, change it in
   generation-pack.md first, then in the English, then here.

   Keyed by shot id, flat, so a page can look up any line without
   knowing which video it came from.                                  */

window.SCRIPTS_TR = {

  status: "Draft 1 · 10 Sep 2026 · B1 reviewed with Elif, B2–B3, A1–A3 and C1–C6 written to the same rules · nothing filmed yet",

  /* ---------- how to translate the next one ----------
     What Elif corrected. Each rule is the fault first, then the fix,
     because the fault is what a straight translation produces.        */
  guide: [
    { rule: "Keep the English card words. Turkish merchants use them.",
      bad: "banka kartı, kurumsal kart, uluslararası kart",
      good: "debit kart, kredi kartı, şirket kartı / business kart, Amex, yurt dışı kartı (UK dışı)",
      why: "Every owner in Rusholme and Cheetham Hill reads these words on their own statement in English. Translating them makes the sentence sound like a bank circular, and worse, makes the owner unsure you mean the same thing they're looking at." },

    { rule: "Decimals are spoken with nokta, not virgül.",
      bad: "yüzde sıfır virgül beş",
      good: "yüzde sıfır nokta beş",
      why: "Elif said nokta every single time, unprompted. It is what the trade says out loud, even though virgül is what school taught. Percentages always lead with yüzde, then the figure. Written is the other way round: a graphic sets it as %0,5 with a comma — spoken nokta, printed virgül." },

    { rule: "Money is pound and peni. Never sterlin, never kuruş.",
      bad: "308 sterlin 46 kuruş",
      good: "üç yüz sekiz pound kırk altı peni",
      why: "Sterlin is newsreader Turkish. Kuruş is the wrong country. Elif caught herself saying kuruş twice and corrected to peni both times." },

    { rule: "Numbers are spelled out, exactly as in the English scripts.",
      bad: "28.400 £, %1,09",
      good: "yirmi sekiz bin dört yüz pound, yüzde bir nokta sıfır dokuz",
      why: "Same reason the English pack spells them out: the video model reads digits wrong and the presenter's mouth has to match. It also forces you to decide how the figure is actually said." },

    { rule: "Statement is döküm — hesap dökümü, banka dökümü, or the fatura that arrives.",
      bad: "beyan, ekstre metni, hesap özeti",
      good: "hesap dökümü / banka dökümü / geçen ayın dökümü",
      why: "Ekstre is a credit-card word in Turkish and pulls the wrong picture. Elif used döküm and fatura interchangeably, which is how owners talk about the thing that arrives each month." },

    { rule: "Effective rate is efektif oran, glossed the first time.",
      bad: "etkin oran, geçerli oran",
      good: "efektif oran — yani gerçekte ödediğiniz oran",
      why: "Etkin is a translation nobody says. Elif reached for 'gerçekten efektif olan, işleyen oran' — so the English loanword with a plain Turkish gloss beside it is the honest version." },

    { rule: "Payout is the money coming back to you, and the sentence should sound like it.",
      bad: "mutabakat ücreti, ödeme aktarım bedeli",
      good: "kendi paranızı kendi hesabınıza gönderdikleri her sefer için ...",
      why: "Elif spent longer on this line than any other: 'kendi kazandıkları parayı kendi banka hesaplarına transfer etmek istediklerinde yine bir para ödemeleri gerekiyor.' The indignation is the point of the line. A neutral noun phrase kills it." },

    { rule: "Per-transaction fee is her işlem başına, not otorizasyon ücreti.",
      bad: "otorizasyon ücreti",
      good: "her işlem başına dört peni",
      why: "Authorisation is a processor's word. The owner counts transactions, not authorisations." },

    { rule: "Address the viewer as siz. The presenter speaks for NeroPay, so it is biz, never ben.",
      bad: "ben size anlatayım, bence",
      good: "size söylendi, sorun, hesaplayın · bizden bu kadar, yayınlıyoruz",
      why: "Rail 3: everything posts as NeroPay. Elif slipped into third person while explaining to us (müşteriler, dükkan sahipleri) but switched to siz the moment she addressed the camera at the end — that instinct is the right one." },

    { rule: "Short sentences. Let the number land at the end.",
      bad: "Yirmi sekiz bin dört yüz poundluk bir ciro üzerinden hesaplandığında ortaya çıkan oran yüzde bir nokta sıfır dokuzdur.",
      good: "Yirmi sekiz bin dört yüz poundluk ciro üzerinden bu, yüzde bir nokta sıfır dokuz eder.",
      why: "Turkish puts the verb last, so a long sentence hides the figure behind the grammar. Break it. Same rule as the English voice: cut the first clause and see if it still works." },

    { rule: "Aslında, yani and mesela are Elif's joints. Use them, sparingly.",
      bad: "Bununla birlikte, söz konusu oran ...",
      good: "Ama aslında o oran ... · Yani soru şu ... · Mesela bir restoran.",
      why: "They're how a Turkish speaker turns a corner mid-explanation. Written connectives (bununla birlikte, dolayısıyla) make the presenter sound like they're reading." },

    { rule: "Concede in Turkish too, and concede plainly.",
      bad: "elbette her işletme farklıdır",
      good: "Herkese uymaz. · Oldukları yerde kalmalarını söylüyoruz. · Cidden. Devam edin.",
      why: "Rail 8. The concession is what makes the rest believable, and a hedge-shaped concession isn't one." },

    { rule: "Never translate the rails away.",
      bad: "kredi imkânı, finansman, taksit, kazanç, garantili tasarruf",
      good: "—",
      why: "Rails 1, 2 and 8 apply to every language. No lending or credit language (s.21 FSMA), no earnings claims, no guaranteed saving. A Turkish caption is a financial promotion in exactly the same way an English one is." }
  ],

  /* ---------- what Elif said that doesn't match the pack ----------
     Raised, not silently applied. The English figures are the ones the
     overlays are drawn from and they reconcile; hers don't.           */
  flags: [
    { heard: "terminal kirası 13 pound 50",
      pack: "£17.50 a month",
      note: "Keep 17.50. The pack's non-percentage charges only add to £75.65 — and the total to £308.46, which every overlay carries — if rental is 17.50. Worth confirming she misheard rather than that she has a newer figure." },
    { heard: "her transferde 11 pound 64",
      pack: "£3.00 a payout, 4 payouts, £12.00 in the month",
      note: "She has the monthly total roughly right and the per-payout figure wrong. B1-09 says three pounds each time, which is the line the overlay draws." },
    { heard: "debit kartlar toplamın yüzde 71'i",
      pack: "70%",
      note: "Trivial, but B1-07 says seventy and OV-2 adds to 601 of 780. Kept at seventy." },
    { heard: "0.7 flat rate",
      pack: "0.70% flat, across every card",
      note: "Matches — and stays an open question for Eray either way. The internal ladder (1.30% + 15p, 0.80% floor) is a different story from the one the videos tell. Don't reconcile it in the Turkish either." }
  ],

  /* ---------- generation ----------
     The presenter and host globals both specify a British voice. A
     Turkish generation needs that paragraph swapped, or the model gives
     you a British actor reading Turkish phonetically.                 */
  voice: {
    presenter: "VOICE: Turkish. Natural, everyday Istanbul Turkish, clear and neutral. A native speaker's rhythm and stress, not a dubbed or read-aloud cadence. Turkish pronunciation throughout, including numbers and money; English brand and card names (NeroPay, Amex, Xero, QuickBooks, PCI) said the way a Turkish speaker in Britain says them, not anglicised and not over-corrected. Any presenter, male or female.",
    host: "VOICE: Turkish. Natural, everyday Istanbul Turkish, clear and neutral. A native speaker's rhythm and stress, not a dubbed cadence. Turkish pronunciation throughout, including numbers and money. Any presenter, male or female, but the same one in every episode.",
    merchant: "VOICE: Turkish. Natural, unforced Turkish as spoken by a long-settled owner in Greater Manchester — a native speaker's rhythm, lightly conversational, never performed. Turkish pronunciation throughout, including numbers and money; English words that belong to the shop (card, terminal, WhatsApp, Instagram) said the way they are actually said behind a counter."
  },

  /* ---------- upload ----------
     Rail 4. The disclosure is made at upload, not inside the video —
     Faisal's decision, 9 Sep 2026. A Turkish upload is a separate
     upload and needs its own setting and its own disclosure line.     */
  disclosure: "Bu videodaki sunucu yapay zekâ ile oluşturulmuştur.",
  disclosureNote: "Turkish uploads are separate uploads: tick YouTube's \"altered or synthetic content\" on each one and put the Turkish disclosure line in the Turkish description. The setting does not carry over from the English video.",

  /* ---------- titles ---------- */
  titles: {
    B1: "Size söylenen oran, ödediğiniz oran değil",
    B2: "Aynı iki teklif, iki işletmeye neden bambaşka yakışır",
    B3: "Sözleşmeler, asgari süreler ve çıkış ücretleri: imzadan önce dört soru",
    A1: "İş ortaklığı programı nedir, kimin için",
    A2: "Bir iş ortağı gerçekte ne yapar",
    A3: "Tanıştırdıktan sonra müşterinize ne olur",
    C1: "Son dökümünüzde gerçekte ne yazıyordu?",
    C2: "Cuma akşamı, kart makinesi çalışmıyor",
    C3: "Noel'den önceki altı hafta",
    C4: "Kaç ekran çalıştırıyorsunuz?",
    C5: "Sizden önce kim para alıyor?",
    C6: "Siz neyi imzaladınız?"
  },

  /* ---------- the question each Behind the Counter episode asks ---------- */
  questions: {
    C1: "Kart ödeme dökümünüzü en son ne zaman gerçekten okudunuz?",
    C2: "Cuma, yedi buçuk, kuyruk kapıda ve kart makinesi bağlantı yok diyor. Sonra ne oluyor?",
    C3: "Noel'den önceki altı hafta. Tezgâhınızda gerçekte ne değişiyor?",
    C4: "Şu anda tezgâhınızda kaç ayrı sistem var?",
    C5: "Her online sipariş geldiğinde, sizden önce kim para alıyor?",
    C6: "Kart makinesi sözleşmeniz ne kadar sürüyor ve çıkmak kaça mal oluyor?"
  },

  /* ---------- description + pinned comment ---------- */
  desc: {
    B1: "Gerçek efektif oranınızı öğrenmek ister misiniz? Geçen ayın dökümünü bize gönderin, hesaplayıp ne anlama geldiğini söyleyelim — cevap \"zaten iyi bir orandasınız\" olsa bile. neropay.app",
    B2: "Yirmi altı pound altmış yedinin hangi tarafındasınız, emin değil misiniz? Geçen ayın dökümünü gönderin, ortalama satış tutarınızı çıkarıp hangi fiyat yapısının size uyduğunu söyleyelim. neropay.app",
    B3: "İmzalamadan önce ikinci bir göz ister misiniz? Sözleşmeyi ve son dökümünüzü gönderin, ne yazdığını söyleyelim. neropay.app"
  },

  /* ---------- on-screen graphics ----------
     The overlays in overlays.js are drawn in English. A Turkish upload
     needs them redrawn — the spoken track alone isn't a Turkish video.
     B1's wording is settled here so whoever redraws it isn't inventing
     terms; B2, B3 and A1–A3 overlays are still to do.                 */
  overlayNote: "Spoken lines only. Every OV card, title card, end card and question card is still English. Redraw before any Turkish upload — the figures don't change, only the labels.",
  overlayText: {
    "B1/OV-1": { label: "ilan edilen oran", rows: ["Debit (tüketici)", "Kredi (tüketici)", "Şirket / ticari", "American Express", "Yurt dışı / UK dışı"] },
    "B1/OV-2": { head: ["Kart türü", "İşlem", "Tutar", "Oran", "Ücret"], total: "Toplam", note: "Örnek hesaplama. Gerçek bir döküm değil." },
    "B1/OV-3": { rows: ["İşlem ücretleri", "Terminal kirası, aylık", "PCI DSS uyum ücreti, aylık", "Hesap / ekstre ücreti, aylık", "Transfer ücreti — hesabınıza aktarım", "Aylık minimum hizmet ücreti"], notTriggered: "uygulanmadı", summary: "Sadece bu ücretler", equals: "cironun yüzde 0,27'si" },
    "B1/OV-4": { top: "DÖKÜMDEKİ HER ÜCRET", bottom: "TOPLAM KART CİROSU", result: "EFEKTİF ORANINIZ" },
    "B1/OV-5": { left: "SÖYLENEN", right: "GERÇEKTE ÖDENEN", note1: "28.400,00 pound kart cirosu üzerinde 308,46 pound toplam ücret", note2: "Söylenen oranın iki katından fazla" },
    "B1/OV-6": { left: "%0,5 KADEMELİ", right: "%0,7 SABİT", rows: ["Debit oranı", "Kredi, ticari, Amex, yurt dışı", "Ücretler: işlem, kira, PCI, hesap, transfer", "Toplam ücret"], none: "yok", summary: "Daha yüksek görünen oranla ayda 109,65 pound daha az" },
    "B1/OV-7": { lines: ["Tüketici kredi kartlarında oran nedir", "Şirket ve ticari kartlarda oran nedir", "American Express'te oran nedir", "UK dışı kartlarda oran nedir", "Hesabıma yapılan her transfer ne tutuyor", "PCI ücreti, hesap ücreti veya aylık minimum var mı", "Efektif oranım nedir"] }
  },

  /* ---------- every spoken line, keyed by shot id ---------- */
  lines: {

    /* ===== B1 — reviewed with Elif, 10 Sep 2026 ===== */
    "B1-01": "Kart ödemelerine başlarken size bir oran söylendi. Belki yüzde sıfır nokta beş. Neredeyse kesin, ödediğiniz oran o değil.",
    "B1-02": "Kimse size yalan söylemedi. O oran sadece tek bir kart türünü kapsıyor; dökümde ise çok daha fazlası var.",
    "B1-03": "Bir yerde yüzde sıfır nokta beşten başlayan bir oran görüyorsanız, o debit kart oranıdır. Debit, kartların en ucuzudur.",
    "B1-04": "Kredi kartları bundan pahalı. Şirket kartları daha da pahalı. Amex ve yurt dışı kartları ise en pahalısı.",
    "B1-05": "Ve bunu siz seçmiyorsunuz. Müşterinin cebinden hangi kart çıkarsa, ödediğiniz oran odur.",
    "B1-06": "Bir restoran için örnek bir ay. Yirmi sekiz bin dört yüz pound kart cirosu, yedi yüz seksen kart ödemesi, o yüzde sıfır nokta beş oranıyla.",
    "B1-07": "Bunun yüzde yetmişi debitti, yüzde sıfır nokta beşten. Ama kredi yüzde bir nokta iki, şirket kartları yüzde iki nokta altı, yurt dışı kartları yüzde iki nokta dokuz geldi.",
    "B1-08": "Bir de yüzdeyle hiç ilgisi olmayan ücretler var. Her işlem başına dört peni, terminal kirası olarak on yedi pound elli ve aylık PCI ücreti.",
    "B1-09": "Bir de hesap ücreti var. Sonra kimsenin saymadığı o ücret: kendi paranızı size gönderdikleri her sefer için üç pound.",
    "B1-10": "Gerçekte ne ödediğinizi bulmak için dökümdeki bütün ücretleri toplayın, kart cironuza bölün, yüzle çarpın.",
    "B1-11": "Buradaki ücretlerin toplamı üç yüz sekiz pound. Yirmi sekiz bin dört yüz poundluk ciro üzerinden bu, yüzde bir nokta sıfır dokuz eder.",
    "B1-12": "Kendilerine yüzde sıfır nokta beş denmişti. Ödedikleri bunun iki katından fazla. Üstelik hepsi dökümde yazıyordu.",
    "B1-13": "Şimdi asıl bilinmeye değer kısım. Her karta aynı, sabit yüzde sıfır nokta yedi, o restorana daha ucuza gelirdi.",
    "B1-14": "Üç yüz sekiz pound yerine yüz doksan sekiz pound. Oran daha yüksek, maliyet daha düşük.",
    "B1-15": "Yani biri size bir oran söylediğinde, kredi kartı ve şirket kartı ne, Amex ne diye sorun. Sonra her para transferinin ne tuttuğunu sorun.",
    "B1-16": "PCI ücreti, hesap ücreti ve aylık minimum var mı, sorun. Sonra efektif oranı hesaplayın; karşılaştırmaya değer tek rakam o.",
    "B1-17": "Geçen ayın dökümü, bir hesap makinesi ve iki dakika; hiçbir reklamın söylemeyeceğini söyler.",
    "B1-18": "Bizden bu kadar. Faydalı bulduysanız takipte kalın. Her hafta bunlardan bir tane yayınlıyoruz.",

    /* ===== B2 ===== */
    "B2-01": "Aynı sokakta iki işletme, aynı firmadan teklif aldı. Bir kafe ve bir restoran. İkisine de aynı iki seçenek sunuldu.",
    "B2-02": "Seçeneklerden biri kafe için çok daha iyi, restoran için çok daha kötü. Teklifte bunu söyleyen tek bir satır yok.",
    "B2-03": "Birincisi her karta sabit yüzde sıfır nokta yedi, satış başına ücret yok. İkincisi yüzde sıfır nokta dört — daha ucuz görünüyor — artı satış başına sekiz peni.",
    "B2-04": "Çoğu kişi yüzde sıfır nokta dördü seçer, çünkü küçük olan rakam odur. Gayet de doğal.",
    "B2-05": "Ama dört poundluk bir kahvede o sekiz peni, yüzdeden çok daha önemli. Dört poundun yüzde sıfır nokta dördü, iki peninin altında.",
    "B2-06": "Yani o kahve, ucuz görünen seçenekte dokuz nokta altı peniye, pahalı görünende iki nokta sekiz peniye mal oluyor.",
    "B2-07": "Denge noktası yirmi altı pound altmış yedi peni. Altında sabit oran kazanıyor. Üstünde, peni ücretli düşük oran kazanıyor.",
    "B2-08": "Kafe, bin altı yüz küçük satışta dokuz bin altı yüz pound ciro yapıyor. Sabit yüzde sıfır nokta yedi, altmış yedi pound tutuyor.",
    "B2-09": "Yüzde sıfır nokta dört ise yüz altmış altı pound. Düşük oranda, iki buçuk katı.",
    "B2-10": "Restoranda tam tersi. Hesaplar büyük, adet az; peni ücreti neredeyse hissedilmiyor. Yaklaşık yirmi üç pound daha az ödüyor.",
    "B2-11": "Yani soru, hangi oranın düşük olduğu değil. Ortalama satış tutarınızın ne olduğu. Onu bulmak da otuz saniye sürüyor.",
    "B2-12": "Ayın kart cirosunu alın, işlem sayısına bölün. Ortalama satış tutarınız bu.",
    "B2-13": "Yaklaşık yirmi beş poundun altındaysa, satış başına ücret alan her teklife dikkat edin. Epey üstündeyse, o ücret genelde ödemeye değer.",
    "B2-14": "Aynı iki teklif, zıt cevaplar. Kararı veren tek şey, ortalama satış tutarının büyüklüğü.",
    "B2-15": "Bizden bu kadar. Faydalı bulduysanız takipte kalın. Her hafta bunlardan bir tane yayınlıyoruz.",

    /* ===== B3 ===== */
    "B3-01": "Önünüze bir kart ödeme sözleşmesi konduğunda herkes önce orana bakar. Gayet doğal.",
    "B3-02": "Ama oran ilk sayfada. İnsanlara asıl paraya mal olan dört şey daha ileride, ve dördüncüyü neredeyse kimse sormuyor.",
    "B3-03": "Birinci soru. Asgari süre ne kadar ve bittiği gün ne oluyor? Aydan aya mı devam ediyor, yoksa baştan bir dönem daha mı yenileniyor?",
    "B3-04": "Bilmekte fayda var: iki bin yirmi üçten beri düzenleyici kurum, yeni terminal kiralamalarını on sekiz ayla sınırlıyor. Size üç yıl teklif ediliyorsa, nedenini sorun.",
    "B3-05": "İkinci soru. Cihaz sizin mi, kirada mı? Satış sayfasından bu her zaman anlaşılmıyor.",
    "B3-06": "Dojo'nun şartlarına göre cihazlar onların kalıyor; otuz gün içinde iade edilmezse KDV hariç dört yüz pounda kadar ücret çıkabiliyor.",
    "B3-07": "Worldpay, erken çıkarsanız kalan kiraları yüzde beş indirimle alıyor. Teya'da terminal baştan sona Teya'nın mülkü.",
    "B3-08": "Üçüncü soru, ve asıl önemlisi bu. Çıkış ücreti, rakam olarak, yazılı olarak nedir? Firmaların çoğu bunu yayınlamıyor.",
    "B3-09": "Dojo, paketinize göre değiştiğini söylüyor. takepayments hiç yayınlamıyor. O yüzden imzadan önce rakamı isteyin.",
    "B3-10": "Dördüncü soru. Siz onaylamadan ne değişebilir? Fiyat değişikliği maddesiyle oranlar oynayabiliyor; bir form süresi geçerse PCI ücreti başlayabiliyor.",
    "B3-11": "Sakin bir ayda aylık minimum ücret farkı yansıyabiliyor. Hiçbiri gizli değil. Sadece insanların okuduğu yerden daha ileride.",
    "B3-12": "Ve sözleşme olması otomatik olarak kötü bir şey değil. Dojo'nun puanları piyasadaki en iyilerden ve müşterilerinin çoğu gayet memnun.",
    "B3-13": "Hizmet iyiyse ve fiyat doğruysa, on iki ay size hiçbir şeye mal olmaz. Yeter ki çıkmanın kaça mal olduğunu bilmeden imzalamayın.",
    "B3-14": "Son bir şey. Düzenleyici kurum bin küçük işletmeyle anket yaptı. Yüzde kırk ikisi iki yıldır ne firma değiştirmiş ne de aklından geçirmiş.",
    "B3-15": "Değiştirenlerin ise yüzde yetmiş altısı kolay olduğunu söylemiş. Bu iki rakamı yan yana koyup biraz düşünmeye değer.",
    "B3-16": "Bizden bu kadar. Faydalı bulduysanız takipte kalın. Her hafta bunlardan bir tane yayınlıyoruz.",

    /* ===== A1 ===== */
    "A1-01": "Restoranlara ve takeaway'lere mal veriyorsanız, hangi müşterinizin zor bir yıl geçirdiğini zaten biliyorsunuz.",
    "A1-02": "Bu, onlara bakmalarında yardımcı olabileceğiniz tek bir gider hakkında — ve size hiçbir maliyeti yok. NeroPay iş ortaklığı programı.",
    "A1-03": "İş ortağı, o işletmelerin zaten güvendiği kişidir. Bir cash and carry, bir gıda toptancısı, EPOS kuran biri, bir muhasebeci ya da sokağı tanıyan bir esnaf.",
    "A1-04": "Basit. Bize tanıştırılacak bir yol açıyorsunuz. Kasanızın yanında küçük bir tabela ya da konu açıldığında iki kelime.",
    "A1-05": "Bütün ücretler sayıldığında gerçekte ne ödediklerini biz hesaplıyoruz, rakamı onlara söylüyoruz, kararı onlar veriyor.",
    "A1-06": "Herkese uymaz. Müşteriniz dört ay önce on iki aylık bir sözleşme imzaladıysa, genelde şimdilik yapabileceğimiz bir şey yok.",
    "A1-07": "Dökümleri zaten iyi bir oranda olduklarını gösteriyorsa, oldukları yerde kalmalarını söylüyoruz. Bunun böyle olması şart; yoksa bunun size faydası olmaz.",
    "A1-08": "Ne yapacağınızın ve müşterinize ne olacağının ayrıntısı partners nokta neropay nokta app adresinde.",
    "A1-09": "Bizden bu kadar. Faydalı bulduysanız takipte kalın. Her hafta bunlardan bir tane yayınlıyoruz.",

    /* ===== A2 ===== */
    "A2-01": "NeroPay iş ortağı olmanın neyi gerektirdiği sık soruluyor ve genelde epey bir şey bekleniyor. O yüzden anlatalım.",
    "A2-02": "Bir tanıştırma yapıyorsunuz. İşin tamamı bu. Ne yapacağınızı ve ne yapmayacağınızı tek tek geçelim.",
    "A2-03": "Bir şey satmıyorsunuz, oran vermiyorsunuz, destek çağrısı almıyorsunuz. Stok yok, evrak yok, hedef yok.",
    "A2-04": "Bağlayıcılık da yok. İki taraftan biri otuz gün önceden haber verir, iş biter; ödenecek bir şey olmaz.",
    "A2-05": "İş bizim tarafımızda. Son dökümlerini alıyoruz, her satırı topluyoruz ve gerçekte ne ödediklerini söylüyoruz.",
    "A2-06": "Geçerlerse terminali biz kuruyoruz, personeli biz eğitiyoruz. Müşterilerinizden biri kullanmaya başladığında da sizdeki hesabına [PLACEHOLDER] tutarında bakiye tanımlıyoruz.",
    "A2-07": "Para iki durumda da aynı. Sadece banka transferi yerine sizin tezgâhınızdan geri dönüyor.",
    "A2-08": "Ve kimsenin beklemediği kısım şu. Bazen bir döküme bakıp müşterinize tam olarak olduğu yerde kalmasını söylüyoruz.",
    "A2-09": "Onlardan bize bir kazanç kalmıyor. Ama sizin yaptığınız tanıştırmanın güvende kalmasının tek yolu bu.",
    "A2-10": "Tek sayfa, otuz gün ihbar süresi, sıfır maliyet. Hepsi partners nokta neropay nokta app adresinde.",
    "A2-11": "Bizden bu kadar. Faydalı bulduysanız takipte kalın. Her hafta bunlardan bir tane yayınlıyoruz.",

    /* ===== A3 ===== */
    "A3-01": "İş ortaklığı programını anlattığımızda kimsenin ilk sorusu para olmuyor. Hep aynı soru geliyor: müşterime ne olacak?",
    "A3-02": "Haklı bir soru; dürüst cevabı da şu. Kimin müşterisi kalıyorlar, biz hangi veriyi alıyoruz ve büyük isimlerin yanında nerede zayıfız.",
    "A3-03": "Sizin müşteriniz olarak kalıyorlar. Sizin işinizi yapmıyoruz, sizin sattığınızı satmıyoruz ve aranıza asla girmeyeceğiz.",
    "A3-04": "Müşteri listenizi hiçbir zaman almıyoruz; hangi müşterinizin geçtiğini de size hiçbir zaman söylemeyeceğiz.",
    "A3-05": "O onların verisi; paylaşmak bizim kadar sizin de sorununuz olurdu. Size sadece bir sayı geliyor. Rakam, asla isim değil.",
    "A3-06": "Onlar için bu, peşine düşmek zorunda kalmadıkları bir ücret kontrolü — sonunda hiçbir yükümlülük yok.",
    "A3-07": "Standart tarifemizde asgari süre yok, terminal doğrudan onların oluyor ve on dört gün içinde tam iade var.",
    "A3-08": "Nerede zayıf olduğumuzu da söyleyelim ki adınızı yanımıza koymadan önce bilin. Biz küçüğüz. Worldpay değiliz.",
    "A3-09": "Tezgâhınızın arkasında müşterilerinizin tanıdığı bir isim istiyorsanız, o biz değiliz.",
    "A3-10": "Onun yerine, on beş dakika ötede olan ve aradığınızda telefonu açan biri var.",
    "A3-11": "Ve bir gün müşterilerinizden birini rahatsız ederse, söyleyin, çekiliriz. Otuz gün, ceza yok.",
    "A3-12": "Bizden bu kadar. Faydalı bulduysanız takipte kalın. Her hafta bunlardan bir tane yayınlıyoruz.",

    /* ===== C1 — Behind the Counter ===== */
    "C1-H1": "Dürüst cevap. Kart ödeme dökümünüzü en son ne zaman gerçekten okudunuz? Açmak değil. Okumak.",
    "C1-01": "Okumak mı? Açıyorum, büyük rakama bakıyorum, kapatıyorum. Doğalgaz faturası gibi. Doğalgaz faturası okunmaz. Atlatılır.",
    "C1-02": "Bir kere. Adam gibi. Yaklaşık bir yıl önce, pazar günü, kahvemle. Adını bile duymadığım dört tane ücret buldum. Sonra pazartesi geldi.",
    "C1-03": "Postayla geliyor. Diğer postalarla birlikte çekmeceye giriyor. Çekmece epey doldu artık. Daha büyük bir çekmece lazım.",
    "C1-04": "Oğlum okuyor. \"Anne, sorun yok\" diyor. Sorun yokmuş. Kuzunun kaça geldiğini bilirim. Personelin kaça mal olduğunu peniyi peniyine bilirim. Ama o kâğıt? Söyleyemem.",
    "C1-H2": "Anlaşıldı. İkinci soru. Sizce hangi orandasınız? Sadece aklınızdaki rakam. Bakmak yok.",
    "C1-05": "Sıfır nokta bir şey. Broşürde yazıyordu. Kocaman rakam, altında minicik yazı. Hesaptan çıkan o mu, hiçbir fikrim yok.",
    "C1-06": "Bana ne söylendiğini biliyorum. Ödediğimin o olmadığını da biliyorum, çünkü hesabı bir peçetenin arkasına yaptım ve tutmadı.",
    "C1-07": "Bir oran var. Bir de diğer kartların oranı var. Sonra bir sayfa dolusu, oranla alakası olmayan şey var. Asıl olay ikinci sayfada.",
    "C1-08": "Yüzde bir mi? Bana dayanmayın. Bakın, bunu bana bugüne kadar kimse sormadı. Kırk yıldır bu tezgâhın arkasındayım. Kimse sormadı.",
    "C1-H3": "İşe yarar kısım şu. Doğruyu söyleyen tek bir rakam var. Dökümdeki her şey, kartla aldığınız toplama bölünür.",
    "C1-H4": "Bazıları bu hesabı yapıyor ve zaten iyi bir anlaşmada oluyor. Oldukları yerde kalsınlar. Çoğu kişi bu hesabı hiç yapmadı. Hesabı yapın.",

    /* ===== C2 ===== */
    "C2-H1": "Gözünüzde canlandırın. Cuma, yedi buçuk. Kuyruk kapıya dayanmış. Kart makinesi bağlantı yok diyor. Sonra ne oluyor?",
    "C2-01": "Panik. Sonra bir karton parçası: SADECE NAKİT. Kuyruğun yarısı iki bin on dokuzdan beri üstünde nakit taşımıyor. Yan dükkâna gidiyorlar. Yan dükkân cumaları beni çok seviyor.",
    "C2-02": "Bir müşteriyi bankamatiğe kadar yürüttüm. Yağmurun altında kendi dükkânımın önünde onu bekledim. Longsight'ta cuma böyle bir şey.",
    "C2-03": "Bizimki bir ay boyunca her cumartesi sabahı düştü. Meğer mutfaktaki mikrodalgaymış. Biri kruvasan ısıtıyor, kart makinesi ölüyor.",
    "C2-04": "Destek hattını aradım. Yirmi beş dakika müzik. Biraz Vivaldi. Karşıma bir insan çıktığında cihaz kendi kendine gelmişti. Yine de teşekkür ettim.",
    "C2-H2": "Peki tam o anda, tezgâhtaki o kutudan gerçekte ne bekliyorsunuz?",
    "C2-05": "Çalışmaya devam etsin. Hepsi bu. Kartı alsın, tutsun, sinyal gelince göndersin. Kırk kişi bana tuşlara basarken bakmasın.",
    "C2-06": "Telefonu açan bir insan. Kayıt numarası değil. Beni tanıyan, dükkânı bilen ve aynı gece geri arayan biri. Salı günü değil.",
    "C2-07": "Ben hiçbir şey yapmadan kendi kendine telefon sinyaline geçebiliyorsa, cumartesilerimin çoğu bana geri döner.",
    "C2-08": "Açık konuşayım mı? Sıkıcı olsun. Sıkıcı olmasını istiyorum. Mutlu bir adama kimse gel de kart makineni anlat dememiştir.",
    "C2-H3": "İki şey bunun çoğunu çözüyor. Wi-fi, 4G ya da çevrimdışı çalışan bir terminal — sinyal geri geldiğinde kart geçiyor. NeroPay Flex bunu yapıyor.",
    "C2-H4": "Bir de on beş dakika ötede olan, telefonu açan bir insan. Bağlantınız bir kere bile kopmadıysa bu sizin sorununuz değil. Cidden. Devam edin.",

    /* ===== C3 ===== */
    "C3-H1": "Noel'den önceki altı hafta. Tezgâhınızda gerçekte ne değişiyor?",
    "C3-01": "Her şey ikiye katlanıyor ama hiçbir şey büyümüyor. Aynı tezgâh, aynı iki kişi, iki katı kuyruk. Aralık bir ay değil. Takvimi olan bir kuyruk.",
    "C3-02": "Büyük masalar. Ofis yemekleri. On iki kişi, tek hesap, altı parçaya bölünüyor ve masanın ucunda mutlaka biri, taksi çevirir gibi kart sallıyor.",
    "C3-03": "Geç saatler. Büyük mağazalar kapanınca on birde gelip hediye kâğıdı ve bir şişe bir şey alanlar. Kart, hep kart. Kimsenin üstünde yirmi pound yok.",
    "C3-04": "Noel pazarı. Üç hafta tezgâhta. Farklı kasa, her şey farklı ve yarım mil boyunca tek bir priz yok.",
    "C3-H2": "Sadece ödeme tarafında, aralığı ne kolaylaştırırdı?",
    "C3-05": "Makineyi müşteriye götürmek, müşteriyi makineye değil. Tezgâhım bir metre ve üstünde bir kuyruk yaşıyor.",
    "C3-06": "Wi-fi olmayan bir tezgâhta çalışan ve fiş basan bir şey. Aralıkta herkes fiş istiyor. Hepsi masraf oluyor.",
    "C3-07": "Hesabı masada bölmek. Altı kart, tek makine, masada bitiyor. Mutfak yanarken kasaya altı kere gidip gelmek değil.",
    "C3-08": "Bir cumartesiyi çıkaran bir batarya. Öğleden sonra ikide hiçbir şey şarja takmam. Bu telefon değil. Bu dükkân.",
    "C3-H3": "Çoğunlukla tek bir şey: taşınabilen bir terminal. NeroPay Flex'te beş buçuk inçlik ekran ve dahili yazıcı var; wi-fi, 4G ya da çevrimdışı çalışıyor. Tezgâh ya da uzaktaki masa sorun olmaktan çıkıyor.",
    "C3-H4": "Tek tezgâh, tek kuyruk ve sağlam wi-fi'ınız varsa, elinizdeki muhtemelen yeterli. Pazarlar altı Kasım civarı açılıyor. Kararı o zamandan önce verin, açıldıktan sonra değil.",

    /* ===== C4 ===== */
    "C4-H1": "Sayın bakalım. Şu anda tezgâhınızda kaç ayrı sistem var? Ekranlar, tabletler, defterler. Hepsi.",
    "C4-01": "Kasa. Kart makinesi. İki paket servis uygulaması için iki tablet. Sadece biriyle konuşan bir yazıcı. Bir de hiçbiri birbiriyle konuşmadığında kullandığım bir defter. Altı.",
    "C4-02": "Bir ajanda. Kâğıt. Bir de kart makinesi. Randevular telefondan, WhatsApp'tan, Instagram'dan ve kapıdan giren bir çocuktan geliyor. Hepsi ajandaya yazılıyor. Kurşun kalemle.",
    "C4-03": "Kasa ve kart makinesi; ikisi hiç tanıştırılmadı. Her satışı iki kere giriyorum. İki kere. Kırk yıldır. Yani kartlar çıktığından beri. Ondan önce bir kereydi.",
    "C4-04": "Üç. Kasa, kart makinesi, online siparişler için tablet. Gece sonunda üç çıktı, bir hesap makinesi ve ben; gece yarısı matematik yapıyorum.",
    "C4-H2": "Bir de gün sonu hesabı. Dürüst olalım, ne kadar sürüyor?",
    "C4-05": "Kapanıştan sonra bir saat. Kasa raporu, kart toplamı, nakit, rezervasyonlar. İlk seferde asla tutmuyor. Bazen ikincide de.",
    "C4-06": "Doğruysa yirmi dakika. Yanlışsa bir saat. Cumartesileri yanlış oluyor, çünkü cumartesiler yoğun ve yoğunluk hata demek.",
    "C4-07": "Muhasebecime ocak ayında bir poşet gidiyor. Gerçek bir poşet. Çok sabırlı. Olmak zorunda kalmamalı.",
    "C4-08": "Ben hesap yapmıyorum. Pazartesi sabahı bankaya bakıyorum. Muhasebem bu. Biliyorum. Biliyorum.",
    "C4-H3": "Kurduğumuz terminalde kasa zaten var. NeroPOS: ürünler, personel, mutfak ekranı, gece sonunda Z raporu ve doğrudan Xero ya da QuickBooks'a işliyor. Aylık yazılım ücreti yok.",
    "C4-H4": "Kasanız bunların hepsini zaten yapıyor ve muhasebecinizle konuşuyorsa, kalsın. Gece yarısı çıktı topluyorsanız, önce onu düzeltin.",

    /* ===== C5 ===== */
    "C5-H1": "Online siparişler. Her sipariş geldiğinde, sizden önce kim para alıyor?",
    "C5-01": "Önce uygulama. Sonra kurye. Sonra kart. Bana ulaştığında yirmi poundluk sipariş, yirmi poundun epey altında oluyor. Tavuk aynı tavuk ama.",
    "C5-02": "Uygulamalar bana asla bulamayacağım müşteriler getirdi. Kötülemiyorum. Ama düzenli müşterilerim de oradan sipariş veriyor. Kapıdan girebilecek insanlar. Canımı sıkan kısım orası.",
    "C5-03": "Vitrine bir QR kod yapıştırdık. İnsanlar yine uygulamadan sipariş veriyor. Alışkanlık. Uygulama telefonlarında. Benim sitem... bir yerlerde.",
    "C5-04": "Ben online iş yapmıyorum. Müşterilerim kapıdan girer. Değişebilir. Henüz değişmedi. Gelecek Noel'de tekrar sorun.",
    "C5-H2": "Düzenli bir müşteri, arada uygulama olmadan doğrudan sizden sipariş verebilseydi, neyin doğru olması gerekirdi?",
    "C5-05": "Kolay. Tek link, üyelik yok, telefondan öde, bitti. Şifre oluşturmaları gerekiyorsa, sayfa açılmadan uygulamaya dönmüş olurlar.",
    "C5-06": "Mutfağa tıpkı uygulama siparişleri gibi düşmeli. Aynı ekran, aynı fiş. Cuma akşamı sekizde ikinci bir ekrana bakmam.",
    "C5-07": "Yeni müşteriler için uygulamalar kalsın. Düzenli müşterilere doğrudan gelecek bir yol verin. İkisi birden. Bu bir boşanma değil.",
    "C5-08": "Bir de sipariş başına komisyon olmasın. Görebildiğim, tek seferlik bir ücret. Mutfaktan çıkan her tabaktan bir dilim değil.",
    "C5-H3": "NeroWeb doğrudan yol: kendi sipariş sayfanız, telefondan ödeme ve her şeyle aynı mutfak ekranına düşen sipariş. Sipariş başına komisyon yok.",
    "C5-H4": "Deliveroo ve Uber Eats'in yanında duruyor. Onların yerini almıyor; yeni müşteriyle ayakta duruyorsanız uygulamalar aldıkları komisyonu hak ediyor. Düzenli müşteriler için doğrudan gidin.",

    /* ===== C6 ===== */
    "C6-H1": "Kart makinenizin sözleşmesi. Ne kadar sürdüğünü ve çıkmanın kaça mal olduğunu biliyor musunuz?",
    "C6-01": "Dört yıl. Bunu ikinci yılda, çıkmaya çalışırken öğrendim. Çıkmanın bedeli, kalmaktan büyük bir rakamdı. Ben de kaldım. İstemeye istemeye.",
    "C6-02": "Dükkânda, salı günü, iki saç kesimi arasında, tabletten imzaladım. O günden beri görmedim. Bir mailin içinde. Bir yerde. Herhâlde.",
    "C6-03": "Benimki kendi kendini yeniliyor. Her yıl. Yenilendiğini söyleyen bir mektup geldi; tarihi de yenilendikten bir hafta sonrası. Ne güzel zamanlama.",
    "C6-04": "Temsilci çok tatlıydı. Çok. Temsilciyi hatırlıyorum. Ayakkabılarını hatırlıyorum. Süreyi hatırlamıyorum.",
    "C6-H2": "Yarın yeniden imzalayacak olsanız, adınızı atmadan önce ne sorardınız?",
    "C6-05": "Kaç ay. Standart süre değil. Ay. Çıkmanın rakamı kaç pound. Bir ücret değil. Pound. Rakam okumayı biliyorum. Bana rakam verin.",
    "C6-06": "Cihaz benim mi, kirada mıyım? Çünkü kiradaysam bir gün biri onu almaya gelecek ve o gün cumartesi olacak.",
    "C6-07": "Ben evet demeden ne zamlanabilir. Çünkü bir şey zamlandı ve onu üç ay sonra dökümde buldum. Çekmecede.",
    "C6-08": "Öylece... bırakabilir miyim? Bir ay önceden haber, cihazı teslim, el sıkış, bitti. Bütün soru bu. Neden zor olsun ki?",
    "C6-H3": "Dört soru. Ne kadar sürüyor. Cihaz benim mi. Çıkış ücreti, rakam olarak ne. Ve ben olmadan ne değişebilir.",
    "C6-H4": "Ocak iki bin yirmi üçten beri düzenleyici kurum, yeni terminal kiralamalarını on sekiz ayla sınırlıyor; sonrasında aydan aya devam ediyor. Payment Systems Regulator, Specific Direction 16.",
    "C6-H5": "İşleyen bir anlaşmanın ikinci yılındaysanız, uzun süre sorun değil. Bağlı olmak, sadece iş yürümediği gün önem kazanır."
  }
};
