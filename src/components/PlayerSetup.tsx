'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Player } from '@/types/game';

export default function PlayerSetup() {
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);
  const { setPlayers } = useGameStore();

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    const newNames = Array(count).fill('').map((_, i) => playerNames[i] || '');
    setPlayerNames(newNames);
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    const players: Player[] = Array(playerCount).fill(null).map((_, i) => ({
      id: `player-${i + 1}`,
      name: `Player ${i + 1}`,
      nickname: playerNames[i] || undefined,
    }));
    setPlayers(players);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">DrivePlay</h1>
          <p className="text-gray-300">Road trip games for 2-6 players</p>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Player Count</h2>
          <div className="grid grid-cols-5 gap-2">
            {[2, 3, 4, 5, 6].map((count) => (
              <button
                key={count}
                onClick={() => handlePlayerCountChange(count)}
                className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
                  playerCount === count
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Player Names (Optional)</h2>
          <div className="space-y-3">
            {Array(playerCount).fill(null).map((_, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Player ${i + 1} nickname`}
                value={playerNames[i] || ''}
                onChange={(e) => handleNameChange(i, e.target.value)}
                className="input-field"
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="btn-primary w-full"
        >
          Start Playing
        </button>
      </div>
    </div>
  );
}
