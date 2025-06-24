# Layout Components

## ItemNavigation

The `ItemNavigation` component provides previous/current/next navigation for wine detail pages. It displays a navigation bar at the bottom of detail pages that allows users to navigate between items in the same collection.

### Features

- **Previous/Next Navigation**: Navigate to the previous or next item in the collection
- **Current Item Display**: Shows the current item title and position in the collection
- **Responsive Design**: Works on both desktop and mobile devices
- **Internationalization**: Supports both English and Slovenian languages
- **Loading States**: Shows loading indicator while fetching data
- **Error Handling**: Gracefully handles missing items or API errors

### Usage

The component is automatically included in wine detail page layouts:

- English: `src/app/(frontend)/(en)/en/(wine)/(detail)/layout.tsx`
- Slovenian: `src/app/(frontend)/(sl)/(wine)/(detail)/layout.tsx`

### Components

#### ItemNavigation (Client Component)

The main client-side component that handles:

- Fetching navigation items from the API
- Managing loading and error states
- Rendering the navigation UI

#### ItemNavigationWrapper (Server Component)

A server-side wrapper that:

- Fetches the current item's title
- Passes data to the client component
- Handles server-side errors

### Styling

The component uses Tailwind CSS classes and follows the existing design system:

- Uses CSS variables for colors (`--foreground`, `--background`, `--accent`, `--border`)
- Responsive design with proper spacing
- Hover effects and transitions
- Backdrop blur for modern glass effect

### Translation Keys

The component uses the following translation keys from `messages/en.json` and `messages/sl.json`:

- `common.previous` - "Previous" / "Prejšnja"
- `common.next` - "Next" / "Naslednja"
- `common.showing` - "Showing" / "Prikazujem"
- `common.of` - "of" / "od"
- `common.loading` - "Loading..." / "Nalaganje..."

### API Integration

The component integrates with the Payload CMS API to:

- Fetch all items in a collection for navigation
- Get the current item's title
- Sort items by title for consistent ordering
- Handle locale-specific content

### Supported Collections

The navigation works with all wine-related collections defined in `routeMappings`:

- Wines (`wines`)
- Wineries (`wineries`)
- Regions (`regions`)
- Wine Countries (`wineCountries`)
- Grape Varieties (`grape-varieties`)
- Styles (`styles`)
- Aromas (`aromas`)
- Climates (`climates`)
- Moods (`moods`)
- Dishes (`dishes`)
- Tags (`tags`)
