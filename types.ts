
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface ColorDefinition {
  id: string;
  name: string;
  hex: string;
  direction?: Direction; // Optional now as it's dynamic per challenge
  textColor: string;
  bgTailwind: string;
  borderTailwind: string;
  hue: string;
  shade: number;
}

export interface Challenge {
  target: ColorDefinition;
  options: Record<Direction, ColorDefinition>;
  correctDirection: Direction;
}

export interface SwipeStats {
  correct: number;
  incorrect: number;
}

export type GameStats = Record<string, SwipeStats>;

export interface GameState {
  score: number;
  streak: number;
  bestStreak: number;
  stats: GameStats;
}
