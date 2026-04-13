import type { Block } from 'payload'

export const CompletedProjects: Block = {
  slug: 'completedProjects',
  interfaceName: 'CompletedProjectsBlock',
  labels: {
    singular: 'Completed Projects (Выполненные объекты)',
    plural: 'Completed Projects (Выполненные объекты)',
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      label: 'Надзаголовок',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Заголовок секции',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Описание',
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      required: true,
      minRows: 4,
      maxRows: 4,
      label: 'Объекты',
      admin: {
        description: 'Выберите до 4 объектов для отображения на главной странице',
      },
    },
    {
      name: 'viewAllLabel',
      type: 'text',
      localized: true,
      label: 'Текст кнопки "Смотреть все"',
    },
    {
      name: 'viewAllLink',
      type: 'text',
      label: 'Ссылка "Смотреть все"',
      admin: {
        description: 'Относительный путь, например /projects',
      },
    },
  ],
}
