'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { recommend, RecommendInput } from '@/utils/recommend';
import { GameMeta } from '@/data/gamesMeta';

interface RecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecommendModal({ isOpen, onClose }: RecommendModalProps) {
  const { gameState, setCurrentGame } = useGameStore();
  const { players } = gameState;
  
  const [input, setInput] = useState<RecommendInput>({
    players: players.length,
    mood: 'party',
    style: 'coop',
    cognition: 'medium'
  });
  
  const [recommendations, setRecommendations] = useState<GameMeta[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleRecommend = () => {
    const results = recommend(input);
    setRecommendations(results);
    setShowResults(true);
  };

  const handleGameSelect = (gameId: GameMeta['id']) => {
    const gameMap = {
      'talk-dice': 'talk-dice' as const,
      'ito': 'ito' as const,
      'insider': 'insider' as const
    };
    setCurrentGame(gameMap[gameId]);
    onClose();
  };

  const handleBack = () => {
    setShowResults(false);
    setRecommendations([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {!showResults ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🎲 おすすめゲーム</h2>
              <p className="text-gray-600">あなたにぴったりのゲームを見つけよう</p>
            </div>

            <div className="space-y-6">
              {/* Player Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👥 プレイヤー人数
                </label>
                <div className="bg-gray-100 rounded-xl p-3 text-center">
                  <span className="text-lg font-bold text-gray-800">{input.players}人</span>
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  😌 気分・雰囲気
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'relax' as const, label: '😌 リラックス' },
                    { value: 'party' as const, label: '🎉 盛り上がりたい' },
                    { value: 'serious' as const, label: '🧐 真剣' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setInput(prev => ({ ...prev, mood: option.value }))}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        input.mood === option.value
                          ? 'bg-pink-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🤝 協力 vs 競争
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'coop' as const, label: '🤝 協力' },
                    { value: 'competitive' as const, label: '⚔️ 競争' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setInput(prev => ({ ...prev, style: option.value }))}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        input.style === option.value
                          ? 'bg-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cognition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🧠 知的負荷レベル
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'low' as const, label: '低' },
                    { value: 'medium' as const, label: '中' },
                    { value: 'high' as const, label: '高' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setInput(prev => ({ ...prev, cognition: option.value }))}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        input.cognition === option.value
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleRecommend}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg"
              >
                おすすめを見る
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🎯 おすすめゲーム</h2>
              <p className="text-gray-600">あなたにぴったりのゲームです</p>
            </div>

            <div className="space-y-4">
              {recommendations.map((game, index) => (
                <button
                  key={game.id}
                  onClick={() => handleGameSelect(game.id)}
                  className="w-full p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-2 border-transparent hover:border-pink-300 transition-all shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{game.emoji}</div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-gray-800 text-lg">{game.name}</h3>
                      <p className="text-gray-600 text-sm">{game.description}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {game.minPlayers}-{game.maxPlayers}人 • {
                          game.style === 'coop' ? '協力' : '競争'
                        } • {
                          game.cognition === 'low' ? '軽め' : 
                          game.cognition === 'medium' ? '普通' : '重め'
                        }
                      </p>
                    </div>
                    {index === 0 && (
                      <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                        おすすめ
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleBack}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                戻る
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg"
              >
                閉じる
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
