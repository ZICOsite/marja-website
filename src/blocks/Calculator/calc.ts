/**
 * Логика расчёта материалов для калькулятора объекта.
 *
 * ВНИМАНИЕ: нормы расхода и цены ниже — ОРИЕНТИРОВОЧНЫЕ (прототип).
 * Перед публикацией заменить на реальные значения из ТУ и прайса.
 * Всё, что нужно править, собрано в PRODUCTS и NORMS — трогать сам расчёт не требуется.
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
  | 'sealant'
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
  | 'sealant'
  | 'vaporBarrier'

type Product = {
  unit: Unit
  /** Ориентировочная цена за единицу (UZS). ЗАМЕНИТЬ на реальную. */
  pricePerUnit: number
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

export const PRODUCTS: Record<ProductKey, Product> = {
  // ── Верхний слой ────────────────────────────────────────────────────────────
  roofizolTkp: {
    unit: 'roll',
    pricePerUnit: 620_000,
    rollArea: 10,
    slug: 'roofizol-tkp',
    roles: ['rollTop', 'rollFoundation'],
    finish: 'granule',
  },
  izomembraneEkp: {
    unit: 'roll',
    pricePerUnit: 700_000,
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
    pricePerUnit: 590_000,
    rollArea: 10,
    slug: 'roofizol-tfp',
    roles: ['rollTop'],
    finish: 'foil',
  },
  izomembraneEfp: {
    unit: 'roll',
    pricePerUnit: 680_000,
    rollArea: 10,
    slug: 'izomembrane-efp',
    roles: ['rollTop'],
    finish: 'foil',
  },
  folgoizolTfp: {
    unit: 'roll',
    pricePerUnit: 640_000,
    rollArea: 10,
    slug: 'folgoizol-tfp',
    roles: ['rollTop'],
    finish: 'foil',
  },
  folgoizolEfp: {
    unit: 'roll',
    pricePerUnit: 720_000,
    rollArea: 10,
    slug: 'folgoizol-efp',
    roles: ['rollTop'],
    finish: 'foil',
  },

  // ── Нижний / подкладочный слой ──────────────────────────────────────────────
  roofizolTpp: {
    unit: 'roll',
    pricePerUnit: 480_000,
    rollArea: 10,
    slug: 'roofizol-tpp',
    roles: ['rollBottom', 'rollFoundation'],
  },
  izomembraneEpp: {
    unit: 'roll',
    pricePerUnit: 560_000,
    rollArea: 10,
    slug: 'izomembrane-epp',
    roles: ['rollBottom', 'rollFoundation'],
  },
  poliizolTpp: {
    unit: 'roll',
    pricePerUnit: 450_000,
    rollArea: 10,
    slug: 'poliizol-tpp',
    roles: ['rollBottom', 'rollFoundation'],
  },
  poliizolEpp: {
    unit: 'roll',
    pricePerUnit: 520_000,
    rollArea: 10,
    slug: 'poliizol-epp',
    roles: ['rollBottom', 'rollFoundation'],
  },
  izolTpp: {
    unit: 'roll',
    pricePerUnit: 400_000,
    rollArea: 10,
    slug: 'izol-tpp',
    roles: ['rollBottom', 'rollFoundation'],
  },
  gidroizolOsnova: {
    unit: 'roll',
    pricePerUnit: 360_000,
    rollArea: 10,
    slug: 'gidroizol-osnova',
    roles: ['rollBottom', 'rollFoundation'],
  },

  // ── Фундамент ───────────────────────────────────────────────────────────────
  gidroizolFundament: {
    unit: 'roll',
    pricePerUnit: 390_000,
    rollArea: 10,
    slug: 'gidroizol-fundament',
    roles: ['rollFoundation'],
  },

  // ── Праймеры ────────────────────────────────────────────────────────────────
  primerUniversal: {
    unit: 'kg',
    pricePerUnit: 28_000,
    slug: 'prajmer-bitumnyj-universalnyj',
    roles: ['primer'],
  },
  primerFast: {
    unit: 'kg',
    pricePerUnit: 32_000,
    slug: 'bitumnyj-prajmer-bystrosohnushhij',
    roles: ['primer'],
  },
  primerMastifix: {
    unit: 'kg',
    pricePerUnit: 45_000,
    slug: 'bitumnyj-prajmer-polimernyj-mastifix',
    roles: ['primer'],
  },

  // ── Мастики ─────────────────────────────────────────────────────────────────
  masticWaterproof: {
    unit: 'kg',
    pricePerUnit: 32_000,
    slug: 'mastika-bitumnaya-gidroizolyatsionnaya',
    roles: ['mastic'],
  },
  masticMbr: {
    unit: 'kg',
    pricePerUnit: 30_000,
    slug: 'bitumnaya-mastika-mbr',
    roles: ['mastic'],
  },
  masticMbgG: {
    unit: 'kg',
    pricePerUnit: 38_000,
    slug: 'bitumnaya-mastika-mbg-g',
    roles: ['mastic'],
  },
  masticUniversal: {
    unit: 'kg',
    pricePerUnit: 34_000,
    slug: 'bitumnaya-mastika-universalnaya',
    roles: ['mastic'],
  },
  masticRoof: {
    unit: 'kg',
    pricePerUnit: 36_000,
    slug: 'bitumnaya-mastika-krovelnaya',
    roles: ['mastic'],
  },

  // ── Прочее ──────────────────────────────────────────────────────────────────
  pvcMembrane: { unit: 'm2', pricePerUnit: 95_000, slug: 'pvh-membrany', roles: ['membrane'] },
  geotextile: {
    unit: 'm2',
    pricePerUnit: 14_000,
    slug: 'armirovannyj-getotekstil-marja-tex',
    roles: ['geotextile'],
  },
  penopleks: { unit: 'm3', pricePerUnit: 1_250_000, slug: 'penopleks', roles: ['insulation'] },
  basaltWool: { unit: 'm3', pricePerUnit: 850_000, slug: 'basalt-wool', roles: ['insulation'] },
  sealant: {
    unit: 'kg',
    pricePerUnit: 55_000,
    slug: 'bitumno-polimernyj-germetik-marja-bp-g',
    roles: ['sealant'],
  },
  vaporBarrier: {
    unit: 'm2',
    pricePerUnit: 12_000,
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

const NORMS = {
  /** Расход праймера, кг/м² — зависит от впитываемости основания. */
  primerPerM2: { concrete: 0.35, screed: 0.4, profiledSheet: 0, oldRoofing: 0.3 },
  /** Расход обмазочной мастики, кг/м² на один слой. */
  masticPerM2PerLayer: 1.2,
  /** Запас на нахлёсты для рулонных материалов и мембран. */
  rollOverlap: 1.15,
  membraneOverlap: 1.1,
  geotextileOverlap: 1.15,
  vaporBarrierOverlap: 1.15,
  /** Расход герметика на примыканиях и парапетах, кг/п.м. */
  sealantPerLm: 0.4,
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
  total: number
  /** Полезная площадь рулона — для пояснения «58 рул. · 580 м²». */
  coverage?: number
}

export type CalcResult = {
  area: number
  lines: CalcLine[]
  total: number
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
const pick = (chosen: ProductKey | undefined, role: ProductRole, fallback: ProductKey): ProductKey =>
  chosen && hasRole(chosen, role) ? chosen : fallback

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

/** Строка сметы по готовому числу рулонов — в обход пересчёта из площади. */
function rollLine(key: ProductKey, rolls: number): CalcLine | null {
  const product = PRODUCTS[key]
  const qty = ceilQty(rolls)

  if (qty <= 0) return null

  return {
    key,
    qty,
    unit: product.unit,
    total: qty * product.pricePerUnit,
    coverage: product.rollArea,
  }
}

function line(key: ProductKey, rawQty: number): CalcLine | null {
  const product = PRODUCTS[key]
  const perUnit = product.rollArea ? rawQty / product.rollArea : rawQty
  const qty = roundQty(perUnit, product.unit)

  if (qty <= 0) return null

  return {
    key,
    qty,
    unit: product.unit,
    total: qty * product.pricePerUnit,
    coverage: product.rollArea,
  }
}

export function calculate(input: CalcInput): CalcResult {
  const area = resolveArea(input)
  if (area <= 0) return { area: 0, lines: [], total: 0 }

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
      lines.push(line(pick(input.topProduct, 'rollTop', DEFAULTS.topProduct), rollArea + parapetArea))

      if (hasParapets) {
        lines.push(
          rollLine(
            PARAPET_REINFORCEMENT,
            parapetRolls(PARAPET_REINFORCEMENT, input.parapets, stripWidth),
          ),
        )
      }
    }

    if (hasParapets) {
      lines.push(line('sealant', input.parapets * NORMS.sealantPerLm))
    }
  } else {
    lines.push(line(primer, area * NORMS.primerPerM2[input.base]))

    const masticLayers = input.foundationMethod === 'combined' ? 1 : layers
    const rollLayers = input.foundationMethod === 'combined' ? 1 : layers

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
    total: result.reduce((sum, item) => sum + item.total, 0),
  }
}
