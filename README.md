# 🧩 Activities Manager — Fullstack CRUD App

A modern fullstack app to manage **activities**, **categories**, and **media**, built with:

- Next.js 15 (App Router)
- PostgreSQL
- Drizzle ORM
- Tailwind CSS
- React Hook Form + Zod
- TanStack Table
- ESLint + Prettier + Husky

---

## 📦 Features

- CRUD operations for:
  - ✅ Activities
  - ✅ Categories
  - ✅ Media
- Many-to-many relations:
  - Activities ↔ Media
  - Categories ↔ Media
  - Categories ↔ Activities
- Real-time assignment via checkboxes
- Form validation via Zod
- Responsive UI with TailwindCSS

---

## Getting Started

- Use latest Node version
- Stop all already running Docker containers

### 1. Clone the project

git clone https://github.com/MarynaSoufi/funkey.git

### 2. Install dependencies

`npm install`

### 3. Configure environment variables

Create a .env file in the root:

DATABASE_URL=postgres://postgres:postgres@localhost:5432/my_project_db

### 4. Run PostgreSQL with Docker

`npm run docker:up`

### 5. Migrate & Seed

- Generate migrations
  `npm run generate`

- Apply migrations
  `npm run migrate`

- Seed DB
  `npm run seed`

### 5. Run locally

`npm run dev`
