# 💣 Minesweeper Pro

The most beautiful, modern, and feature-rich Minesweeper game you've ever played!

Made completely by my background agent [Tembo](https://app.tembo.io/sign-up?utm_source=aarekaz&utm_id=aarekaz)

## ✨ Features

- **Stunning UI/UX**: Beautiful gradients, smooth animations, and modern design
- **Multiple Difficulty Levels**: Beginner, Intermediate, Expert, and Custom modes
- **Statistics Tracking**: Keep track of your wins, losses, best times, and streaks
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Advanced Gameplay**: Supports chord clicking (middle mouse button) for faster gameplay
- **Local Storage**: Your stats are saved automatically

## 🎮 How to Play

- **Left Click**: Reveal a cell
- **Right Click**: Place a flag or question mark
- **Middle Click** (or Shift + Left Click): Chord reveal (reveal all neighbors if flags match)

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Then open your browser to the URL shown (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎯 Game Rules

1. The goal is to clear the board without detonating any mines
2. Numbers indicate how many mines are adjacent to that cell
3. Use flags to mark cells you think contain mines
4. Win by revealing all non-mine cells or correctly flagging all mines

## 🛠️ Tech Stack

- **React 18**: Modern UI framework
- **TypeScript**: Type-safe code
- **Vite**: Lightning-fast build tool
- **CSS3**: Custom animations and gradients
- **Local Storage API**: For persistent statistics

## 📱 Responsive Design

The game automatically adapts to your screen size, providing an optimal experience on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 Design Philosophy

This Minesweeper implementation focuses on:
- **Visual Excellence**: Gradient backgrounds, smooth animations, and modern aesthetics
- **User Experience**: Intuitive controls and immediate feedback
- **Performance**: Optimized rendering and state management
- **Accessibility**: Clear visual indicators and responsive touch targets

## 🏆 Features in Detail

### Statistics Tracking
- Games played, won, and lost
- Win rate percentage
- Best completion time
- Current winning streak
- Longest winning streak

### Difficulty Levels
- **Beginner**: 9×9 grid with 10 mines
- **Intermediate**: 16×16 grid with 40 mines
- **Expert**: 16×30 grid with 99 mines
- **Custom**: Create your own challenge!

### Smart First Click
The first cell you click will never be a mine, and the game ensures a safe starting area.

## 📄 License

MIT License - Feel free to use this code for your own projects!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using React, TypeScript, and Vite
