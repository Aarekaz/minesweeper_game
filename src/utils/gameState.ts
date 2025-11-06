import { Cell, GameConfig, GameStatus, Difficulty } from '../types/game';

const SAVED_GAME_KEY = 'minesweeper-saved-game';

export interface SavedGameState {
  board: Cell[][];
  gameStatus: GameStatus;
  minesPlaced: boolean;
  time: number;
  combo: number;
  maxCombo: number;
  difficulty: Difficulty;
  config: GameConfig;
  timestamp: number;
}

export function saveGameState(state: Omit<SavedGameState, 'timestamp'>): void {
  try {
    const savedState: SavedGameState = {
      ...state,
      timestamp: Date.now(),
    };
    localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(savedState));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function loadGameState(): SavedGameState | null {
  try {
    const stored = localStorage.getItem(SAVED_GAME_KEY);
    if (!stored) return null;

    const state: SavedGameState = JSON.parse(stored);

    // Only load if game was saved within last 24 hours and game is still in progress
    const hoursSinceSave = (Date.now() - state.timestamp) / (1000 * 60 * 60);
    if (hoursSinceSave > 24 || state.gameStatus !== 'playing') {
      clearSavedGame();
      return null;
    }

    return state;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem(SAVED_GAME_KEY);
  } catch (error) {
    console.error('Failed to clear saved game:', error);
  }
}

export function hasSavedGame(): boolean {
  return loadGameState() !== null;
}
