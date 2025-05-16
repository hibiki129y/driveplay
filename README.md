# DrivePlay

DrivePlay is a multiplayer mini-game platform for drivers and passengers to enjoy together in a car. It uses smartphone browsers and progresses through voice, taps, and simple UI.

## Project Structure

This is a monorepo with:
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + Socket.io

## Features

- **Home Screen:** Scene selection, number of participants selection, and game selection
- **Room Creation:** Room ID generation, QR code display, and game selection
- **Room Participation:** Room code input or QR code reading, and nickname input
- **Game (Intro Don):** Host (driver) terminal and player terminal with different functionalities

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend/driveplay-frontend
npm install

# Install backend dependencies
cd ../../backend
npm install
```

### Running the Application

From the root directory:

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run them separately
npm run dev:frontend
npm run dev:backend
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Safety Control

- The host (driver) terminal disables click operations after the game starts and assumes only voice progress.
- The player terminal allows full functionality such as tapping/input.
