# DrivePlay - Road Trip Games

A mobile-first web application for road trip group games, designed for 2-6 players using a single device passed around. Features Talk Dice (conversation prompts) and an Ito-like game (secret number matching).

## 🚀 Live Demo

**Deployed Application:** https://driveplaygameapp-aezhfuww.devinapps.com

## 🎮 Features

### Core Games
- **Talk Dice**: Random conversation starters with 50+ topics in Japanese and English
- **Ito Game**: Cooperative number guessing game where players match words to secret numbers (1-100)

### Key Features
- **Mobile-First Design**: Optimized for touch interactions and single-device gameplay
- **PWA Support**: Install as an app, works offline
- **State Persistence**: Game progress saved in localStorage
- **Privacy Screens**: Secure number reveals between players
- **Responsive UI**: Works on all screen sizes
- **Confetti Animation**: Celebrates 80%+ accuracy in Ito game

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **Deployment**: Vercel
- **PWA**: Service Worker for offline functionality

## 🎯 How to Play

### Talk Dice
1. Set up 2-6 players with optional nicknames
2. Select "Talk Dice" from the game menu
3. Read the conversation prompt aloud
4. Discuss as a group, then tap "Next Topic"
5. Add custom topics if desired

### Ito Game
1. Set up 2-6 players with optional nicknames
2. Select "Ito Game" from the game menu
3. Enter a theme (e.g., "Things that are hot")
4. Each player secretly views their number (1-100)
5. Players enter words/phrases matching their number's magnitude
6. Cooperatively sort the cards from smallest to largest
7. Reveal numbers and see your accuracy score!

## 🚀 Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/hibiki129y/driveplay.git
cd driveplay

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production
```bash
# Build the application
npm run build

# The static files will be in the 'out' directory
```

## 📱 PWA Installation

### On Mobile (iOS/Android)
1. Open the app in your mobile browser
2. Look for "Add to Home Screen" option
3. Follow the prompts to install

### On Desktop
1. Open the app in Chrome/Edge
2. Look for the install icon in the address bar
3. Click to install as a desktop app

## 🏗 Architecture

The application follows a component-based architecture:

```
src/
├── components/          # React components
│   ├── PlayerSetup.tsx  # Player configuration
│   ├── GameMenu.tsx     # Game selection
│   ├── TalkDice.tsx     # Talk Dice game
│   └── ItoGame.tsx      # Ito-like game
├── store/               # State management
│   └── gameStore.ts     # Zustand store
├── types/               # TypeScript types
│   └── game.ts          # Game interfaces
└── app/                 # Next.js app router
    ├── layout.tsx       # Root layout with PWA
    ├── page.tsx         # Main app component
    └── globals.css      # Global styles
```

## 🎨 Design System

- **Colors**: Dark theme with blue accents
- **Typography**: Clean, readable fonts
- **Buttons**: Large, touch-friendly buttons
- **Cards**: Rounded corners with subtle shadows
- **Animations**: Smooth transitions and confetti effects

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build and test
npm run build
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Link to Devin run:** https://app.devin.ai/sessions/9540b13cf6304c369117b71676cc6b55  
**Requested by:** @hibiki129y
