#!/usr/bin/env bash
set -euo pipefail

# Backs up the server's persistent Docker volumes (every donation, user,
# and CMS entry - see "Data storage" in the README) to a rotated set of
# local tarballs. Run this ON THE VPS itself (not inside a container) - it
# shells out to `docker run` to read the volumes without needing to stop
# the api/client containers first.
#
# Usage: ./scripts/backup.sh [backup-dir] [days-to-keep]
# Meant to run on a daily cron/systemd timer - see README > Deployment >
# "Automated backups" for the schedule setup.

BACKUP_DIR="${1:-$HOME/chadi-backups}"
KEEP_DAYS="${2:-14}"
PROJECT_NAME="$(basename "$(pwd)")"
DATA_VOLUME="${PROJECT_NAME}_server_data"
UPLOADS_VOLUME="${PROJECT_NAME}_server_uploads"
TIMESTAMP="$(date +%F_%H%M%S)"

mkdir -p "$BACKUP_DIR"

docker run --rm \
  -v "${DATA_VOLUME}:/data:ro" \
  -v "${UPLOADS_VOLUME}:/uploads:ro" \
  -v "${BACKUP_DIR}:/backup" \
  alpine \
  sh -c "tar czf /backup/chadi-backup-${TIMESTAMP}.tar.gz -C / data uploads"

echo "Backup written to ${BACKUP_DIR}/chadi-backup-${TIMESTAMP}.tar.gz"

# Keep the disk from filling up indefinitely - prune anything older than
# KEEP_DAYS. Point BACKUP_DIR at a mounted network drive (or add an `rclone
# copy`/`aws s3 sync` line here) if you also want an off-VPS copy - a local
# backup alone doesn't survive the VPS itself being lost.
find "$BACKUP_DIR" -name "chadi-backup-*.tar.gz" -mtime "+${KEEP_DAYS}" -delete

echo "Pruned backups older than ${KEEP_DAYS} days from ${BACKUP_DIR}."
