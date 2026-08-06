#!/bin/bash
# Скрипт деплоя: сначала стартует БД, потом миграции, потом строит образ и поднимает всё.
#
# Порядок «миграции ДО сборки app» важен: образ builder выполняет `pnpm run build`
# с реальным DATABASE_URL (см. docker-compose.yml, network: host), то есть генерация
# страниц ходит в базу. Если схема ещё старая, а код уже читает новую колонку,
# билд падает на первой же странице каталога: column products.price_from does not exist.
# Миграции аддитивные, старому контейнеру они не мешают — он работает, пока идёт сборка.
set -e

echo "=== 1. Запускаем postgres ==="
docker compose up postgres -d

echo "=== 2. Ждём, пока postgres будет готов ==="
until docker compose exec -T postgres pg_isready -U "${POSTGRES_USER:-postgres}" -d marja-website 2>/dev/null; do
  printf '.'
  sleep 2
done
echo " ✓"

echo "=== 3. Собираем образ для миграций ==="
docker compose --profile migrate build migrate

echo "=== 4. Запускаем миграции ==="
docker compose --profile migrate run --rm migrate

echo "=== 5. Проверяем, что миграции действительно применены ==="
# Проверять код возврата бесполезно: если в payload_migrations есть запись
# batch = -1 (след dev-режима), Payload спрашивает «data loss, продолжить?» и при
# отказе выходит с кодом 0 (@payloadcms/drizzle/dist/migrate.js). set -e такой
# отказ не ловит — деплой шёл дальше и выкатывал новый код на старую схему,
# после чего каталог отдавал 500: column products.price_from does not exist.
# Поэтому сверяем файлы миграций с тем, что записано в базе.
applied=$(docker compose exec -T postgres psql -U "${POSTGRES_USER:-postgres}" \
  -d marja-website -tAc 'select name from payload_migrations' | tr -d '\r' | sort)
on_disk=$(find src/migrations -maxdepth 1 -name '*.ts' ! -name 'index.ts' \
  -exec basename {} .ts \; | sort)
pending=$(comm -23 <(echo "$on_disk") <(echo "$applied"))

if [ -n "$pending" ]; then
  echo
  echo "ОСТАНОВЛЕНО: миграции не применены —"
  echo "$pending" | sed 's/^/  - /'
  echo
  echo "Образ приложения НЕ пересобирался, сайт работает на прежней версии."
  echo "Если Payload спрашивал про dev-режим, ответьте y и запустите деплой заново:"
  echo "  миграции этого проекта только создают таблицы, типы и колонки,"
  echo "  ничего не удаляют и не переписывают."
  exit 1
fi
echo "непримененных миграций нет ✓"

# Сборка — самый прожорливый шаг: `pnpm run build` берёт до 1.5 ГБ heap
# (Dockerfile, max-old-space-size=1536). По умолчанию сайт продолжает работать
# всю сборку, простой только на перезапуске. Если памяти в обрез и билд падает
# по OOM — запускать как `STOP_APP_FOR_BUILD=1 ./deploy.sh`: сборка пройдёт
# на освободившейся памяти, но сайт будет лежать до шага 8.
# Postgres останавливать нельзя ни в каком режиме: билд ходит в базу.
if [ "${STOP_APP_FOR_BUILD:-0}" = "1" ]; then
  echo "=== 6. Останавливаем app на время сборки ==="
  docker compose stop app
else
  echo "=== 6. app остаётся работать (STOP_APP_FOR_BUILD=1 — остановить) ==="
fi

echo "=== 7. Строим образ приложения ==="
docker compose build app

echo "=== 8. Запускаем приложение ==="
docker compose up -d

echo "=== Готово! ==="
docker compose ps
