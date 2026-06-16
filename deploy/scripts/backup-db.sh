#!/bin/bash
set -euo pipefail

# Malmil database backup script
# Usage: ./backup-db.sh [output-dir]
# Recommended cron: 0 3 * * * /path/to/deploy/scripts/backup-db.sh /backups/malmil

BACKUP_DIR="${1:-/backups/malmil}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-malmil_project}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASS:-}"

mkdir -p "$BACKUP_DIR"

FILENAME="malmil_${DB_NAME}_${TIMESTAMP}.sql.gz"
BACKUP_PATH="${BACKUP_DIR}/${FILENAME}"

MYSQL_PWD="$DB_PASS" mysqldump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --user="$DB_USER" \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  --quick \
  "$DB_NAME" | gzip > "$BACKUP_PATH"

# Verify
if [ -s "$BACKUP_PATH" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup OK: $BACKUP_PATH ($(du -h "$BACKUP_PATH" | cut -f1))"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Backup file is empty"
  exit 1
fi

# Rotate old backups
find "$BACKUP_DIR" -name "malmil_${DB_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Cleaned up backups older than ${RETENTION_DAYS} days"

# Optional: upload to S3-compatible storage
# if [ -n "${S3_BUCKET:-}" ]; then
#   aws s3 cp "$BACKUP_PATH" "s3://${S3_BUCKET}/db-backups/"
# fi
