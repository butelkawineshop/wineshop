# Seeding Scripts

This directory contains seeding scripts for the wineshop project. These scripts populate the database with initial data for wine countries, regions, wineries, tags, and moods.

## Scripts Overview

### Individual Scripts

- **`seed-wine-countries.ts`** - Seeds wine countries (Slovenia, Italy, France, Spain, Germany, etc.)
- **`seed-tags.ts`** - Seeds wine tags (farming practices, characteristics, types, etc.)
- **`seed-grape-varieties.ts`** - Seeds grape varieties (Cabernet Sauvignon, Merlot, Pinot Noir, etc.)
- **`seed-wine-regions.ts`** - Seeds wine regions (Primorska, Tuscany, Bordeaux, etc.)
- **`seed-wineries.ts`** - Seeds wineries (Movia, Antinori, Château Margaux, etc.)
- **`seed-moods.ts`** - Seeds wine moods (social occasions, relaxation, celebrations, etc.)

### Master Script

- **`seed-all.ts`** - Runs all seeding scripts in the correct order

## Usage

### Prerequisites

1. Make sure your database is running and accessible
2. Ensure your environment variables are properly configured
3. The application should be built and ready to run

### Running Individual Scripts

To run a specific seeding script:

```bash
# Using pnpm (recommended)
pnpm tsx scripts/seed-wine-countries.ts
pnpm tsx scripts/seed-tags.ts
pnpm tsx scripts/seed-grape-varieties.ts
pnpm tsx scripts/seed-wine-regions.ts
pnpm tsx scripts/seed-wineries.ts
pnpm tsx scripts/seed-moods.ts

# Using node directly
node --loader tsx scripts/seed-wine-countries.ts
```

### Running All Scripts

To run all seeding scripts in the correct order:

```bash
# Using pnpm (recommended)
pnpm tsx scripts/seed-all.ts

# Using node directly
node --loader tsx scripts/seed-all.ts
```

### Adding to package.json Scripts

You can add these scripts to your `package.json` for easier access:

```json
{
  "scripts": {
    "seed:countries": "tsx scripts/seed-wine-countries.ts",
    "seed:tags": "tsx scripts/seed-tags.ts",
    "seed:grape-varieties": "tsx scripts/seed-grape-varieties.ts",
    "seed:regions": "tsx scripts/seed-wine-regions.ts",
    "seed:wineries": "tsx scripts/seed-wineries.ts",
    "seed:moods": "tsx scripts/seed-moods.ts",
    "seed:all": "tsx scripts/seed-all.ts"
  }
}
```

Then you can run them with:

```bash
pnpm run seed:all
pnpm run seed:countries
pnpm run seed:tags
pnpm run seed:grape-varieties
# etc.
```

## Data Structure

### Wine Countries

- **Slovenia** - Small but proud wine-growing country with unique varieties
- **Italy** - One of the largest wine-producing countries with 350+ varieties
- **France** - World capital of winemaking with prestigious regions
- **Spain** - Largest vineyard area in the world
- **Germany** - World-renowned for white wines, especially Riesling
- **Austria** - High-quality white wines
- **Croatia** - Rich tradition with indigenous varieties
- **United States** - Diverse climate zones, especially California
- **Australia** - Innovative approach to winemaking
- **New Zealand** - Young but successful with unique climate

### Grape Varieties

- **Red varieties**: Cabernet Sauvignon, Merlot, Pinot Noir, Syrah, Grenache, Tempranillo, Sangiovese, Nebbiolo, Malbec, Refošk, Teran, Modra Frankinja
- **White varieties**: Chardonnay, Riesling, Sauvignon Blanc, Pinot Grigio, Gewürztraminer, Malvazija, Laški Rizling, Gruner Veltliner
- **Slovenian varieties**: Refošk, Teran, Modra Frankinja, Malvazija, Laški Rizling, Pinela, Zelen, Cviček
- **International varieties**: Cabernet Sauvignon, Merlot, Pinot Noir, Chardonnay, Riesling, Sauvignon Blanc

### Wine Regions

- **Slovenia**: Primorska, Posavje, Podravje
- **Italy**: Tuscany, Piedmont, Veneto
- **France**: Bordeaux, Burgundy, Champagne
- **Spain**: Rioja, Priorat
- **Germany**: Mosel, Rheingau

### Wineries

- **Slovenia**: Movia, Klet Brda, Edi Simčič, Klet Krško, Klet Jeruzalem Ormož
- **Italy**: Antinori, Tenuta San Guido, Gaja
- **France**: Château Margaux, Château Lafite Rothschild, Domaine de la Romanée-Conti
- **Spain**: Bodegas Vega Sicilia
- **Germany**: Weingut Egon Müller

### Tags

Categories include:

- **Farming practices**: Biodynamic, Organic, Natural, Traditional
- **Wine characteristics**: Elegant, Complex, Powerful, Light, Refreshing, Mineral
- **Wine types**: Red, White, Rosé, Sparkling, Sweet, Dry
- **Special categories**: Cviček, Rebula, Teran, Refošk
- **Quality indicators**: Prestigious, Quality, Exclusive, Long-aged
- **Production methods**: Cooperative, Family, Innovative, Revolutionary
- **Special classifications**: First Growth, Super Tuscan, Barolo, Sassicaia, Riesling

### Moods

Categories include:

- **Social occasions**: Family Dinner, Romantic Dinner, Friends Gathering, Business Dinner
- **Relaxation**: Relaxing by the Fire, Evening Chill, Weekend Relaxation, Spa Evening
- **Celebration**: Birthday, Wedding, New Year, Holiday
- **Food pairing**: Seafood, Grilled Meat, Italian Cuisine, Desserts
- **Seasonal**: Spring, Summer, Autumn, Winter
- **Activity-based**: Movie Night, Reading a Book, Music, Cooking
- **Emotional**: Joy, Melancholy, Inspiration, Appreciation
- **Lifestyle**: Wellness, Luxury, Adventure, Tradition
- **Time-based**: Breakfast, Lunch, Dinner, Late Night

## Features

### Error Handling

- Each script includes comprehensive error handling
- Failed items are logged but don't stop the entire process
- Duplicate checking prevents re-seeding existing data

### Logging

- Uses the project's logger system
- Detailed logging for each operation
- Context information for debugging

### Idempotency

- Scripts check for existing data before creating new entries
- Safe to run multiple times without creating duplicates
- Uses Slovenian titles for duplicate checking

### Dependencies

The scripts handle dependencies automatically:

1. **Countries** must exist before **Regions** (regions reference countries)
2. **Tags** must exist before **Wineries** (wineries reference tags)
3. **Grape Varieties** must exist before **Regions** (regions can reference grape varieties)
4. **Regions** must exist before **Wineries** (wineries reference regions)

## Customization

### Adding New Data

To add new data, edit the respective data arrays in each script:

1. **Wine Countries**: Add to `wineCountriesData` array in `seed-wine-countries.ts`
2. **Tags**: Add to `tagsData` array in `seed-tags.ts`
3. **Grape Varieties**: Add to `grapeVarietiesData` array in `seed-grape-varieties.ts`
4. **Wine Regions**: Add to `wineRegionsData` array in `seed-wine-regions.ts`
5. **Wineries**: Add to `wineriesData` array in `seed-wineries.ts`
6. **Moods**: Add to `moodsData` array in `seed-moods.ts`

### Data Structure

Each data item follows the collection's field structure:

- Required fields must be provided
- Optional fields can be omitted
- Localized fields use `{ sl: 'Slovenian', en: 'English' }` format
- Relationships use IDs or slugs as appropriate

### Running in Development

For development environments, you might want to add a development-specific script:

```bash
# Add to package.json
"seed:dev": "cross-env NODE_ENV=development tsx scripts/seed-all.ts"
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure your database is running and accessible
2. **Environment Variables**: Check that all required environment variables are set
3. **Permissions**: Ensure the application has proper database permissions
4. **Dependencies**: Make sure all required packages are installed

### Logs

Check the console output for detailed logs. Each operation is logged with:

- Success/failure status
- Item being processed
- Error details (if any)
- Context information

### Partial Seeding

If a script fails partway through, you can:

1. Fix the issue
2. Run the script again (it will skip existing items)
3. Or run individual scripts to complete the missing data

## Notes

- All text is provided in both Slovenian (sl) and English (en)
- Scripts follow the project's coding conventions
- Data is realistic and representative of actual wine industry
- Scripts are designed to be maintainable and extensible
