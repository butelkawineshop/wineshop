# Butelka Wineshop

A modern e-commerce platform for fine wines, built with Next.js and Payload CMS.

## 🚀 Features

- Next.js 15 with App Router
- Payload CMS for content management
- Cloudflare Images for optimized image delivery
- TypeScript for type safety
- Tailwind CSS for styling
- i18n support (Slovenian/English)

## 🛠 Tech Stack

- **Framework:** Next.js 15
- **CMS:** Payload CMS
- **Database:** PostgreSQL
- **Image Delivery:** Cloudflare Images
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Data Fetching:** TanStack React Query
- **Authentication:** NextAuth.js
- **Email:** Resend
- **Caching:** Redis (optional)

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
   ```
4. Run the development server:
   ```bash
   pnpm dev
   ```

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
