export interface GameMeta {
  id: 'talk-dice' | 'ito' | 'insider';
  name: string;
  minPlayers: number;
  maxPlayers: number;
  mood: ('relax' | 'party' | 'serious')[];
  style: 'coop' | 'competitive';
  cognition: 'low' | 'medium' | 'high';
  description: string;
  emoji: string;
}

export const GAMES: GameMeta[] = [
  {
    id: 'talk-dice',
    name: 'トークダイス',
    minPlayers: 2,
    maxPlayers: 6,
    mood: ['relax', 'party'],
    style: 'coop',
    cognition: 'low',
    description: '会話のきっかけを作ろう',
    emoji: '🎲'
  },
  {
    id: 'ito',
    name: 'イトゲーム',
    minPlayers: 2,
    maxPlayers: 6,
    mood: ['party', 'serious'],
    style: 'coop',
    cognition: 'medium',
    description: '秘密の数字の順番を当てよう',
    emoji: '🔢'
  },
  {
    id: 'insider',
    name: 'インサイダーゲーム',
    minPlayers: 3,
    maxPlayers: 8,
    mood: ['party', 'serious'],
    style: 'competitive',
    cognition: 'high',
    description: '内通者を見つけ出そう',
    emoji: '🕵️'
  }
];
