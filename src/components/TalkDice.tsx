'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TalkDiceState } from '@/types/game';

interface Topic {
  id: number;
  text: string;
  category: string;
}

export default function TalkDice() {
  const { gameState, setGameData, updateGameData, setCurrentGame } = useGameStore();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const talkDiceData = gameState.gameData as TalkDiceState | null;

  useEffect(() => {
    fetch('/talk_topics.json')
      .then(res => res.json())
      .then(data => setTopics(data.topics))
      .catch(err => console.error('Failed to load topics:', err));
  }, []);

  const getRandomTopic = useCallback((): string => {
    const availableTopics = [
      ...topics.filter(t => !talkDiceData?.usedTopics.includes(t.text)),
      ...(talkDiceData?.customTopics || []).filter(t => !talkDiceData?.usedTopics.includes(t))
    ];
    
    if (availableTopics.length === 0) {
      return topics[Math.floor(Math.random() * topics.length)]?.text || 'Tell us about your day!';
    }
    
    const randomIndex = Math.floor(Math.random() * availableTopics.length);
    return typeof availableTopics[randomIndex] === 'string' 
      ? availableTopics[randomIndex] as string
      : (availableTopics[randomIndex] as Topic).text;
  }, [topics, talkDiceData]);

  useEffect(() => {
    if (!talkDiceData && topics.length > 0) {
      const randomTopic = getRandomTopic();
      setGameData({
        currentTopic: randomTopic,
        usedTopics: [randomTopic],
        customTopics: [],
      });
    }
  }, [topics, talkDiceData, setGameData, getRandomTopic]);


  const handleNextTopic = () => {
    const newTopic = getRandomTopic();
    updateGameData({
      currentTopic: newTopic,
      usedTopics: [...(talkDiceData?.usedTopics || []), newTopic],
    });
  };

  const handleAddCustomTopic = () => {
    if (customTopic.trim()) {
      updateGameData({
        customTopics: [...(talkDiceData?.customTopics || []), customTopic.trim()],
      });
      setCustomTopic('');
      setShowCustomInput(false);
    }
  };

  if (!talkDiceData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">トピックを読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="game-title mb-4">🎲 トークダイス</h1>
          <p className="text-gray-600 text-lg">会話のきっかけを作ろう</p>
        </div>

        <div className="card mb-6 text-center">
          <div className="text-lg text-gray-800 leading-relaxed min-h-[100px] flex items-center justify-center font-medium">
            {talkDiceData.currentTopic}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <button
            onClick={handleNextTopic}
            className="btn-primary w-full"
          >
            🔄 次のトピック
          </button>

          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="btn-secondary w-full"
            >
              ➕ オリジナルトピック追加
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="オリジナルトピックを入力してください..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="input-field"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTopic()}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAddCustomTopic}
                  className="btn-primary flex-1"
                >
                  ✅ 追加
                </button>
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomTopic('');
                  }}
                  className="btn-secondary flex-1"
                >
                  ❌ キャンセル
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => setCurrentGame(null)}
            className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
          >
            ← メニューに戻る
          </button>
        </div>

        <div className="text-center mt-4">
          <div className="bg-white/60 rounded-2xl p-3 shadow-md inline-block">
            <p className="text-sm text-gray-600">
              使用済みトピック: {talkDiceData.usedTopics.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
