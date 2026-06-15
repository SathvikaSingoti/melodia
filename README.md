<div align="center">

# 🎵 Melodia

### AI-powered cloud music streaming — built with vibecoding

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-blue?style=flat-square&logo=google)](https://deepmind.google/gemini)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

**[🚀 Live Demo](https://project-nkv6d.vercel.app)** · **[📋 Notion Docs](https://app.notion.com/p/Melodia-Cloud-Music-Smart-Playlist-Companion-379b4fe8aeae8067a773f56564ea659e?source=copy_link)** · **[🎬 Demo Video](your-video-link)**

### Melodia Preview 
<img width="953" height="503" alt="Screenshot 2026-06-15 052445" src="https://github.com/user-attachments/assets/d531f5a4-604a-4126-a42f-e6613a73b747" />

</div>

---

## What is Melodia?

Melodia is a full-stack cloud music streaming web app built as part of the **Xebia Vibecoding Internship**. It streams real licensed music via the Jamendo API, generates AI-curated playlists using **Gemini 2.5 Flash**, and features a DAW-style audio player with waveform visualization.

> Built entirely through AI-assisted development — every prompt logged in Notion.

---

## ✨ Features

### 🤖 AI-Powered
- **Smart Playlist** — type any vibe ("3am can't sleep", "gym motivation") and Gemini curates a perfect playlist from the catalog
- **Song Radio** — start a radio from any song, AI picks 10 songs with matching energy
- **Mood of the Day** — auto-filters your feed based on a daily mood

### 🎵 Music
- Stream 200+ real licensed tracks via Jamendo API
- Full player with play/pause, seek, next/prev, shuffle, repeat
- Crossfade between songs (adjustable 1-8s)
- Queue management with Play Next

### 🎛️ DAW Player
- Full-screen immersive mode
- CSS waveform visualization with seek
- Loop A→B markers
- Playback speed control (0.5x to 1.5x)

### 📚 Library
- Like songs, create playlists, manage library
- Dynamic playlist cover collages (1, 2, or 4-grid)
- AI Generated playlist badge
- Follow artists

### 🔍 Discovery
- Browse by genre, mood, trending, new releases
- Live search with Artist/Genre/Duration filters
- Artist pages with bio and discography
- Album pages

### 📊 Personal Insights
- **Time Machine** — chronological listening history with heatmap
- **Stats** — top songs, artists, genre breakdown, listening streak
- All data is real and user-specific

### ⚡ UX
- `Cmd+K` command palette — navigate, play, generate playlists by typing
- Keyboard shortcuts (`Space`, `N`, `L`, `S`, `R` and more)
- Mini floating player
- Toast notifications throughout
- No scrollbars anywhere

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| State | Zustand (player), Context API (auth) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT, Bcrypt, Google OAuth (Passport.js) |
| Audio | Howler.js + Jamendo API |
| AI | Google Gemini 2.5 Flash |
| Storage | Firebase Storage |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Jamendo API key
- Google Gemini API key
- Google OAuth credentials
- Firebase project

### Installation

```bash
# Clone frontend
git clone https://github.com/SathvikaSingoti/melodia-client.git

# Clone backend  
git clone https://github.com/SathvikaSingoti/melodia-server.git

# Install server dependencies
cd server
npm install
cp .env.example .env
# Fill in your env variables

# Install client dependencies
cd ../client
npm install
cp .env.local.example .env.local
# Fill in your env variables

# Seed the database
cd ../server
node scripts/seedJamendo.js

# Start development servers
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

### Environment Variables

**server/.env**
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_key

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

JAMENDO_CLIENT_ID=your_jamendo_client_id

CLIENT_URL=http://localhost:3000

**client/.env.local**
NEXT_PUBLIC_API_URL=http://localhost:5000/api

NEXT_PUBLIC_CLIENT_URL=http://localhost:3000

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket

NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

---

## 📁 Project Structure

melodia-client/

src/

├── app/          # App Router pages

├── components/   

├── store/        # Zustand player store

└── context/      # Auth context

melodia-server/

├── routes/

├── controllers/

├── models/

├── middleware/

└── scripts/      # DB seed scripts

---

## 🎨 Design

Melodia uses a custom **Autumn Fog** color palette:
- Background: `#0e0d0d`
- Accent: `#c4a090` (warm clay)
- Secondary: `#a88070` (deeper copper)
- Text: `#ede8e4`

---

## 📖 Documentation

All documentation lives in Notion:
- [PRD](https://app.notion.com/p/Product-Requirements-Document-PRD-379b4fe8aeae80918248c9595881b6cc?source=copy_link)
- [Tech Doc](https://app.notion.com/p/Technical-Documentation-379b4fe8aeae802f9891eef07b8e06e4?source=copy_link)
- [API Docs](https://app.notion.com/p/37ab4fe8aeae80538ff2c4ea1a09f93f?v=37ab4fe8aeae80c3a07a000c8886bdec&source=copy_link)
- [Prompt Log](https://app.notion.com/p/37ab4fe8aeae809bac93cecebf25025c?v=37ab4fe8aeae80238f6c000c9b934c0b&source=copy_link)
- [Setup and Running Guide](https://app.notion.com/p/Setup-Running-Guide-37fb4fe8aeae80898f86de4b65367fea?source=copy_link)
- [Deployment Notes](https://app.notion.com/p/Deployment-Notes-37fb4fe8aeae808b877dd164f268cad1?source=copy_link)
- [System Architecture](https://app.notion.com/p/System-Architecture-37fb4fe8aeae809db349d425746dc472?source=copy_link)

---

## 🤖 Built with vibecoding

Melodia was developed using AI-assisted development 
as part of the Xebia Vibecoding Internship — 
where the focus shifts from writing every line 
to directing AI tools effectively through 
architecture decisions, prompt engineering, 
and output verification.

Tools: Antigravity · Stitch · GitHub Copilot · 
Claude · Notion MCP

Every prompt is logged in the 
[Notion Prompt Log](https://app.notion.com/p/37ab4fe8aeae809bac93cecebf25025c?v=37ab4fe8aeae80238f6c000c9b934c0b&source=copy_link).

---

## 👩‍💻 Built By

**Sathvika Singoti** — Xebia Internship 2026

---

<div align="center">
Made with 🍂 and a lot of AI prompts
</div>
