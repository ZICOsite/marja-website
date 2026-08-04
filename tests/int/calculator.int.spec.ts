import { describe, it, expect } from 'vitest'

import {
  calculate,
  catalogPriceToUnitPrice,
  resolveArea,
  productsForRole,
  PRODUCTS,
  DEFAULT_INPUT,
  type CalcInput,
  type PriceMap,
  type ProductKey,
} from '@/blocks/Calculator/calc'

const input = (overrides: Partial<CalcInput> = {}): CalcInput => ({
  ...DEFAULT_INPUT,
  ...overrides,
})

/**
 * Цены в проде приходят из каталога, здесь — одинаковая условная цена на всё.
 * Тестам важны количества и арифметика итога, а не конкретные суммы.
 */
const PRICES: PriceMap = Object.fromEntries(
  (Object.keys(PRODUCTS) as ProductKey[]).map((key) => [key, 1000]),
)

describe('Калькулятор объекта', () => {
  it('считает площадь по длине и ширине', () => {
    expect(resolveArea(input({ areaMode: 'dimensions', length: 20, width: 25 }))).toBe(500)
  })

  it('считает площадь фундамента как периметр × глубину', () => {
    expect(
      resolveArea(
        input({ objectType: 'foundation', areaMode: 'dimensions', perimeter: 60, depth: 2.5 }),
      ),
    ).toBe(150)
  })

  it('возвращает пустой расчёт при нулевой площади', () => {
    const result = calculate(input({ area: 0 }))
    expect(result.lines).toHaveLength(0)
    expect(result.total).toBe(0)
  })

  it('кровля в 2 слоя: праймер + нижний и верхний слой, рулоны округляются вверх', () => {
    const result = calculate(input({ area: 500, layers: 2, base: 'concrete' }))
    const keys = result.lines.map((line) => line.key)

    expect(keys).toContain('primerUniversal')
    expect(keys).toContain('roofizolTpp')
    expect(keys).toContain('roofizolTkp')

    // 500 м² × 1,15 запаса ÷ 10 м² в рулоне = 57,5 → 58 рулонов
    expect(result.lines.find((line) => line.key === 'roofizolTpp')?.qty).toBe(58)
    // 500 м² × 0,35 кг/м² = 175 кг праймера
    expect(result.lines.find((line) => line.key === 'primerUniversal')?.qty).toBe(175)
  })

  it('кровля в 1 слой: только верхний слой с посыпкой', () => {
    const keys = calculate(input({ layers: 1 })).lines.map((line) => line.key)
    expect(keys).toContain('roofizolTkp')
    expect(keys).not.toContain('roofizolTpp')
  })

  it('ПВХ-мембрана идёт без праймера и рулонной гидроизоляции', () => {
    const keys = calculate(input({ roofMethod: 'pvc' })).lines.map((line) => line.key)
    expect(keys).toEqual(['pvcMembrane'])
  })

  it('герметик не попадает в смету — товара нет в производстве', () => {
    const keys = calculate(input({ parapets: 100 })).lines.map((line) => line.key)
    expect(keys).not.toContain('sealant')
  })

  describe('Примыкания и парапеты', () => {
    const qty = (result: ReturnType<typeof calculate>, key: string) =>
      result.lines.find((line) => line.key === key)?.qty

    it('усиливает примыкание Полиизолом, а без примыканий его нет', () => {
      const withParapets = calculate(input({ parapets: 100, parapetHeight: 40 }))
      // полоса 40 + 15 см полки = 55 см, из метрового рулона выходит одна:
      // 10 п.м. с рулона → 100 × 1,1 нахлёста ÷ 10 = 11 рулонов
      expect(qty(withParapets, 'poliizolTpp')).toBe(11)

      expect(calculate(input({ parapets: 0 })).lines.some((l) => l.key === 'poliizolTpp')).toBe(
        false,
      )
    })

    it('раскрой меняет расход скачком: 35 см экономнее 40 см почти вдвое', () => {
      // 35 + 15 = 50 см — рулон делится ровно на две полосы, отхода нет
      expect(qty(calculate(input({ parapets: 100, parapetHeight: 35 })), 'poliizolTpp')).toBe(6)
      // 40 + 15 = 55 см — вторая полоса не влезает, 45 см ширины в отход
      expect(qty(calculate(input({ parapets: 100, parapetHeight: 40 })), 'poliizolTpp')).toBe(11)
    })

    it('верхний ковёр заходит на парапет, нижний слой не растёт', () => {
      const plain = calculate(input({ area: 500, layers: 2, parapets: 0 }))
      const withParapets = calculate(input({ area: 500, layers: 2, parapets: 100 }))

      // 500 × 1,15 = 575 м² кровли + 100 × 0,55 × 1,1 = 60,5 м² вертикали → 64 рулона
      expect(qty(plain, 'roofizolTkp')).toBe(58)
      expect(qty(withParapets, 'roofizolTkp')).toBe(64)

      // усиление делает Полиизол, поэтому подкладочный слой остаётся по площади кровли
      expect(qty(withParapets, 'roofizolTpp')).toBe(qty(plain, 'roofizolTpp'))
    })

    it('вертикаль парапета тоже грунтуется', () => {
      // (500 + 60,5) × 0,35 кг/м² = 196,2 кг вместо 175
      expect(qty(calculate(input({ area: 500, parapets: 100 })), 'primerUniversal')).toBe(196.2)
    })

    it('у ПВХ примыкание решается краевой рейкой — рулонного усиления нет', () => {
      const keys = calculate(input({ roofMethod: 'pvc', parapets: 100 })).lines.map((l) => l.key)

      expect(keys).not.toContain('poliizolTpp')
      expect(keys).not.toContain('primerUniversal')
      // После удаления герметика примыкания не добавляют ПВХ-кровле ни одной
      // позиции: смета совпадает с расчётом без примыканий.
      expect(keys).toEqual(['pvcMembrane'])
    })

    it('высота вне допустимых границ зажимается', () => {
      const huge = calculate(input({ parapets: 100, parapetHeight: 5000 }))
      const atMax = calculate(input({ parapets: 100, parapetHeight: 100 }))
      expect(qty(huge, 'poliizolTpp')).toBe(qty(atMax, 'poliizolTpp'))

      const tiny = calculate(input({ parapets: 100, parapetHeight: 0 }))
      const atMin = calculate(input({ parapets: 100, parapetHeight: 10 }))
      expect(qty(tiny, 'poliizolTpp')).toBe(qty(atMin, 'poliizolTpp'))
    })

    it('нечисловая высота откатывается к значению по умолчанию', () => {
      const broken = calculate(input({ parapets: 100, parapetHeight: NaN }))
      expect(qty(broken, 'poliizolTpp')).toBe(
        qty(calculate(input({ parapets: 100 })), 'poliizolTpp'),
      )
    })
  })

  it('подставляет марку, выбранную клиентом', () => {
    const keys = calculate(
      input({ topProduct: 'folgoizolTfp', bottomProduct: 'poliizolEpp', layers: 2 }),
    ).lines.map((line) => line.key)

    expect(keys).toContain('folgoizolTfp')
    expect(keys).toContain('poliizolEpp')
    expect(keys).not.toContain('roofizolTkp')
  })

  it('отбрасывает марку, недопустимую для роли слоя', () => {
    // Roofizol ТПП — подкладочный: в верхнем слое он оставил бы кровлю без УФ-защиты
    const keys = calculate(input({ topProduct: 'roofizolTpp', layers: 1 })).lines.map((l) => l.key)
    expect(keys).toContain('roofizolTkp')
    expect(keys).not.toContain('roofizolTpp')

    // и наоборот: марка с посыпкой не может быть нижним слоем
    const bottom = calculate(input({ bottomProduct: 'roofizolTkp', layers: 2 })).lines
    expect(bottom.filter((l) => l.key === 'roofizolTkp')).toHaveLength(1)
    expect(bottom.some((l) => l.key === 'roofizolTpp')).toBe(true)
  })

  it('в каждой роли есть хотя бы одна марка, и верхние слои размечены финишем', () => {
    for (const role of ['rollTop', 'rollBottom', 'rollFoundation', 'primer', 'mastic'] as const) {
      expect(productsForRole(role).length).toBeGreaterThan(0)
    }
    for (const key of productsForRole('rollTop')) {
      expect(PRODUCTS[key].finish).toBeDefined()
    }
  })

  it('выбранная мастика и праймер попадают в расчёт фундамента', () => {
    const keys = calculate(
      input({
        objectType: 'foundation',
        area: 150,
        foundationMethod: 'coating',
        masticProduct: 'masticMbgG',
        primerProduct: 'primerFast',
      }),
    ).lines.map((line) => line.key)

    expect(keys).toContain('masticMbgG')
    expect(keys).toContain('primerFast')
  })

  it('фундамент: обмазочная даёт мастику, рулонная — рулоны, комбинированная — оба', () => {
    const base = { objectType: 'foundation' as const, areaMode: 'area' as const, area: 150 }

    const coating = calculate(input({ ...base, foundationMethod: 'coating' })).lines.map(
      (l) => l.key,
    )
    expect(coating).toContain('masticWaterproof')
    expect(coating).not.toContain('gidroizolFundament')

    const roll = calculate(input({ ...base, foundationMethod: 'roll' })).lines.map((l) => l.key)
    expect(roll).toContain('gidroizolFundament')
    expect(roll).not.toContain('masticWaterproof')

    const combined = calculate(input({ ...base, foundationMethod: 'combined' })).lines.map(
      (l) => l.key,
    )
    expect(combined).toContain('masticWaterproof')
    expect(combined).toContain('gidroizolFundament')
  })

  describe('Рулонные материалы в фундаменте', () => {
    const foundation = (overrides: Partial<CalcInput> = {}) =>
      calculate(input({ objectType: 'foundation', areaMode: 'area', area: 150, ...overrides }))
        .lines

    it('для фундамента доступны марки с посыпкой и плёнкой, но не фольгированные', () => {
      const available = productsForRole('rollFoundation')

      for (const key of ['roofizolTkp', 'izomembraneEkp', 'roofizolTpp'] as const) {
        expect(available).toContain(key)
      }
      // фольга в грунте бесполезна и рвётся при обратной засыпке — только кровля
      for (const key of [
        'roofizolTfp',
        'izomembraneEfp',
        'folgoizolTfp',
        'folgoizolEfp',
      ] as const) {
        expect(available).not.toContain(key)
      }
    })

    it('клиент может выбрать ТКП для фундамента', () => {
      const keys = foundation({
        foundationMethod: 'roll',
        layers: 1,
        foundationRollProduct: 'roofizolTkp',
      }).map((l) => l.key)

      expect(keys).toContain('roofizolTkp')
    })

    it('фольгированную марку в фундаменте заменяет материал по умолчанию', () => {
      const keys = foundation({
        foundationMethod: 'roll',
        layers: 1,
        foundationRollProduct: 'folgoizolTfp',
      }).map((l) => l.key)

      expect(keys).not.toContain('folgoizolTfp')
      expect(keys).toContain('gidroizolFundament')
    })

    it('два слоя с посыпкой: под финишный ложится подкладочный, а не вторая посыпка', () => {
      const lines = foundation({
        foundationMethod: 'roll',
        layers: 2,
        foundationRollProduct: 'roofizolTkp',
      })

      // 150 × 1,15 ÷ 10 = 17,25 → 18 рулонов каждого слоя
      expect(lines.filter((l) => l.key === 'roofizolTkp')).toHaveLength(1)
      expect(lines.find((l) => l.key === 'roofizolTkp')?.qty).toBe(18)
      expect(lines.find((l) => l.key === 'roofizolTpp')?.qty).toBe(18)
      // подкладочный идёт первым — он под финишным
      const keys = lines.map((l) => l.key)
      expect(keys.indexOf('roofizolTpp')).toBeLessThan(keys.indexOf('roofizolTkp'))
    })

    it('плёночную марку в два слоя по-прежнему считает одной позицией', () => {
      const lines = foundation({
        foundationMethod: 'roll',
        layers: 2,
        foundationRollProduct: 'gidroizolFundament',
      })

      expect(lines.filter((l) => l.key === 'gidroizolFundament')).toHaveLength(1)
      // 150 × 1,15 × 2 слоя ÷ 10 = 34,5 → 35 рулонов
      expect(lines.find((l) => l.key === 'gidroizolFundament')?.qty).toBe(35)
    })

    it('один слой с посыпкой подкладочного не тянет', () => {
      const keys = foundation({
        foundationMethod: 'roll',
        layers: 1,
        foundationRollProduct: 'roofizolTkp',
      }).map((l) => l.key)

      expect(keys).toContain('roofizolTkp')
      expect(keys).not.toContain('roofizolTpp')
    })

    it('комбинированная считается как один рулонный слой даже с посыпкой', () => {
      const lines = foundation({
        foundationMethod: 'combined',
        layers: 2,
        foundationRollProduct: 'roofizolTkp',
      })

      expect(lines.some((l) => l.key === 'masticWaterproof')).toBe(true)
      expect(lines.filter((l) => l.key === 'roofizolTkp')).toHaveLength(1)
      expect(lines.some((l) => l.key === 'roofizolTpp')).toBe(false)
    })
  })

  it('геотекстиль добавляется только для фундамента по галочке', () => {
    const keys = calculate(
      input({ objectType: 'foundation', area: 150, geotextile: true }),
    ).lines.map((line) => line.key)
    expect(keys).toContain('geotextile')
  })

  it('на кровле с утеплителем добавляет пароизоляцию под него', () => {
    const result = calculate(input({ area: 500, insulation: 'penopleks', insulationThickness: 50 }))
    const keys = result.lines.map((line) => line.key)

    expect(keys).toContain('vaporBarrier')
    // 500 м² × 1,15 запаса = 575 м²
    expect(result.lines.find((line) => line.key === 'vaporBarrier')?.qty).toBe(575)
    // пароизоляция идёт под утеплителем
    expect(keys.indexOf('vaporBarrier')).toBeLessThan(keys.indexOf('penopleks'))
  })

  it('без утеплителя пароизоляции нет, в фундаменте её нет никогда', () => {
    expect(
      calculate(input({ insulation: 'none' })).lines.some((l) => l.key === 'vaporBarrier'),
    ).toBe(false)

    expect(
      calculate(input({ objectType: 'foundation', area: 150, insulation: 'basalt' })).lines.some(
        (l) => l.key === 'vaporBarrier',
      ),
    ).toBe(false)
  })

  it('переводит толщину утеплителя в кубометры', () => {
    const result = calculate(input({ area: 500, insulation: 'penopleks', insulationThickness: 50 }))
    // 500 м² × 0,05 м = 25 м³
    expect(result.lines.find((line) => line.key === 'penopleks')?.qty).toBe(25)
  })

  it('итог равен сумме позиций', () => {
    const result = calculate(input({ area: 500, parapets: 40, insulation: 'basalt' }), PRICES)
    const sum = result.lines.reduce((acc, line) => acc + (line.total ?? 0), 0)
    expect(result.total).toBe(sum)
    expect(result.total).toBeGreaterThan(0)
    expect(result.pricesComplete).toBe(true)
  })

  describe('Цены из каталога', () => {
    it('без карты цен считает объёмы, но не суммы', () => {
      const result = calculate(input({ area: 500 }))

      expect(result.lines.length).toBeGreaterThan(0)
      expect(result.lines.every((line) => line.total === null)).toBe(true)
      expect(result.total).toBe(0)
      expect(result.pricesComplete).toBe(false)
    })

    it('позиция без цены не попадает в итог, но остаётся в смете', () => {
      const withoutPrimer: PriceMap = { ...PRICES }
      delete withoutPrimer.primerUniversal

      const full = calculate(input({ area: 500 }), PRICES)
      const partial = calculate(input({ area: 500 }), withoutPrimer)

      expect(partial.lines).toHaveLength(full.lines.length)
      expect(partial.lines.find((line) => line.key === 'primerUniversal')?.total).toBeNull()
      expect(partial.total).toBeLessThan(full.total)
      expect(partial.pricesComplete).toBe(false)
    })

    it('рулонная цена каталога умножается на площадь рулона', () => {
      // Roofizol ТПП: 16 500 сум/м² × 10 м² в рулоне
      expect(catalogPriceToUnitPrice('roofizolTpp', 16_500)).toBe(165_000)
    })

    it('цена утеплителя за м² плиты переводится в кубометры', () => {
      // Пеноплэкс: 20 000 сум/м² плиты 50 мм → 400 000 сум/м³
      expect(catalogPriceToUnitPrice('penopleks', 20_000)).toBe(400_000)
    })

    it('кг и м² берутся из каталога как есть', () => {
      expect(catalogPriceToUnitPrice('primerUniversal', 11_500)).toBe(11_500)
      expect(catalogPriceToUnitPrice('pvcMembrane', 75_000)).toBe(75_000)
    })

    it('пустая или отрицательная цена не считается ценой', () => {
      expect(catalogPriceToUnitPrice('roofizolTpp', 0)).toBeNull()
      expect(catalogPriceToUnitPrice('roofizolTpp', NaN)).toBeNull()
    })
  })
})
