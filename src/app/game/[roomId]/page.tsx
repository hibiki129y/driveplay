'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRoom } from '@/hooks/useRoom';
import { useGameStore } from '@/store/gameStore';
import PlayerSetup from '@/components/PlayerSetup';
import GameMenu from '@/components/GameMenu';
import TalkDice from '@/components/TalkDice';
import ItoGame from '@/components/ItoGame';
import InsiderGame from '@/components/InsiderGame';

export default function RoomGamePage() {
  const params = useParams();
  const roomId = params.roomId as string;
  
  const { user, loading: authLoading, signInAnonymously } = useAuth();
  const { room, loading: roomLoading, joinRoom, updateRoomState } = useRoom(roomId);
  const { gameState } = useGameStore();
  const { players, currentGame } = gameState;

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        if (!user && !authLoading) {
          await signInAnonymously();
        }
        
        if (user && !room && !roomLoading) {
          await joinRoom(roomId);
        }
      } catch (error) {
        console.error('Failed to initialize room:', error);
      }
    };

    initializeRoom();
  }, [user, authLoading, room, roomLoading, roomId, signInAnonymously, joinRoom]);

  useEffect(() => {
    if (room && user) {
      updateRoomState(gameState);
    }
  }, [gameState, room, user, updateRoomState]);

  if (authLoading || roomLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">ルームに接続中...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">ルームが見つかりません</div>
      </div>
    );
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
