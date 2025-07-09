'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useAuth } from '@/hooks/useAuth';
import { useRoom } from '@/hooks/useRoom';
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
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const { user, loading: authLoading, signInAnonymously } = useAuth();
  const { room, loading: roomLoading, joinRoom, updateRoomState } = useRoom(roomId);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    
    if (roomParam) {
      setRoomId(roomParam);
      setMode('multi');
      
      const initializeRoom = async () => {
        try {
          if (!user && !authLoading) {
            await signInAnonymously();
          }
          
          if (user && !room && !roomLoading) {
            await joinRoom(roomParam);
          }
        } catch (error) {
          console.error('Failed to initialize room:', error);
        } finally {
          setIsInitializing(false);
        }
      };

      initializeRoom();
    } else {
      setIsInitializing(false);
    }
  }, [user, authLoading, room, roomLoading, roomId, signInAnonymously, joinRoom]);

  useEffect(() => {
    if (room && user && roomId) {
      updateRoomState(gameState);
    }
  }, [gameState, room, user, roomId, updateRoomState]);

  if (isInitializing || (roomId && (authLoading || roomLoading))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">ルームに接続中...</div>
      </div>
    );
  }

  if (roomId && !room && !roomLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">ルームが見つかりません</div>
          <button
            onClick={() => {
              window.history.pushState({}, '', '/');
              window.location.reload();
            }}
            className="btn-primary"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  if (!mode && !roomId) {
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
    return <RoomSetup onRoomCreated={(newRoomId) => {
      window.history.pushState({}, '', `/?room=${newRoomId}`);
      setRoomId(newRoomId);
    }} onRoomJoined={(newRoomId) => {
      window.history.pushState({}, '', `/?room=${newRoomId}`);
      setRoomId(newRoomId);
    }} />;
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
