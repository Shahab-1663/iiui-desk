# IIUI Student Desk

An IIUI-inspired student resource library for finding and sharing course materials. The app is built with Next.js App Router, React, TypeScript, Tailwind CSS, Motion, PostgreSQL, Drizzle ORM, Better Auth, and private Vercel Blob storage.

## Requirements

- Node.js 20.9 or newer
- A PostgreSQL database, such as Prisma Postgres provisioned through the Vercel Marketplace
- A Vercel Blob private store for file uploads

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and fill in the database URL, auth secret, and app URL.
3. Generate and apply the database migration with `npm run db:generate` and `npm run db:migrate`.
4. Set `NEXT_PUBLIC_AUTH_ENABLED=true` after the auth and database settings are ready.
5. Set `BLOB_READ_WRITE_TOKEN` for private document uploads and `ADMIN_EMAILS` for moderation accounts.
6. Start the app with `npm run dev`.

## Features

- Browse by IIUI faculty and search approved past papers, notes, assignments, and other resources.
- Create degree, course, and semester records as resources are contributed; upload forms use filenames to suggest metadata while allowing students to correct it.
- Sign in or register with email and password when account services are configured.
- Keep new uploads private and pending until an administrator approves them. Approved downloads require a signed-in account.
- Submit contact messages to the configured database.

The faculty directory follows the official IIUI faculties listing. Course records are community-created and should be checked against the university's current programme and course information. This is an independent student project and is not an official IIUI service.

## Deployment

Deploy the project root as a Next.js app on Vercel. Provision Prisma Postgres from the Vercel Marketplace and connect it to the project; the integration provides `DATABASE_URL`. Run the database migration against that database, create a private Blob store, and configure the remaining variables from `.env.example`. Never commit `.env.local` or provider tokens.

