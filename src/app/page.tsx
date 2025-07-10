'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import PlayerSetup from '@/components/PlayerSetup';
import RoomSetup from '@/components/RoomSetup';
import RoomLobby from '@/components/RoomLobby';
import GameMenu from '@/components/GameMenu';
import TalkDice from '@/components/TalkDice';
import ItoGame from '@/components/ItoGame';
import InsiderGame from '@/components/InsiderGame';

export default function Home() {
  const [mode, setMode] = useState<'single' | 'multi' | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const players = useGameStore(state => state.gameState.players);
  const currentGame = useGameStore(state => state.gameState.currentGame);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    
    if (roomParam) {
      setRoomId(roomParam);
      setMode('multi');
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

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

  if (mode === 'multi' && !roomId) {
    return (
      <RoomSetup 
        onRoomCreated={(newRoomId) => {
          setRoomId(newRoomId);
        }} 
        onRoomJoined={(newRoomId) => {
          setRoomId(newRoomId);
        }} 
      />
    );
  }

  if (mode === 'multi' && roomId && players.length === 0) {
    return <RoomLobby roomId={roomId} onStartGame={() => {
    }} />;
  }

  if (mode === 'single' && players.length === 0) {
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
