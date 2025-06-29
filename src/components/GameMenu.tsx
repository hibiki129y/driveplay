'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';

export default function GameMenu() {
  const { gameState, setCurrentGame, resetGame } = useGameStore();
  const { players } = gameState;

  const playerDisplay = players.map(p => p.nickname || p.name).join(', ');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">DrivePlay</h1>
          <p className="text-gray-300 mb-4">Choose a game to play</p>
          <p className="text-sm text-gray-400">
            Players: {playerDisplay}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={() => setCurrentGame('talk-dice')}
            className="btn-primary w-full"
          >
            🎲 Talk Dice
            <span className="block text-sm font-normal mt-1 opacity-80">
              Random conversation starters
            </span>
          </button>

          <button
            onClick={() => setCurrentGame('ito')}
            className="btn-primary w-full"
          >
            🔢 Ito Game
            <span className="block text-sm font-normal mt-1 opacity-80">
              Guess the order of secret numbers
            </span>
          </button>
        </div>

        <button
          onClick={resetGame}
          className="btn-secondary w-full"
        >
          Change Players
        </button>
      </div>
    </div>
  );
}
