'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRoom } from '@/hooks/useRoom';

interface RoomSetupProps {
  onRoomCreated: (roomId: string) => void;
  onRoomJoined: (roomId: string) => void;
}

export default function RoomSetup({ onRoomCreated, onRoomJoined }: RoomSetupProps) {
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, signInAnonymously } = useAuth();
  const { createRoom, joinRoom } = useRoom(null);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        await signInAnonymously();
      }
      
      const roomId = await createRoom(roomName.trim());
      onRoomCreated(roomId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ルームの作成に失敗しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        await signInAnonymously();
      }
      
      await joinRoom(roomCode.trim());
      onRoomJoined(roomCode.trim());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ルームへの参加に失敗しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="game-title mb-4">🚗 ドライブプレイ</h1>
            <p className="text-gray-600 text-lg">マルチプレイヤーモード</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="btn-primary w-full"
            >
              🏠 ルームを作成
              <span className="block text-sm font-normal mt-1 opacity-90">
                新しいゲームルームを作成
              </span>
            </button>

            <button
              onClick={() => setMode('join')}
              className="btn-secondary w-full"
            >
              🚪 ルームに参加
              <span className="block text-sm font-normal mt-1 opacity-90">
                既存のルームに参加
              </span>
            </button>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => window.location.href = '/'}
              className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              ← シングルプレイヤーモードに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="game-title mb-4">🏠 ルーム作成</h1>
            <p className="text-gray-600 text-lg">新しいゲームルームを作成します</p>
          </div>

          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">ルーム名</h2>
            <input
              type="text"
              placeholder="ルーム名を入力してください"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="input-field mb-4"
            />
            
            {error && (
              <div className="bg-red-100 border border-red-300 rounded-2xl p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <button
              onClick={handleCreateRoom}
              disabled={loading || !roomName.trim()}
              className="btn-primary w-full"
            >
              {loading ? '作成中...' : '🎮 ルーム作成'}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setMode(null)}
              className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              ← 戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="game-title mb-4">🚪 ルーム参加</h1>
          <p className="text-gray-600 text-lg">ルームコードを入力してください</p>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">ルームコード</h2>
          <input
            type="text"
            placeholder="ルームコードを入力してください"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="input-field mb-4"
          />
          
          {error && (
            <div className="bg-red-100 border border-red-300 rounded-2xl p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <button
            onClick={handleJoinRoom}
            disabled={loading || !roomCode.trim()}
            className="btn-primary w-full"
          >
            {loading ? '参加中...' : '🎮 ルーム参加'}
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => setMode(null)}
            className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
          >
            ← 戻る
          </button>
        </div>
      </div>
    </div>
  );
}
