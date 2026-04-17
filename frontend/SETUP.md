# ✨ SportsStream React Frontend - Complete Setup Guide

## 🎯 What You Have

A complete **React + TypeScript + Tailwind + Vite** frontend for SportsStream, perfectly configured for Vercel deployment.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This installs:
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Zustand (state management)

### 2. Start Development Server

```bash
npm run dev
```

- Opens http://localhost:3000 automatically
- Hot reload enabled (changes appear instantly)
- TypeScript checking in background

### 3. Create Test Data

In another terminal:
```bash
# Backend must be running first
npm run dev  # in root directory

# Create a match
curl -X POST http://localhost:8000/matches \
  -H "Content-Type: application/json" \
  -d '{
    "sport": "football",
    "homeTeam": "FC Neon",
    "awayTeam": "Drizzle United",
    "startTime": "2026-04-17T14:00:00.000Z",
    "endTime": "2026-04-17T15:45:00.000Z"
  }'
```

### 4. Add Commentary

```bash
curl -X POST http://localhost:8000/matches/1/commentary \
  -H "Content-Type: application/json" \
  -d '{
    "minute": 15,
    "sequence": 1,
    "period": "1st half",
    "eventType": "goal",
    "actor": "Player Name",
    "team": "FC Neon",
    "message": "GOAL! Beautiful play!",
    "tags": ["goal"]
  }'
```

Watch it appear in real-time on http://localhost:3000! 🎉

## 📁 Project Structure Explained

```
frontend/
├── src/
│   ├── components/           # Reusable React components
│   │   ├── Sidebar.tsx      # Left navigation
│   │   ├── TopBar.tsx       # Connection status bar
│   │   ├── MatchCard.tsx    # Match card component
│   │   ├── MatchGrid.tsx    # Grid of match cards
│   │   └── Commentary.tsx   # Commentary feed
│   │
│   ├── pages/                # Full page components
│   │   ├── HomePage.tsx          # Dashboard
│   │   ├── LiveCenterPage.tsx    # Live matches only
│   │   ├── SchedulePage.tsx      # Match schedule
│   │   ├── WatchlistPage.tsx     # Your matches
│   │   ├── SettingsPage.tsx      # Configuration
│   │   └── MatchDetailsPage.tsx  # Match view
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useWebSocket.ts  # WebSocket management
│   │   └── useApi.ts        # REST API calls
│   │
│   ├── App.tsx              # Main app component (router)
│   ├── main.tsx             # React entry point
│   ├── store.ts             # Zustand state management
│   └── index.css            # Tailwind + global styles
│
├── index.html               # HTML template
├── package.json             # Dependencies & scripts
├── tailwind.config.js       # Tailwind theme config
├── vite.config.ts           # Vite build config
├── tsconfig.json            # TypeScript config
└── README.md                # Documentation
```

## 🏗️ Architecture

### State Management (Zustand)
```typescript
useStore() -> {
  matches: Map of all matches
  watchlist: Array of watched match IDs
  connectionState: WebSocket status
  subscriptions: Set of subscribed match IDs
}
```

### Hooks
- `useWebSocket()` - Manages WebSocket connection & messages
- `useApi()` - Fetches match data from REST API

### Pages
- Each page is a React component
- Pages call `useStore()` to read state
- Pages dispatch actions to update state

### Components
- Dumb components (just render props)
- Smart components (connect to store)
- Tailwind styling throughout

## 💻 Development Workflow

### Make a Change
Edit any file in `src/`:
```typescript
// src/components/MatchCard.tsx
export const MatchCard = ({ match }: MatchCardProps) => {
  // Your code here
}
```

### See It Instantly
Vite hot-reloads the page automatically. No refresh needed!

### Add TypeScript Support
All files have `.ts` or `.tsx` extension for type safety.

### Use Tailwind Classes
```typescript
<div className="flex gap-4 items-center p-6 bg-surface rounded-lg">
  Your content
</div>
```

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

Creates optimized `dist/` folder with:
- Minified JavaScript
- Optimized CSS
- Static assets
- Ready for any host

### Deploy to Vercel

#### Method 1: Git Integration (Recommended)
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Select your repo
5. Vercel auto-detects Vite
6. Click "Deploy"
7. Done! 🎉

#### Method 2: Vercel CLI
```bash
npm i -g vercel
vercel
```

#### Method 3: Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Then deploy anywhere that supports Docker.

## 🔌 Backend Connection

### Development
Backend expected at `http://localhost:8000` (configurable in Settings)

### Production
Update API URL in Settings tab to production backend URL

### CORS Note
Backend must have CORS enabled for frontend domain:
```javascript
// In backend src/index.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com']
}));
```

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#ff006e',        // Your color
  secondary: '#00d9ff',      // Your color
  // ...
}
```

### Add New Page
1. Create `src/pages/NewPage.tsx`
2. Add case to `App.tsx` switch statement
3. Add nav item to `Sidebar.tsx`
4. Done!

### Add New Component
1. Create `src/components/NewComponent.tsx`
2. Use in pages: `<NewComponent />`
3. TypeScript provides autocomplete!

## 🔧 Troubleshooting

### Blank Page After `npm run dev`
- Check port 3000 is free
- Browser console (F12) for errors
- Try: `npm run dev -- --force`

### WebSocket Errors
- Backend must be running
- Check API URL in Settings
- Check CORS headers

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### TypeScript Errors
- Save files (format on save enabled)
- Check `tsconfig.json` settings
- Restart VS Code if needed

## 📊 Performance

Vite provides:
- ⚡ Instant HMR (< 100ms)
- 🚀 Fast builds (seconds, not minutes)
- 📦 Optimized chunks
- 🎯 Tree-shaking for small bundles
- ✨ Modern JavaScript (no IE11 support, but smaller)

## 📱 Responsive Testing

Test on all breakpoints:
```javascript
// Tailwind breakpoints
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

Browser DevTools:
- F12 to open
- Ctrl+Shift+M for device toolbar
- Test iPhone, iPad, Android

## 🔐 Environment Variables (Optional)

Create `.env.local`:
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

Use in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## 🎯 Next Steps

1. ✅ Install: `npm install`
2. ✅ Start: `npm run dev`
3. ✅ Create test data via API
4. ✅ See real-time updates
5. 🚀 Build: `npm run build`
6. 🌍 Deploy: Push to Vercel

## 📞 Help & Resources

### Vite
- https://vitejs.dev/
- https://vitejs.dev/guide/

### React
- https://react.dev/
- https://react.dev/learn

### Tailwind CSS
- https://tailwindcss.com/
- https://tailwindcss.com/docs

### TypeScript
- https://www.typescriptlang.org/
- https://www.typescriptlang.org/docs/

### Vercel
- https://vercel.com/docs
- https://vercel.com/docs/concepts/git

## ✨ Features Summary

✅ Modern React with hooks
✅ Full TypeScript support
✅ Tailwind CSS styling
✅ Vite for fast development
✅ Zustand state management
✅ WebSocket real-time updates
✅ Multiple responsive pages
✅ Persistent localStorage
✅ Easy Vercel deployment
✅ Production-ready code

---

**You're all set!** Start building your real-time sports streaming platform! ⚡🏟️

