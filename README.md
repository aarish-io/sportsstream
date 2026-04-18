# SportsStream - Real-Time Sports Events Dashboard

A production-ready backend service for live sports coverage with WebSocket real-time streaming, rate limiting, and robust error handling.

## 📋 Table of Contents

1. ✨ [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 📡 [REST API](#rest-api)
6. 🔌 [WebSocket Protocol](#websocket-protocol)

## 🚨 Overview

This repository contains the backend implementation for a real-time sports streaming platform.

## <a name="introduction">✨ Introduction</a>

**SportsStream** is a comprehensive backend service designed for live sports coverage, utilizing REST endpoints for match and commentary management alongside WebSockets for real-time data broadcasting. The platform allows clients to monitor match lists and receive instantaneous score and play-by-play commentary updates through a robust streaming architecture that features heartbeats, rate limiting, and backpressure protection. 

By enforcing live-only updates and utilizing Zod schemas for strict input validation, SportsStream ensures a reliable and structured flow of information; additionally, the service includes dedicated seeding tools to simulate live game environments and facilitate development.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **Node.js**: Open-source, cross-platform JavaScript runtime environment.
- **Express.js**: Minimal and flexible Node.js web application framework.
- **PostgreSQL**: Powerful, open-source relational database system.
- **Drizzle ORM**: Lightweight and performant TypeScript ORM.
- **WebSockets (ws)**: Full-duplex communication channels over a single TCP connection.
- **Zod**: TypeScript-first schema declaration and validation library.
- **Arcjet**: Security-first tool for rate limiting and bot protection.

## <a name="features">🔋 Features</a>

👉 **Match Management**: Effortlessly list and create sports matches while maintaining accurate updates for scores and match statuses.

👉 **Commentary Management**: Access comprehensive play-by-play commentary tied to specific matches and add new entries to keep the coverage current.

👉 **Real-Time Broadcasts**: Deliver instant commentary and score updates via per-match WebSocket subscriptions, ensuring clients receive live data as it happens.

👉 **WebSocket Protocol**: Utilize a structured messaging system for subscribing, unsubscribing, and managing active subscriptions with automated ping responses.

👉 **Robust WS Behavior**: Maintain high performance and stability through the use of heartbeats, backpressure protection, rate limiting, and subscription caps.

👉 **Input Validation**: Ensure data integrity across both REST endpoints and WebSocket messages using strict Zod schemas.

👉 **Seed Tooling**: Rapidly populate matches and simulate live commentary and score changes with a dedicated script designed for testing and simulation.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/)

**Cloning the Repository**

```bash
git clone https://github.com/yourusername/sportsstream.git
cd sportsstream
```

**Installation**

```bash
npm install
```

**Set Up Environment Variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_postgresql_url
PORT=8000
HOST=0.0.0.0 
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
API_URL=http://localhost:8000
BROADCAST=1
DELAY_MS=250
MATCH_COUNT=0
```

**Running the Project**

```bash
npm run dev
```

Server runs at:
- HTTP: http://localhost:8000
- WS: ws://localhost:8000/ws

## Deployment (Render)

- Build Command: `npm install`
- Start Command: `npm start` (or `node src/index.js`)

If your service is configured to run `node index.js`, keep the root `index.js` file in the repository because it forwards startup to `src/index.js`.

## <a name="rest-api">📡 REST API</a>

### List matches
`GET /matches?limit=50`

### Create match
`POST /matches`

### List commentary for a match
`GET /matches/:id/commentary?limit=100`

### Create commentary for a match
`POST /matches/:id/commentary`

## <a name="websocket-protocol">🔌 WebSocket Protocol</a>

Connect: `ws://localhost:8000/ws`

### Client → Server Messages
- `{ "type": "subscribe", "matchId": 123 }`
- `{ "type": "unsubscribe", "matchId": 123 }`
- `{ "type": "setSubscriptions", "matchIds": [1, 2, 3] }`
- `{ "type": "ping" }`

### Server → Client Messages
- `{ "type": "welcome" }`
- `{ "type": "commentary", "data": { ... } }`
- `{ "type": "score_update", "data": { ... } }`
- `{ "type": "subscribed", "matchId": 123 }`
- `{ "type": "unsubscribed", "matchId": 123 }`
- `{ "type": "error", "error": "Invalid message", "details": { ... } }`
- `{ "type": "pong" }`

### Limits
- Max subscriptions per socket: 50
- Rate limit: 20 burst, 10 messages/sec
- Max message payload: 1 MB
- Backpressure: closes if buffered > 1 MB
