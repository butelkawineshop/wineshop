# CollectionPage System

This is a flexible, template-based system for displaying different collections of data with minimal maintenance. Instead of creating individual page components for each route, this system uses configuration objects to define how each collection should be displayed.

## How It Works

### 1. Route Mappings (`routeMappings.ts`)

The system uses route mappings to determine which collection to fetch based on the URL segment. Each route maps to:

- Slovenian route name
- English route name
- Collection name in the CMS

### 2. Collection Configuration (`CollectionConfig.ts`)

Each collection has a configuration object that defines:

- Which fields to display
- How to display them (list vs detail view)
- Sorting and pagination settings
- Media field mappings
- Relationship configurations

### 3. Field Renderers (`FieldRenderer.tsx`)

Different field types are rendered using specialized components:

- `TextField` - Simple text display
- `TextareaField` - Multi-line text with formatting
- `RelationshipField` - Related items with optional links
- `ArrayField` - Arrays of items (text or relationships)
- `SelectField` - Dropdown values
- `GroupField` - Object groups
- `MediaField` - Images and media

### 4. CollectionPage Component

The main component that:

- Determines the collection from the route
- Fetches data from the CMS
- Renders either a list view or detail view
- Handles localization

## Usage

### Creating a New Collection Page

1. **Add the route mapping** in `routeMappings.ts`:

```typescript
myCollection: { sl: 'moja-zbirka', en: 'my-collection', collection: 'my-collection' }
```

2. **Add the collection configuration** in `CollectionConfig.ts`:

```typescript
'my-collection': {
  titleField: 'title',
  descriptionField: 'description',
  mediaField: 'media',
  listTitle: 'My Collection',
  listDescription: 'Browse my collection',
  listLimit: 20,
  sort: 'title',
  depth: 1,
  fields: [
    { name: 'description', type: 'textarea', showInDetail: true },
    { name: 'category', type: 'relationship', showInDetail: true, relationshipConfig: { displayField: 'title', linkTo: 'categories' } },
  ]
}
```

3. **Generate the page files** using the script:

```bash
node scripts/generate-collection-pages.cjs
```

### Adding New Field Types

1. **Add the field type** to the `FieldConfig` interface
2. **Create a renderer component** in `FieldRenderer.tsx`
3. **Add the case** to the switch statement in `FieldRenderer`

## Benefits

- **Minimal Maintenance**: One component handles all collections
- **Consistent UI**: All collections follow the same design patterns
- **Flexible**: Easy to customize per collection via configuration
- **Type Safe**: Full TypeScript support
- **Localized**: Built-in support for multiple languages
- **SEO Friendly**: Proper meta tags and structured data

## File Structure

```
src/components/CollectionPage/
├── CollectionPage.tsx      # Main component
├── CollectionConfig.ts     # Collection configurations
├── FieldRenderer.tsx       # Field type renderers
├── index.ts               # Exports
└── README.md              # This file
```

## Configuration Options

### CollectionDisplayConfig

- `titleField`: Field to use as the main title
- `subtitleField`: Optional subtitle field
- `descriptionField`: Field for descriptions
- `mediaField`: Field containing media/images
- `listTitle`: Title for list pages
- `listDescription`: Description for list pages
- `listLimit`: Number of items per page
- `sort`: Sort order for list pages
- `depth`: How deep to populate relationships
- `fields`: Array of field configurations

### FieldConfig

- `name`: Field name in the CMS
- `type`: Field type (text, textarea, relationship, etc.)
- `label`: Display label (optional)
- `showInList`: Show in list view
- `showInDetail`: Show in detail view
- `relationshipConfig`: Configuration for relationship fields
- `arrayConfig`: Configuration for array fields
