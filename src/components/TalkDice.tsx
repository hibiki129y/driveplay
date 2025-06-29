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
        <div className="text-white">Loading topics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🎲 Talk Dice</h1>
          <p className="text-gray-300">Conversation starter</p>
        </div>

        <div className="card mb-6 text-center">
          <div className="text-lg text-white leading-relaxed min-h-[100px] flex items-center justify-center">
            {talkDiceData.currentTopic}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <button
            onClick={handleNextTopic}
            className="btn-primary w-full"
          >
            Next Topic
          </button>

          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="btn-secondary w-full"
            >
              Add Custom Topic
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter your custom topic..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="input-field"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTopic()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddCustomTopic}
                  className="btn-primary flex-1"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomTopic('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => setCurrentGame(null)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Menu
          </button>
        </div>

        <div className="text-center mt-4 text-sm text-gray-500">
          Topics used: {talkDiceData.usedTopics.length}
        </div>
      </div>
    </div>
  );
}
