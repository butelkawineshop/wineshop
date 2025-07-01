# Tasting Components

This directory contains comprehensive tasting-related UI components for the wineshop project, designed to provide both list and detail views for wine tastings with dynamic wine selection based on budget and themes.

## Components Overview

### TastingPage

The main component that orchestrates the entire tasting experience. It handles both list and detail views, showing either a grid of tastings or a detailed view of a specific tasting.

```tsx
import { TastingPage } from '@/components/Tastings'

;<TastingPage
  tastings={tastings}
  selectedTasting={selectedTasting} // Optional - for detail view
  locale="sl"
  messages={messages}
  selectedWines={selectedWines} // Optional - for detail view
/>
```

### TastingCarousel

Inspired by InfoCarousel, displays tasting information on different slides with media backgrounds.

**Features:**

- Overview slide with description
- Details slide with pricing and specifications
- Themes slide with linked theme tags
- Responsive design with Swiper.js
- Media support with fallback gradients

### TastingCard

Displays individual tastings in a grid layout, similar to wine cards.

**Features:**

- Responsive card design with hover effects
- Price overlay with per-person pricing
- Action buttons (share, like)
- Theme tags with collection links
- Duration and capacity information
- Wine type summary

### TastingGrid

Responsive grid component for displaying multiple tasting cards.

**Features:**

- Infinite scroll with lazy loading
- Responsive grid (1-3 columns based on screen size)
- Share and like functionality
- Empty state handling

### TastingDetail

Comprehensive detail view for individual tastings.

**Features:**

- Large media display
- Detailed information cards
- Budget breakdown
- Theme links
- Wine selection interface
- Selected wines display
- Wine grid integration

### TastingWineSelector

Interactive component for selecting wines based on budget and criteria.

**Features:**

- Dynamic budget calculation
- People selector
- Real-time wine selection
- Quality scoring
- Budget utilization tracking
- Selected wines list

## Usage Examples

### List View (All Tastings)

```tsx
import { TastingPage } from '@/components/Tastings'
import { SAMPLE_TASTINGS } from '@/data/sampleTastings'

export default function TastingsListPage() {
  return <TastingPage tastings={SAMPLE_TASTINGS} locale="sl" messages={messages} />
}
```

### Detail View (Single Tasting)

```tsx
import { TastingPage } from '@/components/Tastings'

export default function TastingDetailPage({ params }) {
  const selectedTasting = tastings.find((t) => t.slug === params.slug)

  return (
    <TastingPage
      tastings={tastings}
      selectedTasting={selectedTasting}
      locale="sl"
      messages={messages}
      selectedWines={selectedWines}
    />
  )
}
```

## Data Structure

### Tasting Interface

```typescript
interface Tasting {
  id: string
  slug: string
  title: string
  description?: string
  pricePerPerson: number
  minPeople: number
  maxPeople: number
  wineTypes: Array<{
    wineType: string
    quantity: number
  }>
  theme?: Array<{
    id: string
    title: string
    slug: string
    collection: string
  }>
  duration: number
  media?: Array<{
    url: string
    baseUrl?: string
  }>
}
```

## Features

### ✅ Responsive Design

- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interactions

### ✅ Accessibility

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management

### ✅ Internationalization

- Full i18n support (Slovenian/English)
- Translation keys for all text
- Locale-aware routing

### ✅ Performance

- Lazy loading for images
- Infinite scroll optimization
- Memoized components
- Efficient re-renders

### ✅ Integration

- Uses existing wine grid components
- Leverages tasting wine selection service
- Follows project design system
- Compatible with existing collections

## Routing Structure

```
/sl/tastings          # List view (Slovenian)
/en/tastings          # List view (English)
/sl/tastings/[slug]   # Detail view (Slovenian)
/en/tastings/[slug]   # Detail view (English)
```

## Sample Data

The `SAMPLE_TASTINGS` array in `@/data/sampleTastings.ts` provides hardcoded tasting data for demonstration:

- Summer Light Wines (€35/person)
- Bold Red Wines (€45/person)
- Natural Wines (€40/person)
- Sweet & Dessert Wines (€30/person)
- Regional Wine Exploration (€50/person)
- Beginner-Friendly Wines (€25/person)

## Translation Keys

All components use translation keys from the messages files:

```json
{
  "tasting": {
    "perPerson": "na osebo",
    "actions": {
      "share": "Deli degustacijo",
      "like": "Všeč mi je degustacija"
    },
    "fields": {
      "pricePerPerson": "Cena na osebo",
      "duration": "Trajanje",
      "people": "Število oseb",
      "wineTypes": "Vrste vin"
    },
    "slides": {
      "overview": { "title": "Pregled" },
      "details": { "title": "Podrobnosti" },
      "themes": { "title": "Teme" }
    }
  }
}
```

## Future Enhancements

- [ ] Real-time booking integration
- [ ] Advanced filtering and search
- [ ] User reviews and ratings
- [ ] Social sharing features
- [ ] Calendar integration
- [ ] Payment processing
- [ ] Admin management interface
- [ ] Analytics and tracking

## Dependencies

- Swiper.js for carousel functionality
- Next.js for routing and SSR
- Tailwind CSS for styling
- React hooks for state management
- Existing wine components and services
