# Butelka Project — Codebase Conventions

This document outlines the architectural and code conventions for the Butelka e-commerce project.

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

- Always use `try/catch` in async handlers
- Wrap API logic in `handleError()` from `lib/errors.ts`
- Never expose internal error details to frontend
- Log with `pino` (optional)

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

- All inputs in local API routes must be validated and sanitized
- Never expose auto-incremented or numeric IDs — use UUIDs or ULIDs
- Magic links and tokens must:
  - Expire within 15 minutes
  - Be single-use and device-bound if possible
- Cookies must be:
  - `HttpOnly`
  - `Secure`
  - `SameSite=Strict`
- Implement CSRF protection for all mutations
- Use rate limiting for auth endpoints
- Sanitize user inputs (e.g., `DOMPurify`)
- Apply strict CORS policies
- Add Content-Security-Policy (CSP) headers
- Run regular audits using `pnpm audit`

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
