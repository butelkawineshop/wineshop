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
