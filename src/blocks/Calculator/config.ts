import type { Block } from 'payload'

export const CalculatorBlock: Block = {
  slug: 'calculator',
  interfaceName: 'CalculatorBlock',
  labels: {
    singular: 'Калькулятор объекта',
    plural: 'Калькулятор объекта',
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      label: 'Надзаголовок',
      localized: true,
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      localized: true,
    },
    {
      name: 'showPrices',
      type: 'checkbox',
      label: 'Показывать ориентировочные цены',
      defaultValue: true,
      admin: {
        description:
          'Если выключить — калькулятор покажет только объёмы материалов, без сумм. Цены берутся из карточек товаров в каталоге.',
      },
    },
    {
      name: 'disclaimer',
      type: 'textarea',
      label: 'Дисклеймер под расчётом',
      localized: true,
      admin: {
        description: 'Если пусто — используется стандартный текст из переводов.',
      },
    },
  ],
}
