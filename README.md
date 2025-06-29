# Butelka Wineshop

A modern e-commerce platform for fine wines, built with Next.js and Payload CMS.

## 🚀 Features

- Next.js 15 with App Router
- Payload CMS for content management
- Cloudflare Images for optimized image delivery
- Typesense for fast search functionality
- TypeScript for type safety
- Tailwind CSS for styling
- i18n support (Slovenian/English)

## 🛠 Tech Stack

- **Framework:** Next.js 15
- **CMS:** Payload CMS
- **Database:** PostgreSQL
- **Search:** Typesense
- **Image Delivery:** Cloudflare Images
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Data Fetching:** TanStack React Query
- **Authentication:** NextAuth.js
- **Email:** Resend
- **Caching:** Redis

## 🏗 Project Structure

```
src/
├── app/(frontend)      ← Pages & UI for customers
├── app/(payload)       ← Payload-admin specific SSR/custom UI
├── app/api             ← Local API endpoints
├── auth/               ← Customer auth (NextAuth logic)
├── collections/        ← Payload collections
├── components/         ← Reusable UI components
├── contexts/           ← React contexts
├── features/           ← Feature-specific logic
├── fields/             ← Custom Payload fields
├── hooks/              ← Reusable hooks
├── i18n/               ← Internationalization
├── lib/                ← Shared logic
├── middleware/         ← Middleware
├── providers/          ← App-level providers
├── store/              ← Zustand stores
├── tasks/              ← Background tasks
└── utils/              ← Pure utility functions
```

## 🚦 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   ```env
   NEXT_PUBLIC_CLOUDFLARE_IMAGES_URL=your_cloudflare_images_url
   TYPESENSE_HOST=localhost
   TYPESENSE_PORT=8108
   TYPESENSE_API_KEY=xyz
   ```
4. **Database Setup** (Choose one option):

   **Option A: Migrate from Brew PostgreSQL (Recommended)**

   ```bash
   # Migrate your existing data to Docker
   pnpm db:migrate-to-docker
   ```

   **Option B: Start Fresh with Docker**

   ```bash
   # Start the required services
   docker-compose up -d
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

> **Note:** If you're migrating from Brew PostgreSQL, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed instructions.

## 🔍 Search Setup (Typesense)

The project uses Typesense for fast search functionality. Follow these steps to set it up:

### 1. Start Typesense

```bash
docker-compose up -d typesense
```

### 2. Setup Collections

```bash
pnpm typesense:setup
```

### 3. Sync Wine Data

```bash
pnpm typesense:sync
```

### 4. Test Setup

```bash
pnpm typesense:test
```

### 5. Full Setup (All Steps)

```bash
pnpm typesense:full
```

### Available Commands

- `pnpm typesense:setup` - Create Typesense collections
- `pnpm typesense:sync` - Sync wine data from Payload CMS
- `pnpm typesense:full` - Run both setup and sync
- `pnpm typesense:test` - Test Typesense functionality

### Automatic Sync

The system automatically syncs wine data to Typesense when:

- Flat wine variants are created or updated
- Flat wine variants are deleted

This is handled by hooks in the `FlatWineVariants` collection.

## 📝 Code Conventions

See [conventions.md](./conventions.md) for detailed coding standards and practices.

## 🧩 Components

### Media Component

A reusable image component that handles:

- Cloudflare Images integration
- Fallback to placeholder images
- Next.js Image optimization
- Fill and fixed dimension modes
- Error handling

Usage:

```tsx
<Media src="image-id" alt="Description" width={400} height={300} fill={false} priority={false} />
```

## 📄 License

MIT
