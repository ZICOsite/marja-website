#!/bin/bash
# Запускается ОДИН РАЗ при первом деплое для получения SSL сертификата.
# После этого certbot-контейнер сам обновляет сертификат каждые 12 часов.
set -e

DOMAIN="marja.uz"
EMAIL="ziyodahmedov23@gmail.com"

echo "=== 1. Запускаем postgres и app ==="
docker compose up postgres app -d

echo "=== 2. Останавливаем nginx (освобождаем порт 80 для certbot) ==="
docker compose stop nginx

echo "=== 3. Получаем SSL сертификат от Let's Encrypt (standalone) ==="
# Только первый выпуск идёт через standalone: nginx не стартует, пока файла
# сертификата нет (ssl_certificate указывает на несуществующий путь), поэтому
# отдать webroot-челлендж на этом шаге ещё некому. Порт 80 сейчас свободен.
docker run --rm \
    -v marja-website_certbot-certs:/etc/letsencrypt \
    -p 80:80 \
    certbot/certbot:latest certonly \
    --standalone \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

echo "=== 4. Переводим продление на webroot ==="
# Обязательный шаг. Certbot запоминает способ выпуска и повторяет его при renew,
# а standalone после старта nginx уже нерабочий: порт 80 занят, Let's Encrypt
# приходит в nginx и челлендж проваливается. Один раз это уже стоило сайту
# простоя — сертификат протух, потому что renew молча падал 30 дней подряд.
docker run --rm \
    -v marja-website_certbot-certs:/etc/letsencrypt \
    alpine sed -i \
    's|^authenticator = standalone$|authenticator = webroot\nwebroot_path = /var/www/certbot,|' \
    "/etc/letsencrypt/renewal/$DOMAIN.conf"

docker run --rm \
    -v marja-website_certbot-certs:/etc/letsencrypt \
    alpine grep -q '^authenticator = webroot$' "/etc/letsencrypt/renewal/$DOMAIN.conf" \
    || { echo "ОСТАНОВЛЕНО: не удалось переключить продление на webroot"; exit 1; }

echo "=== 5. Запускаем nginx с HTTPS конфигом ==="
docker compose start nginx

echo "=== 6. Проверяем, что продление действительно работает ==="
docker compose up certbot -d
docker compose run --rm --entrypoint certbot certbot renew --dry-run

echo ""
echo "✓ SSL настроен!"
echo "✓ Сайт доступен на https://marja.uz"
