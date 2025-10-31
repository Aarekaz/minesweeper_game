import { GameStats } from '../types/game';

const STATS_KEY = 'minesweeper-stats';

export function loadStats(): GameStats {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
  }

  return {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    bestTime: Infinity,
    currentStreak: 0,
    longestStreak: 0,
  };
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
}

export function updateStats(
  currentStats: GameStats,
  won: boolean,
  time: number
): GameStats {
  const newStats = { ...currentStats };

  newStats.gamesPlayed++;

  if (won) {
    newStats.gamesWon++;
    newStats.currentStreak++;
    newStats.longestStreak = Math.max(
      newStats.longestStreak,
      newStats.currentStreak
    );

    if (time < newStats.bestTime) {
      newStats.bestTime = time;
    }
  } else {
    newStats.gamesLost++;
    newStats.currentStreak = 0;
  }

  return newStats;
}
