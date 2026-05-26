#!/bin/bash
# Запускается ОДИН РАЗ при первом деплое для получения SSL сертификата.
# После этого certbot-контейнер сам обновляет сертификат каждые 12 часов.
set -e

DOMAIN="marja.uz"
EMAIL="ziyodahmedov23@gmail.com"

echo "=== 1. Запускаем nginx (HTTP-only) ==="
docker compose up nginx -d

echo "=== 2. Ждём запуска nginx ==="
sleep 3

echo "=== 3. Получаем SSL сертификат от Let's Encrypt ==="
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

echo "=== 4. Записываем полный nginx конфиг (HTTP + HTTPS) ==="
cat > nginx/conf.d/marja.conf << 'NGINXEOF'
# HTTP → HTTPS редирект
server {
    listen 80;
    server_name marja.uz www.marja.uz;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS
server {
    listen 443 ssl;
    http2 on;
    server_name marja.uz www.marja.uz;

    ssl_certificate     /etc/letsencrypt/live/marja.uz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/marja.uz/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 1d;

    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;

    # Максимальный размер загружаемых файлов (для медиа в Payload)
    client_max_body_size 50m;

    location / {
        proxy_pass         http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        'upgrade';
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
NGINXEOF

echo "=== 5. Перезагружаем nginx с новым конфигом ==="
docker compose exec nginx nginx -s reload

echo ""
echo "✓ SSL настроен!"
echo "✓ Сайт доступен на https://marja.uz"
