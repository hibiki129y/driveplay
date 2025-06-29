export interface Player {
  id: string;
  name: string;
  nickname?: string;
}

export interface GameState {
  players: Player[];
  currentGame: 'setup' | 'talk-dice' | 'ito' | null;
  gameData: TalkDiceState | ItoGameState | null;
}

export interface TalkDiceState {
  currentTopic: string;
  usedTopics: string[];
  customTopics: string[];
}

export interface ItoGameState {
  theme: string;
  playerNumbers: Record<string, number>;
  playerWords: Record<string, string>;
  currentPhase: 'theme-input' | 'number-reveal' | 'word-input' | 'sorting' | 'results';
  currentPlayerIndex: number;
  sortedCards: Array<{ playerId: string; word: string }>;
  timeRemaining: number;
  isTimerActive: boolean;
}

export interface GameStore {
  gameState: GameState;
  setPlayers: (players: Player[]) => void;
  setCurrentGame: (game: 'setup' | 'talk-dice' | 'ito' | null) => void;
  setGameData: (data: TalkDiceState | ItoGameState | null) => void;
  updateGameData: (updates: Partial<TalkDiceState | ItoGameState>) => void;
  resetGame: () => void;
}
