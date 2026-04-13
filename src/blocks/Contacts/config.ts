import type { Block } from 'payload'

export const ContactsBlock: Block = {
  slug: 'contacts',
  interfaceName: 'ContactsBlock',
  labels: {
    singular: 'Контакты',
    plural: 'Контакты',
  },
  fields: [
    {
      name: 'officesTitle',
      type: 'text',
      label: 'Заголовок секции офисов',
      localized: true,
    },
    {
      name: 'offices',
      type: 'array',
      label: 'Офисы',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Название офиса',
          required: true,
          localized: true,
        },
        {
          name: 'address',
          type: 'text',
          label: 'Адрес',
          required: true,
          localized: true,
        },
        {
          name: 'hours',
          type: 'text',
          label: 'Часы работы',
          localized: true,
        },
        {
          name: 'mapUrl',
          type: 'text',
          label: 'Ссылка на карту (href)',
          admin: {
            description: 'Ссылка для открытия в Яндекс Картах или Google Maps',
          },
        },
      ],
    },
    {
      name: 'contactsTitle',
      type: 'text',
      label: 'Заголовок секции контактных данных',
      localized: true,
    },
    {
      name: 'phones',
      type: 'array',
      label: 'Телефоны',
      fields: [
        {
          name: 'number',
          type: 'text',
          label: 'Номер телефона',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Описание (напр. Горячая линия)',
          localized: true,
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'emailLabel',
      type: 'text',
      label: 'Описание email',
      localized: true,
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      label: 'URL для встроенной карты (iframe src)',
      admin: {
        description: 'Ссылка для embed Яндекс Карт (https://yandex.ru/map-widget/...)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание внизу блока',
      localized: true,
    },
  ],
}
