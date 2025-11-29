# AgencyRoom

AgencyRoom is a lightweight B2B SaaS MVP that provides a client portal and reporting tool for small marketing agencies.

## Project Structure
- `backend/` – NestJS REST API with Prisma + PostgreSQL
- `frontend/` – Next.js 14 frontend with Tailwind CSS

## Backend setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
4. Run Prisma migrations: `npx prisma migrate dev`
5. Start the API: `npm run start:dev` (listens on port 4000)
6. For a production-like run: `npm run build` then `npm run start`.

## Frontend setup
1. `cd frontend`
2. `npm install`
3. Set `NEXT_PUBLIC_API_URL` to your backend URL (e.g. `http://localhost:4000`).
4. Start the dev server: `npm run dev` (listens on port 3000)
5. For a production-like run: `npm run build` then `npm run start`.

## Usage
- Register a new agency via the frontend register page or `POST /auth/register-agency`.
- Create clients, projects, and reports as an agency owner/manager.
- Invite client users by creating users in the database with role `CLIENT` and `clientId` set; they can log in to view their projects and published reports.
