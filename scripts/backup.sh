#!/bin/bash
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
DB_NAME="marja-website"
DB_USER="postgres"
BACKUP_DIR="/backups/marja-website"
KEEP_DAYS=14

# Load bot credentials from the app .env (same file Next.js uses)
ENV_FILE="$(dirname "$0")/../.env"
if [[ -f "$ENV_FILE" ]]; then
  export $(grep -E '^(TELEGRAM_BOT_TOKEN|TELEGRAM_CHAT_ID)=' "$ENV_FILE" | xargs)
fi
# ─────────────────────────────────────────────────────────────────────────────

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
FILENAME="marja_${TIMESTAMP}.dump"
OUT="$BACKUP_DIR/$FILENAME"

mkdir -p "$BACKUP_DIR"

send_telegram() {
  local text="$1"
  if [[ -z "${TELEGRAM_BOT_TOKEN:-}" || -z "${TELEGRAM_CHAT_ID:-}" ]]; then return; fi
  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -H "Content-Type: application/json" \
    -d "{\"chat_id\":\"${TELEGRAM_CHAT_ID}\",\"text\":\"${text}\",\"parse_mode\":\"HTML\"}" \
    > /dev/null
}

# ── Backup ────────────────────────────────────────────────────────────────────
if pg_dump -U "$DB_USER" -F c -f "$OUT" "$DB_NAME"; then
  SIZE=$(du -sh "$OUT" | cut -f1)

  # Rotate old backups
  find "$BACKUP_DIR" -name "*.dump" -mtime +${KEEP_DAYS} -delete

  REMAINING=$(find "$BACKUP_DIR" -name "*.dump" | wc -l)

  send_telegram "✅ <b>Backup OK</b>
🗄 <code>${FILENAME}</code>
💾 Size: <b>${SIZE}</b>
📦 Files kept: <b>${REMAINING}</b>"
else
  send_telegram "❌ <b>Backup FAILED</b>
🗄 DB: <code>${DB_NAME}</code>
🕐 Time: <code>${TIMESTAMP}</code>

Check logs on the server."
  exit 1
fi
