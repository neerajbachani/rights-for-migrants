This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Bull Board Setup

This project includes Bull Board configuration for monitoring Bull queues via a NestJS-style setup.

Configuration
- Route: `/admin/queues`
- Enabled: non-production environments only (!environment.production)
- Mode: read-only

Files
- lib/bull-board/setup.ts contains the configuration and helpers
- lib/environment.ts exposes the `environment.production` flag used to enable/disable the route

Usage in a NestJS backend
- Import the module only in non-production environments:
  - import { BullBoardRootModule, createExpressBullBoardAdapter, bullBoardConfig } from '@/lib/bull-board/setup';
- The module is configured with base path `/admin/queues` and uses the Express adapter.
- To enforce read-only mode when using the Express adapter directly:
  - const adapter = createExpressBullBoardAdapter();

Environment
- NODE_ENV=development  # Bull Board enabled
- NODE_ENV=production   # Bull Board disabled
