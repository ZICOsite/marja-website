/**
 * Ограничение частоты заявок и защита от дублей.
 *
 * Счётчики живут в памяти процесса и обнуляются при рестарте — для одного
 * инстанса в Docker этого достаточно. Если появятся несколько реплик,
 * понадобится общее хранилище (Redis), потому что каждая реплика будет считать своё.
 */

const hits = new Map<string, number[]>()
const fingerprints = new Map<string, number>()

/** Верхняя граница числа ключей — страховка от роста памяти при атаке с подменой IP. */
const MAX_KEYS = 10_000

export const RATE_LIMIT = { limit: 5, windowMs: 2 * 60 * 1000 }
export const DEDUPE_WINDOW_MS = 2 * 60 * 1000

function prune(now: number): void {
  for (const [key, times] of hits) {
    const fresh = times.filter((t) => now - t < RATE_LIMIT.windowMs)
    if (fresh.length === 0) hits.delete(key)
    else hits.set(key, fresh)
  }
  for (const [key, time] of fingerprints) {
    if (now - time >= DEDUPE_WINDOW_MS) fingerprints.delete(key)
  }
}

/**
 * Разрешена ли ещё одна заявка с этого IP в рамках формы. Вызов засчитывается
 * как попытка. Лимит считается отдельно по каждой форме (scope).
 *
 * Неизвестный IP (заголовки не пришли) не ограничиваем: потерять живой лид хуже,
 * чем пропустить спам — от него остаётся защита по дублям. Проверять надо именно
 * ip, а не составной ключ, иначе 'scope:unknown' проходит мимо этого условия.
 */
export function allowRequest(scope: string, ip: string, options = RATE_LIMIT): boolean {
  if (!ip || ip === 'unknown') return true

  const key = `${scope}:${ip}`
  const now = Date.now()
  if (hits.size > MAX_KEYS) prune(now)

  const times = (hits.get(key) ?? []).filter((t) => now - t < options.windowMs)

  // Заблокированную попытку в окно НЕ записываем: иначе нетерпеливый клиент,
  // жмущий кнопку, сам продлевал бы себе блокировку бесконечно. Боту это ничего
  // не даёт — потолок отправок за окно остаётся прежним.
  if (times.length >= options.limit) return false

  times.push(now)
  hits.set(key, times)

  return true
}

/**
 * Повторная отправка той же заявки в пределах окна — двойной клик или
 * «отправлю ещё раз, вдруг не дошло». Первый вызов возвращает false.
 */
export function isDuplicate(fingerprint: string, windowMs = DEDUPE_WINDOW_MS): boolean {
  const now = Date.now()
  if (fingerprints.size > MAX_KEYS) prune(now)

  const previous = fingerprints.get(fingerprint)
  fingerprints.set(fingerprint, now)

  return previous !== undefined && now - previous < windowMs
}

/** Только для тестов. */
export function resetRateLimit(): void {
  hits.clear()
  fingerprints.clear()
}
