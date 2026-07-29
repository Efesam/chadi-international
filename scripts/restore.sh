#!/usr/bin/env bash
set -euo pipefail

# Restores server_data/server_uploads from a backup created by backup.sh.
# This OVERWRITES whatever is currently in those volumes - stop the api
# container first (`docker compose stop api`) so nothing writes to the data
# directory mid-restore, and be sure you actually want to discard current
# data before confirming.
#
# Usage: ./scripts/restore.sh path/to/chadi-backup-2026-07-29_120000.tar.gz

BACKUP_FILE="${1:?Usage: ./scripts/restore.sh path/to/backup.tar.gz}"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "No such file: $BACKUP_FILE"
  exit 1
fi

PROJECT_NAME="$(basename "$(pwd)")"
DATA_VOLUME="${PROJECT_NAME}_server_data"
UPLOADS_VOLUME="${PROJECT_NAME}_server_uploads"
BACKUP_DIR="$(cd "$(dirname "$BACKUP_FILE")" && pwd)"
BACKUP_NAME="$(basename "$BACKUP_FILE")"

echo "This will OVERWRITE the current server_data and server_uploads volumes"
echo "with the contents of: $BACKUP_FILE"
read -r -p "Type 'restore' to continue: " CONFIRM
if [ "$CONFIRM" != "restore" ]; then
  echo "Aborted - nothing was changed."
  exit 1
fi

docker run --rm \
  -v "${DATA_VOLUME}:/data" \
  -v "${UPLOADS_VOLUME}:/uploads" \
  -v "${BACKUP_DIR}:/backup:ro" \
  alpine \
  sh -c "rm -rf /data/* /uploads/* && tar xzf /backup/${BACKUP_NAME} -C /"

echo "Restore complete. Restart the api container: docker compose restart api"
