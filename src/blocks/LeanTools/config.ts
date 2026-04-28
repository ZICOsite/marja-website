import type { Block } from 'payload'

export const LeanToolsBlock: Block = {
  slug: 'leanTools',
  interfaceName: 'LeanToolsBlock',
  labels: {
    singular: 'Lean Tools (Инструменты бережливого производства)',
    plural: 'Lean Tools (Инструменты бережливого производства)',
  },
  fields: [
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
      name: 'tools',
      type: 'array',
      label: 'Инструменты',
      minRows: 1,
      maxRows: 9,
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Иконка',
          defaultValue: 'layers',
          options: [
            { label: 'Слои (5S)', value: 'layers' },
            { label: 'Тренд (Kaizen)', value: 'trendingUp' },
            { label: 'Сетка (Kanban)', value: 'layoutGrid' },
            { label: 'Спидометр (SMED)', value: 'gauge' },
            { label: 'Гаечный ключ (TPM)', value: 'wrench' },
            { label: 'График (Анализ)', value: 'barChart' },
            { label: 'Цель (Poka-yoke)', value: 'target' },
            { label: 'Перемешать (Heijunka)', value: 'shuffle' },
            { label: 'Активность (Мониторинг)', value: 'activity' },
            { label: 'Щит (Jidoka)', value: 'shieldCheck' },
          ],
        },
        {
          name: 'name',
          type: 'text',
          label: 'Аббревиатура / название (например: 5S)',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Подзаголовок',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Описание',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
