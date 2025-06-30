'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { InsiderGameState } from '@/types/game';

interface Word {
  id: number;
  text: string;
  category: string;
}

export default function InsiderGame() {
  const { gameState, setGameData, updateGameData, setCurrentGame } = useGameStore();
  const [words, setWords] = useState<Word[]>([]);
  const [showPrivacyScreen, setShowPrivacyScreen] = useState(false);
  const [timerDuration, setTimerDuration] = useState<180 | 300>(180);

  const insiderData = gameState.gameData as InsiderGameState | null;
  const { players } = gameState;

  useEffect(() => {
    fetch('/insider_words.json')
      .then(res => res.json())
      .then(data => setWords(data.words))
      .catch(err => console.error('Failed to load words:', err));
  }, []);

  useEffect(() => {
    if (!insiderData) {
      setGameData({
        currentWord: '',
        playerRoles: {},
        currentPhase: 'role-assignment',
        currentPlayerIndex: 0,
        timeRemaining: timerDuration,
        isTimerActive: false,
        timerDuration,
        votes: {},
        gameResult: null,
      });
    }
  }, [insiderData, setGameData, timerDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (insiderData?.isTimerActive && insiderData.timeRemaining > 0) {
      interval = setInterval(() => {
        updateGameData({ timeRemaining: insiderData.timeRemaining - 1 });
      }, 1000);
    } else if (insiderData?.isTimerActive && insiderData.timeRemaining <= 0) {
      updateGameData({ 
        isTimerActive: false,
        currentPhase: 'reasoning-phase'
      });
    }
    return () => clearInterval(interval);
  }, [insiderData?.isTimerActive, insiderData?.timeRemaining, updateGameData]);

  const getRandomWord = useCallback((): string => {
    if (words.length === 0) return 'りんご';
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex].text;
  }, [words]);

  const assignRoles = () => {
    if (players.length < 3) return;

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const playerRoles: Record<string, 'master' | 'insider' | 'citizen'> = {};
    
    playerRoles[shuffledPlayers[0].id] = 'master';
    playerRoles[shuffledPlayers[1].id] = 'insider';
    
    for (let i = 2; i < shuffledPlayers.length; i++) {
      playerRoles[shuffledPlayers[i].id] = 'citizen';
    }

    const word = getRandomWord();
    
    updateGameData({
      playerRoles,
      currentWord: word,
      currentPlayerIndex: 0,
    });
  };

  const showNextPlayerRole = () => {
    if (!insiderData) return;
    
    if (insiderData.currentPlayerIndex < players.length - 1) {
      updateGameData({ currentPlayerIndex: insiderData.currentPlayerIndex + 1 });
      setShowPrivacyScreen(true);
    } else {
      updateGameData({
        currentPhase: 'question-phase',
        timeRemaining: insiderData.timerDuration,
        isTimerActive: true,
      });
    }
  };

  const startReasoningPhase = () => {
    updateGameData({
      currentPhase: 'reasoning-phase',
      isTimerActive: false,
      timeRemaining: 120,
    });
  };

  const startAccusationPhase = () => {
    updateGameData({
      currentPhase: 'accusation-phase',
      votes: {},
    });
  };

  const castVote = (accusedPlayerId: string) => {
    if (!insiderData) return;
    
    const newVotes = { ...insiderData.votes };
    newVotes['vote'] = accusedPlayerId;
    
    updateGameData({ votes: newVotes });
  };

  const calculateResults = () => {
    if (!insiderData) return;
    
    const insiderPlayer = players.find(p => insiderData.playerRoles[p.id] === 'insider');
    const accusedPlayerId = insiderData.votes['vote'];
    
    const gameResult = accusedPlayerId === insiderPlayer?.id ? 'citizens-win' : 'insider-wins';
    
    updateGameData({
      currentPhase: 'results',
      gameResult,
    });
  };

  const resetGame = () => {
    setGameData({
      currentWord: '',
      playerRoles: {},
      currentPhase: 'role-assignment',
      currentPlayerIndex: 0,
      timeRemaining: timerDuration,
      isTimerActive: false,
      timerDuration,
      votes: {},
      gameResult: null,
    });
    setShowPrivacyScreen(false);
  };

  if (!insiderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">ゲームを読み込み中...</div>
      </div>
    );
  }

  if (insiderData.currentPhase === 'role-assignment') {
    if (Object.keys(insiderData.playerRoles).length === 0) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="game-title mb-4">🕵️ インサイダーゲーム</h1>
              <p className="text-gray-600 text-lg">役職を配布します</p>
            </div>

            <div className="card mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">⏱️ 質問時間を選択</h2>
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setTimerDuration(180)}
                  className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all duration-200 shadow-md ${
                    timerDuration === 180
                      ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg transform scale-105'
                      : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  3分
                </button>
                <button
                  onClick={() => setTimerDuration(300)}
                  className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all duration-200 shadow-md ${
                    timerDuration === 300
                      ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg transform scale-105'
                      : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  5分
                </button>
              </div>
              
              <button
                onClick={assignRoles}
                className="btn-primary w-full"
              >
                🎭 役職を配布
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

    const currentPlayer = players[insiderData.currentPlayerIndex];
    const playerRole = insiderData.playerRoles[currentPlayer.id];

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
            <p className="text-gray-600 mb-6">あなたの役職は：</p>
            
            <div className="text-4xl font-bold mb-4">
              {playerRole === 'master' && '👑 マスター'}
              {playerRole === 'insider' && '🕵️ インサイダー'}
              {playerRole === 'citizen' && '👥 庶民'}
            </div>
            
            {(playerRole === 'master' || playerRole === 'insider') && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-2xl p-4 mb-6">
                <p className="text-gray-700 font-semibold mb-2">お題：</p>
                <p className="text-2xl font-bold text-purple-600">{insiderData.currentWord}</p>
              </div>
            )}
            
            {playerRole === 'master' && (
              <p className="text-sm text-gray-600 mb-6">
                あなたはマスターです。お題を知っていますが、質問には「はい」「いいえ」「わからない」でのみ答えてください。
              </p>
            )}
            
            {playerRole === 'insider' && (
              <p className="text-sm text-gray-600 mb-6">
                あなたはインサイダーです。お題を知っていますが、バレないように質問してください。
              </p>
            )}
            
            {playerRole === 'citizen' && (
              <p className="text-sm text-gray-600 mb-6">
                あなたは庶民です。質問をしてお題を当ててください。
              </p>
            )}
            
            <button
              onClick={showNextPlayerRole}
              className="btn-primary"
            >
              {insiderData.currentPlayerIndex < players.length - 1 ? '👥 次のプレイヤー' : '🎯 質問フェーズ開始'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (insiderData.currentPhase === 'question-phase') {
    const minutes = Math.floor(insiderData.timeRemaining / 60);
    const seconds = insiderData.timeRemaining % 60;
    const progressPercentage = ((insiderData.timerDuration - insiderData.timeRemaining) / insiderData.timerDuration) * 100;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">❓ 質問フェーズ</h2>
            <p className="text-gray-600 mb-4">お題を当ててください！</p>
          </div>

          <div className="card mb-6">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-pink-500 mb-2">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-pink-400 to-purple-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={startReasoningPhase}
                className="btn-primary w-full"
              >
                ✅ 正解！推理フェーズへ
              </button>
              
              <p className="text-sm text-gray-600 text-center">
                時間切れになると自動的に推理フェーズに移ります
              </p>
            </div>
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

  if (insiderData.currentPhase === 'reasoning-phase') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">🤔 推理フェーズ</h2>
            <p className="text-gray-600 mb-4">誰がインサイダーか話し合ってください</p>
          </div>

          <div className="card mb-6">
            <div className="bg-yellow-100 border border-yellow-300 rounded-2xl p-4 mb-4">
              <p className="text-gray-700 font-semibold mb-2">お題：</p>
              <p className="text-2xl font-bold text-purple-600">{insiderData.currentWord}</p>
            </div>
            
            <p className="text-gray-600 text-center mb-6">
              この時間を使って、誰がインサイダーかを話し合ってください。
            </p>
            
            <button
              onClick={startAccusationPhase}
              className="btn-primary w-full"
            >
              🗳️ 告発フェーズへ
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

  if (insiderData.currentPhase === 'accusation-phase') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">🗳️ 告発フェーズ</h2>
            <p className="text-gray-600 mb-4">インサイダーだと思う人を選んでください</p>
          </div>

          <div className="space-y-3 mb-6">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => castVote(player.id)}
                className={`w-full p-4 rounded-2xl text-lg font-bold transition-all duration-300 shadow-lg ${
                  insiderData.votes['vote'] === player.id
                    ? 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-xl transform scale-105'
                    : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-xl hover:scale-105'
                }`}
              >
                {player.nickname || player.name}
                {insiderData.votes['vote'] === player.id && ' ✓'}
              </button>
            ))}
          </div>

          <button
            onClick={calculateResults}
            disabled={!insiderData.votes['vote']}
            className={`w-full py-4 px-8 rounded-2xl text-lg font-bold transition-all duration-300 shadow-lg ${
              insiderData.votes['vote']
                ? 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            🎯 結果発表
          </button>
        </div>
      </div>
    );
  }

  if (insiderData.currentPhase === 'results') {
    const insiderPlayer = players.find(p => insiderData.playerRoles[p.id] === 'insider');
    const accusedPlayerId = insiderData.votes['vote'];
    const accusedPlayer = players.find(p => p.id === accusedPlayerId);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">🎯 結果発表</h2>
            
            <div className={`text-4xl font-bold mb-4 ${
              insiderData.gameResult === 'citizens-win' ? 'text-green-500' : 'text-red-500'
            }`}>
              {insiderData.gameResult === 'citizens-win' ? '👥 庶民チーム勝利！' : '🕵️ インサイダー勝利！'}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-2">🎯 お題</h3>
              <p className="text-xl font-bold text-purple-600">{insiderData.currentWord}</p>
            </div>
            
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-2">🕵️ インサイダー</h3>
              <p className="text-lg font-bold text-red-500">
                {insiderPlayer?.nickname || insiderPlayer?.name}
              </p>
            </div>
            
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-2">🗳️ 告発された人</h3>
              <p className="text-lg font-bold text-blue-500">
                {accusedPlayer?.nickname || accusedPlayer?.name}
              </p>
            </div>
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
