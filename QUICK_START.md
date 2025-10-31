# ⚡ Quick Start Guide

## 30-Second Setup

```bash
npm install && npm run dev
```

Open http://localhost:5173 and play! 🎮

## First Time Setup (5 minutes)

### 1. Prerequisites
- Node.js 16+ (check with `node --version`)
- npm (comes with Node.js)

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
or
```bash
./start.sh
```

### 4. Open Browser
Visit: http://localhost:5173

## Game Controls

| Action | Control |
|--------|---------|
| Reveal cell | Left click |
| Flag/unflag | Right click |
| Question mark | Right click twice |
| Chord reveal | Middle click on revealed number |
| New game | Click the face button |
| Change difficulty | Click ⚙️ icon |
| View stats | Click 📊 icon |

## Project Commands

```bash
# Development
npm run dev          # Start dev server (hot reload)

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Quick Start
./start.sh           # Auto-install and run
```

## File Structure (Quick Ref)

```
minesweeper-pro/
├── src/
│   ├── components/       # React components
│   ├── hooks/           # Custom hooks
│   ├── types/           # TypeScript types
│   ├── utils/           # Game logic
│   ├── App.tsx          # Main app
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── dist/                # Build output
└── docs (*.md)          # Documentation
```

## Common Tasks

### Change Difficulty
1. Click ⚙️ button in header
2. Select difficulty level
3. Click "Start Game"

### View Statistics
1. Click 📊 button in header
2. View your game stats
3. Close modal

### Reset Game
Click the face button in the center of the header

### Build for Production
```bash
npm run build
# Output in dist/ folder
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Click | Reveal cell |
| Right-click | Flag cell |
| Middle-click | Chord reveal |
| Shift+Click | Alternative chord |

## Troubleshooting

### Port 5173 already in use?
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9
# Or change port in vite.config.ts
```

### Dependencies not installing?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build failing?
```bash
# Clean build
rm -rf dist
npm run build
```

### Game not loading?
1. Check browser console (F12)
2. Clear browser cache
3. Try different browser

## Tips & Tricks

### For Beginners
1. Start with Beginner difficulty
2. Numbers show adjacent mine count
3. Use flags to mark suspected mines
4. First click is always safe!

### For Advanced Players
1. Use middle-click chord reveals
2. Learn number patterns
3. Track remaining mine count
4. Try to beat your best time!

## Next Steps

1. ✅ Play the game
2. ✅ Check statistics
3. ✅ Try different difficulties
4. ✅ Read [FEATURES.md](FEATURES.md) for detailed features
5. ✅ See [DEPLOYMENT.md](DEPLOYMENT.md) to deploy online

## Support

- 📖 Full docs: [README.md](README.md)
- 🎨 Design guide: [VISUAL_DESIGN.md](VISUAL_DESIGN.md)
- 🚀 Deploy guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- 📊 Feature list: [FEATURES.md](FEATURES.md)

## One-Liner Start

Already have Node.js? Just run:
```bash
git clone <repo> && cd minesweeper-pro && npm i && npm run dev
```

---

**Have fun!** 🎉
