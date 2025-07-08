'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import PlayerSetup from '@/components/PlayerSetup';
import RoomSetup from '@/components/RoomSetup';
import GameMenu from '@/components/GameMenu';
import TalkDice from '@/components/TalkDice';
import ItoGame from '@/components/ItoGame';
import InsiderGame from '@/components/InsiderGame';

export default function Home() {
  const { gameState } = useGameStore();
  const { players, currentGame } = gameState;
  const [mode, setMode] = useState<'single' | 'multi' | null>(null);

  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="game-title mb-4">🚗 ドライブプレイ</h1>
            <p className="text-gray-600 text-lg">プレイモードを選択してください</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setMode('single')}
              className="btn-primary w-full"
            >
              📱 シングルデバイス
              <span className="block text-sm font-normal mt-1 opacity-90">
                1台の端末で順番にプレイ
              </span>
            </button>

            <button
              onClick={() => setMode('multi')}
              className="btn-secondary w-full"
            >
              🌐 マルチプレイヤー
              <span className="block text-sm font-normal mt-1 opacity-90">
                オンラインでリアルタイム同期
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'multi') {
    return <RoomSetup />;
  }

  if (players.length === 0) {
    return <PlayerSetup />;
  }

  if (!currentGame) {
    return <GameMenu />;
  }

  if (currentGame === 'talk-dice') {
    return <TalkDice />;
  }

  if (currentGame === 'ito') {
    return <ItoGame />;
  }

  if (currentGame === 'insider') {
    return <InsiderGame />;
  }

  return <GameMenu />;
}
