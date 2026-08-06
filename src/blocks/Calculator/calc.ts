/**
 * Логика расчёта материалов для калькулятора объекта.
 *
 * ВНИМАНИЕ: нормы расхода (NORMS) — ОРИЕНТИРОВОЧНЫЕ, их ещё нужно свести с ТУ.
 * А вот цен в этом файле больше нет вообще: они берутся из карточек каталога,
 * см. `prices.ts`. Так сделано намеренно — выдуманные цены однажды разошлись
 * с реальными втрое, и заметить это по коду было невозможно.
 *
 * `calculate()` принимает готовую карту цен за единицу расчёта. Если цены для
 * материала нет, строка сметы остаётся без суммы (`total: null`), а у результата
 * взводится `pricesComplete: false` — лучше показать прочерк, чем неверную сумму.
 */

export type ObjectType = 'flatRoof' | 'foundation'
export type AreaMode = 'area' | 'dimensions'
export type BaseType = 'concrete' | 'screed' | 'profiledSheet' | 'oldRoofing'
export type RoofMethod = 'torch' | 'pvc'
export type FoundationMethod = 'coating' | 'roll' | 'combined'
export type InsulationType = 'none' | 'penopleks' | 'basalt'
export type Unit = 'kg' | 'roll' | 'm2' | 'm3'

/**
 * Роль в пироге. Марка рулонного материала кодирует роль последней буквой:
 * П — плёнка (нижний слой), К — крупнозернистая посыпка (верх, УФ-защита),
 * Ф — фольга (верх). Поэтому выбор клиента ограничен списком марок для его роли:
 * два нижних слоя подряд дали бы кровлю без защиты от ультрафиолета.
 */
export type ProductRole =
  | 'rollTop'
  | 'rollBottom'
  | 'rollFoundation'
  | 'primer'
  | 'mastic'
  | 'membrane'
  | 'geotextile'
  | 'insulation'
  | 'vaporBarrier'

/** Верхний слой: с посыпкой или фольгированный. */
export type TopFinish = 'granule' | 'foil'

export type ProductKey =
  // верхний слой
  | 'roofizolTkp'
  | 'izomembraneEkp'
  | 'roofizolTfp'
  | 'izomembraneEfp'
  | 'folgoizolTfp'
  | 'folgoizolEfp'
  // нижний / подкладочный слой
  | 'roofizolTpp'
  | 'izomembraneEpp'
  | 'poliizolTpp'
  | 'poliizolEpp'
  | 'izolTpp'
  | 'gidroizolOsnova'
  // фундамент
  | 'gidroizolFundament'
  // праймеры
  | 'primerUniversal'
  | 'primerFast'
  | 'primerMastifix'
  // мастики
  | 'masticWaterproof'
  | 'masticMbr'
  | 'masticMbgG'
  | 'masticUniversal'
  | 'masticRoof'
  // прочее
  | 'pvcMembrane'
  | 'geotextile'
  | 'penopleks'
  | 'basaltWool'
  | 'vaporBarrier'

type Product = {
  unit: Unit
  /** Полезная площадь рулона, м² (только для unit === 'roll'). */
  rollArea?: number
  /**
   * Ширина полотна, м. Нужна для примыканий: рулон режут вдоль на полосы,
   * и остаток уже ни на что не годен — отход зависит от того, делится ли
   * ширина на полосу нацело. Для площади кровли роли не играет.
   */
  rollWidth?: number
  /** Slug товара в каталоге — ссылка строится как /{locale}/products/{slug}. */
  slug: string
  /** В каких ролях материал может быть выбран. */
  roles: ProductRole[]
  /** Только для роли rollTop. */
  finish?: TopFinish
}

/**
 * Битумно-полимерный герметик MARJA БП-Г убран отсюда 31.07.2026: товара нет
 * в производстве и цены на него нет. Примыкания считаются без него — усиливающий
 * слой, праймер и добавка верхнего ковра на месте. Чтобы вернуть: позиция в
 * PRODUCTS, роль 'sealant', норма sealantPerLm и строка в calculate().
 */
export const PRODUCTS: Record<ProductKey, Product> = {
  // ── Верхний слой ────────────────────────────────────────────────────────────
  roofizolTkp: {
    unit: 'roll',
    rollArea: 10,
    slug: 'roofizol-tkp',
    roles: ['rollTop', 'rollFoundation'],
    finish: 'granule',
  },
  izomembraneEkp: {
    unit: 'roll',
    rollArea: 10,
    // slug в каталоге именно такой — без «o» в izmembrane
    slug: 'izmembrane-ekp',
    roles: ['rollTop', 'rollFoundation'],
    finish: 'granule',
  },
  // Фольгированные марки — только кровля: в грунте фольга ничего не отражает
  // и повреждается при обратной засыпке.
  roofizolTfp: {
    unit: 'roll',
    rollArea: 10,
    slug: 'roofizol-tfp',
    roles: ['rollTop'],
    finish: 'foil',
  },
  izomembraneEfp: {
    unit: 'roll',
    rollArea: 10,
    slug: 'izomembrane-efp',
    roles: ['rollTop'],
    finish: 'foil',
  },
  folgoizolTfp: {
    unit: 'roll',
    rollArea: 10,
    slug: 'folgoizol-tfp',
    roles: ['rollTop'],
    finish: 'foil',
  },
  folgoizolEfp: {
    unit: 'roll',
    rollArea: 10,
    slug: 'folgoizol-efp',
    roles: ['rollTop'],
    finish: 'foil',
  },

  // ── Нижний / подкладочный слой ──────────────────────────────────────────────
  roofizolTpp: {
    unit: 'roll',
    rollArea: 10,
    slug: 'roofizol-tpp',
    roles: ['rollBottom', 'rollFoundation'],
  },
  izomembraneEpp: {
    unit: 'roll',
    rollArea: 10,
    slug: 'izomembrane-epp',
    roles: ['rollBottom', 'rollFoundation'],
  },
  poliizolTpp: {
    unit: 'roll',
    rollArea: 10,
    slug: 'poliizol-tpp',
    roles: ['rollBottom', 'rollFoundation'],
  },
  poliizolEpp: {
    unit: 'roll',
    rollArea: 10,
    slug: 'poliizol-epp',
    roles: ['rollBottom', 'rollFoundation'],
  },
  izolTpp: {
    unit: 'roll',
    rollArea: 10,
    slug: 'izol-tpp',
    roles: ['rollBottom', 'rollFoundation'],
  },
  gidroizolOsnova: {
    unit: 'roll',
    rollArea: 10,
    slug: 'gidroizol-osnova',
    roles: ['rollBottom', 'rollFoundation'],
  },

  // ── Фундамент ───────────────────────────────────────────────────────────────
  gidroizolFundament: {
    unit: 'roll',
    rollArea: 10,
    slug: 'gidroizol-fundament',
    roles: ['rollFoundation'],
  },

  // ── Праймеры ────────────────────────────────────────────────────────────────
  primerUniversal: {
    unit: 'kg',
    slug: 'prajmer-bitumnyj-universalnyj',
    roles: ['primer'],
  },
  primerFast: {
    unit: 'kg',
    slug: 'bitumnyj-prajmer-bystrosohnushhij',
    roles: ['primer'],
  },
  primerMastifix: {
    unit: 'kg',
    slug: 'bitumnyj-prajmer-polimernyj-mastifix',
    roles: ['primer'],
  },

  // ── Мастики ─────────────────────────────────────────────────────────────────
  masticWaterproof: {
    unit: 'kg',
    slug: 'mastika-bitumnaya-gidroizolyatsionnaya',
    roles: ['mastic'],
  },
  masticMbr: {
    unit: 'kg',
    slug: 'bitumnaya-mastika-mbr',
    roles: ['mastic'],
  },
  masticMbgG: {
    unit: 'kg',
    slug: 'bitumnaya-mastika-mbg-g',
    roles: ['mastic'],
  },
  masticUniversal: {
    unit: 'kg',
    slug: 'bitumnaya-mastika-universalnaya',
    roles: ['mastic'],
  },
  masticRoof: {
    unit: 'kg',
    slug: 'bitumnaya-mastika-krovelnaya',
    roles: ['mastic'],
  },

  // ── Прочее ──────────────────────────────────────────────────────────────────
  pvcMembrane: { unit: 'm2', slug: 'pvh-membrany', roles: ['membrane'] },
  geotextile: {
    unit: 'm2',
    slug: 'armirovannyj-getotekstil-marja-tex',
    roles: ['geotextile'],
  },
  penopleks: { unit: 'm3', slug: 'penopleks', roles: ['insulation'] },
  basaltWool: { unit: 'm3', slug: 'basalt-wool', roles: ['insulation'] },
  vaporBarrier: {
    unit: 'm2',
    slug: 'paroizolyacziya',
    roles: ['vaporBarrier'],
  },
}

const KEYS = Object.keys(PRODUCTS) as ProductKey[]

/** Марки, доступные для роли — источник опций в селектах и проверки на сервере. */
export const productsForRole = (role: ProductRole): ProductKey[] =>
  KEYS.filter((key) => PRODUCTS[key].roles.includes(role))

export const hasRole = (key: ProductKey, role: ProductRole): boolean =>
  Boolean(PRODUCTS[key]?.roles.includes(role))

/** Все slug'и каталога, которые нужны калькулятору — запрос цен идёт по ним. */
export const CATALOG_SLUGS: string[] = KEYS.map((key) => PRODUCTS[key].slug)

/** Цена за единицу расчёта (рулон/кг/м²/м³) в UZS. Материала может не быть. */
export type PriceMap = Partial<Record<ProductKey, number>>

/**
 * Толщина плиты утеплителя, для которой в каталоге указана цена за м².
 * В карточках толщина не проставлена, значение согласовано отдельно.
 */
const INSULATION_PRICE_THICKNESS_M = 0.05

/**
 * Перевод цены из карточки каталога в цену за единицу расчёта.
 *
 * У поля `price` в Products нет единицы измерения — это просто число, поэтому
 * связь задаётся здесь и только здесь. Правило выведено из `unit`, а не задано
 * у каждого товара: единица расчёта однозначно определяет, что означает
 * каталожная цена. Если появится материал в м³, который продаётся НЕ плитами,
 * правило придётся расщепить.
 *
 * - `roll` — в каталоге цена за м² полотна, считаем рулонами → × площадь рулона
 * - `kg`, `m2` — единицы совпадают, берём как есть
 * - `m3` — в каталоге цена за м² плиты, считаем кубами → делим на толщину плиты
 */
export function catalogPriceToUnitPrice(key: ProductKey, catalogPrice: number): number | null {
  const product = PRODUCTS[key]
  if (!Number.isFinite(catalogPrice) || catalogPrice <= 0) return null

  switch (product.unit) {
    case 'roll':
      return product.rollArea ? catalogPrice * product.rollArea : null
    case 'm3':
      return catalogPrice / INSULATION_PRICE_THICKNESS_M
    case 'kg':
    case 'm2':
      return catalogPrice
  }
}

const NORMS = {
  /** Расход праймера, кг/м² — зависит от впитываемости основания. */
  primerPerM2: { concrete: 0.4, screed: 0.3, profiledSheet: 0, oldRoofing: 0.5 },
  /** Расход обмазочной мастики, кг/м² на один слой. */
  masticPerM2PerLayer: 1.2,
  /** Запас на нахлёсты для рулонных материалов и мембран. */
  rollOverlap: 1.15,
  membraneOverlap: 1.1,
  geotextileOverlap: 1.15,
  vaporBarrierOverlap: 1.15,
  /**
   * Примыкания. Усиливающий слой — полоса, которая заходит на вертикаль
   * парапета и ложится на кровлю: её ширина = высота захода + полка.
   * Высоту задаёт клиент (по умолчанию 40 см), полка и нахлёст — константы.
   */
  parapetApronCm: 15,
  /** Нахлёст полос усиления по длине. */
  parapetOverlap: 1.1,
} as const

/** Ширина полотна по умолчанию, м — у всех рулонных материалов MARJA она 1 м. */
const DEFAULT_ROLL_WIDTH = 1

/**
 * Усиливающий слой примыканий — подкладочный Полиизол. Марку клиент не выбирает:
 * слой скрытый, сверху его накрывает верхний ковёр, поэтому плёнка ТПП здесь
 * работает и УФ до неё не доходит.
 */
export const PARAPET_REINFORCEMENT: ProductKey = 'poliizolTpp'

/** Разумные границы высоты захода на парапет, см. */
export const PARAPET_HEIGHT = { min: 10, max: 100, default: 40 } as const

export type CalcInput = {
  objectType: ObjectType
  areaMode: AreaMode
  /** Прямой ввод площади, м² (areaMode === 'area'). */
  area: number
  /** Кровля, areaMode === 'dimensions'. */
  length: number
  width: number
  /** Фундамент, areaMode === 'dimensions': периметр × глубина. */
  perimeter: number
  depth: number
  base: BaseType
  layers: 1 | 2
  roofMethod: RoofMethod
  foundationMethod: FoundationMethod
  /** Длина примыканий и парапетов, п.м. (кровля). */
  parapets: number
  /** Высота захода на вертикаль парапета, см. */
  parapetHeight: number
  insulation: InsulationType
  /** Толщина утеплителя, мм. */
  insulationThickness: number
  /** Защита геотекстилем (фундамент). */
  geotextile: boolean
  /** Выбор клиента по ролям. */
  topProduct: ProductKey
  bottomProduct: ProductKey
  foundationRollProduct: ProductKey
  primerProduct: ProductKey
  masticProduct: ProductKey
}

export type CalcLine = {
  key: ProductKey
  /** Итоговое количество в единицах материала (рулоны/кг/м²/м³). */
  qty: number
  unit: Unit
  /** Сумма по строке. `null` — цены на материал нет в каталоге. */
  total: number | null
  /** Полезная площадь рулона — для пояснения «58 рул. · 580 м²». */
  coverage?: number
}

export type CalcResult = {
  area: number
  lines: CalcLine[]
  /** Сумма известных строк. Строки без цены в неё не входят. */
  total: number
  /**
   * Все ли материалы сметы получили цену. Если false — показывать итог как
   * окончательный нельзя, часть позиций в него не вошла.
   */
  pricesComplete: boolean
}

export const DEFAULTS = {
  topProduct: 'roofizolTkp',
  bottomProduct: 'roofizolTpp',
  foundationRollProduct: 'gidroizolFundament',
  primerProduct: 'primerUniversal',
  masticProduct: 'masticWaterproof',
} as const satisfies Record<string, ProductKey>

export const DEFAULT_INPUT: CalcInput = {
  objectType: 'flatRoof',
  areaMode: 'area',
  area: 500,
  length: 20,
  width: 25,
  perimeter: 60,
  depth: 2.5,
  base: 'concrete',
  layers: 2,
  roofMethod: 'torch',
  foundationMethod: 'coating',
  parapets: 0,
  parapetHeight: PARAPET_HEIGHT.default,
  insulation: 'none',
  insulationThickness: 50,
  geotextile: false,
  ...DEFAULTS,
}

const MAX_AREA = 100_000

/** Площадь изолируемой поверхности по выбранному способу ввода. */
export function resolveArea(input: CalcInput): number {
  const raw =
    input.areaMode === 'area'
      ? input.area
      : input.objectType === 'flatRoof'
        ? input.length * input.width
        : input.perimeter * input.depth

  if (!Number.isFinite(raw) || raw <= 0) return 0
  return Math.min(raw, MAX_AREA)
}

/**
 * Марка, выбранная клиентом, но только если она допустима для роли.
 * Иначе — материал по умолчанию: защищает и от подделки запроса, и от
 * рассинхрона, если марку убрали из каталога.
 */
const pick = (
  chosen: ProductKey | undefined,
  role: ProductRole,
  fallback: ProductKey,
): ProductKey => (chosen && hasRole(chosen, role) ? chosen : fallback)

/**
 * Округление вверх, устойчивое к погрешности double.
 *
 * Без этого 100 × 1,1 даёт 110.00000000000001, и клиенту приписывается лишний
 * рулон на пустом месте. Гасим шум за пределами шестого знака — на реальных
 * количествах такая точность физического смысла не имеет.
 */
const ceilQty = (value: number): number => Math.ceil(Number(value.toFixed(6)))

/** Округление количества: штучное вверх, весовое/площадное — до 0,1. */
const roundQty = (value: number, unit: Unit): number =>
  unit === 'roll' ? ceilQty(value) : Math.round(value * 10) / 10

/**
 * Высота захода в допустимых границах. Значение приходит от клиента, поэтому
 * и расчёт, и текст заявки должны опираться на одно и то же зажатое число.
 */
export function clampParapetHeight(heightCm: number): number {
  if (!Number.isFinite(heightCm)) return PARAPET_HEIGHT.default
  return Math.min(Math.max(heightCm, PARAPET_HEIGHT.min), PARAPET_HEIGHT.max)
}

/** Ширина полосы усиления примыкания, м: заход на вертикаль плюс полка на кровлю. */
function parapetStripWidth(heightCm: number): number {
  return (clampParapetHeight(heightCm) + NORMS.parapetApronCm) / 100
}

/**
 * Сколько рулонов уйдёт на примыкания длиной `lengthLm`.
 *
 * Рулон режут вдоль на полосы, и остаток шириной меньше полосы — отход.
 * Поэтому расход скачет: при полосе 50 см из метрового рулона выходит ровно
 * две полосы, а при 55 см — только одна, и почти половина рулона в мусор.
 * Считать «по площади» здесь нельзя, иначе смета выйдет заметно ниже факта.
 */
function parapetRolls(key: ProductKey, lengthLm: number, stripWidth: number): number {
  const product = PRODUCTS[key]
  const rollWidth = product.rollWidth ?? DEFAULT_ROLL_WIDTH
  const rollArea = product.rollArea

  if (!rollArea || stripWidth <= 0) return 0

  // Полоса шире полотна — режем по всей ширине, стык добирается отдельным куском.
  const stripsPerRoll = Math.max(1, Math.floor(rollWidth / stripWidth))
  const rollLength = rollArea / rollWidth
  const lmPerRoll = stripsPerRoll * rollLength

  return (lengthLm * NORMS.parapetOverlap) / lmPerRoll
}

/** Сумма строки, либо null — если цены на материал в каталоге нет. */
const lineTotal = (key: ProductKey, qty: number, prices: PriceMap): number | null => {
  const price = prices[key]
  return price == null ? null : qty * price
}

/** Строка сметы по готовому числу рулонов — в обход пересчёта из площади. */
function rollLine(key: ProductKey, rolls: number, prices: PriceMap): CalcLine | null {
  const product = PRODUCTS[key]
  const qty = ceilQty(rolls)

  if (qty <= 0) return null

  return {
    key,
    qty,
    unit: product.unit,
    total: lineTotal(key, qty, prices),
    coverage: product.rollArea,
  }
}

function makeLine(key: ProductKey, rawQty: number, prices: PriceMap): CalcLine | null {
  const product = PRODUCTS[key]
  const perUnit = product.rollArea ? rawQty / product.rollArea : rawQty
  const qty = roundQty(perUnit, product.unit)

  if (qty <= 0) return null

  return {
    key,
    qty,
    unit: product.unit,
    total: lineTotal(key, qty, prices),
    coverage: product.rollArea,
  }
}

/**
 * @param prices цены за единицу расчёта, обычно из каталога (`fetchCatalogPrices`).
 *   Пустая карта — смета без сумм: количества считаются как обычно.
 */
export function calculate(input: CalcInput, prices: PriceMap = {}): CalcResult {
  const line = (key: ProductKey, rawQty: number) => makeLine(key, rawQty, prices)

  const area = resolveArea(input)
  if (area <= 0) return { area: 0, lines: [], total: 0, pricesComplete: true }

  const lines: (CalcLine | null)[] = []
  const layers = input.layers === 2 ? 2 : 1

  const primer = pick(input.primerProduct, 'primer', DEFAULTS.primerProduct)
  const mastic = pick(input.masticProduct, 'mastic', DEFAULTS.masticProduct)

  if (input.objectType === 'flatRoof') {
    const hasParapets = input.parapets > 0
    const stripWidth = parapetStripWidth(input.parapetHeight)
    // Площадь вертикали примыканий: её грунтуют и накрывают верхним ковром
    // так же, как саму кровлю. У ПВХ примыкание решается краевой рейкой —
    // рулонной технологии там нет.
    const parapetArea =
      hasParapets && input.roofMethod !== 'pvc'
        ? input.parapets * stripWidth * NORMS.parapetOverlap
        : 0

    if (input.roofMethod === 'pvc') {
      // ПВХ-мембрана укладывается механическим креплением — праймер не нужен.
      lines.push(line('pvcMembrane', area * NORMS.membraneOverlap))
    } else {
      lines.push(line(primer, (area + parapetArea) * NORMS.primerPerM2[input.base]))

      const rollArea = area * NORMS.rollOverlap
      // Верхний слой всегда с посыпкой или фольгой, нижний — подкладочный.
      if (layers === 2) {
        lines.push(line(pick(input.bottomProduct, 'rollBottom', DEFAULTS.bottomProduct), rollArea))
      }
      // Верхний ковёр заходит на парапет поверх усиления — отсюда добавка площади.
      lines.push(
        line(pick(input.topProduct, 'rollTop', DEFAULTS.topProduct), rollArea + parapetArea),
      )

      if (hasParapets) {
        lines.push(
          rollLine(
            PARAPET_REINFORCEMENT,
            parapetRolls(PARAPET_REINFORCEMENT, input.parapets, stripWidth),
            prices,
          ),
        )
      }
    }
  } else {
    lines.push(line(primer, area * NORMS.primerPerM2[input.base]))

    // В комбинированной схеме мастика — обмазка под ковёр, её всегда один слой:
    // выбор слоёв наращивает только рулонную часть.
    const masticLayers = input.foundationMethod === 'combined' ? 1 : layers
    const rollLayers = layers

    if (input.foundationMethod !== 'roll') {
      lines.push(line(mastic, area * NORMS.masticPerM2PerLayer * masticLayers))
    }
    if (input.foundationMethod !== 'coating') {
      const roll = pick(
        input.foundationRollProduct,
        'rollFoundation',
        DEFAULTS.foundationRollProduct,
      )
      const rollArea = area * NORMS.rollOverlap

      // Второй слой нельзя наплавить поверх посыпки или фольги — горелка не даёт
      // адгезии к такой поверхности. Поэтому марка с покрытием идёт финишным
      // слоем, а под неё ложится подкладочная с плёнкой.
      if (rollLayers === 2 && PRODUCTS[roll].finish) {
        lines.push(line(DEFAULTS.bottomProduct, rollArea))
        lines.push(line(roll, rollArea))
      } else {
        lines.push(line(roll, rollArea * rollLayers))
      }
    }
    if (input.geotextile) {
      lines.push(line('geotextile', area * NORMS.geotextileOverlap))
    }
  }

  if (input.insulation !== 'none' && input.insulationThickness > 0) {
    // Пирог утеплённой кровли: пароизоляция → утеплитель → гидроизоляция.
    // Без пароизоляции влага из помещения копится в утеплителе, поэтому на кровле
    // она идёт в смету всегда. В фундаменте её роль выполняет сама гидроизоляция.
    if (input.objectType === 'flatRoof') {
      lines.push(line('vaporBarrier', area * NORMS.vaporBarrierOverlap))
    }

    const volume = (area * input.insulationThickness) / 1000
    lines.push(line(input.insulation === 'penopleks' ? 'penopleks' : 'basaltWool', volume))
  }

  const result = lines.filter((item): item is CalcLine => item !== null)

  return {
    area: Math.round(area * 10) / 10,
    lines: result,
    total: result.reduce((sum, item) => sum + (item.total ?? 0), 0),
    pricesComplete: result.every((item) => item.total !== null),
  }
}
