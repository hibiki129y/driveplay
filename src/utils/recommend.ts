import { GameMeta, GAMES } from '@/data/gamesMeta';

export interface RecommendInput {
  players: number;
  mood: 'relax' | 'party' | 'serious';
  style: 'coop' | 'competitive';
  cognition: 'low' | 'medium' | 'high';
}

export function recommend(input: RecommendInput): GameMeta[] {
  const filtered = GAMES.filter(g =>
    input.players >= g.minPlayers && input.players <= g.maxPlayers
  );

  if (filtered.length === 0) {
    return GAMES.slice(0, 3);
  }

  const scored = filtered.map(g => ({
    game: g,
    score:
      (g.mood.includes(input.mood) ? 1 : 0) +
      (g.style === input.style ? 1 : 0) +
      (g.cognition === input.cognition ? 1 : 0),
  }));

  scored.sort((a, b) => b.score - a.score);

  if (scored[0].score === 0) {
    const relaxedCognition = filtered.map(g => ({
      game: g,
      score:
        (g.mood.includes(input.mood) ? 1 : 0) +
        (g.style === input.style ? 1 : 0),
    }));
    relaxedCognition.sort((a, b) => b.score - a.score);
    
    if (relaxedCognition[0].score > 0) {
      return relaxedCognition.slice(0, 3).map(s => s.game);
    }

    const relaxedStyle = filtered.map(g => ({
      game: g,
      score: g.mood.includes(input.mood) ? 1 : 0,
    }));
    relaxedStyle.sort((a, b) => b.score - a.score);
    
    if (relaxedStyle[0].score > 0) {
      return relaxedStyle.slice(0, 3).map(s => s.game);
    }

    return filtered.slice(0, 3);
  }

  return scored.slice(0, 3).map(s => s.game);
}
