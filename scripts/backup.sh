#!/bin/bash

# Database Backup Script
# Usage: ./scripts/backup.sh

set -e

# Load environment variables
if [ -f .env.production ]; then
  export $(cat .env.production | grep -v '^#' | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL not set"
  exit 1
fi

# Create backup directory
BACKUP_DIR="backups"
mkdir -p "$BACKUP_DIR"

# Generate backup filename
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_${DATE}.sql"

echo "Creating backup: $BACKUP_FILE"

# Create backup
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

echo "Backup created: $BACKUP_FILE"

# Optional: Upload to cloud storage
# Uncomment and configure as needed
# aws s3 cp "$BACKUP_FILE" s3://your-bucket/backups/
# or
# gcloud storage cp "$BACKUP_FILE" gs://your-bucket/backups/

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup complete!"

