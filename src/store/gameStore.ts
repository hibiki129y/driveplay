import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameStore, GameState, Player, TalkDiceState, ItoGameState } from '@/types/game';

const initialState: GameState = {
  players: [],
  currentGame: null,
  gameData: null,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      gameState: initialState,
      
      setPlayers: (players: Player[]) =>
        set((state) => ({
          gameState: { ...state.gameState, players },
        })),
      
      setCurrentGame: (currentGame: 'setup' | 'talk-dice' | 'ito' | null) =>
        set((state) => ({
          gameState: { 
            ...state.gameState, 
            currentGame,
            gameData: null // Clear previous game data when switching games
          },
        })),
      
      setGameData: (gameData: TalkDiceState | ItoGameState | null) =>
        set((state) => ({
          gameState: { ...state.gameState, gameData },
        })),
      
      updateGameData: (updates: Partial<TalkDiceState | ItoGameState>) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            gameData: state.gameState.gameData
              ? { ...state.gameState.gameData, ...updates }
              : null,
          },
        })),
      
      resetGame: () => set({ gameState: initialState }),
    }),
    {
      name: 'driveplay-game-state',
    }
  )
);
