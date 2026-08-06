import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import { sendTelegramNotification } from '@/services/notifications/telegram'

/**
 * Заявку пишет клиент, а уходит она с `parse_mode: 'HTML'`. Живая проверка
 * 05.08.2026 показала, что имя «ООО <Марджа> & Ко» Telegram отвергает с
 * 400 `can't parse entities`, — заявка получала статус failed уже после того,
 * как клиент увидел «Спасибо». Тесты держат экранирование на месте.
 */

const fetchMock = vi.fn()

const lastBody = (): { text: string; parse_mode: string } =>
  JSON.parse(fetchMock.mock.calls[0]![1].body)

beforeEach(() => {
  fetchMock.mockReset()
  fetchMock.mockResolvedValue({ ok: true, text: async () => '' })
  vi.stubGlobal('fetch', fetchMock)
  vi.stubEnv('TELEGRAM_BOT_TOKEN', 'test-token')
  vi.stubEnv('TELEGRAM_CHAT_ID', '123')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('sendTelegramNotification', () => {
  it('экранирует угловые скобки в значениях полей', async () => {
    const status = await sendTelegramNotification({
      submissionData: [{ field: 'Имя', value: 'ООО <Марджа> & Ко' }],
      form: { title: 'Расчёт объекта (калькулятор)' },
    })

    expect(status).toBe('sent')

    const { text } = lastBody()
    expect(text).toContain('ООО &lt;Марджа&gt; &amp; Ко')
    // Разметку самого уведомления экранирование ломать не должно.
    expect(text).toContain('<b>Имя:</b>')
  })

  it('экранирует подписи полей и заголовок формы', async () => {
    await sendTelegramNotification({
      submissionData: [{ field: 'Площадь <м²>', value: '500' }],
      form: { title: 'Заявка <тест>' },
    })

    const { text } = lastBody()
    expect(text).toContain('<b>Площадь &lt;м²&gt;:</b>')
    expect(text).toContain('<b>Заявка &lt;тест&gt;</b>')
  })

  it('не оставляет в сообщении ни одного тега, кроме собственных <b>', async () => {
    await sendTelegramNotification({
      submissionData: [
        { field: 'Комментарий', value: '<script>alert(1)</script> и <i>курсив</i>' },
      ],
      form: { title: 'Заявка' },
    })

    const { text } = lastBody()
    const tags = text.match(/<\/?[a-z][^>]*>/gi) ?? []
    expect(new Set(tags)).toEqual(new Set(['<b>', '</b>']))
  })

  it('не трогает уже безопасный текст', async () => {
    await sendTelegramNotification({
      submissionData: [{ field: 'Материалы', value: '• Roofizol ТПП — 58 рул.' }],
      form: { title: 'Заявка' },
    })

    expect(lastBody().text).toContain('• Roofizol ТПП — 58 рул.')
  })

  it('без настроенного бота ничего не отправляет', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '')

    expect(
      await sendTelegramNotification({ submissionData: [{ field: 'Имя', value: 'Тест' }] }),
    ).toBe('skipped')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('отказ Telegram отдаёт failed, а не исключение', async () => {
    fetchMock.mockResolvedValue({ ok: false, text: async () => 'Bad Request' })

    expect(
      await sendTelegramNotification({ submissionData: [{ field: 'Имя', value: 'Тест' }] }),
    ).toBe('failed')
  })
})
