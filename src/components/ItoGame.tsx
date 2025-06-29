'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ItoGameState } from '@/types/game';

export default function ItoGame() {
  const { gameState, setGameData, updateGameData, setCurrentGame } = useGameStore();
  const [theme, setTheme] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [showPrivacyScreen, setShowPrivacyScreen] = useState(false);

  const itoData = gameState.gameData as ItoGameState | null;
  const { players } = gameState;

  useEffect(() => {
    if (!itoData) {
      setGameData({
        theme: '',
        playerNumbers: {},
        playerWords: {},
        currentPhase: 'theme-input',
        currentPlayerIndex: 0,
        sortedCards: [],
        timeRemaining: 60,
        isTimerActive: false,
      });
    }
  }, [itoData, setGameData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (itoData?.isTimerActive && itoData.timeRemaining > 0) {
      interval = setInterval(() => {
        updateGameData({ timeRemaining: itoData.timeRemaining - 1 });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [itoData?.isTimerActive, itoData?.timeRemaining, updateGameData]);

  const startGame = () => {
    if (!theme.trim()) return;

    const playerNumbers: Record<string, number> = {};
    const usedNumbers = new Set<number>();
    
    players.forEach(player => {
      let number;
      do {
        number = Math.floor(Math.random() * 100) + 1;
      } while (usedNumbers.has(number));
      usedNumbers.add(number);
      playerNumbers[player.id] = number;
    });

    updateGameData({
      theme: theme.trim(),
      playerNumbers,
      currentPhase: 'number-reveal',
      currentPlayerIndex: 0,
    });
  };

  const showNextPlayerNumber = () => {
    if (!itoData) return;
    
    if (itoData.currentPlayerIndex < players.length - 1) {
      updateGameData({ currentPlayerIndex: itoData.currentPlayerIndex + 1 });
      setShowPrivacyScreen(true);
    } else {
      updateGameData({
        currentPhase: 'word-input',
        currentPlayerIndex: 0,
        timeRemaining: 60,
        isTimerActive: true,
      });
      setShowPrivacyScreen(true);
    }
  };

  const submitWord = () => {
    if (!itoData || !currentWord.trim()) return;

    const currentPlayer = players[itoData.currentPlayerIndex];
    const newPlayerWords = {
      ...itoData.playerWords,
      [currentPlayer.id]: currentWord.trim(),
    };

    if (itoData.currentPlayerIndex < players.length - 1) {
      updateGameData({
        playerWords: newPlayerWords,
        currentPlayerIndex: itoData.currentPlayerIndex + 1,
        timeRemaining: 60,
      });
      setCurrentWord('');
      setShowPrivacyScreen(true);
    } else {
      const cards = players.map(player => ({
        playerId: player.id,
        word: newPlayerWords[player.id] || '',
      }));
      
      updateGameData({
        playerWords: newPlayerWords,
        currentPhase: 'sorting',
        sortedCards: cards,
        isTimerActive: false,
      });
      setCurrentWord('');
    }
  };

  const moveCard = (fromIndex: number, toIndex: number) => {
    if (!itoData) return;
    
    const newCards = [...itoData.sortedCards];
    const [movedCard] = newCards.splice(fromIndex, 1);
    newCards.splice(toIndex, 0, movedCard);
    
    updateGameData({ sortedCards: newCards });
  };

  const revealResults = () => {
    if (!itoData) return;
    
    updateGameData({ currentPhase: 'results' });
  };

  const calculateAccuracy = () => {
    if (!itoData) return 0;
    
    const actualOrder = itoData.sortedCards.map(card => 
      itoData.playerNumbers[card.playerId]
    );
    
    const correctOrder = [...actualOrder].sort((a, b) => a - b);
    
    let correctPositions = 0;
    for (let i = 0; i < actualOrder.length; i++) {
      if (actualOrder[i] === correctOrder[i]) {
        correctPositions++;
      }
    }
    
    return Math.round((correctPositions / actualOrder.length) * 100);
  };

  const resetGame = () => {
    setGameData({
      theme: '',
      playerNumbers: {},
      playerWords: {},
      currentPhase: 'theme-input',
      currentPlayerIndex: 0,
      sortedCards: [],
      timeRemaining: 60,
      isTimerActive: false,
    });
    setTheme('');
    setCurrentWord('');
    setShowPrivacyScreen(false);
  };

  if (!itoData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading game...</div>
      </div>
    );
  }

  if (itoData.currentPhase === 'theme-input') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">🔢 Ito Game</h1>
            <p className="text-gray-300">Enter a theme for the game</p>
          </div>

          <div className="card mb-6">
            <label className="block text-white text-lg font-semibold mb-4">
              Theme (e.g., &quot;Things that are hot&quot;, &quot;Scary things&quot;)
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Enter your theme..."
              className="input-field mb-4"
              onKeyPress={(e) => e.key === 'Enter' && startGame()}
            />
            <button
              onClick={startGame}
              disabled={!theme.trim()}
              className={`w-full py-4 px-8 rounded-lg text-lg font-bold transition-colors ${
                theme.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Start Game
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentGame(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (itoData.currentPhase === 'number-reveal') {
    const currentPlayer = players[itoData.currentPlayerIndex];
    const playerNumber = itoData.playerNumbers[currentPlayer.id];

    if (showPrivacyScreen) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
          <div className="w-full max-w-md text-center">
            <div className="card mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Pass to Next Player</h2>
              <p className="text-gray-300 mb-4">
                Hand the device to{' '}
                <span className="font-semibold text-white">
                  {currentPlayer.nickname || currentPlayer.name}
                </span>
              </p>
              <button
                onClick={() => setShowPrivacyScreen(false)}
                className="btn-primary"
              >
                I&apos;m Ready
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
        <div className="w-full max-w-md text-center">
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              {currentPlayer.nickname || currentPlayer.name}
            </h2>
            <p className="text-gray-300 mb-6">Your secret number is:</p>
            <div className="text-6xl font-bold text-blue-400 mb-6">
              {playerNumber}
            </div>
            <p className="text-gray-300 mb-6">
              Theme: <span className="font-semibold text-white">{itoData.theme}</span>
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Remember this number! You&apos;ll need to think of something that matches this magnitude.
            </p>
            <button
              onClick={showNextPlayerNumber}
              className="btn-primary"
            >
              {itoData.currentPlayerIndex < players.length - 1 ? 'Next Player' : 'Start Word Input'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (itoData.currentPhase === 'word-input') {
    const currentPlayer = players[itoData.currentPlayerIndex];

    if (showPrivacyScreen) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
          <div className="w-full max-w-md text-center">
            <div className="card mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Pass to Next Player</h2>
              <p className="text-gray-300 mb-4">
                Hand the device to{' '}
                <span className="font-semibold text-white">
                  {currentPlayer.nickname || currentPlayer.name}
                </span>
              </p>
              <button
                onClick={() => setShowPrivacyScreen(false)}
                className="btn-primary"
              >
                I&apos;m Ready
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentPlayer.nickname || currentPlayer.name}
            </h2>
            <p className="text-gray-300 mb-4">
              Theme: <span className="font-semibold text-white">{itoData.theme}</span>
            </p>
            <div className="text-3xl font-bold text-red-400">
              {Math.floor(itoData.timeRemaining / 60)}:{(itoData.timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="card mb-6">
            <label className="block text-white text-lg font-semibold mb-4">
              Enter your word/phrase:
            </label>
            <input
              type="text"
              value={currentWord}
              onChange={(e) => setCurrentWord(e.target.value)}
              placeholder="Something that matches your number..."
              className="input-field mb-4"
              onKeyPress={(e) => e.key === 'Enter' && submitWord()}
            />
            <button
              onClick={submitWord}
              disabled={!currentWord.trim() || itoData.timeRemaining === 0}
              className={`w-full py-4 px-8 rounded-lg text-lg font-bold transition-colors ${
                currentWord.trim() && itoData.timeRemaining > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Word
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            Player {itoData.currentPlayerIndex + 1} of {players.length}
          </div>
        </div>
      </div>
    );
  }

  if (itoData.currentPhase === 'sorting') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Sort the Cards</h2>
            <p className="text-gray-300 mb-4">
              Arrange from smallest to largest number
            </p>
            <p className="text-sm text-gray-400">
              Theme: {itoData.theme}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {itoData.sortedCards.map((card, index) => {
              const player = players.find(p => p.id === card.playerId);
              return (
                <div
                  key={card.playerId}
                  className="card bg-gray-700 hover:bg-gray-600 transition-colors cursor-move"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-white">
                        {player?.nickname || player?.name}
                      </div>
                      <div className="text-gray-300">{card.word}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {index > 0 && (
                        <button
                          onClick={() => moveCard(index, index - 1)}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          ↑
                        </button>
                      )}
                      {index < itoData.sortedCards.length - 1 && (
                        <button
                          onClick={() => moveCard(index, index + 1)}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          ↓
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={revealResults}
            className="btn-primary w-full"
          >
            Reveal Numbers
          </button>
        </div>
      </div>
    );
  }

  if (itoData.currentPhase === 'results') {
    const accuracy = calculateAccuracy();
    const isSuccess = accuracy >= 80;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Results</h2>
            <div className={`text-4xl font-bold mb-4 ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
              {accuracy}%
            </div>
            {isSuccess && (
              <div className="text-2xl mb-4">🎉 Great job! 🎉</div>
            )}
          </div>

          <div className="space-y-3 mb-6">
            {itoData.sortedCards.map((card) => {
              const player = players.find(p => p.id === card.playerId);
              const actualNumber = itoData.playerNumbers[card.playerId];
              return (
                <div key={card.playerId} className="card">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-white">
                        {player?.nickname || player?.name}
                      </div>
                      <div className="text-gray-300">{card.word}</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">
                      {actualNumber}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="btn-primary w-full"
            >
              Play Again
            </button>
            <button
              onClick={() => setCurrentGame(null)}
              className="btn-secondary w-full"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
