# SportsStream

A production-ready real-time sports streaming platform built with **Node.js**, **Express**, **WebSockets**, **React**, and **PostgreSQL**.

## 🎯 Overview

SportsStream is a full-stack application for live sports coverage with:
- **Real-time WebSocket streaming** of match scores and commentary
- **RESTful API** for match and commentary management
- **Production-grade security** with rate limiting and bot protection
- **Type-safe database** layer with Drizzle ORM
- **Modern frontend** with React 19, TypeScript, and Tailwind CSS

## 📦 Tech Stack

### Backend
- **Node.js** + **Express 5** - Server runtime & web framework
- **WebSockets (WS)** - Real-time bidirectional communication
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database layer
- **Zod** - Runtime schema validation
- **Arcjet** - Rate limiting & security

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tooling

## 🚀 Quick Start

### Prerequisites
```bash
- Node.js 18+
- npm or yarn
- PostgreSQL database (or use Neon)
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aarish-io/sportsstream.git
cd sportsstream
```

2. **Install dependencies**
```bash
npm install
cd frontend && npm install && cd ..
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Update `.env` with:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/sportsstream
PORT=8000
HOST=0.0.0.0
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
API_URL=http://localhost:8000
```

4. **Run database migrations**
```bash
npm run db:migrate
```

5. **Start the backend**
```bash
npm run dev
```

6. **Start the frontend** (in a new terminal)
```bash
cd frontend
npm run dev
```

7. **Seed with live data** (in another terminal)
```bash
npm run seed
```

Access the application at `http://localhost:3000`

## 📡 API Documentation

### REST Endpoints

#### Get Matches
```bash
GET /matches?limit=50
```

#### Create Match
```bash
POST /matches
Content-Type: application/json

{
  "sport": "football",
  "homeTeam": "Team A",
  "awayTeam": "Team B",
  "startTime": "2025-02-01T12:00:00Z",
  "endTime": "2025-02-01T14:00:00Z"
}
```

#### Get Commentary
```bash
GET /matches/:id/commentary?limit=100
```

#### Add Commentary
```bash
POST /matches/:id/commentary
Content-Type: application/json

{
  "minute": 45,
  "eventType": "goal",
  "actor": "Player Name",
  "team": "Team A",
  "message": "Goal! Amazing strike from the edge of the box."
}
```

#### Update Score
```bash
PATCH /matches/:id/score
Content-Type: application/json

{
  "homeScore": 2,
  "awayScore": 1
}
```

### WebSocket Protocol

**Connect:**
```
ws://localhost:8000/ws
```

**Client → Server:**
```json
{ "type": "subscribe", "matchId": 123 }
{ "type": "unsubscribe", "matchId": 123 }
{ "type": "ping" }
```

**Server → Client:**
```json
{ "type": "welcome" }
{ "type": "score_update", "matchId": 123, "data": { "homeScore": 1, "awayScore": 0 } }
{ "type": "commentary", "data": { "matchId": 123, "message": "..." } }
{ "type": "subscribed", "matchId": 123 }
{ "type": "unsubscribed", "matchId": 123 }
{ "type": "pong" }
{ "type": "error", "code": "...", "message": "..." }
```

## 📋 Available Scripts

```bash
# Backend
npm run dev           # Start with watch mode
npm start            # Start production server
npm run seed         # Seed database with live data
npm run db:migrate   # Run Drizzle migrations
npm run db:generate  # Generate migration files

# Frontend
cd frontend
npm run dev          # Start dev server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🏗️ Project Structure

```
websockets/
├── src/
│   ├── index.js           # Server entry point
│   ├── arcjet.js          # Security config
│   ├── db/
│   │   ├── db.js          # Database connection
│   │   └── schema.js      # Drizzle schema
│   ├── routes/
│   │   ├── matches.js     # Match endpoints
│   │   └── commentary.js  # Commentary endpoints
│   ├── ws/
│   │   └── server.js      # WebSocket server
│   ├── seed/
│   │   └── seed.js        # Data seeding script
│   ├── utils/
│   │   └── match-status.js
│   └── validation/
│       ├── matches.js
│       └── commentary.js
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── package.json
│   └── vite.config.ts
└── package.json
```

## 🔐 Security Features

- **Rate Limiting** - Arcjet rate limiting on REST & WebSocket endpoints
- **Bot Protection** - Blocks suspicious bot traffic
- **Input Validation** - Strict Zod schema validation
- **CORS** - Configured for localhost development

## 🚢 Deployment

### Deploy Backend to Vercel

1. Create a new Vercel project
2. Connect your GitHub repository
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Deploy Frontend to Vercel

Frontend is built and can be deployed separately:
```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel
```

## 💡 Key Features

✅ Real-time score updates via WebSocket
✅ Live commentary streaming
✅ Per-match subscriptions
✅ Automatic match status tracking
✅ Production-grade rate limiting
✅ Type-safe full-stack development
✅ Modern React frontend with Tailwind
✅ Database migrations with Drizzle

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the ISC License.

## 🙋 Support

For questions or issues:
- Open a GitHub issue
- Check existing documentation
- Review the API docs above

---

**Built with ❤️ for real-time sports streaming**
