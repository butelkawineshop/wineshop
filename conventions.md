# Butelka Project — Codebase Conventions

This document outlines the architectural and code conventions for the Butelka e-commerce project.

---

## 🧹 Clean Code Principles

- **No unused variables, imports, or code** - Delete anything that's not needed
- **No commented-out code** - Remove it completely, use git history if needed later
- **No console.log in production** - Use proper logging or remove debug statements
- **No TODO comments without tickets** - Create tickets for todos, don't leave code comments
- **No magic numbers** - Use named constants
- **No hardcoded strings in UI** - All text must use i18n keys
- **Keep functions small and focused** - Single responsibility principle
- **Meaningful variable names** - Self-documenting code
- **Remove dead code immediately** - Don't accumulate technical debt

---

## 📊 Constants Management

### **Constants File Structure**

- **Create dedicated constants files** in `src/constants/` for domain-specific constants
- **Use descriptive file names** that reflect the domain (e.g., `wine.ts`, `filters.ts`, `store.ts`)
- **Export constants as `as const`** to ensure type safety and prevent mutations
- **Group related constants** logically within each file

### **Constants File Naming Convention**

```
src/constants/
├── wine.ts          ← Wine-related constants
├── filters.ts       ← Filter component constants
├── store.ts         ← Store/state constants
├── ui.ts            ← UI component constants
└── api.ts           ← API-related constants
```

### **Constants Definition Pattern**

```typescript
// src/constants/wine.ts
export const WINE_CONSTANTS = {
  // Component dimensions
  CARD_IMAGE_WIDTH: 400,
  CARD_IMAGE_HEIGHT: 400,

  // UI measurements
  PRICE_OVERLAY_WIDTH: 'w-[300px]',
  SLIDE_INDICATOR_SIZE: 'w-2 h-2',

  // Business logic
  DEFAULT_PAGE_LIMIT: 24,
  MAX_DESCRIPTION_LENGTH: 120,

  // Arrays and collections
  SLIDE_INDICATORS: [0, 1, 2] as const,
  GRID_BREAKPOINTS: {
    MOBILE: 'grid-cols-1',
    TABLET: 'sm:grid-cols-2',
    DESKTOP: 'lg:grid-cols-3',
    WIDE: 'xl:grid-cols-4',
  },
} as const
```

### **Constants Usage Guidelines**

- **Import constants from dedicated files** rather than defining them inline
- **Use descriptive constant names** that clearly indicate their purpose
- **Group constants by functionality** within each file
- **Use TypeScript's `as const`** to ensure immutability and type inference
- **Prefer string constants for CSS classes** to maintain consistency
- **Use numeric constants for business logic** (limits, thresholds, etc.)

### **When to Create Constants Files**

- **Domain-specific constants** that are used across multiple components
- **UI measurements and dimensions** that should be consistent
- **Business logic thresholds** and limits
- **Configuration values** that might change
- **Magic numbers or strings** that appear in multiple places

### **Constants Import Pattern**

```typescript
// ✅ Good: Import from dedicated constants file
import { WINE_CONSTANTS } from '@/constants/wine'

// Usage
const imageWidth = WINE_CONSTANTS.CARD_IMAGE_WIDTH
const gridClass = WINE_CONSTANTS.GRID_BREAKPOINTS.DESKTOP

// ❌ Bad: Magic numbers inline
const imageWidth = 400
const gridClass = 'lg:grid-cols-3'
```

### **Constants Maintenance**

- **Update constants in one place** when business requirements change
- **Document complex constants** with inline comments explaining their purpose
- **Review constants regularly** to ensure they're still relevant
- **Remove unused constants** to keep files clean
- **Consider environment-specific constants** for different deployment stages

---

## 🎨 Styling Principles

### **Use Tailwind CSS Utilities**

- **Always use Tailwind CSS utilities** for styling consistency
- **Typography**: Use Tailwind typography classes (`text-lg`, `font-bold`, `text-center`)
- **Layout**: Use Tailwind layout utilities (`container`, `grid`, `flex`, `p-4`, `m-2`)
- **Components**: Use Tailwind component classes (`bg-primary`, `text-foreground`, `border-border`)
- **Spacing**: Use Tailwind spacing scale (`space-y-4`, `gap-2`, `p-6`)
- **Interactive**: Use Tailwind interactive classes (`hover:bg-accent`, `focus:ring-2`, `active:scale-95`)
- **Accessibility**: Use Tailwind accessibility classes (`sr-only`, `focus:outline-none`)

### **Design System Compliance**

- **Font families**: Use `font-accent` for headings, `font-sans` for body text
- **Color system**: Use CSS custom properties (e.g., `hsl(var(--primary))`)
- **Spacing scale**: Follow Tailwind's spacing scale consistently
- **Border radius**: Use consistent rounded corners (`rounded-lg`, `rounded-full`)
- **Transitions**: Use standard duration classes (`transition-colors`, `transition-all`)

### **Responsive Design**

- **Mobile-first**: Start with mobile styles, enhance for larger screens
- **Breakpoint consistency**: Use Tailwind's standard breakpoints (`md:`, `lg:`, `xl:`)
- **Responsive utilities**: Use responsive variants for conditional display

### **Performance & Maintainability**

- **Prefer Tailwind utilities** over custom CSS
- **CSS-in-JS discouraged** - Use Tailwind utilities and CSS custom properties
- **Consistent naming** - Follow Tailwind's class naming conventions
- **Theme support** - All styles must work with both light and dark themes

### **Accessibility Standards**

### **WCAG 2.1 AA Compliance**

- **Level AA compliance** required for all user-facing features
- **Test with screen readers** (NVDA, JAWS, VoiceOver)
- **Keyboard navigation** - All interactive elements must be keyboard accessible
- **Color contrast** - Minimum 4.5:1 for normal text, 3:1 for large text (18pt+)

### **Semantic HTML**

- **Use proper HTML elements** - `<button>`, `<nav>`, `<main>`, `<section>`, `<article>`
- **Heading hierarchy** - Use `<h1>` through `<h6>` in logical order
- **Landmarks** - Use `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- **Lists** - Use `<ul>`, `<ol>`, `<dl>` for list content
- **Forms** - Use `<label>`, `<fieldset>`, `<legend>` for form structure

### **ARIA Attributes**

- **Add ARIA when semantic HTML isn't sufficient**
- **Labels and descriptions** - Use `aria-label`, `aria-describedby`
- **States and properties** - Use `aria-expanded`, `aria-pressed`, `aria-hidden`
- **Live regions** - Use `aria-live` for dynamic content updates
- **Landmarks** - Use `role` attributes when semantic elements aren't available

### **Focus Management**

- **Visible focus indicators** - Ensure focus is clearly visible
- **Logical tab order** - Elements should be focusable in logical sequence
- **Skip links** - Provide skip navigation links for keyboard users
- **Focus trapping** - Trap focus in modals and dialogs
- **Focus restoration** - Restore focus when modals close

### **Screen Reader Support**

- **Alternative text** - All images must have meaningful `alt` attributes
- **Descriptive links** - Use descriptive link text, avoid "click here"
- **Form labels** - Associate form controls with descriptive labels
- **Error messages** - Provide clear, descriptive error messages
- **Status updates** - Use `aria-live` for status changes

### **Testing Accessibility**

- **Automated testing** - Use axe-core or similar tools
- **Manual testing** - Test with keyboard navigation and screen readers
- **Color contrast** - Verify contrast ratios meet WCAG standards
- **Responsive design** - Ensure accessibility on all screen sizes

Example:

```typescript
// ✅ Good: Accessible component
export function AccessibleButton({
  children,
  onClick,
  ariaLabel
}: AccessibleButtonProps): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="focus:ring-2 focus:ring-primary focus:outline-none"
      type="button"
    >
      {children}
    </button>
  )
}

// ❌ Bad: Inaccessible component
export function BadButton({ children, onClick }: BadButtonProps): React.JSX.Element {
  return (
    <div onClick={onClick} className="cursor-pointer">
      {children}
    </div>
  )
}
```

---

## 📁 File Structure

All core logic must reside under `/src` and follow this structure:

```
src/
├── app/(frontend)      ← Pages & UI for customers
├── app/(payload)       ← Payload-admin specific SSR/custom UI
├── app/api             ← Local API endpoints (preferred over REST)
├── auth/               ← Customer auth (NextAuth logic)
├── collections/        ← Payload collections grouped by function
│   ├── ecommerce/
│   ├── wine/
│   └── content/
├── components/         ← Reusable UI components by domain
├── contexts/           ← React contexts
├── features/           ← Feature-specific logic (KGB, tastings, etc.)
├── fields/             ← Custom Payload field components
├── hooks/              ← Reusable hooks (React + server)
├── i18n/               ← Internationalization utils
├── lib/                ← Shared logic (formatters, integrations, analytics)
├── middleware/         ← Middleware (Redis cache, guards)
├── providers/          ← App-level providers (QueryClient, Theme)
├── store/              ← Zustand stores
├── tasks/              ← Background tasks (cron, sync)
├── utils/              ← Pure utility functions
```

---

## 🔁 Data Layer

- ✅ Use local API routes in `app/api/` as the default data access layer
- ✅ Use GraphQL for deeply nested or external queries
- ❌ Never build internal REST endpoints

---

## 🔐 Authentication

### Admins

- Use Payload's built-in `users` collection
- Admin-only access is handled via `access` config
- Login via `/admin`

### Customers

- Use `next-auth` under `/auth`
- Magic links or OAuth only
- Cookie-based JWT session
- Session strategy: JWT
- Token expiration: 2 hours
- Custom pages: `/login`, `/register`, `/verify`
- Required providers: Email (magic links), Google OAuth
- Session storage: Redis (optional)
- Access control: Role-based (`'customer' | 'admin'`)

---

## 🔎 Validation

- Use **Zod** for all server and form schema validation
- Use `react-hook-form` + `zodResolver` in forms
- Validate all incoming API data using `safeParse`

---

## 💣 Error Handling

### **Client-Side Error Handling**

- **Use error boundaries** for React components to catch rendering errors
- **Implement retry mechanisms** for network requests with exponential backoff
- **Show user-friendly error messages** - never expose technical details
- **Log errors to monitoring service** (Sentry, LogRocket, etc.)
- **Graceful degradation** - provide fallback UI when features fail

### **Server-Side Error Handling**

- **Always use `try/catch`** in async handlers and API routes
- **Return consistent error response format** across all endpoints
- **Log with structured data** including user, route, timestamp, and context
- **Never expose internal error details** to the frontend
- **Use proper HTTP status codes** (400, 401, 403, 404, 500, etc.)

### **Error Response Format**

```typescript
// Standard error response structure
interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

// Example error responses
const validationError: ErrorResponse = {
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input provided',
    details: { field: 'email', issue: 'Invalid email format' },
  },
}

const serverError: ErrorResponse = {
  success: false,
  error: {
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong. Please try again.',
  },
}
```

### **Error Handling Patterns**

```typescript
// ✅ Good: Comprehensive error handling
export async function handleApiRequest<T>(
  request: () => Promise<T>,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await request()
    return { data, error: null }
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn('Validation error', { error: error.issues })
      return { data: null, error: 'Invalid input provided' }
    }

    if (error instanceof AuthError) {
      logger.warn('Authentication error', { error: error.message })
      return { data: null, error: 'Authentication required' }
    }

    logger.error('Unexpected error', { error, route: '/api/endpoint' })
    return { data: null, error: 'Something went wrong. Please try again.' }
  }
}

// ❌ Bad: Poor error handling
export async function badApiRequest<T>(request: () => Promise<T>): Promise<T> {
  const data = await request() // No error handling
  return data
}
```

### **Error Monitoring**

- **Use structured logging** with consistent fields
- **Include context information** (user ID, request ID, route)
- **Set up alerts** for critical errors
- **Track error rates** and trends
- **Implement error recovery** strategies where possible

---

## ⚡ Performance Standards

### **Core Web Vitals Targets**

- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Contentful Paint (FCP)**: < 1.8 seconds
- **Time to Interactive (TTI)**: < 3.8 seconds

### **Bundle Size Limits**

- **JavaScript bundles**: Keep chunks under 250KB (gzipped)
- **CSS bundles**: Keep under 50KB (gzipped)
- **Image optimization**: Use WebP format with fallbacks
- **Font loading**: Use `font-display: swap` and preload critical fonts

### **Optimization Techniques**

- **Code splitting**: Lazy load non-critical components and routes
- **Image optimization**: Use Next.js Image component with proper sizing
- **Caching strategy**: Implement proper cache headers and service workers
- **Tree shaking**: Remove unused code from production builds
- **Minification**: Compress all assets (JS, CSS, HTML)

### **Performance Monitoring**

```typescript
// Performance monitoring setup
export function trackPerformance(metric: string, value: number): void {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(`${metric}-start`)
    performance.measure(metric, `${metric}-start`)

    // Send to analytics
    analytics.track('performance', { metric, value })
  }
}

// Usage in components
export function OptimizedComponent(): React.JSX.Element {
  useEffect(() => {
    trackPerformance('component-render', performance.now())
  }, [])

  return <div>Optimized content</div>
}
```

### **Performance Testing**

- **Lighthouse audits** - Run regularly in CI/CD
- **Bundle analyzer** - Monitor bundle size changes
- **Real User Monitoring (RUM)** - Track actual user performance
- **Load testing** - Test under high traffic conditions

### **Performance Checklist**

- [ ] Images are optimized and use appropriate formats
- [ ] JavaScript is code-split and lazy-loaded
- [ ] CSS is minified and critical CSS is inlined
- [ ] Fonts are optimized with proper loading strategies
- [ ] API responses are cached appropriately
- [ ] Database queries are optimized and indexed
- [ ] Third-party scripts are loaded asynchronously
- [ ] Core Web Vitals meet target thresholds

---

## 🧠 State Management

- Use **Zustand** for all client-side state
- Organize into separate files in `store/`
- Use `persist` middleware if data should survive reload
- Never use Redux or Context for remote data
- Store structure:
  ```ts
  interface Store {
    state: State
    actions: Actions
    selectors: Selectors
  }
  ```
- Use `create` with `devtools` and `persist` middleware
- Implement selectors for derived state
- Keep stores domain-specific (auth, cart, ui)

---

## 🌍 i18n

- All translation messages live in:
  - `/en.json`
  - `/sl.json`
- Default locale: `sl`
- Use custom `useTranslation()` or `next-intl`

---

## 🧩 Component and Collection Organization

### collections/

Group by functional domain:

```
ecommerce/: orders, cart, coupons
wine/: wines, regions, grape-varieties
content/: pages, moods, faqs
```

### components/

Group by UI domain:

```
wine/: WineCard.tsx, WineDetail.tsx
filters/: MoodFilter.tsx, RangeSlider.tsx
layout/: Header.tsx, Footer.tsx
```

---

## 🧪 Development Rules

- Always use `devsafe` when hot reload fails
- Run `generate:types` and `generate:importmap` after Payload changes
- Use `cross-env NODE_OPTIONS=--no-deprecation` for all scripts
- Commit messages must follow **Conventional Commits**:
  - `feat:` new features
  - `fix:` bug fixes
  - `refactor:` logic improvements
  - `chore:` build/config updates
  - `docs:` documentation
  - `test:` test updates
  - `style:` formatting (no logic)
- Git flow:
  - `main` → production
  - `develop` → staging/dev
  - `feature/*`, `bugfix/*`, `release/*`
- **Use `pnpm` exclusively. Do not use `npm` or `yarn`**

---

## ✅ Approved Libraries

| Purpose       | Library               |
| ------------- | --------------------- |
| Forms         | React Hook Form + Zod |
| State         | Zustand               |
| Data fetching | TanStack React Query  |
| Auth          | NextAuth              |
| Validation    | Zod                   |
| Email         | Resend                |
| Caching       | Redis                 |
| Security      | Helmet, RateLimit     |
| Logging (opt) | Pino                  |

---

## 🛠 Enforceable Tooling

- Use `eslint-plugin-boundaries` to enforce folder/module boundaries.
- Use custom ESLint rules to:
  - Disallow `REST` (`fetch('/api/...')`) unless external
  - Disallow `useContext` for app state
  - Enforce `try/catch` on all async logic
  - Enforce explicit return types for all exported functions
  - **No unused variables, imports, or code**
  - **No console.log in production**

---

## 🧾 Type Safety

- Always define interfaces and types explicitly
- Avoid `any`, `as any`, or unchecked casting
- Use `satisfies` for narrowing literals
- Exported functions must define return types
- Use **branded types** for ID safety:
  ```ts
  type CustomerId = string & { readonly brand: unique symbol }
  type OrderId = string & { readonly brand: unique symbol }
  ```
- Implement **type guards**:
  ```ts
  function isCustomer(user: User): user is Customer {
    return user.role === 'customer'
  }
  ```
- Use **discriminated unions** for app state:
  ```ts
  type AuthState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; user: User }
    | { status: 'error'; error: string }
  ```

---

## 📦 API Structure and Contracts

All local API routes under `app/api/` must:

- Use `zod.safeParse()` to validate `req.body`, `req.query`, and/or `req.params`
- Return **typed, consistent response shapes**
- Handle rate limiting:
  ```ts
  const rateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
  ```
- Implement proper error boundaries:
  ```ts
  try {
    // logic
  } catch (error) {
    if (error instanceof ZodError) {
      return createError('Validation failed', error.issues)
    }
    if (error instanceof AuthError) {
      return createError('Authentication failed')
    }
    logger.error({ err: error, route })
    return createError('Internal server error')
  }
  ```

---

## 🌐 i18n Discipline

- All strings in the UI must be i18n keys — no hardcoded text.
- Keys must be namespaced by domain:
  - `wine.card.title`
  - `checkout.error.invalidEmail`
- Default locale is `sl` and must always be complete.
- Fallbacks to `en` must be logged as a warning in development builds.

---

## 📉 Logging & Error Tracing

- All server-side caught errors must be logged using `pino` via `lib/logger.ts`.
- Log structure must include:
  - `err`
  - `route`
  - `context` or `userId` if available

Example:

```ts
logger.error({ err, route: '/api/orders/[id]', userId: req.user?.id }, 'Order fetch failed')
```

---

## 🔐 Security Rules

### **Input Validation & Sanitization**

- **Validate all inputs** in local API routes using Zod schemas
- **Sanitize user inputs** to prevent XSS attacks (use DOMPurify for HTML)
- **Use parameterized queries** to prevent SQL injection
- **Validate file uploads** - check file type, size, and content
- **Escape output** - always escape user-generated content

### **Authentication & Authorization**

- **Use secure session management** with proper expiration times
- **Implement role-based access control** (RBAC) for all endpoints
- **Use secure password hashing** (bcrypt, Argon2) if storing passwords
- **Implement rate limiting** for authentication endpoints
- **Use secure token storage** (HttpOnly cookies, secure headers)

### **Data Protection**

- **Never expose auto-incremented or numeric IDs** - use UUIDs or ULIDs
- **Encrypt sensitive data** at rest and in transit
- **Use HTTPS everywhere** - redirect HTTP to HTTPS
- **Implement proper CORS policies** - restrict to trusted domains
- **Sanitize database queries** - use ORM/query builders

### **Security Headers**

```typescript
// Security headers configuration
const securityHeaders = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}
```

### **Magic Links & Tokens**

- **Expire within 15 minutes** for security-sensitive operations
- **Be single-use** when possible
- **Device-bound** if applicable
- **Rate limited** to prevent abuse
- **Secure transmission** via HTTPS only

### **Cookie Security**

```typescript
// Secure cookie configuration
const secureCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 2 * 60 * 60 * 1000, // 2 hours
  path: '/',
  domain: process.env.COOKIE_DOMAIN,
}
```

### **API Security**

- **Validate request bodies** using Zod schemas
- **Implement proper error handling** - don't leak sensitive information
- **Use rate limiting** for all public endpoints
- **Log security events** (failed logins, suspicious activity)
- **Implement request signing** for sensitive operations

### **Security Testing**

- **Regular security audits** using `pnpm audit`
- **Dependency scanning** for known vulnerabilities
- **Penetration testing** for critical features
- **Code security reviews** for sensitive changes
- **Automated security scanning** in CI/CD

### **Security Checklist**

- [ ] All inputs are validated and sanitized
- [ ] Authentication endpoints are rate limited
- [ ] Sensitive data is encrypted
- [ ] Security headers are properly configured
- [ ] HTTPS is enforced everywhere
- [ ] Dependencies are regularly updated
- [ ] Error messages don't leak sensitive information
- [ ] File uploads are properly validated
- [ ] CORS policies are restrictive
- [ ] Session management is secure

---

## 🚦 CI & Pre-Commit Requirements

- All commits and pull requests must pass:

```
pnpm run lint
pnpm run build
pnpm run typecheck
```

- No usage of:
  - `any`, `as any`, or unchecked casting
  - `useContext` (except for non-state providers)
  - untyped exports or return values
  - magic strings in UI
  - **unused variables, imports, or code**
  - **console.log in production**

---

## 📚 Documentation Compliance

- Always follow the latest stable documentation as of **June 2025** for:

| Tool/Library       | Doc URL                      |
| ------------------ | ---------------------------- |
| Payload CMS        | https://payloadcms.com/docs  |
| Next.js App Router | https://nextjs.org/docs/app  |
| NextAuth (Auth.js) | https://authjs.dev           |
| Zod                | https://zod.dev              |
| TanStack Query     | https://tanstack.com/query   |
| Zustand            | https://docs.pmnd.rs/zustand |
| Redis              | https://redis.io/docs        |
| React 19           | https://react.dev            |

---

## 🧪 Testing

### Structure

- All tests must be placed in `src/__tests__/` directory
- Mirror the source directory structure in `__tests__/`
- Test files must be named `*.test.ts` or `*.test.tsx`
- Test files are ignored in git (see .gitignore)

### Configuration

- Use Jest as the testing framework
- Configure in `jest.config.ts`
- Coverage reports go to `/coverage`
- Ignore test files in coverage collection

### Writing Tests

- Group related tests using `describe` blocks
- Use clear, descriptive test names
- Test both success and failure cases
- Mock external dependencies
- Keep tests focused and atomic
- Follow AAA pattern (Arrange, Act, Assert)

Example:

```typescript
describe('feature name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test'

    // Act
    const result = functionUnderTest(input)

    // Assert
    expect(result).toBe(expected)
  })
})
```

### Coverage

- Aim for high test coverage
- Focus on critical business logic
- Don't test implementation details
- Use coverage reports to identify gaps

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

---

## 📝 Logging

- Use **Pino** for all server-side logging
- Create logger instance at the start of each task/hook:
  ```ts
  const logger = createLogger(req, {
    task: 'taskName',
    operation: 'create|update|delete',
    collection: 'collectionName',
    id: docId,
  })
  ```
- Log levels:
  - `debug`: Development details
  - `info`: Normal operations
  - `warn`: Potential issues
  - `error`: Actual errors
- Always include error objects in error logs
- Never log sensitive data
- Use structured logging format:
  ```ts
  logger.info('Operation completed', {
    task: 'syncFlatWineVariant',
    id: variantId,
    duration: endTime - startTime,
  })
  ```

---

## 🧩 Component Guidelines

### **Component Structure**

```typescript
// ✅ Good component structure
interface ComponentProps {
  // Props interface with proper types
  title: string
  description?: string
  onAction?: () => void
}

export function Component({
  title,
  description,
  onAction
}: ComponentProps): React.JSX.Element {
  // 1. Hooks first
  const [state, setState] = useState<string>('')
  const { data, isLoading } = useQuery(['key'], fetchData)

  // 2. Event handlers
  const handleClick = (): void => {
    onAction?.()
  }

  // 3. Computed values
  const isDisabled = isLoading || !state

  // 4. Early returns
  if (isLoading) {
    return <LoadingSpinner />
  }

  // 5. Render
  return (
    <div className="component-container">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className="btn-primary"
      >
        Action
      </button>
    </div>
  )
}
```

### **Component Naming Conventions**

- **Use PascalCase** for component names: `WineCard`, `UserProfile`
- **Use descriptive names** that indicate purpose: `WineDetailModal`, `CheckoutForm`
- **Suffix with type**: `WineCard.tsx`, `WineCard.test.tsx`, `WineCard.stories.tsx`
- **Group related components**: `WineCard/index.tsx`, `WineCard/WineCard.tsx`

### **Props Guidelines**

```typescript
// ✅ Good: Well-typed props
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  className?: string
  'aria-label'?: string
}

// ❌ Bad: Poorly typed props
interface BadButtonProps {
  children: any
  variant: string
  onClick: any
}
```

### **Component Composition**

```typescript
// ✅ Good: Composition over inheritance
export function Card({ children, ...props }: CardProps): React.JSX.Element {
  return (
    <div className="card" {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children }: CardHeaderProps): React.JSX.Element {
  return <div className="card-header">{children}</div>
}

export function CardBody({ children }: CardBodyProps): React.JSX.Element {
  return <div className="card-body">{children}</div>
}

// Usage
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

### **State Management in Components**

- **Use local state** for UI-only state (form inputs, toggles)
- **Use Zustand stores** for shared state across components
- **Use React Query** for server state (data fetching, caching)
- **Avoid prop drilling** - use stores or context for deep component trees

### **Component Testing**

```typescript
// Component test example
describe('WineCard', () => {
  const defaultProps = {
    wine: mockWine,
    onAddToCart: jest.fn(),
  }

  it('renders wine information correctly', () => {
    render(<WineCard {...defaultProps} />)

    expect(screen.getByText(mockWine.name)).toBeInTheDocument()
    expect(screen.getByText(mockWine.price)).toBeInTheDocument()
  })

  it('calls onAddToCart when button is clicked', () => {
    render(<WineCard {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(defaultProps.onAddToCart).toHaveBeenCalledWith(mockWine.id)
  })
})
```

### **Component Documentation**

````typescript
/**
 * WineCard component displays wine information in a card format
 *
 * @param wine - Wine data to display
 * @param onAddToCart - Callback when add to cart button is clicked
 * @param variant - Visual variant of the card
 *
 * @example
 * ```tsx
 * <WineCard
 *   wine={wineData}
 *   onAddToCart={(id) => addToCart(id)}
 *   variant="featured"
 * />
 * ```
 */
export function WineCard({
  wine,
  onAddToCart,
  variant = 'default',
}: WineCardProps): React.JSX.Element {
  // Component implementation
}
````

---

## 🔄 Code Reusability & Separation of Concerns

### **Why Separation of Concerns is Critical**

- **Maintainability** - Logic changes don't require touching UI code
- **Reusability** - Business logic can be reused across different UI components
- **Testability** - Logic and UI can be tested independently
- **Scalability** - Different developers can work on different layers
- **Performance** - Optimize logic without affecting UI rendering

### **Layer Architecture Pattern**

```typescript
// 1. Data Layer (API, Database)
// src/lib/api/wine.ts
export class WineService {
  async getWines(filters: WineFilters): Promise<Wine[]> {
    // API logic, data fetching, caching
  }

  async addToCart(wineId: string, quantity: number): Promise<void> {
    // Cart logic, validation, API calls
  }
}

// 2. Business Logic Layer (Hooks, Utilities)
// src/hooks/useWineFilters.ts
export function useWineFilters() {
  const [filters, setFilters] = useState<WineFilters>({})
  const [results, setResults] = useState<Wine[]>([])

  const applyFilters = useCallback(async (newFilters: WineFilters) => {
    // Business logic for filtering
    const filteredWines = await wineService.getWines(newFilters)
    setResults(filteredWines)
  }, [])

  return { filters, results, applyFilters }
}

// 3. UI Layer (Components)
// src/components/WineGrid.tsx
export function WineGrid(): React.JSX.Element {
  const { filters, results, applyFilters } = useWineFilters()

  // Pure UI logic - rendering, event handlers
  return (
    <div className="wine-grid">
      {results.map(wine => (
        <WineCard key={wine.id} wine={wine} />
      ))}
    </div>
  )
}
```

### **❌ Anti-Pattern: Mixed Concerns**

```typescript
// ❌ Bad: Logic and UI mixed together
export function WineFiltersClient(): React.JSX.Element {
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({})

  // Business logic mixed with UI
  const toggleFilter = (key: string, value: string) => {
    // URL manipulation logic
    // Data transformation logic
    // API call logic
    // All mixed with UI state updates
  }

  // UI rendering
  return <div>...</div>
}
```

### **✅ Best Pattern: Separated Concerns**

```typescript
// ✅ Good: Business logic in custom hook
// src/hooks/useWineFilters.ts
export function useWineFilters() {
  const [filters, setFilters] = useState<WineFilters>({})
  const [results, setResults] = useState<Wine[]>([])

  const toggleFilter = useCallback(async (key: string, value: string) => {
    // Pure business logic
    const newFilters = { ...filters, [key]: value }
    const results = await wineService.getWines(newFilters)
    setFilters(newFilters)
    setResults(results)
  }, [filters])

  return { filters, results, toggleFilter }
}

// ✅ Good: Pure UI component
// src/components/WineFilters.tsx
export function WineFilters(): React.JSX.Element {
  const { filters, results, toggleFilter } = useWineFilters()

  // Pure UI logic
  const handleFilterClick = (key: string, value: string) => {
    toggleFilter(key, value)
  }

  return (
    <div className="filters">
      {/* Pure UI rendering */}
    </div>
  )
}
```

### **Custom Hook Patterns**

#### **Data Fetching Hooks**

```typescript
// src/hooks/useWineData.ts
export function useWineData(wineId: string) {
  const [wine, setWine] = useState<Wine | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWine = async () => {
      try {
        setIsLoading(true)
        const wineData = await wineService.getWineById(wineId)
        setWine(wineData)
      } catch (err) {
        setError('Failed to load wine')
        logger.error('Wine fetch failed', { error: err, wineId })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWine()
  }, [wineId])

  return { wine, isLoading, error }
}
```

#### **State Management Hooks**

```typescript
// src/hooks/useWineCart.ts
export function useWineCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addToCart = useCallback(async (wineId: string, quantity: number) => {
    setIsLoading(true)
    try {
      await cartService.addItem(wineId, quantity)
      const updatedCart = await cartService.getCart()
      setCart(updatedCart)
    } catch (error) {
      logger.error('Failed to add to cart', { error, wineId })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const removeFromCart = useCallback(async (itemId: string) => {
    setIsLoading(true)
    try {
      await cartService.removeItem(itemId)
      const updatedCart = await cartService.getCart()
      setCart(updatedCart)
    } catch (error) {
      logger.error('Failed to remove from cart', { error, itemId })
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { cart, isLoading, addToCart, removeFromCart }
}
```

#### **Form Management Hooks**

```typescript
// src/hooks/useWineSearch.ts
export function useWineSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Wine[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const searchWines = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    try {
      const searchResults = await wineService.search(term)
      setResults(searchResults)
    } catch (error) {
      logger.error('Search failed', { error, term })
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  return { searchTerm, results, isSearching, searchWines }
}
```

### **Service Class Patterns**

#### **API Service Classes**

```typescript
// src/services/WineService.ts
export class WineService {
  private baseUrl = '/api/wines'

  async getWines(filters: WineFilters): Promise<Wine[]> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString())
    })

    const response = await fetch(`${this.baseUrl}?${params}`)
    if (!response.ok) {
      throw new Error('Failed to fetch wines')
    }

    return response.json()
  }

  async getWineById(id: string): Promise<Wine> {
    const response = await fetch(`${this.baseUrl}/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch wine')
    }

    return response.json()
  }

  async searchWines(query: string): Promise<Wine[]> {
    const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error('Search failed')
    }

    return response.json()
  }
}

// src/services/CartService.ts
export class CartService {
  private baseUrl = '/api/cart'

  async addItem(wineId: string, quantity: number): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wineId, quantity }),
    })

    if (!response.ok) {
      throw new Error('Failed to add item to cart')
    }
  }

  async getCart(): Promise<CartItem[]> {
    const response = await fetch(this.baseUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch cart')
    }

    return response.json()
  }

  async removeItem(itemId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${itemId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to remove item from cart')
    }
  }
}
```

### **Pure UI Component Patterns**

#### **Presentational Components**

```typescript
// src/components/WineCard.tsx
interface WineCardProps {
  wine: Wine
  onAddToCart: (wineId: string, quantity: number) => void
  isLoading?: boolean
  variant?: 'default' | 'featured'
}

export function WineCard({
  wine,
  onAddToCart,
  isLoading = false,
  variant = 'default'
}: WineCardProps): React.JSX.Element {
  // Pure UI logic only
  const handleAddToCart = () => {
    onAddToCart(wine.id, 1)
  }

  const cardClassName = cn(
    'wine-card',
    variant === 'featured' && 'wine-card--featured'
  )

  return (
    <div className={cardClassName}>
      <img src={wine.image} alt={wine.name} />
      <h3>{wine.name}</h3>
      <p>{wine.description}</p>
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  )
}
```

#### **Container Components**

```typescript
// src/components/WineGridContainer.tsx
export function WineGridContainer(): React.JSX.Element {
  const { wines, isLoading, error } = useWineData()
  const { addToCart, isAddingToCart } = useWineCart()

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <WineGrid
      wines={wines}
      onAddToCart={addToCart}
      isLoading={isLoading || isAddingToCart}
    />
  )
}
```

### **File Organization for Reusability**

```
src/
├── hooks/                    ← Business logic hooks
│   ├── useWineData.ts
│   ├── useWineCart.ts
│   ├── useWineFilters.ts
│   └── useWineSearch.ts
├── services/                 ← API and business logic services
│   ├── WineService.ts
│   ├── CartService.ts
│   └── UserService.ts
├── components/               ← Pure UI components
│   ├── WineCard.tsx
│   ├── WineGrid.tsx
│   └── WineFilters.tsx
├── containers/               ← Container components (optional)
│   ├── WineGridContainer.tsx
│   └── WineDetailContainer.tsx
└── utils/                    ← Pure utility functions
    ├── wineUtils.ts
    └── cartUtils.ts
```

### **Testing Strategy for Separated Concerns**

```typescript
// Test business logic hooks
describe('useWineCart', () => {
  it('should add item to cart', async () => {
    const { result } = renderHook(() => useWineCart())

    await act(async () => {
      await result.current.addToCart('wine-1', 2)
    })

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].wineId).toBe('wine-1')
  })
})

// Test pure UI components
describe('WineCard', () => {
  it('should render wine information', () => {
    const mockWine = { id: '1', name: 'Test Wine', price: 25 }
    const mockOnAddToCart = jest.fn()

    render(<WineCard wine={mockWine} onAddToCart={mockOnAddToCart} />)

    expect(screen.getByText('Test Wine')).toBeInTheDocument()
    expect(screen.getByText('$25')).toBeInTheDocument()
  })

  it('should call onAddToCart when button is clicked', () => {
    const mockWine = { id: '1', name: 'Test Wine', price: 25 }
    const mockOnAddToCart = jest.fn()

    render(<WineCard wine={mockWine} onAddToCart={mockOnAddToCart} />)

    fireEvent.click(screen.getByText('Add to Cart'))

    expect(mockOnAddToCart).toHaveBeenCalledWith('1', 1)
  })
})
```

### **Benefits for Wine Shop Application**

#### **1. Wine Filtering Logic**

- **Reusable** across different components (grid, list, search)
- **Testable** independently of UI
- **Maintainable** - filter logic changes don't affect UI

#### **2. Cart Management**

- **Consistent** cart behavior across all components
- **Persistent** - cart state survives component unmounts
- **Optimistic updates** - immediate UI feedback

#### **3. Wine Data Management**

- **Caching** - avoid duplicate API calls
- **Error handling** - consistent error states
- **Loading states** - consistent loading behavior

### **Implementation Checklist**

- [ ] **Extract business logic** from components into custom hooks
- [ ] **Create service classes** for API and data operations
- [ ] **Separate UI components** from business logic
- [ ] **Use container components** to connect hooks with UI
- [ ] **Test business logic** independently from UI
- [ ] **Test UI components** with mock data and handlers
- [ ] **Document hook interfaces** and usage patterns
- [ ] **Create reusable utilities** for common operations

---

## 👀 Code Review Guidelines

### **Pre-Submission Checklist**

Before submitting a pull request, ensure:

- [ ] **All tests pass** - Unit, integration, and e2e tests
- [ ] **No linting errors** - ESLint and Prettier checks pass
- [ ] **TypeScript compilation successful** - No type errors
- [ ] **No console.log statements** - Use proper logging instead
- [ ] **All functions have explicit return types** - No implicit returns
- [ ] **No magic numbers or hardcoded strings** - Use constants and i18n
- [ ] **Proper error handling implemented** - Try/catch blocks where needed
- [ ] **Accessibility requirements met** - ARIA attributes, keyboard navigation
- [ ] **Performance considerations** - No unnecessary re-renders or expensive operations
- [ ] **Security best practices** - Input validation, proper authentication

### **Code Review Checklist**

When reviewing code, check for:

#### **Code Quality**

- [ ] **Readability** - Code is easy to understand and follow
- [ ] **Naming conventions** - Variables, functions, and files follow conventions
- [ ] **Function size** - Functions are small and focused (single responsibility)
- [ ] **DRY principle** - No code duplication
- [ ] **Comments** - Complex logic is properly documented

#### **Type Safety**

- [ ] **No `any` types** - All types are properly defined
- [ ] **No type assertions** - Avoid `as any` or unchecked casting
- [ ] **Proper interfaces** - Props and data structures are well-typed
- [ ] **Type guards** - Used where appropriate for runtime type checking

#### **Testing**

- [ ] **Test coverage** - New functionality has appropriate tests
- [ ] **Test quality** - Tests are meaningful and not just for coverage
- [ ] **Edge cases** - Error conditions and edge cases are tested
- [ ] **Test naming** - Test descriptions are clear and descriptive

#### **Performance**

- [ ] **No memory leaks** - Proper cleanup in useEffect hooks
- [ ] **Efficient rendering** - No unnecessary re-renders
- [ ] **Bundle size** - No large dependencies added unnecessarily
- [ ] **Database queries** - Queries are optimized and indexed

#### **Security**

- [ ] **Input validation** - All user inputs are validated
- [ ] **Authentication** - Proper authentication checks
- [ ] **Authorization** - Proper authorization for sensitive operations
- [ ] **Data exposure** - No sensitive data exposed in logs or responses

### **Review Process**

1. **Automated checks** - CI/CD pipeline runs all checks
2. **Self-review** - Author reviews their own code first
3. **Peer review** - At least one other developer reviews
4. **Security review** - Security-sensitive changes get security review
5. **Final approval** - Maintainer or senior developer approves

### **Review Comments**

When leaving review comments:

- **Be constructive** - Focus on improvement, not criticism
- **Provide context** - Explain why changes are needed
- **Suggest alternatives** - Offer specific solutions when possible
- **Use checkboxes** - For actionable items that need to be addressed
- **Be specific** - Point to exact lines and explain issues clearly

### **Common Review Patterns**

```typescript
// ❌ Bad: Generic comment
// This looks wrong

// ✅ Good: Specific, actionable comment
// Consider using a constant for the magic number 24
// Suggested: const DEFAULT_PAGE_SIZE = 24

// ❌ Bad: Vague feedback
// This could be better

// ✅ Good: Clear, constructive feedback
// This function is doing too much. Consider splitting into:
// 1. Data fetching logic
// 2. Data transformation logic
// 3. UI rendering logic
```

---

## 🚀 Deployment Standards

### **Pre-Deployment Checklist**

Before deploying to production, ensure:

- [ ] **Environment variables configured** - All required env vars are set
- [ ] **Database migrations applied** - Schema changes are deployed
- [ ] **Static assets optimized** - Images, fonts, and other assets are optimized
- [ ] **Security headers configured** - CSP, HSTS, and other security headers
- [ ] **Monitoring and logging setup** - Error tracking and performance monitoring
- [ ] **Performance benchmarks met** - Core Web Vitals and load times
- [ ] **SSL certificates valid** - HTTPS is properly configured
- [ ] **Backup strategy in place** - Database and file backups configured
- [ ] **Rollback plan ready** - Quick rollback procedure documented

### **Deployment Process**

1. **Staging deployment** - Deploy to staging environment first
2. **Testing** - Run full test suite and manual testing
3. **Performance testing** - Load testing and performance validation
4. **Security scan** - Automated security vulnerability scan
5. **Production deployment** - Deploy to production with monitoring
6. **Post-deployment verification** - Verify all systems are working

### **Environment Configuration**

```typescript
// Environment configuration structure
export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production',
  },

  // Authentication
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL,
  },

  // External services
  services: {
    email: process.env.EMAIL_SERVICE_URL,
    storage: process.env.STORAGE_SERVICE_URL,
  },

  // Feature flags
  features: {
    enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
    enableDebugMode: process.env.NODE_ENV === 'development',
  },
} as const

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'] as const

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
})
```

### **Deployment Scripts**

```json
{
  "scripts": {
    "deploy:staging": "pnpm build && pnpm test && deploy-to-staging",
    "deploy:production": "pnpm build && pnpm test && deploy-to-production",
    "migrate:up": "payload migrate",
    "migrate:down": "payload migrate:down",
    "health:check": "curl -f http://localhost:3000/api/health",
    "backup:database": "pg_dump $DATABASE_URL > backup.sql"
  }
}
```

### **Monitoring & Observability**

- **Application monitoring** - Track application performance and errors
- **Infrastructure monitoring** - Monitor server resources and health
- **User analytics** - Track user behavior and feature usage
- **Error tracking** - Capture and alert on application errors
- **Performance monitoring** - Track Core Web Vitals and load times

### **Rollback Procedures**

```bash
# Quick rollback script
#!/bin/bash
echo "Rolling back to previous version..."

# Stop current deployment
docker-compose down

# Restore previous version
git checkout HEAD~1

# Restart with previous version
docker-compose up -d

# Verify health
./scripts/health-check.sh

echo "Rollback completed"
```

### **Post-Deployment Verification**

- [ ] **Health checks pass** - All endpoints respond correctly
- [ ] **Database connectivity** - Database connections are working
- [ ] **External services** - All third-party integrations are functional
- [ ] **User flows** - Critical user journeys work end-to-end
- [ ] **Performance metrics** - Load times and Core Web Vitals are acceptable
- [ ] **Error rates** - No increase in error rates
- [ ] **Monitoring alerts** - All monitoring systems are active

### **Deployment Best Practices**

- **Blue-green deployment** - Deploy new version alongside old version
- **Feature flags** - Use feature flags for gradual rollouts
- **Database migrations** - Always test migrations on staging first
- **Backup before deployment** - Create database backup before major changes
- **Monitor during deployment** - Watch metrics during deployment process
- **Document changes** - Keep deployment log with changes and rollback notes

---
