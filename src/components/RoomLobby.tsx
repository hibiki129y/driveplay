'use client';

import React from 'react';
import { useRoom } from '@/hooks/useRoom';

interface RoomLobbyProps {
  roomId: string;
  onStartGame: () => void;
}

export default function RoomLobby({ roomId, onStartGame }: RoomLobbyProps) {
  const { room, participants } = useRoom(roomId);

  const copyRoomLink = () => {
    const roomUrl = `${window.location.origin}/?room=${roomId}`;
    navigator.clipboard.writeText(roomUrl).then(() => {
      alert('ルームリンクをコピーしました！');
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="game-title mb-4">🏠 ルーム待機中</h1>
          <p className="text-gray-600 text-lg">他の参加者を待っています</p>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">ルーム情報</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">ルーム名</label>
            <div className="bg-gray-100 rounded-xl p-3 text-gray-800 font-medium">
              {room?.name || 'ルーム'}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">ルームID</label>
            <div className="bg-gray-100 rounded-xl p-3 text-gray-800 font-mono text-sm">
              {roomId}
            </div>
          </div>

          <button
            onClick={copyRoomLink}
            className="btn-secondary w-full mb-4"
          >
            📋 ルームリンクをコピー
          </button>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              参加者 ({participants?.length || 0}名)
            </label>
            <div className="bg-gray-50 rounded-xl p-3 min-h-[60px]">
              {participants && participants.length > 0 ? (
                <div className="space-y-1">
                  {participants.map((participant, index) => (
                    <div key={participant.id} className="flex items-center text-sm text-gray-700">
                      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                        {index + 1}
                      </span>
                      参加者 {index + 1}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm text-center py-2">
                  参加者を待っています...
                </div>
              )}
            </div>
          </div>

          {participants && participants.length >= 2 && (
            <button
              onClick={onStartGame}
              className="btn-primary w-full"
            >
              🎮 ゲーム開始
            </button>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            他の人にルームリンクを共有してゲームを始めましょう！
          </p>
          <button
            onClick={() => {
              window.history.pushState({}, '', '/');
              window.location.reload();
            }}
            className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
          >
            ← ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
