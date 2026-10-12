import type { SiteContent } from "./types";

const B = "/images/brand";
const P = "/images/placeholders";

/**
 * Demo content for Mehmet Oglu. Mirrors the Dinex index-01 structure
 * (hero → about → team → menu → services → interior → news → contact)
 * and is the source for the Supabase seed migration.
 */
export const seedContent: SiteContent = {
  settings: {
    name: "Mehmet Oglu",
    tagline: { en: "Döner & İskender", tr: "Döner & İskender" },
    description: {
      en: "Premium Turkish döner & grill house. A century of flavours — tradition, craftsmanship, heritage — served on a plate.",
      tr: "Premium Türk döner ve ızgara evi. Bir asırlık lezzet — gelenek, ustalık, miras — tabağınızda.",
    },
    foundedYear: 1928,
    phone: "+90 212 000 00 00",
    email: "hello@mehmetoglu.com",
    address: {
      en: "Grand Bazaar Avenue 76, Fatih, İstanbul",
      tr: "Kapalıçarşı Caddesi No: 76, Fatih, İstanbul",
    },
    hours: {
      en: "Mon – Sun · 11:00 – 23:00",
      tr: "Pzt – Paz · 11:00 – 23:00",
    },
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.287!2d28.968!3d41.0106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzM4LjIiTiAyOMKwNTgnMDQuOCJF!5e0!3m2!1sen!2str!4v1700000000000",
    social: {
      instagram: "https://instagram.com/mehmetoglu",
      facebook: "https://facebook.com/mehmetoglu",
      twitter: "https://x.com/mehmetoglu",
    },
  },

  heroSlides: [
    {
      id: "hero-1",
      sortOrder: 1,
      eyebrow: { en: "A century of flavours", tr: "Bir asırlık lezzet" },
      title: { en: "Döner & İskender, the way it began", tr: "Döner & İskender, başladığı gibi" },
      image: `${B}/interior-dining-room.webp`,
      imageAlt: { en: "Mehmet Oglu dining room with döner counter", tr: "Döner tezgâhlı Mehmet Oglu salonu" },
    },
    {
      id: "hero-2",
      sortOrder: 2,
      eyebrow: { en: "Since 1928", tr: "1928'den beri" },
      title: { en: "Tradition is our recipe", tr: "Geleneğimiz tarifimizdir" },
      image: `${B}/storefront-mall.webp`,
      imageAlt: { en: "Mehmet Oglu storefront", tr: "Mehmet Oglu dükkân cephesi" },
    },
    {
      id: "hero-3",
      sortOrder: 3,
      eyebrow: { en: "Craftsmanship", tr: "Ustalık" },
      title: { en: "Hand-stacked. Slow-roasted. Thinly carved.", tr: "Elle dizilir. Ağır pişer. İnce kesilir." },
      image: `${B}/storefront-entrance.webp`,
      imageAlt: { en: "Entrance of Mehmet Oglu restaurant", tr: "Mehmet Oglu restoran girişi" },
    },
    {
      id: "hero-4",
      sortOrder: 4,
      eyebrow: { en: "Heritage", tr: "Miras" },
      title: { en: "Where every plate tells a story", tr: "Her tabağın bir hikâyesi var" },
      image: `${B}/poster-heritage.webp`,
      imageAlt: { en: "Mehmet Oglu heritage poster of İstanbul skyline", tr: "İstanbul silüetli Mehmet Oglu miras afişi" },
    },
  ],

  sections: {
    about: { key: "about", isEnabled: true, eyebrow: { en: "Who we are", tr: "Biz kimiz" }, title: { en: "The Restaurant", tr: "Restoran" } },
    team: { key: "team", isEnabled: true, eyebrow: { en: "Meet the masters", tr: "Ustalarla tanışın" }, title: { en: "The Chefs", tr: "Şefler" } },
    menu: { key: "menu", isEnabled: true, eyebrow: { en: "What's on the table", tr: "Sofrada ne var" }, title: { en: "The Menu", tr: "Menü" } },
    services: { key: "services", isEnabled: true, eyebrow: { en: "What we do", tr: "Ne yapıyoruz" }, title: { en: "The Services", tr: "Hizmetler" } },
    interior: { key: "interior", isEnabled: true, eyebrow: { en: "Step inside", tr: "İçeri buyurun" }, title: { en: "The Interior", tr: "Mekân" } },
    news: { key: "news", isEnabled: true, eyebrow: { en: "Stay in the know", tr: "Haberdar olun" }, title: { en: "The News", tr: "Haberler" } },
    contact: { key: "contact", isEnabled: true, eyebrow: { en: "Let's talk", tr: "Konuşalım" }, title: { en: "The Contact", tr: "İletişim" } },
    reservation: { key: "reservation", isEnabled: true, eyebrow: { en: "Join us", tr: "Bize katılın" }, title: { en: "Reserve a Table", tr: "Masa Ayırtın" } },
    location: { key: "location", isEnabled: true, eyebrow: { en: "Where to find us", tr: "Bizi nerede bulursunuz" }, title: { en: "The Location", tr: "Konum" } },
  },

  about: {
    paragraphs: [
      {
        en: "Mehmet Oglu began in 1928 as a single charcoal spit beside the Grand Bazaar. Four generations later the recipe is unchanged: lamb and veal hand-stacked each dawn, roasted slowly over oak embers and carved paper-thin to order.",
        tr: "Mehmet Oglu, 1928'de Kapalıçarşı'nın yanında tek bir kömür şişiyle başladı. Dört kuşak sonra tarif aynı: her sabah elle dizilen kuzu ve dana, meşe korunda ağır ağır pişer ve sipariş üzerine kâğıt inceliğinde kesilir.",
      },
      {
        en: "Our İskender is served the Bursa way — over hand-torn pide, drowned in tomato sauce and finished tableside with sizzling brown butter. Nothing arrives pre-cut, nothing arrives lukewarm.",
        tr: "İskender'imiz Bursa usulü sunulur — elle bölünmüş pide üzerine, domates soslu ve masada kızgın tereyağıyla tamamlanmış. Hiçbir şey önceden kesilmez, hiçbir şey ılık gelmez.",
      },
    ],
    images: [`${B}/menu-cover-iskender-plate.webp`, `${B}/poster-heritage.webp`],
    counterValue: 1928,
    counterLabel: { en: "Serving İstanbul since", tr: "İstanbul'a hizmet veriyoruz" },
    quote: {
      en: "“The spit turns the same way it did in my grandfather's day. Only the city around it has changed.”",
      tr: "“Şiş, dedemin zamanındaki gibi dönüyor. Değişen sadece etrafındaki şehir.”",
    },
    quoteAuthor: "Mehmet Oğlu, 4th generation",
  },

  team: [
    { id: "team-1", sortOrder: 1, name: "Mehmet Oğlu", role: { en: "Master Dönerci", tr: "Usta Dönerci" }, image: `${P}/portrait.webp` },
    { id: "team-2", sortOrder: 2, name: "Ayşe Kaya", role: { en: "Head Chef", tr: "Baş Aşçı" }, image: `${P}/portrait.webp` },
    { id: "team-3", sortOrder: 3, name: "Emre Demir", role: { en: "Grill Master", tr: "Izgara Ustası" }, image: `${P}/portrait.webp` },
    { id: "team-4", sortOrder: 4, name: "Zeynep Arslan", role: { en: "Pastry & Baklava", tr: "Tatlı & Baklava" }, image: `${P}/portrait.webp` },
  ],

  menuCategories: [
    { id: "cat-doner", slug: "doner", sortOrder: 1, name: { en: "Döner", tr: "Döner" } },
    { id: "cat-iskender", slug: "iskender-grill", sortOrder: 2, name: { en: "İskender & Grill", tr: "İskender & Izgara" } },
    { id: "cat-meze", slug: "meze", sortOrder: 3, name: { en: "Meze & Starters", tr: "Meze & Başlangıçlar" } },
    { id: "cat-drinks", slug: "desserts-drinks", sortOrder: 4, name: { en: "Desserts & Drinks", tr: "Tatlılar & İçecekler" } },
  ],

  menuItems: [
    { id: "m-1", categoryId: "cat-doner", sortOrder: 1, price: 14, currency: "€", isAvailable: true, image: `${B}/menu-cover-iskender-plate.webp`, name: { en: "Classic Lamb Döner Plate", tr: "Klasik Kuzu Döner Tabağı" }, description: { en: "Thinly carved lamb over bulgur pilav, grilled pepper, tomato and sumac onions.", tr: "Bulgur pilavı üzerine ince kesilmiş kuzu döner, közlenmiş biber, domates ve sumaklı soğan." } },
    { id: "m-2", categoryId: "cat-doner", sortOrder: 2, price: 9, currency: "€", isAvailable: true, image: `${P}/landscape.webp`, name: { en: "Döner Dürüm", tr: "Döner Dürüm" }, description: { en: "Lavash wrap with veal döner, garlic yoghurt, pickles and our spicy ezme.", tr: "Lavaş içinde dana döner, sarımsaklı yoğurt, turşu ve acılı ezmemiz." } },
    { id: "m-3", categoryId: "cat-doner", sortOrder: 3, price: 10, currency: "€", isAvailable: true, image: `${P}/landscape.webp`, name: { en: "Ekmek Arası Döner", tr: "Ekmek Arası Döner" }, description: { en: "Crusty Turkish bread filled with döner, lettuce, tomato and mint-lemon sauce.", tr: "Çıtır Türk ekmeği arasında döner, marul, domates ve nane-limon sosu." } },
    { id: "m-4", categoryId: "cat-doner", sortOrder: 4, price: 12, currency: "€", isAvailable: true, image: `${P}/landscape.webp`, name: { en: "Pilav Üstü Döner", tr: "Pilav Üstü Döner" }, description: { en: "Buttered rice pilav crowned with chicken döner and roasted tomato.", tr: "Tereyağlı pirinç pilavı üzerine tavuk döner ve közlenmiş domates." } },

    { id: "m-5", categoryId: "cat-iskender", sortOrder: 1, price: 18, currency: "€", isAvailable: true, image: `${P}/landscape.webp`, name: { en: "İskender Kebap", tr: "İskender Kebap" }, description: { en: "Bursa style: lamb döner on torn pide, tomato sauce, yoghurt and sizzling brown butter poured tableside.", tr: "Bursa usulü: pide üzerine kuzu döner, domates sosu, yoğurt ve masada dökülen kızgın tereyağı." } },
    { id: "m-6", categoryId: "cat-iskender", sortOrder: 2, price: 19, currency: "€", isAvailable: true, image: `${P}/landscape.webp`, name: { en: "Adana Kebap", tr: "Adana Kebap" }, description: { en: "Hand-minced lamb with red pepper flakes, grilled over oak charcoal.", tr: "Meşe kömüründe pişen, elle kıyılmış pul biberli kuzu kebabı." } },
    { id: "m-7", categoryId: "cat-iskender", sortOrder: 3, price: 21, currency: "€", isAvailable: true, image: `${P}/landscape.webp`, name: { en: "Mixed Grill for Two", tr: "İki Kişilik Karışık Izgara" }, description: { en: "Lamb chops, Adana, chicken şiş and köfte with grilled vegetables and lavash.", tr: "Kuzu pirzola, Adana, tavuk şiş ve köfte; közlenmiş sebze ve lavaş ile." } },
    { id: "m-8", categoryId: "cat-iskender", sortOrder: 4, price: 17, currency: "€", isAvailable: true, image: `${P}/landscape.webp`, name: { en: "Beyti Sarma", tr: "Beyti Sarma" }, description: { en: "Spiced lamb rolled in lavash, sliced and topped with tomato sauce and yoghurt.", tr: "Lavaşa sarılı baharatlı kuzu, dilimlenmiş; domates sosu ve yoğurt ile." } },

    { id: "m-9", categoryId: "cat-meze", sortOrder: 1, price: 6, currency: "€", isAvailable: true, image: `${P}/landscape.webp`, name: { en: "Mercimek Çorbası", tr: "Mercimek Çorbası" }, description: { en: "Red lentil soup with lemon and toasted cumin.", tr: "Limon ve kavrulmuş kimyonlu kırmızı mercimek çorbası." } },
    { id: "m-10", categoryId: "cat-meze", sortOrder: 2, price: 7, currency: "€", isAvailable: true, image: `${B}/products-sauce-sachets.webp`, name: { en: "Meze Trio", tr: "Üçlü Meze" }, description: { en: "Haydari, acılı ezme and smoked aubergine with warm pide.", tr: "Haydari, acılı ezme ve közlenmiş patlıcan; sıcak pide ile." } },
    { id: "m-11", categoryId: "cat-meze", sortOrder: 3, price: 8, currency: "€", isAvailable: true, image: `${P}/landscape.webp`, name: { en: "Sigara Böreği", tr: "Sigara Böreği" }, description: { en: "Crisp filo rolls filled with feta and parsley.", tr: "Beyaz peynir ve maydanozlu çıtır yufka sarması." } },
    { id: "m-12", categoryId: "cat-meze", sortOrder: 4, price: 7, currency: "€", isAvailable: true, image: `${P}/landscape.webp`, name: { en: "Çoban Salatası", tr: "Çoban Salatası" }, description: { en: "Shepherd's salad of tomato, cucumber, pepper, onion and sumac.", tr: "Domates, salatalık, biber, soğan ve sumaklı çoban salatası." } },

    { id: "m-13", categoryId: "cat-drinks", sortOrder: 1, price: 7, currency: "€", isAvailable: true, image: `${P}/landscape.webp`, name: { en: "Fıstıklı Baklava", tr: "Fıstıklı Baklava" }, description: { en: "Forty-layer pistachio baklava with clotted cream.", tr: "Kırk katlı Antep fıstıklı baklava, kaymak ile." } },
    { id: "m-14", categoryId: "cat-drinks", sortOrder: 2, price: 6, currency: "€", isAvailable: true, image: `${P}/landscape.webp`, name: { en: "Künefe", tr: "Künefe" }, description: { en: "Shredded pastry with melted cheese and syrup, served hot.", tr: "Peynirli, şerbetli, sıcak servis edilen tel kadayıf." } },
    { id: "m-15", categoryId: "cat-drinks", sortOrder: 3, price: 3, currency: "€", isAvailable: true, image: `${B}/packaging-cups.webp`, name: { en: "Ayran", tr: "Ayran" }, description: { en: "House-churned, frothy and salted.", tr: "Ev yapımı, köpüklü ve tuzlu." } },
    { id: "m-16", categoryId: "cat-drinks", sortOrder: 4, price: 3, currency: "€", isAvailable: true, image: `${B}/packaging-drink-carrier.webp`, name: { en: "Turkish Tea & Coffee", tr: "Türk Çayı & Kahvesi" }, description: { en: "Çay in tulip glasses or coffee slow-brewed in copper cezve.", tr: "İnce belli bardakta çay ya da bakır cezvede pişen kahve." } },
  ],

  services: [
    { id: "s-1", sortOrder: 1, image: `${B}/interior-dining-room.webp`, title: { en: "Dine In", tr: "Restoranda" }, description: { en: "Leather booths, brass lanterns and the döner spit in full view — the dining room is built around the fire.", tr: "Deri koltuklar, pirinç fenerler ve tam karşınızda döner şişi — salon ateşin etrafında kurulu." } },
    { id: "s-2", sortOrder: 2, image: `${B}/packaging-cup-tray.webp`, title: { en: "Takeaway & Delivery", tr: "Paket & Teslimat" }, description: { en: "Carved to order and sealed in our heritage packaging so it arrives as hot as it left the spit.", tr: "Sipariş üzerine kesilir, şişten çıktığı sıcaklıkta ulaşsın diye özel ambalajımızla paketlenir." } },
    { id: "s-3", sortOrder: 3, image: `${B}/products-sauce-sachets.webp`, title: { en: "Signature Sauces", tr: "Özel Soslar" }, description: { en: "Acılı ezme, nane-limon, sarımsaklı yoğurt and döner baharatı — the four sachets that travel with every order.", tr: "Acılı ezme, nane-limon, sarımsaklı yoğurt ve döner baharatı — her siparişle giden dört poşet." } },
    { id: "s-4", sortOrder: 4, image: `${B}/storefront-entrance.webp`, title: { en: "Events & Catering", tr: "Etkinlik & Catering" }, description: { en: "A travelling spit for weddings, corporate dinners and bayram feasts of 30 to 300 guests.", tr: "Düğünler, kurumsal yemekler ve 30'dan 300 kişiye bayram sofraları için gezici şiş." } },
  ],

  gallery: [
    { id: "g-1", sortOrder: 1, image: `${B}/interior-dining-room.webp`, width: 1448, height: 1086, caption: { en: "The dining room", tr: "Salon" } },
    { id: "g-2", sortOrder: 2, image: `${B}/storefront-mall.webp`, width: 1448, height: 1086, caption: { en: "The storefront", tr: "Cephe" } },
    { id: "g-3", sortOrder: 3, image: `${B}/storefront-entrance.webp`, width: 1527, height: 1030, caption: { en: "The entrance", tr: "Giriş" } },
    { id: "g-4", sortOrder: 4, image: `${B}/menu-cover-iskender-plate.webp`, width: 1024, height: 1536, caption: { en: "İskender, plated", tr: "İskender tabağı" } },
    { id: "g-5", sortOrder: 5, image: `${B}/packaging-cups.webp`, width: 1027, height: 1532, caption: { en: "Heritage packaging", tr: "Miras ambalaj" } },
    { id: "g-6", sortOrder: 6, image: `${B}/poster-heritage.webp`, width: 1024, height: 1536, caption: { en: "Since 1928", tr: "1928'den beri" } },
  ],

  posts: [
    {
      id: "p-1", slug: "a-century-of-flavours", publishedAt: "2026-09-01",
      coverImage: `${B}/poster-heritage.webp`, gallery: [`${B}/poster-heritage.webp`, `${B}/interior-dining-room.webp`, `${B}/storefront-mall.webp`],
      title: { en: "A century of flavours", tr: "Bir asırlık lezzet" },
      excerpt: { en: "How a single charcoal spit beside the Grand Bazaar became Mehmet Oglu.", tr: "Kapalıçarşı'nın yanındaki tek bir kömür şişi nasıl Mehmet Oglu oldu." },
      body: { en: "In 1928 Mehmet Oğlu's great-grandfather lit a charcoal spit beside the Grand Bazaar...\n\nFour generations later the method is unchanged.", tr: "1928'de Mehmet Oğlu'nun büyük dedesi Kapalıçarşı'nın yanında bir kömür şişi yaktı...\n\nDört kuşak sonra yöntem değişmedi." },
    },
    {
      id: "p-2", slug: "the-art-of-the-spit", publishedAt: "2026-09-10",
      coverImage: `${B}/interior-dining-room.webp`, gallery: [`${B}/interior-dining-room.webp`, `${B}/menu-cover-iskender-plate.webp`],
      title: { en: "The art of the spit", tr: "Şiş sanatı" },
      excerpt: { en: "Why we still stack every döner by hand before dawn.", tr: "Neden her döneri hâlâ şafaktan önce elle diziyoruz." },
      body: { en: "A döner is built, not made. Each layer of marinated lamb is laid by hand...", tr: "Döner yapılmaz, inşa edilir. Marine edilmiş her kuzu katmanı elle dizilir..." },
    },
    {
      id: "p-3", slug: "four-sauces-one-tradition", publishedAt: "2026-09-18",
      coverImage: `${B}/products-sauce-sachets.webp`, gallery: [`${B}/products-sauce-sachets.webp`, `${B}/packaging-drink-carrier.webp`],
      title: { en: "Four sauces, one tradition", tr: "Dört sos, tek gelenek" },
      excerpt: { en: "Meet the sachets that travel with every takeaway order.", tr: "Her paket siparişle yola çıkan poşetlerle tanışın." },
      body: { en: "Acılı ezme, nane-limon, sarımsaklı yoğurt and döner baharatı...", tr: "Acılı ezme, nane-limon, sarımsaklı yoğurt ve döner baharatı..." },
    },
    {
      id: "p-4", slug: "new-dining-room", publishedAt: "2026-09-25",
      coverImage: `${B}/storefront-entrance.webp`, gallery: [`${B}/storefront-entrance.webp`, `${B}/storefront-mall.webp`, `${B}/interior-dining-room.webp`],
      title: { en: "A new dining room, the same fire", tr: "Yeni salon, aynı ateş" },
      excerpt: { en: "Our restored dining room opens its brass doors this autumn.", tr: "Restore edilen salonumuz bu sonbahar pirinç kapılarını açıyor." },
      body: { en: "Leather booths, brass lanterns and the spit in full view...", tr: "Deri koltuklar, pirinç fenerler ve tam karşınızda şiş..." },
    },
  ],
};
