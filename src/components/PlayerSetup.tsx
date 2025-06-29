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
      name: `プレイヤー${i + 1}`,
      nickname: playerNames[i] || undefined,
    }));
    setPlayers(players);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="game-title mb-4">🚗 ドライブプレイ</h1>
          <p className="text-gray-600 text-lg">2〜6人で楽しむドライブゲーム</p>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">👥 プレイヤー人数</h2>
          <div className="grid grid-cols-5 gap-3">
            {[2, 3, 4, 5, 6].map((count) => (
              <button
                key={count}
                onClick={() => handlePlayerCountChange(count)}
                className={`py-3 px-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-md ${
                  playerCount === count
                    ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg transform scale-105'
                    : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">✏️ ニックネーム（任意）</h2>
          <div className="space-y-3">
            {Array(playerCount).fill(null).map((_, i) => (
              <input
                key={i}
                type="text"
                placeholder={`プレイヤー${i + 1}のニックネーム`}
                value={playerNames[i] || ''}
                onChange={(e) => handleNameChange(i, e.target.value)}
                className="input-field"
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="btn-primary w-full text-xl"
        >
          🎮 ゲームスタート！
        </button>
      </div>
    </div>
  );
}
