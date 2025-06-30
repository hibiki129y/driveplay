export interface Player {
  id: string;
  name: string;
  nickname?: string;
}

export interface GameState {
  players: Player[];
  currentGame: 'setup' | 'talk-dice' | 'ito' | 'insider' | null;
  gameData: TalkDiceState | ItoGameState | InsiderGameState | null;
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
}

export interface InsiderGameState {
  currentWord: string;
  playerRoles: Record<string, 'master' | 'insider' | 'citizen'>;
  currentPhase: 'role-assignment' | 'question-phase' | 'reasoning-phase' | 'accusation-phase' | 'results';
  currentPlayerIndex: number;
  timeRemaining: number;
  isTimerActive: boolean;
  timerDuration: 180 | 300;
  votes: Record<string, string>;
  gameResult: 'citizens-win' | 'insider-wins' | null;
}

export interface GameStore {
  gameState: GameState;
  setPlayers: (players: Player[]) => void;
  setCurrentGame: (game: 'setup' | 'talk-dice' | 'ito' | 'insider' | null) => void;
  setGameData: (data: TalkDiceState | ItoGameState | InsiderGameState | null) => void;
  updateGameData: (updates: Partial<TalkDiceState | ItoGameState | InsiderGameState>) => void;
  resetGame: () => void;
}
