import { useState, useEffect, useCallback } from 'react';
import { Difficulty } from '../types/game';
import { Achievement, AchievementProgress } from '../types/achievement';
import {
  loadAchievements,
  loadProgress,
  saveProgress,
  checkAndUnlockAchievements,
} from '../utils/achievementStorage';

export interface AchievementUpdate {
  won: boolean;
  difficulty: Difficulty;
  time: number;
  maxCombo: number;
  flagsUsed: number;
  mistakesMade: number;
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadAchievements());
  const [progress, setProgress] = useState<AchievementProgress>(() => loadProgress());
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  const updateProgress = useCallback((update: AchievementUpdate) => {
    setProgress(prevProgress => {
      const newProgress = { ...prevProgress };

      // Increment total games
      newProgress.totalGames += 1;

      if (update.won) {
        // Track wins
        newProgress.totalWins += 1;

        switch (update.difficulty) {
          case 'beginner':
            newProgress.beginnerWins += 1;
            if (
              newProgress.bestBeginnerTime === null ||
              update.time < newProgress.bestBeginnerTime
            ) {
              newProgress.bestBeginnerTime = update.time;
            }
            break;

          case 'intermediate':
            newProgress.intermediateWins += 1;
            if (
              newProgress.bestIntermediateTime === null ||
              update.time < newProgress.bestIntermediateTime
            ) {
              newProgress.bestIntermediateTime = update.time;
            }
            break;

          case 'expert':
            newProgress.expertWins += 1;
            if (
              newProgress.bestExpertTime === null ||
              update.time < newProgress.bestExpertTime
            ) {
              newProgress.bestExpertTime = update.time;
            }
            break;

          case 'custom':
            // Custom games don't count towards difficulty-specific achievements
            break;
        }

        // Track flags in wins
        newProgress.flagsUsedInWins += update.flagsUsed;
      }

      // Track combo
      if (update.maxCombo > newProgress.maxCombo) {
        newProgress.maxCombo = update.maxCombo;
      }

      // Track flags
      newProgress.totalFlags += update.flagsUsed;

      // Save progress
      saveProgress(newProgress);

      return newProgress;
    });
  }, []);

  // Check for newly unlocked achievements whenever progress changes
  useEffect(() => {
    const result = checkAndUnlockAchievements(achievements, progress);

    if (result.newlyUnlocked.length > 0) {
      setAchievements(result.achievements);
      setNewlyUnlocked(result.newlyUnlocked);
    }
  }, [progress]);

  const clearNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked([]);
  }, []);

  const getUnlockedCount = useCallback(() => {
    return achievements.filter(a => a.unlocked).length;
  }, [achievements]);

  const getTotalCount = useCallback(() => {
    return achievements.length;
  }, [achievements]);

  const getCompletionPercentage = useCallback(() => {
    return Math.round((getUnlockedCount() / getTotalCount()) * 100);
  }, [getUnlockedCount, getTotalCount]);

  return {
    achievements,
    progress,
    newlyUnlocked,
    updateProgress,
    clearNewlyUnlocked,
    getUnlockedCount,
    getTotalCount,
    getCompletionPercentage,
  };
}
