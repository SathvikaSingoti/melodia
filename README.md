# Melodia

A full-stack cloud music streaming web app.

## Project Structure
- `client/`: Next.js 14 App Router frontend.
- `server/`: Node.js + Express backend.

## How to Run

### Backend
1. `cd server`
2. Configure `.env` with `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, etc.
3. `npm run dev` (starts on port 5000)

### Frontend
1. `cd client`
2. Configure `.env.local`
3. `npm run dev` (starts on port 3000)
