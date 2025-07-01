# Tasting Wine Selection Feature

This document explains the dynamic wine selection system for wine tastings based on budget, wine types, and themes.

## Overview

The tasting wine selection feature automatically selects wines for tastings based on:

- **Budget**: Calculated from total tasting price minus food/expenses (€15 per person)
- **Wine Types**: Red, white, rose, sparkling, sweet, skin-contact, beasts, babies
- **Themes**: Moods, climates, aromas, dishes, regions, countries, grape varieties, tags
- **Number of People**: Affects total budget and wine quantities needed

## Architecture

### 1. Service Layer (`TastingWineSelectionService`)

- **Location**: `src/services/TastingWineSelectionService.ts`
- **Purpose**: Core business logic for wine selection
- **Features**:
  - Budget-based wine selection
  - Theme matching with scoring
  - Wine type filtering
  - Quality assessment

### 2. GraphQL Layer

- **Query**: `src/graphql/queries/tasting-wine-selection.graphql`
- **Purpose**: API interface for wine selection
- **Input**: Budget, wine types, themes, number of people, locale

### 3. React Hook (`useTastingWineSelection`)

- **Location**: `src/hooks/useTastingWineSelection.ts`
- **Purpose**: React integration with caching and state management
- **Features**: React Query integration, error handling, loading states

### 4. Constants (`TASTING_CONSTANTS`)

- **Location**: `src/constants/tasting.ts`
- **Purpose**: Centralized configuration
- **Includes**: Budget allocation, scoring weights, quality thresholds

### 5. Utilities (`tastingBudget.ts`)

- **Location**: `src/utils/tastingBudget.ts`
- **Purpose**: Budget calculation helpers
- **Functions**: Calculate wine budget, budget percentage, food costs

## Budget Calculation

```
Total Revenue = Price per person × Number of people
Food & Expenses = €15 × Number of people
Wine Budget = Total Revenue - Food & Expenses
```

**Example**: €40 per person, 4 people

- Total Revenue: €160
- Food & Expenses: €60
- Wine Budget: €100

## Wine Selection Algorithm

### 1. Budget Allocation

- Allocate remaining budget across wine types
- Target 80-120% of ideal price per wine
- Prioritize wines that fit themes

### 2. Scoring System

- **Base Score**: 10 points for being in stock
- **Theme Relevance**: Up to 50 points for matching themes
- **Budget Fit**: Up to 20 points for price optimization
- **Premium Bonuses**: +5 for complexity, +3 for high alcohol

### 3. Quality Assessment

- **Excellent**: ≥90% budget utilization, 100% wine type coverage
- **Good**: ≥75% budget utilization, ≥80% wine type coverage
- **Fair**: ≥50% budget utilization, ≥60% wine type coverage
- **Poor**: Below fair thresholds

## Usage Examples

### Basic Usage

```typescript
import { useTastingWineSelection } from '@/hooks/useTastingWineSelection'
import { calculateWineBudget } from '@/utils/tastingBudget'

const criteria = {
  budget: calculateWineBudget(40, 4), // €100 for 4 people at €40 each
  wineTypes: [
    { wineType: 'red', quantity: 2 },
    { wineType: 'white', quantity: 1 },
    { wineType: 'rose', quantity: 1 },
  ],
  themes: ['summer', 'light', 'fruity'],
  numberOfPeople: 4,
  locale: 'sl',
}

const { selectedWines, totalCost, budgetUtilization, selectionQuality } = useTastingWineSelection({
  criteria,
})
```

### Component Usage

```typescript
import { TastingWineSelector } from '@/components/TastingWineSelector'

<TastingWineSelector
  pricePerPerson={40}
  wineTypes={[
    { wineType: 'red', quantity: 2 },
    { wineType: 'white', quantity: 1 },
    { wineType: 'rose', quantity: 1 }
  ]}
  themes={['summer', 'light', 'fruity']}
  locale="sl"
/>
```

## Configuration

### Budget Allocation

```typescript
// src/constants/tasting.ts
FOOD_AND_EXPENSES_PER_PERSON: 15, // €15 per person
WINE_BUDGET_PERCENTAGE: 0.625, // 62.5% of total budget
```

### Scoring Weights

```typescript
SCORING: {
  BASE_SCORE: 10,
  THEME_RELEVANCE_MAX: 50,
  BUDGET_FIT_MAX: 20,
  COMPLEXITY_BONUS: 5,
  ALCOHOL_BONUS: 3,
}
```

### Quality Thresholds

```typescript
QUALITY_THRESHOLDS: {
  EXCELLENT: { BUDGET_UTILIZATION: 90, WINE_COVERAGE: 1.0 },
  GOOD: { BUDGET_UTILIZATION: 75, WINE_COVERAGE: 0.8 },
  FAIR: { BUDGET_UTILIZATION: 50, WINE_COVERAGE: 0.6 },
}
```

## Wine Type Mappings

The system maps wine types to database fields:

- **Red/White/Rose**: `styleTitle` contains the type
- **Sparkling/Sweet**: `styleTitle` contains the type
- **Skin Contact**: `styleTitle` contains "skin contact"
- **Beasts/Babies**: `tags.title` contains "beast" or "baby"

## Theme Matching

Themes are matched against wine attributes:

- **Moods**: Wine mood characteristics
- **Climates**: Wine climate information
- **Aromas**: Wine aroma profiles
- **Dishes**: Food pairing information
- **Regions**: Wine region data
- **Countries**: Wine country information
- **Grape Varieties**: Grape variety data
- **Tags**: Wine tags

## Performance Considerations

- **Caching**: 5-minute stale time, 10-minute garbage collection
- **Query Limits**: Maximum 50 candidates per wine type
- **Indexing**: Uses existing flat collection indexes
- **Scoring**: Client-side scoring for better performance

## Error Handling

- **Budget Too Low**: Returns empty selection with poor quality
- **No Matching Wines**: Returns partial selection with available wines
- **Database Errors**: Logged and handled gracefully
- **Network Errors**: React Query retry mechanism

## Future Enhancements

1. **Machine Learning**: Improve scoring based on customer preferences
2. **Seasonal Adjustments**: Consider seasonal wine availability
3. **Inventory Integration**: Real-time stock level checking
4. **Customer Preferences**: Learn from previous selections
5. **Wine Pairing**: Suggest complementary wine combinations
