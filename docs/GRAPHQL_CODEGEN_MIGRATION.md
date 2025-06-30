# GraphQL Codegen Migration Guide

## Overview

This guide explains how to migrate from manual GraphQL type definitions to GraphQL Codegen for better type safety, reduced maintenance, and improved developer experience.

## Why GraphQL Codegen?

### Current Problems

- **2,000+ lines of manual type definitions** in `src/lib/graphql.ts`
- **Type drift** - manual types can become out of sync with actual schema
- **Maintenance burden** - every schema change requires manual type updates
- **No compile-time validation** of GraphQL queries
- **Inconsistent naming** and structure

### Benefits of Codegen

- ✅ **Auto-generated types** - always in sync with schema
- ✅ **Compile-time validation** - catch errors before runtime
- ✅ **React Query hooks** - auto-generated hooks for data fetching
- ✅ **Reduced bundle size** - only generate types for used queries
- ✅ **Better DX** - IntelliSense, autocomplete, refactoring support

## Setup

### 1. Install Dependencies

```bash
pnpm add -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-query @graphql-codegen/introspection
```

### 2. Configuration

The `codegen.yml` file is already configured to:

- Use the existing `generated-schema.graphql` from Payload
- Generate TypeScript types and React Query hooks
- Output to `src/generated/graphql.ts`

### 3. Generate Types

```bash
pnpm codegen
```

This will generate:

- `src/generated/graphql.ts` - TypeScript types and React Query hooks
- `src/generated/graphql.schema.json` - Schema introspection

## Migration Strategy

### Phase 1: Setup and Testing (Current)

1. ✅ **Setup codegen configuration**
2. ✅ **Create example GraphQL documents**
3. ✅ **Generate initial types**
4. ✅ **Test with example hooks**

### Phase 2: Gradual Migration

1. **Move queries to `.graphql` files**

   ```graphql
   # src/graphql/queries/wine-variants.graphql
   query GetWineVariant($slug: String!, $locale: LocaleInputType!) {
     FlatWineVariants(where: { slug: { equals: $slug } }) {
       docs {
         id
         slug
         wineTitle
         # ... other fields
       }
     }
   }
   ```

2. **Replace manual types with generated types**

   ```typescript
   // Before: Manual interface
   interface WineVariantResponse {
     FlatWineVariants: { docs: FlatWineVariant[] }
   }

   // After: Generated type
   import { GetWineVariantQuery } from '@/generated/graphql'
   ```

3. **Use generated React Query hooks**

   ```typescript
   // Before: Manual implementation
   export function useWineVariant(slug: string) {
     return useQuery({
       queryKey: ['wine-variant', slug],
       queryFn: async () => {
         const { data, error } = await graphqlRequest<WineVariantResponse>({
           query: WINE_VARIANT_QUERY,
           variables: { slug, locale },
         })
         // ... error handling
       },
     })
   }

   // After: Generated hook
   import { useGetWineVariantQuery } from '@/generated/graphql'

   export function useWineVariant(slug: string, locale: Locale) {
     return useGetWineVariantQuery({
       variables: { slug, locale },
       skip: !slug,
     })
   }
   ```

### Phase 3: Cleanup

1. **Remove manual type definitions** from `src/lib/graphql.ts`
2. **Update imports** throughout the codebase
3. **Remove unused GraphQL constants**
4. **Update tests** to use generated types

## File Structure

```
src/
├── graphql/                    ← GraphQL documents
│   ├── queries/
│   │   ├── collection-items.graphql
│   │   ├── wine-variants.graphql
│   │   └── flat-collections.graphql
│   ├── mutations/
│   └── fragments/
├── generated/                  ← Generated files (gitignored)
│   ├── graphql.ts             ← Generated types and hooks
│   └── graphql.schema.json    ← Schema introspection
├── lib/
│   ├── graphql-client.ts      ← GraphQL client utilities
│   └── graphql.ts             ← Legacy file (to be removed)
└── hooks/
    ├── useWineVariantCodegen.ts ← Example with generated types
    └── useWineVariant.ts       ← Legacy hook (to be migrated)
```

## Best Practices

### 1. GraphQL Documents

- **Use descriptive names** for queries and mutations
- **Group related queries** in the same file
- **Use fragments** for shared field selections
- **Keep queries focused** - don't fetch unnecessary fields

### 2. Generated Hooks

- **Use the generated hooks** instead of manual implementations
- **Leverage TypeScript** for compile-time validation
- **Use proper error handling** with generated error types
- **Take advantage of React Query features** (caching, refetching, etc.)

### 3. Type Safety

- **Import generated types** instead of defining manual interfaces
- **Use strict typing** for variables and responses
- **Leverage TypeScript's type checking** for GraphQL operations

## Performance Impact

### Bundle Size

- **Codegen generates only used types** (tree-shaking friendly)
- **Reduces manual type definitions** (2,000+ lines → auto-generated)
- **No runtime overhead** - types are compile-time only

### Build Time

- **Codegen runs during build** - minimal impact on development
- **Incremental generation** - only regenerates changed queries
- **Watch mode available** for development

### Runtime Performance

- **No impact on runtime performance**
- **Same network requests** as before
- **Better caching** with React Query hooks

## Troubleshooting

### Common Issues

1. **Schema not found**

   ```bash
   # Ensure Payload generates the schema
   pnpm generate:types
   pnpm codegen
   ```

2. **Type errors after generation**

   ```bash
   # Regenerate types after schema changes
   pnpm codegen
   ```

3. **Missing fields in generated types**
   - Check that fields are included in GraphQL documents
   - Ensure schema is up to date
   - Regenerate types

### Development Workflow

1. **Add new GraphQL documents** to `src/graphql/`
2. **Run codegen** to generate types: `pnpm codegen`
3. **Use generated hooks** in components
4. **Commit generated files** (or add to CI/CD)

## CI/CD Integration

### Pre-commit Hook

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "pnpm codegen && git add src/generated/"
    }
  }
}
```

### Build Pipeline

```yaml
# .github/workflows/build.yml
- name: Generate GraphQL types
  run: pnpm codegen

- name: Build application
  run: pnpm build
```

## Conclusion

GraphQL Codegen provides significant benefits for the wineshop project:

- **Reduced maintenance burden** - no more manual type definitions
- **Better type safety** - compile-time validation of GraphQL operations
- **Improved developer experience** - auto-generated hooks and types
- **Consistent codebase** - standardized GraphQL patterns
- **Performance benefits** - tree-shaking and optimized bundles

The migration can be done gradually, allowing the team to adopt codegen incrementally while maintaining the existing functionality.
