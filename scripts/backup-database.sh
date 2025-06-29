#!/bin/bash

# Simple backup script for the current wineshop database
BACKUP_FILE="wineshop_backup_$(date +%Y%m%d_%H%M%S).sql"

echo "📦 Creating backup of wineshop database..."
pg_dump -h localhost -U postgres -d wineshop --clean --if-exists --create > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully: $BACKUP_FILE"
    echo "📊 Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "❌ Backup failed. Please check your PostgreSQL connection."
    exit 1
fi 