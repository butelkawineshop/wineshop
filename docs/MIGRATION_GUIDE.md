# Database Migration Guide

This guide will help you migrate your wineshop data from Brew PostgreSQL to Docker PostgreSQL and set up Typesense.

## 🎯 Overview

We'll migrate your existing 46MB wineshop database from Brew PostgreSQL to Docker PostgreSQL, then set up Typesense for search functionality.

## 📋 Prerequisites

- Docker and Docker Compose installed
- PostgreSQL client tools (psql, pg_dump)
- Your current wineshop database with data

## 🚀 Step-by-Step Migration

### Step 1: Create a Backup (Safety First!)

```bash
# Create a backup of your current database
pnpm db:backup
```

This creates a timestamped backup file like `wineshop_backup_20241217_143022.sql`

### Step 2: Migrate to Docker PostgreSQL

```bash
# Run the automated migration script
pnpm db:migrate-to-docker
```

This script will:

- Create a backup of your current database
- Start the Docker PostgreSQL container
- Restore your data to the Docker database
- Verify the migration was successful

### Step 3: Verify the Migration

```bash
# Check that Docker PostgreSQL is running
docker-compose ps

# Connect to the Docker database and verify data
docker-compose exec postgres psql -U postgres -d wineshop -c "SELECT COUNT(*) FROM \"flat-wine-variants\";"
```

### Step 4: Update Environment Variables

Your `.env` file should already be correct, but verify it contains:

```env
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/wineshop
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=wineshop
```

### Step 5: Set Up Typesense

```bash
# Start Typesense
docker-compose up -d typesense

# Set up Typesense collections and sync data
pnpm typesense:full

# Test Typesense functionality
pnpm typesense:test
```

### Step 6: Start Your Application

```bash
# Start the development server
pnpm dev
```

## 🔧 Manual Migration (Alternative)

If you prefer to do it manually:

### 1. Create Backup

```bash
pg_dump -h localhost -U postgres -d wineshop --clean --if-exists --create > wineshop_backup.sql
```

### 2. Start Docker Services

```bash
docker-compose up -d postgres typesense
```

### 3. Restore Data

```bash
# Wait for PostgreSQL to be ready
sleep 10

# Create database and restore
docker-compose exec -T postgres psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS wineshop;"
docker-compose exec -T postgres psql -U postgres -d postgres -c "CREATE DATABASE wineshop;"
docker-compose exec -T postgres psql -U postgres -d wineshop < wineshop_backup.sql
```

## 🧪 Testing the Setup

### Test Database Connection

```bash
# Test connection to Docker PostgreSQL
docker-compose exec postgres psql -U postgres -d wineshop -c "SELECT version();"
```

### Test Typesense

```bash
# Test Typesense health
curl http://localhost:8108/health

# Test search functionality
pnpm typesense:test
```

### Test Application

1. Start your application: `pnpm dev`
2. Navigate to your site
3. Test the search functionality
4. Verify wine data is displaying correctly

## 🔄 Rollback Plan

If something goes wrong, you can rollback:

### Option 1: Use the Backup

```bash
# Stop Docker services
docker-compose down

# Restore from backup to your Brew PostgreSQL
psql -h localhost -U postgres -d wineshop < wineshop_backup_YYYYMMDD_HHMMSS.sql
```

### Option 2: Re-run Migration

```bash
# The migration script creates a fresh backup each time
pnpm db:migrate-to-docker
```

## 🐛 Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check if Docker PostgreSQL is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Restart if needed
docker-compose restart postgres
```

### Typesense Connection Issues

```bash
# Check if Typesense is running
docker-compose ps

# Check logs
docker-compose logs typesense

# Restart if needed
docker-compose restart typesense
```

### Data Not Appearing

```bash
# Check if data was migrated
docker-compose exec postgres psql -U postgres -d wineshop -c "SELECT COUNT(*) FROM \"flat-wine-variants\";"

# Re-sync Typesense if needed
pnpm typesense:sync
```

## 📊 Verification Checklist

- [ ] Database backup created successfully
- [ ] Docker PostgreSQL container running
- [ ] Data migrated to Docker database
- [ ] Typesense container running
- [ ] Typesense collections created
- [ ] Wine data synced to Typesense
- [ ] Application starts without errors
- [ ] Search functionality works
- [ ] Wine data displays correctly

## 🎉 Success!

Once all steps are completed, you'll have:

- ✅ Your data running in Docker PostgreSQL
- ✅ Typesense search engine set up
- ✅ Automatic sync between Payload CMS and Typesense
- ✅ Fast search functionality in your application

## 📝 Notes

- Your original Brew PostgreSQL data remains untouched
- Docker data is persisted in volumes
- Typesense automatically syncs when wine variants are updated
- You can stop using Brew PostgreSQL after successful migration
