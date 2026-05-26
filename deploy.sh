#!/bin/bash
# Скрипт деплоя: сначала стартует БД, потом строит образ, потом поднимает всё
set -e

echo "=== 1. Запускаем postgres ==="
docker compose up postgres -d

echo "=== 2. Ждём, пока postgres будет готов ==="
until docker compose exec -T postgres pg_isready -U "${POSTGRES_USER:-postgres}" -d marja-website 2>/dev/null; do
  printf '.'
  sleep 2
done
echo " ✓"

echo "=== 3. Строим образ приложения ==="
docker compose build app

echo "=== 4. Собираем образ для миграций ==="
docker compose --profile migrate build migrate

echo "=== 5. Запускаем миграции ==="
docker compose --profile migrate run --rm migrate

echo "=== 6. Запускаем приложение ==="
docker compose up -d

echo "=== Готово! ==="
docker compose ps
