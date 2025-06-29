# Production Scripts

This directory contains scripts organized for production use.

## 🚀 Production Scripts

These scripts are used in production operations:

### **Sync Operations**

- **`sync-missing-published-variants.js`** - Queue sync jobs for published wine variants that don't have flat variants yet
- **`check-sync-status.js`** - Check the current sync status (how many variants vs flat variants exist)

### **Job Management**

- **`clear-all-sync-jobs.js`** - Clear all syncFlatWineVariant jobs from the queue (use when needed)
- **`clear-failed-jobs.js`** - Clear only failed jobs from the queue

### **Image Management**

- **`upload-wine-images-via-payload.ts`** - Upload wine images through Payload CMS
- **`upload-wine-images.ts`** - Direct image upload script

## 📁 Subdirectories

### **`setup/`** - Initial Setup Scripts

Contains data seeding scripts for initial database population:

- `seed-all.ts` - Master seeding script (runs all others)
- `seed-wines.ts` - Seed wine data
- `seed-wineries.ts` - Seed winery data
- `seed-grape-varieties.ts` - Seed grape varieties
- `seed-wine-regions.ts` - Seed wine regions
- `seed-wine-countries.ts` - Seed countries
- `seed-tags.ts` - Seed wine tags
- `seed-moods.ts` - Seed wine moods
- `Wines-All Wines.csv` - Source data file
- `README.md` - Detailed setup documentation

### **`dev/`** - Development Scripts

Contains debugging and development tools:

- `debug-single-variant.js` - Debug single variant sync issues
- `diagnose-failed-syncs.js` - Analyze failed sync patterns
- `check-*.ts` - Various data validation scripts
- `test-*.ts` - API and service testing scripts

## 🔄 Common Usage

### Sync All Published Variants

```bash
# Queue sync jobs for missing published variants
pnpm payload run scripts/sync-missing-published-variants.js

# Run the jobs (processes 10 at a time)
pnpm payload jobs:run

# Check the results
pnpm payload run scripts/check-sync-status.js
```

### Clear Jobs if Needed

```bash
# Clear all sync jobs
pnpm payload run scripts/clear-all-sync-jobs.js

# Or clear only failed jobs
pnpm payload run scripts/clear-failed-jobs.js
```

## 🧹 Cleaned Up

**Removed scripts:**

- `check-and-queue-wine-variants.js` - Replaced by `sync-missing-published-variants.js`
- `force-clear-wines.ts` - Too dangerous for production
- `clear-wines.ts` - Too dangerous for production
- `fix-nextjs15-params.cjs` - One-time fix, no longer needed
- `check-styles.ts` - Development only
- `check-extensions.ts` - Development only

## Typesense Setup

Typesense is used for search functionality. Follow these steps to set it up:

### 1. Start Typesense Services

First, start the Typesense service using Docker Compose:

```bash
docker-compose up -d typesense
```

This will start Typesense on port 8108.

### 2. Set Environment Variables

Make sure you have the following environment variables set in your `.env` file:

```env
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_API_KEY=xyz
```

### 3. Setup Typesense Collections

Run the setup script to create the necessary collections:

```bash
pnpm typesense:setup
```

### 4. Sync Wine Data

Sync wine data from Payload CMS to Typesense:

```bash
pnpm typesense:sync
```

### 5. Full Setup (Setup + Sync)

Or run both setup and sync in one command:

```bash
pnpm typesense:full
```

### 6. Verify Setup

You can verify that Typesense is working by:

1. Checking the health endpoint: `http://localhost:8108/health`
2. Testing the search functionality in your application
3. Checking the Typesense logs: `docker-compose logs typesense`

## Other Scripts

### Data Seeding

- `pnpm seed:all` - Seed all initial data
- `pnpm seed:countries` - Seed wine countries
- `pnpm seed:regions` - Seed wine regions
- `pnpm seed:wineries` - Seed wineries
- `pnpm seed:styles` - Seed wine styles
- `pnpm seed:climates` - Seed climates
- `pnpm seed:moods` - Seed moods
- `pnpm seed:grape-varieties` - Seed grape varieties
- `pnpm seed:tags` - Seed tags
- `pnpm seed:wines` - Seed wines

### Data Synchronization

- `pnpm sync:flat-wine` - Sync flat wine variants
- `pnpm populate:related-wines` - Populate related wines
- `pnpm sync:cloud-images` - Sync cloud images
- `pnpm sync:wine-images` - Sync wine images

### Database Management

- `pnpm db:backup` - Create a backup of the current database
- `pnpm db:migrate-to-docker` - Migrate data from Brew PostgreSQL to Docker PostgreSQL

### Image Management

- `pnpm upload:wine-images` - Upload wine images
- `pnpm verify:image-mapping` - Verify image mapping

## Troubleshooting

### Typesense Issues

1. **Typesense not starting**: Check if port 8108 is available
2. **Connection refused**: Ensure Typesense container is running
3. **No search results**: Verify data has been synced using `pnpm typesense:sync`
4. **Collection already exists**: This is normal, the script will handle it gracefully

### Data Sync Issues

1. **No wine variants found**: Ensure you have wine data in Payload CMS
2. **Permission errors**: Check database connection and credentials
3. **Memory issues**: Reduce the limit in the sync script if processing large datasets
