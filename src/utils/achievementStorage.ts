import {
  Achievement,
  AchievementProgress,
  ACHIEVEMENT_DEFINITIONS,
  checkAchievementUnlock,
  getAchievementProgress,
} from '../types/achievement';

const ACHIEVEMENTS_KEY = 'minesweeper-achievements';
const PROGRESS_KEY = 'minesweeper-achievement-progress';

export function loadAchievements(): Achievement[] {
  try {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!stored) {
      return initializeAchievements();
    }

    const achievements: Achievement[] = JSON.parse(stored);

    // Merge with new achievements if any were added
    const allAchievements: Achievement[] = [];
    for (const [id, def] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
      const existing = achievements.find(a => a.id === id);
      if (existing) {
        allAchievements.push(existing);
      } else {
        allAchievements.push({
          ...def,
          unlocked: false,
        });
      }
    }

    return allAchievements;
  } catch (error) {
    console.error('Failed to load achievements:', error);
    return initializeAchievements();
  }
}

export function saveAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch (error) {
    console.error('Failed to save achievements:', error);
  }
}

export function loadProgress(): AchievementProgress {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (!stored) {
      return initializeProgress();
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load achievement progress:', error);
    return initializeProgress();
  }
}

export function saveProgress(progress: AchievementProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save achievement progress:', error);
  }
}

export function initializeAchievements(): Achievement[] {
  const achievements: Achievement[] = [];

  for (const [, def] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
    achievements.push({
      ...def,
      unlocked: false,
    });
  }

  saveAchievements(achievements);
  return achievements;
}

export function initializeProgress(): AchievementProgress {
  const progress: AchievementProgress = {
    totalWins: 0,
    beginnerWins: 0,
    intermediateWins: 0,
    expertWins: 0,
    bestBeginnerTime: null,
    bestIntermediateTime: null,
    bestExpertTime: null,
    maxCombo: 0,
    totalGames: 0,
    flagsUsedInWins: 0,
    totalFlags: 0,
  };

  saveProgress(progress);
  return progress;
}

export function checkAndUnlockAchievements(
  achievements: Achievement[],
  progress: AchievementProgress
): { achievements: Achievement[]; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];
  const updatedAchievements = achievements.map(achievement => {
    if (achievement.unlocked) {
      return achievement;
    }

    const shouldUnlock = checkAchievementUnlock(achievement.id, progress);

    if (shouldUnlock) {
      const unlocked = {
        ...achievement,
        unlocked: true,
        unlockedAt: Date.now(),
      };
      newlyUnlocked.push(unlocked);
      return unlocked;
    }

    // Update progress for incremental achievements
    const currentProgress = getAchievementProgress(achievement.id, progress);
    if (currentProgress > 0) {
      return {
        ...achievement,
        progress: currentProgress,
      };
    }

    return achievement;
  });

  saveAchievements(updatedAchievements);

  return {
    achievements: updatedAchievements,
    newlyUnlocked,
  };
}

export function resetAchievements(): void {
  try {
    localStorage.removeItem(ACHIEVEMENTS_KEY);
    localStorage.removeItem(PROGRESS_KEY);
  } catch (error) {
    console.error('Failed to reset achievements:', error);
  }
}
