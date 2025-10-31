export type CellState = 'hidden' | 'revealed' | 'flagged' | 'questioned';
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';
export type Difficulty = 'beginner' | 'intermediate' | 'expert' | 'custom';

export interface Cell {
  isMine: boolean;
  neighborMines: number;
  state: CellState;
  row: number;
  col: number;
}

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  bestTime: number;
  currentStreak: number;
  longestStreak: number;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, GameConfig> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
  custom: { rows: 16, cols: 16, mines: 40 },
};
