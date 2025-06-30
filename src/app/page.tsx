'use client';

import { useGameStore } from '@/store/gameStore';
import PlayerSetup from '@/components/PlayerSetup';
import GameMenu from '@/components/GameMenu';
import TalkDice from '@/components/TalkDice';
import ItoGame from '@/components/ItoGame';
import InsiderGame from '@/components/InsiderGame';

export default function Home() {
  const { gameState } = useGameStore();
  const { players, currentGame } = gameState;

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
