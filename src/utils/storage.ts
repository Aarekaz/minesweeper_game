import { GameStats, DifficultyStats, Difficulty } from '../types/game';

const STATS_KEY = 'minesweeper-stats';

const createEmptyDifficultyStats = (): DifficultyStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  bestTime: Infinity,
  currentStreak: 0,
  longestStreak: 0,
});

export function loadStats(): GameStats {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate old stats format if needed
      if ('gamesPlayed' in parsed && !('beginner' in parsed)) {
        return {
          beginner: parsed,
          intermediate: createEmptyDifficultyStats(),
          expert: createEmptyDifficultyStats(),
          custom: createEmptyDifficultyStats(),
        };
      }
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
  }

  return {
    beginner: createEmptyDifficultyStats(),
    intermediate: createEmptyDifficultyStats(),
    expert: createEmptyDifficultyStats(),
    custom: createEmptyDifficultyStats(),
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
  difficulty: Difficulty,
  won: boolean,
  time: number
): GameStats {
  const newStats = { ...currentStats };
  const diffStats = { ...currentStats[difficulty] };

  diffStats.gamesPlayed++;

  if (won) {
    diffStats.gamesWon++;
    diffStats.currentStreak++;
    diffStats.longestStreak = Math.max(
      diffStats.longestStreak,
      diffStats.currentStreak
    );

    if (time < diffStats.bestTime) {
      diffStats.bestTime = time;
    }
  } else {
    diffStats.gamesLost++;
    diffStats.currentStreak = 0;
  }

  newStats[difficulty] = diffStats;
  return newStats;
}
