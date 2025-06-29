# Seeding Scripts

This directory contains scripts for seeding the wineshop database with initial data. All scripts follow a consistent pattern and use a shared utility for localized collections.

## Structure

```
scripts/setup/
├── README.md                           # This file
├── seed-all.ts                         # Main script to run all seeding
├── seedLocalizedCollection.ts          # Shared utility for localized seeding
├── seed-climates.ts                    # Seed climate data
├── climates.data.ts                    # Climate data definitions
├── seed-moods.ts                       # Seed mood data
├── moods.data.ts                       # Mood data definitions
├── seed-styles.ts                      # Seed wine style data
├── styles.data.ts                      # Style data definitions
├── seed-tags.ts                        # Seed tag data
├── tags.data.ts                        # Tag data definitions
├── seed-wine-countries.ts              # Seed wine country data
├── wine-countries.data.ts              # Wine country data definitions
├── seed-wine-regions.ts                # Seed wine region data
├── wine-regions.data.ts                # Wine region data definitions
├── seed-wineries.ts                    # Seed winery data
├── wineries.data.ts                    # Winery data definitions
├── seed-grape-varieties.ts             # Seed grape variety data
├── grape-varieties.data.ts             # Grape variety data definitions
├── seed-wines.ts                       # Seed wine data
└── wines.data.ts                       # Wine data definitions
```

## Features

- **Localized Collections**: All scripts support both Slovenian (sl) and English (en) locales
- **Shared Utility**: Uses `seedLocalizedCollection.ts` to eliminate code duplication
- **Data Separation**: Data definitions are separated into `.data.ts` files for better maintainability
- **Structured Logging**: Consistent logging using the project's logger
- **Error Handling**: Comprehensive error handling with detailed logging
- **Dependency Management**: Scripts run in the correct order to handle relationships

## Usage

### Run All Seeding

```bash
npm run seed:all
# or
pnpm seed:all
```

### Run Individual Scripts

```bash
# Seed climates
npm run seed:climates

# Seed moods
npm run seed:moods

# Seed styles
npm run seed:styles

# Seed tags
npm run seed:tags

# Seed wine countries
npm run seed:wine-countries

# Seed wine regions
npm run seed:wine-regions

# Seed wineries
npm run seed:wineries

# Seed grape varieties
npm run seed:grape-varieties

# Seed wines
npm run seed:wines
```

## Scripts Overview

### `seed-all.ts`

Main script that runs all seeding operations in the correct dependency order:

1. Climates
2. Moods
3. Styles
4. Tags
5. Wine Countries
6. Wine Regions
7. Wineries
8. Grape Varieties
9. Wines

### `seedLocalizedCollection.ts`

Shared utility that handles:

- Existence checking to avoid duplicates
- Creation in Slovenian locale
- Update in English locale
- Structured logging
- Error handling

### Data Files

Each seeding script has a corresponding `.data.ts` file containing:

- TypeScript interfaces for type safety
- Data arrays with localized content
- Proper categorization and organization

## Data Structure

### Climates

- Climate types (desert, maritime, mediterranean, continental, alpine)
- Temperature ranges (cool, moderate, warm, hot)
- Humidity levels (dry, moderate, humid)
- Diurnal temperature ranges (low, medium, high)

### Moods

- Wine drinking occasions and moods
- Netflix & Chill, Picnic, Date Night, etc.
- Localized descriptions for each mood

### Styles

- Wine styles (White, Red, Rosé, Sparkling, etc.)
- Icon keys for UI representation
- Detailed descriptions of each style

### Tags

- Wine characteristics and production methods
- Biodynamics, Organic, Natural, etc.
- Educational content about wine making

### Wine Countries

- Major wine-producing countries
- Country codes and descriptions
- Historical and cultural context

### Wine Regions

- Specific wine regions within countries
- Regional characteristics and specialties
- Climate and terroir information

### Wineries

- Notable wineries from around the world
- Founding dates and websites
- Regional affiliations

### Grape Varieties

- White, red, and pink grape varieties
- Origin countries and descriptions
- Wine type classifications

### Wines

- Sample wines from various regions
- Complete wine profiles with technical details
- Pricing and vintage information

## Customization

### Adding New Data

1. Create a new `.data.ts` file with your data structure
2. Create a new seeding script using `seedLocalizedCollection`
3. Add the script to `seed-all.ts` in the correct order
4. Update this README with the new script

### Modifying Existing Data

1. Edit the appropriate `.data.ts` file
2. Run the specific seeding script to update the database
3. The script will handle existing records appropriately

### Adding New Fields

1. Update the TypeScript interface in the `.data.ts` file
2. Update the `getSlData` and `getEnData` functions in the seeding script
3. Ensure the Payload collection schema supports the new fields

## Best Practices

- **Data Consistency**: Ensure all localized content is provided for both languages
- **Type Safety**: Use TypeScript interfaces for all data structures
- **Logging**: Use structured logging with appropriate task and context information
- **Error Handling**: Always handle errors gracefully and provide meaningful error messages
- **Dependencies**: Consider the order of seeding when dealing with related collections
- **Testing**: Test seeding scripts in a development environment before production

## Troubleshooting

### Common Issues

1. **Missing Relationships**: Ensure all referenced entities exist before seeding dependent data
2. **Duplicate Entries**: Scripts check for existing entries, but verify your unique field logic
3. **Locale Issues**: Ensure both Slovenian and English content is provided
4. **Type Errors**: Check that your data matches the TypeScript interfaces

### Debugging

- Check the logs for detailed error information
- Verify that all required collections exist in Payload
- Ensure environment variables are properly configured
- Test individual scripts before running the full seeding process

## Contributing

When adding new seeding scripts or modifying existing ones:

1. Follow the established pattern using `seedLocalizedCollection`
2. Separate data into `.data.ts` files
3. Update this README with any new information
4. Test thoroughly in development
5. Ensure all TypeScript types are properly defined
