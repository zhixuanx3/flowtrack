# FlowTrack

A full-stack project management web application.

## Tech Stack

**Frontend**

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Redux Toolkit (auth state)
- React Hook Form + Zod (form validation)
- React Router v7
- Axios
- Sonner (toast notifications)
- Lucide React (icons)

**Backend**

- Node.js + Express 5
- TypeScript
- Prisma ORM + PostgreSQL
- JWT (access token auth via httpOnly cookies)
- Bcrypt (password hashing)
- Zod (request validation)

## Project Structure

```
flowtrack/
├── flowtrack-frontend/     # React app
│   └── src/
│       ├── api/            # Axios API calls
│       ├── components/     # Shared UI components
│       ├── layouts/        # App shell (sidebar, header)
│       ├── pages/          # Route pages
│       ├── schemas/        # Zod validation schemas
│       ├── store/          # Redux slices
│       └── utils/          # Helpers
│
└── flowtrack-backend/      # Express API
    └── src/
        ├── controllers/    # Route handlers (auth, org, project)
        ├── middleware/      # Auth middleware
        ├── prisma/          # Prisma schema and migrations
        ├── routes/          # Express routers
        └── services/        # Business logic
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL

### Backend

```bash
cd flowtrack-backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd flowtrack-frontend
npm install
npm run dev
```
