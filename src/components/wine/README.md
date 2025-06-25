# Wine Components

This directory contains reusable wine-related UI components for the wineshop project.

## Components

### WineCard

A complete wine card component with swipeable slides showing wine image, tasting notes, and interactions.

```tsx
import { WineCard } from '@/components/wine'

;<WineCard
  variant={flatWineVariant}
  locale="sl"
  onShare={(variant) => console.log('Share', variant)}
  onLike={(variant) => console.log('Like', variant)}
/>
```

### WineGrid

Server-side component that fetches and displays a grid of wine cards with infinite scroll.

```tsx
import { WineGrid } from '@/components/wine'

;<WineGrid locale="sl" where={{ regionTitle: 'Vipava' }} sort="wineTitle" />
```

### WineGridClient

Client-side grid component with infinite scroll and responsive layout.

```tsx
import { WineGridClient } from '@/components/wine'

;<WineGridClient locale="sl" initialVariants={variants} totalDocs={100} hasNextPage={true} />
```

## Sub-components

- **WineTitleBar**: Wine name, winery, and vintage info
- **WineTastingNotes**: Interactive tasting profile sliders
- **WineCartButton**: Add to cart functionality with stock status
- **WineDescription**: Expandable wine description
- **WineCollectionTags**: Filterable tags for regions, grapes, etc.

## Features

- ✅ Uses flat wine variants for efficient queries
- ✅ Follows project conventions and design system
- ✅ Mobile-first responsive design
- ✅ Infinite scroll for large wine catalogs
- ✅ Swipeable cards with tasting notes
- ✅ Accessibility-compliant
- ✅ TypeScript support with proper types
- ✅ Server-side rendering compatible

## Usage Notes

- All components use the `FlatWineVariant` type from flat collections
- Visual design matches butelka-si components but with improved performance
- Uses utility classes from conventions.md design system
- Supports both Slovenian and English locales
