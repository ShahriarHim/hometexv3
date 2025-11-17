# Hometex Bangladesh Web App

Modern ecommerce experience for Hometex Bangladesh, powered by Next.js 16 (App Router), React 18, Tailwind CSS, shadcn/ui, and TanStack Query.

## Getting Started

```sh
git clone <repo-url>
cd hometexV3
npm install
npm run dev
```

- Local dev server listens on `https://localhost:3000`
- `npm run build` generates the production bundle
- `npm run start` serves the optimized standalone build locally

## Project Structure

- `src/app` – Next.js App Router layouts, pages, metadata, and providers
- `src/views` – client-side screen modules consumed by the App Router
- `src/components` – shared UI primitives (shadcn/ui + custom layout)
- `src/context` – client providers for cart, wishlist, auth, and orders
- `src/lib` & `src/data` – utilities, mock APIs, and demo catalog data
- `public` – static assets (favicons, OG images, robots, etc.)

## Deployment

The project builds as a Next.js standalone output. Deploy the `.next/standalone` bundle (or use `next start`) on Vercel, Netlify, Cloudflare, Fly.io, or any Node 18+ environment behind your preferred CDN.*** End Patch
