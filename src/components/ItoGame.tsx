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
      });
    }
  }, [itoData, setGameData]);

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

  const resetGame = () => {
    setGameData({
      theme: '',
      playerNumbers: {},
      playerWords: {},
      currentPhase: 'theme-input',
      currentPlayerIndex: 0,
      sortedCards: [],
    });
    setTheme('');
    setCurrentWord('');
    setShowPrivacyScreen(false);
  };

  if (!itoData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">ゲームを読み込み中...</div>
      </div>
    );
  }

  if (itoData.currentPhase === 'theme-input') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="game-title mb-4">🔢 イトゲーム</h1>
            <p className="text-gray-600 text-lg">テーマを入力してください</p>
          </div>

          <div className="card mb-6">
            <label className="block text-gray-700 text-lg font-semibold mb-4">
              テーマ（例：「熱いもの」「怖いもの」）
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="テーマを入力してください..."
              className="input-field mb-4"
              onKeyPress={(e) => e.key === 'Enter' && startGame()}
            />
            <button
              onClick={startGame}
              disabled={!theme.trim()}
              className={`w-full py-4 px-8 rounded-2xl text-lg font-bold transition-all duration-300 shadow-lg ${
                theme.trim()
                  ? 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              🎮 ゲーム開始
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentGame(null)}
              className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              ← メニューに戻る
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
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <div className="card mb-6">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">📱 次のプレイヤーに渡してください</h2>
              <p className="text-gray-600 mb-4">
                デバイスを{' '}
                <span className="font-semibold text-pink-600">
                  {currentPlayer.nickname || currentPlayer.name}
                </span>
                {' '}さんに渡してください
              </p>
              <button
                onClick={() => setShowPrivacyScreen(false)}
                className="btn-primary"
              >
                ✅ 準備完了
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              {currentPlayer.nickname || currentPlayer.name}さん
            </h2>
            <p className="text-gray-600 mb-6">あなたの秘密の数字は：</p>
            <div className="text-6xl font-bold text-pink-500 mb-6">
              {playerNumber}
            </div>
            <p className="text-gray-600 mb-6">
              テーマ: <span className="font-semibold text-purple-600">{itoData.theme}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              この数字を覚えて、数字の大きさに合うものを考えてください！
            </p>
            <button
              onClick={showNextPlayerNumber}
              className="btn-primary"
            >
              {itoData.currentPlayerIndex < players.length - 1 ? '👥 次のプレイヤー' : '✏️ 単語入力開始'}
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
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <div className="card mb-6">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">📱 次のプレイヤーに渡してください</h2>
              <p className="text-gray-600 mb-4">
                デバイスを{' '}
                <span className="font-semibold text-pink-600">
                  {currentPlayer.nickname || currentPlayer.name}
                </span>
                {' '}さんに渡してください
              </p>
              <button
                onClick={() => setShowPrivacyScreen(false)}
                className="btn-primary"
              >
                ✅ 準備完了
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              {currentPlayer.nickname || currentPlayer.name}さん
            </h2>
            <p className="text-gray-600 mb-4">
              テーマ: <span className="font-semibold text-purple-600">{itoData.theme}</span>
            </p>
          </div>

          <div className="card mb-6">
            <label className="block text-gray-700 text-lg font-semibold mb-4">
              あなたの数字に合う単語・フレーズを入力：
            </label>
            <input
              type="text"
              value={currentWord}
              onChange={(e) => setCurrentWord(e.target.value)}
              placeholder="数字の大きさに合うものを入力..."
              className="input-field mb-4"
              onKeyPress={(e) => e.key === 'Enter' && submitWord()}
            />
            <button
              onClick={submitWord}
              disabled={!currentWord.trim()}
              className={`w-full py-4 px-8 rounded-2xl text-lg font-bold transition-all duration-300 shadow-lg ${
                currentWord.trim()
                  ? 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              ✅ 単語を決定
            </button>
          </div>

          <div className="text-center">
            <div className="bg-white/60 rounded-2xl p-3 shadow-md inline-block">
              <p className="text-sm text-gray-600">
                プレイヤー {itoData.currentPlayerIndex + 1} / {players.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (itoData.currentPhase === 'sorting') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">🔄 カードを並べ替え</h2>
            <p className="text-gray-600 mb-4">
              小さい数字から大きい数字の順に並べてください
            </p>
            <div className="bg-white/60 rounded-2xl p-3 shadow-md inline-block">
              <p className="text-sm text-gray-600">
                テーマ: {itoData.theme}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {itoData.sortedCards.map((card, index) => {
              const player = players.find(p => p.id === card.playerId);
              return (
                <div
                  key={card.playerId}
                  className="card hover:shadow-xl transition-all duration-200 cursor-move"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-700">
                        {player?.nickname || player?.name}
                      </div>
                      <div className="text-gray-600">{card.word}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {index > 0 && (
                        <button
                          onClick={() => moveCard(index, index - 1)}
                          className="text-pink-500 hover:text-pink-600 text-lg font-bold"
                        >
                          ↑
                        </button>
                      )}
                      {index < itoData.sortedCards.length - 1 && (
                        <button
                          onClick={() => moveCard(index, index + 1)}
                          className="text-pink-500 hover:text-pink-600 text-lg font-bold"
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
            🎯 答え合わせ
          </button>
        </div>
      </div>
    );
  }

  if (itoData.currentPhase === 'results') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">🎯 結果発表</h2>
            <p className="text-gray-600 mb-4">みんなの数字を見てみましょう！</p>
          </div>

          <div className="space-y-3 mb-6">
            {itoData.sortedCards.map((card) => {
              const player = players.find(p => p.id === card.playerId);
              const actualNumber = itoData.playerNumbers[card.playerId];
              return (
                <div key={card.playerId} className="card">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-700">
                        {player?.nickname || player?.name}
                      </div>
                      <div className="text-gray-600">{card.word}</div>
                    </div>
                    <div className="text-3xl font-bold text-pink-500">
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
              🔄 もう一度プレイ
            </button>
            <button
              onClick={() => setCurrentGame(null)}
              className="btn-secondary w-full"
            >
              ← メニューに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
