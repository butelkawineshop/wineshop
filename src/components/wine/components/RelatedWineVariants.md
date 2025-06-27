# RelatedWineVariants Component

The `RelatedWineVariants` component displays related wine variants in four distinct categories with sophisticated matching logic.

## Categories

### 1. Brothers & Sisters

- **Logic**: Wines from the same winery and/or related wineries
- **Priority**: Same winery has priority over related wineries
- **Limit**: 5 wines maximum
- **Display**: Only renders if wines are available

### 2. Neighbours

- **Logic**: Wines from the same region and/or neighbouring regions
- **Priority**: Same region has priority over neighbouring regions
- **Exclusion**: Wines already shown in "Brothers & Sisters" are excluded
- **Limit**: 5 wines maximum
- **Display**: Only renders if wines are available

### 3. Cousins

- **Logic**: Wines with same grape variety and/or related grape varieties
- **Priority** (in order):
  1. Same grape variety (10 points each)
  2. Same grape family (5 points each)
  3. Common blending partners (3 points)
- **Exclusion**: Wines already shown in previous categories are excluded
- **Limit**: 5 wines maximum
- **Display**: Only renders if wines are available

### 4. Budget Buds

- **Logic**: Wines in the same price range with sliding scale
- **Price Ranges**:
  - Up to €15: ±30% range
  - Up to €30: ±25% range
  - Above €30: ±20% range
- **Priority**: Wines closest to the same price
- **Exclusion**: Wines already shown in previous categories are excluded
- **Limit**: 5 wines maximum
- **Display**: Only renders if wines are available

## Usage

```tsx
import { RelatedWineVariants } from '@/components/wine/components/RelatedWineVariants'

;<RelatedWineVariants currentVariant={currentVariant} allVariants={allVariants} locale={locale} />
```

## Props

- `currentVariant`: The current wine variant being viewed
- `allVariants`: Array of all available wine variants for matching
- `locale`: Language locale ('sl' | 'en')

## Features

- **Swiper Integration**: Uses Swiper with card effect for smooth navigation
- **Internationalization**: Supports Slovenian and English translations
- **Smart Filtering**: Prevents duplicate wines across categories
- **Stock Checking**: Only shows wines with available stock
- **Published Only**: Only shows published wine variants
- **Responsive Design**: Grid layout adapts to screen size

## Translation Keys

The component uses the following translation keys:

- `wine.detail.brothersAndSisters`
- `wine.detail.neighbours`
- `wine.detail.cousins`
- `wine.detail.budgetBuds`
- `wine.detail.relatedWines`
- `wine.detail.noRelatedByWinery`
