#!/bin/bash

# Migration script to move data from Brew PostgreSQL to Docker PostgreSQL
# This script will:
# 1. Create a backup of your current wineshop database
# 2. Start the Docker PostgreSQL container
# 3. Restore the data to the Docker database

set -e  # Exit on any error

echo "🚀 Starting migration from Brew PostgreSQL to Docker PostgreSQL..."

# Configuration
BACKUP_FILE="wineshop_backup_$(date +%Y%m%d_%H%M%S).sql"
DOCKER_CONTAINER="wineshop-postgres"
DOCKER_DB="wineshop"
DOCKER_USER="postgres"
DOCKER_PASSWORD="postgres"

echo "📦 Creating backup of current database..."
pg_dump -h localhost -U postgres -d wineshop --clean --if-exists --create > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully: $BACKUP_FILE"
else
    echo "❌ Backup failed. Please check your PostgreSQL connection."
    exit 1
fi

echo "🐳 Starting Docker PostgreSQL container..."
docker-compose up -d postgres

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Wait for PostgreSQL to be ready
echo "🔍 Checking if PostgreSQL is ready..."
until docker-compose exec -T postgres pg_isready -U postgres; do
    echo "⏳ PostgreSQL is not ready yet, waiting..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"

echo "🔄 Restoring data to Docker PostgreSQL..."
docker-compose exec -T postgres psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS $DOCKER_DB;"
docker-compose exec -T postgres psql -U postgres -d postgres -c "CREATE DATABASE $DOCKER_DB;"

# Restore the backup
docker-compose exec -T postgres psql -U postgres -d $DOCKER_DB < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Data restored successfully!"
else
    echo "❌ Data restoration failed."
    exit 1
fi

echo "🔍 Verifying the migration..."
RECORD_COUNT=$(docker-compose exec -T postgres psql -U postgres -d $DOCKER_DB -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
echo "📊 Found $RECORD_COUNT tables in the migrated database"

echo "🧹 Cleaning up backup file..."
rm "$BACKUP_FILE"

echo "🎉 Migration completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update your .env file to use Docker PostgreSQL:"
echo "   DATABASE_URI=postgresql://postgres:postgres@localhost:5432/wineshop"
echo ""
echo "2. Start your application:"
echo "   pnpm dev"
echo ""
echo "3. Set up Typesense:"
echo "   pnpm typesense:full" 