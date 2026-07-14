// Next.js config redirects (next.config.js -> redirects).
// permanent: true => 308 (Google 301 kabi qabul qiladi — reyting o'tadi).
//
// MAQSAD: eski WordPress saytdan qolgan, Google indeksida turgan URL'larni
// yangi Payload URL'lariga 301/308 bilan yo'naltirish. Migratsiyada redirect
// qo'yilmagani uchun bu sahifalar 404 bo'lib, eski SEO-trafik yo'qolayotgan edi.
//
// TARTIB MUHIM: avval ANIQ (slug o'zgargan / o'chgan / mos kelmagan) redirectlar,
// keyin umumiy PATTERN'lar (uzun-dum eski URL'larni ham qamrab oladi).

const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const p = (source, destination) => ({ source, destination, permanent: true })

  // 1) Slug O'ZGARGAN yoki O'CHGAN sahifalar
  const pageRedirects = [
    p('/catalog', '/uz/products'),
    p('/produkcziya', '/uz/products'),
    p('/dokumentacziya', '/uz/dokumentatsiya'),
    p('/kontakty', '/uz/kontakti'),
    p('/karera-v-kompanii', '/uz/karyera-v-kompanii'),
    p('/top-menedzhment-kompanii', '/uz/top-menedzhment'),
    p('/poleznaya-informacziya', '/uz/posts'),
    p('/galereya-vypolnenyh-obektov', '/uz/projects'),
    p('/oplata-i-dostavka', '/uz/kontakti'),
  ]

  // 2) Mahsulot slug'lari mos kelmagan holatlar (yangi slug boshqacha)
  const productOverrides = [
    p('/product/bitumnaya-mastika-krovelnaya-kopirovat', '/uz/products/bitumnaya-mastika-krovelnaya'),
    p('/product/bitumnaya-mastika-universalnaya-kopirovat', '/uz/products/bitumnaya-mastika-universalnaya'),
    p('/product/:slug(prajmer-bitumnyj-universalnyj.*)', '/uz/products/prajmer-bitumnyj-universalnyj'),
    p('/product/bitum-bn-90-10', '/uz/products/bitum-neftyanoj-bn-90-10'),
    p('/product/izmembrane-epp', '/uz/products/izomembrane'),
    p('/product/roofizol-efp', '/uz/products/roofizol'),
    p('/product-category/rulonnaya-gidroizolyacziya/sigment-izomembrane', '/uz/products'),
  ]

  // 3) Eski (rus tilidagi) blog maqolalari — mos yangi slug topilmadi -> ru blog ro'yxati
  const oldArticleRedirects = [
    p('/kak-proizvoditsya-bitum-iz-nefti-podrobnoe-opisanie-tehnologicheskogo-proczessa', '/ru/posts'),
    p('/bitumnyj-polimernyj-germetik-ot-marja-universalnoe-reshenie-dlya-germetizaczii', '/ru/posts'),
    p('/teploizolyaczionnye-materialy-iz-penopleksa-i-bazalta-nadezhnaya-zashhita-ot-holoda-i-zhary', '/ru/posts'),
  ]

  // 4) PATTERN'lar — asosiy massa + uzun-dum
  const patternRedirects = [
    p('/product/:slug*', '/uz/products/:slug*'),
    p('/product-category/:slug*', '/uz/products/:slug*'),
    p('/products/:slug*', '/uz/products/:slug*'),
    p('/posts/:slug*', '/uz/posts/:slug*'),
    // Eski WordPress media (sertifikat/qo'llanma PDF) -> hujjatlar sahifasi
    p('/wp-content/:path*', '/uz/dokumentatsiya'),
  ]

  return [
    internetExplorerRedirect,
    ...pageRedirects,
    ...productOverrides,
    ...oldArticleRedirects,
    ...patternRedirects,
  ]
}

export default redirects
