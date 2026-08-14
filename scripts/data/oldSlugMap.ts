/**
 * Данные для scripts/seedOldUrlRedirects.ts — карта переведённых слагов
 * старого сайта. Вынесена отдельным модулем, чтобы её можно было
 * импортировать в проверках, не запуская заливку.
 *
 * Источник: лог nginx marja.uz за 04.06-14.08.2026, сверено с базой прода
 * (41 товар, 16 категорий) и проверено curl'ом по живому сайту.
 */

export const MAP: Record<string, string[]> = {
  // --- Мастики ---
  'bitumnaya-mastika-universalnaya': [
    'bitumen-mastic-is-universal',
    'mastikai-bitumӣ-universalӣ',
    'bitum-mastikasi-universal',
    'aembebap-bitwm-mastikasy',
  ],
  'bitumnaya-mastika-krovelnaya': [
    'shatyrdyng-bitwm-mastikasy',
    'bitumli-tom-yopish-mastikasi',
    'bitumen-mastic-roofing',
  ],
  'bitumnaya-mastika-mbg-g': [
    'bitumen-mastic-mbg-g',
    'bitum-mastikasi-mbg-g',
    'mastikai-bitumii-mbg-g',
    'mbg-g-bitwm-mastikasy',
  ],
  // «icbm» — не опечатка: автопереводчик принял МБР за межконтинентальную ракету.
  'bitumnaya-mastika-mbr': [
    'bitwm-mastikasy-mbr',
    'bitumen-mastic-mbr',
    'mastikai-bitumii-mbr',
    'icbm-bitum-mastikasi',
  ],
  'mastika-bitumnaya-gidroizolyatsionnaya': [
    'mastikai-bitumӣ-gidroizolyatsionӣ',
    'gidrooqshawlaghysh-bitwm-mastikasy',
    'bitumen-waterproofing-mastic',
    'bitumli-mastik-gidroizolyatsiyasi',
  ],

  // --- Праймеры ---
  'prajmer-bitumnyj-universalnyj': [
    'prajmeri-bitumӣ-universalӣ',
    'prajmer-bitumnyj-universalnyj-№1',
    'bitumli-primer-universal',
    'bitumen-primer-is-universal',
    'aembebap-bitwm-prajmeri',
  ],
  'bitumnyj-prajmer-polimernyj-mastifix': [
    'prajmeri-bitumӣ-polimerӣ-mastifix',
    'mastifix-polimerli-bitwm-prajmeri',
    'bitumen-polymer-primer-mastifix',
    'bitumli-primer-polimer-mastifix',
  ],
  // ЧЕРНОВИК в базе — пока не опубликуют, редирект приведёт на 404.
  'bitumnyj-prajmer-bystrosohnushhij': [
    'prajmeri-bitumӣ-zud-hushk-meshavad',
    'bitwm-prajmeri-tez-kebedi',
    'quick-drying-bitumen-primer',
    'tez-quriydigan-bitumli-primer',
    'bitumnyj-prajmer-bystrosohnushhij',
  ],

  // --- Эмульсии ---
  'bitumnaya-emulsiya': [
    'emulsiyai-bitumӣ',
    'bitum-emulsiyasi',
    'bitwm-emwlsiyasy',
    'bitumen-emulsion',
  ],
  'bitumnaya-emulsiya-dorozhnaya': [
    'emulsiyai-bitumӣ-roҳ',
    'bitumen-road-emulsion',
    'yol-bitum-emulsiyasi',
    'zhol-bitwm-emwlsiyasy',
  ],
  'bitumnaya-emulsiya-universalnaya-bystrosohnushhaya': [
    'emulsiyai-bitumii-universalӣ-zudhushkshavanda',
    'universal-quick-drying-bitumen-emulsion',
    'universal-tez-quriydigan-bitum-emulsiyasi',
    'zhyldam-kebetin-aembebap-bitwm-emwlsiyasy',
  ],

  // --- Лаки ---
  'bitumnyj-lak-antikorrozijnyj': [
    'laki-bitumӣ-ziddi-zangzanii',
    'korroziyagha-qarsy-bitwmdy-lak',
    'bitum-korroziyaga-qarshi-lak',
    'bitumen-anti-corrosion-varnish',
  ],
  'bitumnyj-lak-dlya-drevesiny': [
    'aғashқa-arnalғan-bitumdy-lak',
    'bitumen-varnish-for-wood',
    'yogoch-uchun-bitumli-lak',
    'aghashqa-arnalghan-bitwmdy-lak',
  ],
  'bitumnyj-lak-dlya-zhelezobetonnyh-pokrytij': [
    'laki-bitumӣ-baroi-pӯshishi-oҳani-betonӣ',
    'temir-beton-qoplamalar-uchun-bitumli-lak',
    'temirbeton-zhabyndaryna-arnalghan-bitwmdy-lak',
    'bitumen-varnish-for-reinforced-concrete-coatings',
  ],

  // --- Герметики ---
  'germetik-universalnyj': [
    'plomba-universalӣ',
    'universal-plomba',
    'aembebap-tyghyzdaghysh',
    'universal-sealant',
  ],
  'germetik-akrilovyj-dlya-shvov': [
    'mӯҳri-akrilӣ-baroi-darzҳo',
    'acrylic-sealant-for-joints',
    'tigisterge-arnalghan-akril-tyghyzdaghysh',
    'akril-qoshma-plomba',
  ],
  'bitumno-polimernyj-germetik-marja-bp-g': [
    'bitumno-polymer-mӯҳri-marja-bp-g',
    'bitumen-polymer-sealant-marja-bp-g',
    'marja-bitwm-polimerli-tyghyzdaghysh-bp-g',
    'marja-bp-g-bitum-polimer-plomba-moddasi',
  ],

  // --- Битум ---
  'bitum-bn-60-90': ['bitumi-bn-60-90', 'bitumen-bn-60-90', 'bitwm-bn-60-90'],
  // ЧЕРНОВИК в базе.
  'bitum-neftyanoj-bn-90-10': [
    'bitumi-bn-naftӣ-90-10',
    'bitum-neftyanoj-bn-90-10',
    'neft-bitumi-bn-90-10',
    'munaj-bitwmy-bn-90-10',
    'petroleum-bitumen-bn-90-10',
  ],

  // --- Геотекстиль и мембраны ---
  'geotekstil-igloprobivnoj-poliefirnyj': [
    'geotekstili-poliefirii-sӯzanparron',
    'ignaprobivnoy-poliefir-geotekstil',
    'inewltki-tesilgen-poliefirli-geotekstil',
    'needle-punched-polyester-geotextile',
  ],
  'armirovannyj-getotekstil-marja-tex': [
    'geotekstili-mustaҳkami-marja-tex',
    'reinforced-geotextile-marja-tex',
    'armiyalangan-getotekstil-marja-tex',
    'armirlengen-geotekstil-marja-tex',
  ],
  'pvh-membrany': ['membraҳoi-pvh', 'pvx-membranalari', 'pvc-membranes', 'pvh-membranalar'],
  'vetro-vlago-zashhitnaya-membrana': [
    'membranai-muҳofizatkunandai-shamolu-namӣ',
    'wind-and-moisture-protection-membrane',
    'zhel-men-ylghaldan-qorghajtyn-membrana',
    'shamol-namlikdan-himoya-qiluvchi-membrana',
  ],
  'drenazhnaya-membrana': [
    'profildi-drenazhdyq-membrana',
    'profiled-drainage-membrane',
    'membranai-drenazhii-profildor',
    'profillangan-drenaj-membranasi',
  ],
  geomembrana: ['geomembrane'],

  // --- Рулонная гидроизоляция ---
  'izmembrane-ekp': ['izomembrane-ekp', 'izomembrane-ecp'],
  'poliizol-tpp': ['poliizoli-tpp', 'polyisol-cci'],
  'poliizol-epp': ['poliizoli-epp', 'polyisol-epp'],
  'izol-tpp': ['isol-cci', 'izoli-tpp', 'isol-tpp'],
  'roofizol-tpp': ['roofizol-cci'],
  'roofizol-tkp': ['roofizol-tcp'],
  'folgoizol-efp': ['folga-izol-efp'],
  'gidroizol-fundament': [
    'taҳkursii-gidroizol',
    'poydevorni-gidroizolyatsiya-qilish',
    'gidroizol-fundament-kopirovat',
    'gidroizol-irgetasy',
    'waterproofing-the-foundation',
  ],
  'gidroizol-osnova': [
    'waterproofing-base',
    'gidroizol-bazasi',
    'gidroizol-asos',
    'gidroizol-negizi',
  ],

  // --- Прочее ---
  paroizolyacziya: ['vapor-barrier', 'bug-izolyatsiyasi', 'bwgha-tosqawyl', 'paroizolyatsiya'],
  penopleks: ['penoplex'],

  // --- Категории ---
  izomembrane: ['rulonnaya-gidroizolyacziya/sigment-izomembrane'],
  roofizol: [
    'rulonnaya-gidroizolyacziya/sigment-roofizol',
    // Roofizol Э-серии в новом каталоге нет (есть только ТПП/ТКП/ТФП),
    // поэтому ведём на страницу линейки, а не на чужой товар.
    'roofizol-epp',
    'roofizol-ekp',
    'roofizol-ecp',
  ],
  'teploizolyaczionnye-materialy': [
    'zhyluoqshaulaghysh-materialdar',
    'issiqlik-izolyatsiya-materiallari',
  ],
  membrany: ['membranes'],
  geotekstil: ['geotextile'],
  // «Мастика битумная» без уточнения — в новом каталоге такой позиции нет,
  // ведём в раздел «Мастики и Праймер».
  misc: ['mastikai-bitumӣ'],
}

/** Старые RSS-адреса WordPress: /products/<что-то>/feed -> /products/<что-то> */
export const FEED_PARENTS = [
  'bitumnaya-emulsiya',
  'bitumnye-germetiki',
  'bitumnye-laki',
  'bitumnye-produkty',
  'geotekstil',
  'misc',
  'paroizolyacziya-i-vetra-vlaga',
  'rulonnaya-gidroizolyacziya',
  'rulonnaya-gidroizolyacziya/folgoizol',
  'rulonnaya-gidroizolyacziya/sigment-izol',
  'rulonnaya-gidroizolyacziya/sigment-izomembrane',
  'rulonnaya-gidroizolyacziya/sigment-roofizol',
  'teploizolyaczionnye-materialy',
]
