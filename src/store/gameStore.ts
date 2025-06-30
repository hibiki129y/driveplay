import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameStore, GameState, Player, TalkDiceState, ItoGameState, InsiderGameState } from '@/types/game';

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
      
      setCurrentGame: (currentGame: 'setup' | 'talk-dice' | 'ito' | 'insider' | null) =>
        set((state) => ({
          gameState: { 
            ...state.gameState, 
            currentGame,
            gameData: null // Clear previous game data when switching games
          },
        })),
      
      setGameData: (gameData: TalkDiceState | ItoGameState | InsiderGameState | null) =>
        set((state) => ({
          gameState: { ...state.gameState, gameData },
        })),
      
      updateGameData: (updates: Partial<TalkDiceState | ItoGameState | InsiderGameState>) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            gameData: state.gameState.gameData
              ? { ...state.gameState.gameData, ...updates } as TalkDiceState | ItoGameState | InsiderGameState
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
