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

echo "=== 4. Запускаем nginx с HTTPS конфигом ==="
docker compose start nginx

echo ""
echo "✓ SSL настроен!"
echo "✓ Сайт доступен на https://marja.uz"
