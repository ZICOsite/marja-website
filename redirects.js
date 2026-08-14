// Next.js config redirects (next.config.js -> redirects).
// permanent: true => 308 (Google 301 kabi qabul qiladi — reyting o'tadi).
//
// MAQSAD: eski WordPress saytdan qolgan, Google indeksida turgan URL'larni
// yangi Payload URL'lariga 301/308 bilan yo'naltirish.
//
// MUHIM KASHFIYOT (nginx logi, 04.06-14.08.2026):
// Eski sayt avto-tarjima plaginli WordPress edi — HAR BIR sahifani beshta
// locale prefiksi ostida, TARJIMA QILINGAN slug bilan chiqargan
// (/en/about-company, /tg/ҳuҷҷatguzorӣ, /uz/mahsulot/..., /kk/katalog).
// Google shu variantlarning hammasini indekslagan. 404 ga tushgan
// so'rovlarning taqsimoti: prefiks bilan 19 557, prefiksSIZ 9 ta.
// Shuning uchun asosiy karta "tarjima qilingan slug -> yangi sahifa slugi"
// ko'rinishida, har bir locale uchun generatsiya qilinadi. PrefiksSIZ eski
// qoidalar ham saqlanadi — ular to'g'ridan-to'g'ri havolalarni qamrab oladi.
//
// TARTIB MUHIM: avval ANIQ redirectlar, keyin umumiy PATTERN'lar.

const LOCALES = ['uz', 'ru', 'en', 'tg', 'kk']

const p = (source, destination) => ({ source, destination, permanent: true })

// Karta: YANGI yo'l (locale prefiksidan keyingi qismi, '' = bosh sahifa)
//     -> { locale: [eski slug'lar], all: [hamma locale'da uchraydigan slug'lar] }
//
// `all` — eski plagin ruscha slug'ni ham har bir prefiks ostida qoldirgani uchun
// (masalan /en/karera-v-kompanii, /tg/karera-v-kompanii).
const aliases = {
  // Bosh sahifa — eski "xizmatlar va hisob-kitob" sahifasi. Kalkulyator bloki
  // hozir aynan bosh sahifada joylashgan (pages.slug = 'home').
  '': {
    all: ['gidroizolyaczionnye-uslugi-i-raschet'],
    uz: ['gidroizolyatsiya-xizmatlari-va-hisoblash'],
    en: ['waterproofing-services-and-calculation'],
    kk: ['gidrooqshawlaghysh-qyzmetter-men-eseptewler'],
    tg: ['hidmatҳoi-obguzarguzaronӣ-va-ҳisobbarobarkunӣ'],
  },

  products: {
    all: ['catalog', 'katalog', 'produkcziya'],
    uz: ['mahsulotlar'],
    tg: ['maҳsulot'],
  },

  posts: {
    all: ['poleznaya-informacziya'],
    uz: ['foydali-malumot'],
    en: ['helpful-information'],
    kk: ['pajdaly-aqparat'],
    tg: ['malumoti-mufid'],
  },

  projects: {
    all: ['galereya-vypolnenyh-obektov'],
    uz: ['bajarilgan-obektlar-galereyasi'],
    en: ['gallery-of-completed-objects'],
    kk: ['oryndalghan-nysandar-galereyasy'],
    tg: ['galereya-obektҳoi-iҷroshuda'],
  },

  'o-kompanii': {
    uz: ['kompaniya-haqida'],
    en: ['about-company'],
    kk: ['kompaniya-twraly'],
    tg: ['dar-borai-shirkat'],
  },

  'top-menedzhment': {
    all: ['top-menedzhment-kompanii'],
    uz: ['kompaniyaning-top-menejmenti'],
    en: ['top-management-of-the-company'],
    kk: ['kompaniyanyng-top-menedzhmenti'],
    tg: ['roҳbariyati-olii-shirkat'],
  },

  // Eski "to'lov va yetkazib berish" sahifasining o'rni ham kontaktlar.
  kontakti: {
    all: ['kontakty', 'contacts', 'oplata-i-dostavka'],
    uz: ['kontaktlar', 'tolov-va-yetkazib-berish'],
    en: ['payment-and-delivery'],
    kk: ['bajlanys', 'toelem-zhaene-zhetkizw'],
    tg: ['tamos', 'pardoht-va-rasonidan'],
  },

  dokumentatsiya: {
    all: ['dokumentacziya'],
    uz: ['hujjatlar'],
    en: ['documentation'],
    kk: ['quzhattama'],
    tg: ['ҳuҷҷatguzorӣ'],
  },

  'karyera-v-kompanii': {
    all: ['karera-v-kompanii'],
    uz: ['kompaniyada-martaba'],
    en: ['career-in-the-company'],
  },

  'garantiya-skvoz-goda': {
    uz: ['yillar-davomida-kafolat'],
    en: ['warranty-through-the-years'],
    kk: ['zhyldar-bojy-kepildik'],
    tg: ['kafolat-dar-tӯli-solҳo'],
  },

  'reklamniye-materiali': {
    all: ['reklamnye-materialy'],
    uz: ['reklama-materiallari'],
    kk: ['zharnamalyq-materialdar'],
    tg: ['mavodҳoi-tabliғotӣ'],
  },

  'gotovye-resheniya-dlya-krovli': {
    uz: ['tom-uchun-tajyor-echimlar'],
    en: ['ready-made-roofing-solutions'],
    kk: ['dajyn-shatyr-sheshimderi'],
    tg: ['ҳalli-tajyor-baroi-saқf'],
  },

  'gotovye-gidroizolyaczionnye-resheniya-dlya-fundamenta': {
    uz: ['poydevor-uchun-tayyor-gidroizolyatsiya-yechimlari'],
    en: ['ready-made-waterproofing-solutions-for-foundations'],
    kk: ['dajyn-ghimarat-irgetasynyng-gidrooqshawlaghysh-sheshimderi'],
    tg: ['ҳalli-tajyori-obnoguzar-baroi-taҳkursӣ'],
  },
}

// aliases -> tekis redirect ro'yxati
//
// Tojikcha slug'lar kirillcha (ҳ, ҷ, ӣ, ғ, қ, ӯ). Brauzer ularni percent-encoding
// bilan yuboradi, Next esa `source` ni dekodlangan yo'lga solishtiradi — lekin
// bunga tayanmaslik uchun ikkala variant ham qo'shiladi (ortiqchasi hech qachon
// mos kelmaydi, zarari yo'q).
const buildAliasRedirects = () => {
  const out = []
  const seen = new Set()

  const add = (source, destination) => {
    if (seen.has(source)) return
    seen.add(source)
    out.push(p(source, destination))
  }

  for (const [target, byLocale] of Object.entries(aliases)) {
    for (const locale of LOCALES) {
      const slugs = [...(byLocale.all ?? []), ...(byLocale[locale] ?? [])]
      const destination = target ? `/${locale}/${target}` : `/${locale}`

      for (const slug of slugs) {
        add(`/${locale}/${slug}`, destination)

        const encoded = encodeURIComponent(slug)
        if (encoded !== slug) add(`/${locale}/${encoded}`, destination)
      }
    }
  }

  return out
}

const redirects = async () => {
  // 1) Locale prefiksi BILAN kelgan eski sahifalar (trafikning asosiy qismi)
  const aliasRedirects = buildAliasRedirects()

  // 2) PrefiksSIZ eski URL'lar — slug o'zgargan yoki o'chgan sahifalar
  const legacyPageRedirects = [
    p('/catalog', '/uz/products'),
    p('/katalog', '/uz/products'),
    p('/produkcziya', '/uz/products'),
    p('/dokumentacziya', '/uz/dokumentatsiya'),
    p('/kontakty', '/uz/kontakti'),
    p('/karera-v-kompanii', '/uz/karyera-v-kompanii'),
    p('/top-menedzhment-kompanii', '/uz/top-menedzhment'),
    p('/poleznaya-informacziya', '/uz/posts'),
    p('/galereya-vypolnenyh-obektov', '/uz/projects'),
    p('/oplata-i-dostavka', '/uz/kontakti'),
    p('/gidroizolyaczionnye-uslugi-i-raschet', '/uz'),
  ]

  // 3) Mahsulot slug'lari mos kelmagan holatlar (yangi slug boshqacha).
  //    Prefiksli variantlar ham kerak — pattern'lar slug'ni o'zgartirmaydi.
  const productOverrideMap = [
    ['bitumnaya-mastika-krovelnaya-kopirovat', 'bitumnaya-mastika-krovelnaya'],
    ['bitumnaya-mastika-universalnaya-kopirovat', 'bitumnaya-mastika-universalnaya'],
    ['bitum-bn-90-10', 'bitum-neftyanoj-bn-90-10'],
    ['izmembrane-epp', 'izomembrane-epp'],
    ['roofizol-efp', 'roofizol'],
  ]

  const productOverrides = [
    ...productOverrideMap.flatMap(([from, to]) => [
      p(`/product/${from}`, `/uz/products/${to}`),
      ...LOCALES.map((l) => p(`/${l}/product/${from}`, `/${l}/products/${to}`)),
      ...LOCALES.map((l) => p(`/${l}/products/${from}`, `/${l}/products/${to}`)),
    ]),
    p(
      '/product/:slug(prajmer-bitumnyj-universalnyj.*)',
      '/uz/products/prajmer-bitumnyj-universalnyj',
    ),
  ]

  // 4) PATTERN'lar.
  //
  // Next `destination`da ISHLATILMAGAN paramlarni query string sifatida qo'shib
  // yuboradi — lekin faqat manbadagi paramlarning BIRORTASI ham destination'da
  // uchramasa (prepare-destination.js: `!paramKeys.some(k => destParams.includes(k))`).
  // Prefiksli qoidalarda `:loc` ishlatilgani uchun `:path*` bemalol yo'qoladi.
  // PrefiksSIZ qoidalarda esa bunday himoya yo'q, shuning uchun ular avval
  // `/uz/...` shakliga o'tkaziladi, qolganini yuqoridagi qoida tugatadi —
  // aks holda `/uz/dokumentatsiya?0=uploads/...` chiqib qolardi.
  const patternRedirects = [
    // --- locale prefiksi bilan: real trafikning ~99.95% i ---
    p('/:loc(uz|ru|en|tg|kk)/product/:slug*', '/:loc/products/:slug*'),
    p('/:loc(uz|ru|en|tg|kk)/product-category/:slug*', '/:loc/products/:slug*'),
    p('/:loc(uz|ru|en|tg|kk)/mahsulot/:slug*', '/:loc/products/:slug*'),
    // Eski blog rubrikalari -> blog ro'yxati
    p('/:loc(uz|ru|en|tg|kk)/category/:path*', '/:loc/posts'),
    // Eski WordPress media (sertifikat/qo'llanma PDF) -> hujjatlar sahifasi
    p('/:loc(uz|ru|en|tg|kk)/wp-content/:path*', '/:loc/dokumentatsiya'),

    // --- prefiksSIZ ---
    p('/product/:slug*', '/uz/products/:slug*'),
    p('/product-category/:slug*', '/uz/products/:slug*'),
    p('/mahsulot/:slug*', '/uz/products/:slug*'),
    p('/products/:slug*', '/uz/products/:slug*'),
    p('/posts/:slug*', '/uz/posts/:slug*'),
    p('/category/:path*', '/uz/category/:path*'),
    p('/wp-content/:path*', '/uz/wp-content/:path*'),
  ]

  return [
    ...aliasRedirects,
    ...legacyPageRedirects,
    ...productOverrides,
    ...patternRedirects,
  ]
}

export default redirects
