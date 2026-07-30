import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

/**
 * Журнал заявок с трёх форм сайта: калькулятор, консультация, заказ товара.
 *
 * Менеджеры работают в Telegram — эта коллекция не замена чату, а страховка:
 * запись создаётся ДО отправки, поэтому упавший Telegram или CRM больше не
 * означает бесследно потерянный лид. Поле «Доставка» показывает, дошла ли
 * заявка: фильтр по `deliveryStatus = failed` — это список тех, кому никто
 * не позвонил, и он же сигнал, что канал сломан (например, у группы сменился
 * chat_id после апгрейда в супергруппу).
 *
 * Создание закрыто: заявки пишет только сервер через Local API, публичного
 * доступа к REST на запись быть не должно.
 */
export const Leads: CollectionConfig<'leads'> = {
  slug: 'leads',
  labels: {
    singular: 'Заявка',
    plural: 'Заявки',
  },
  admin: {
    useAsTitle: 'phone',
    defaultColumns: ['phone', 'name', 'source', 'deliveryStatus', 'createdAt'],
    description:
      'Все заявки с сайта. Менеджеры получают их в Telegram — здесь архив и проверка доставки.',
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'source',
      type: 'select',
      required: true,
      options: [
        { label: 'Калькулятор объекта', value: 'calculator' },
        { label: 'Консультация', value: 'consultation' },
        { label: 'Заказ товара', value: 'order' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Телефон',
      required: true,
      index: true,
    },
    {
      name: 'city',
      type: 'text',
      label: 'Город',
    },
    {
      name: 'timing',
      type: 'select',
      label: 'Срок закупки',
      options: [
        { label: 'Сейчас', value: 'now' },
        { label: 'В течение месяца', value: 'month' },
        { label: 'Через 1–3 месяца', value: 'quarter' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Заполняется только калькулятором',
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      label: 'Комментарий',
    },
    {
      name: 'area',
      type: 'number',
      label: 'Площадь, м²',
      admin: { description: 'Только для заявок из калькулятора' },
    },
    {
      name: 'amount',
      type: 'number',
      label: 'Сумма расчёта, UZS',
      admin: {
        description: 'Ориентировочная сумма на момент заявки. Только для калькулятора.',
      },
    },
    {
      // Полный снимок того, что ушло менеджерам. Держим списком, а не отдельными
      // полями под каждую форму: формы будут меняться, а старые заявки должны
      // остаться читаемыми без миграций данных.
      name: 'details',
      type: 'array',
      label: 'Содержимое заявки',
      admin: {
        description: 'Ровно то, что было отправлено в Telegram и CRM.',
        initCollapsed: true,
      },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'value', type: 'textarea' },
      ],
    },
    {
      name: 'locale',
      type: 'text',
      label: 'Язык сайта',
      admin: { position: 'sidebar' },
    },
    {
      name: 'ip',
      type: 'text',
      label: 'IP',
      admin: {
        position: 'sidebar',
        description: 'unknown — заголовки от nginx не пришли',
      },
    },
    {
      name: 'deliveryStatus',
      type: 'select',
      label: 'Доставка',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Отправляется…', value: 'pending' },
        { label: 'Доставлено', value: 'delivered' },
        { label: 'Частично', value: 'partial' },
        { label: 'Не доставлено', value: 'failed' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'pending после сохранения означает, что процесс упал между записью и отправкой — такую заявку нужно обработать вручную.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'telegramStatus',
          type: 'select',
          label: 'Telegram',
          defaultValue: 'pending',
          options: [
            { label: 'Отправляется…', value: 'pending' },
            { label: 'Отправлено', value: 'sent' },
            { label: 'Ошибка', value: 'failed' },
            { label: 'Не настроен', value: 'skipped' },
          ],
        },
        {
          name: 'crmStatus',
          type: 'select',
          label: 'CRM',
          defaultValue: 'pending',
          options: [
            { label: 'Отправляется…', value: 'pending' },
            { label: 'Отправлено', value: 'sent' },
            { label: 'Ошибка', value: 'failed' },
            { label: 'Не настроен', value: 'skipped' },
          ],
        },
      ],
    },
  ],
}
