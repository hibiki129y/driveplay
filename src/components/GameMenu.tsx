'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import RecommendModal from './RecommendModal';

export default function GameMenu() {
  const { gameState, setCurrentGame, resetGame } = useGameStore();
  const { players } = gameState;
  const [showRecommendModal, setShowRecommendModal] = useState(false);

  const playerDisplay = players.map(p => p.nickname || p.name).join('、');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="game-title mb-4">🚗 ドライブプレイ</h1>
          <p className="text-gray-600 text-lg mb-4">ゲームを選んでください</p>
          <div className="bg-white/60 rounded-2xl p-3 shadow-md">
            <p className="text-sm text-gray-600">
              👥 参加者: {playerDisplay}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={() => setShowRecommendModal(true)}
            className="btn-secondary w-full"
          >
            🎲 おすすめ
            <span className="block text-sm font-normal mt-1 opacity-90">
              あなたにぴったりのゲームを見つけよう
            </span>
          </button>

          <button
            onClick={() => setCurrentGame('talk-dice')}
            className="btn-primary w-full"
          >
            🎲 トークダイス
            <span className="block text-sm font-normal mt-1 opacity-90">
              会話のきっかけを作ろう
            </span>
          </button>

          <button
            onClick={() => setCurrentGame('ito')}
            className="btn-primary w-full"
          >
            🔢 イトゲーム
            <span className="block text-sm font-normal mt-1 opacity-90">
              秘密の数字の順番を当てよう
            </span>
          </button>

          <button
            onClick={() => setCurrentGame('insider')}
            className="btn-primary w-full"
          >
            🕵️ インサイダーゲーム
            <span className="block text-sm font-normal mt-1 opacity-90">
              内通者を見つけ出そう
            </span>
          </button>
        </div>

        <button
          onClick={resetGame}
          className="btn-secondary w-full"
        >
          👥 プレイヤー変更
        </button>
      </div>

      <RecommendModal 
        isOpen={showRecommendModal} 
        onClose={() => setShowRecommendModal(false)} 
      />
    </div>
  );
}
