import { DIFFICULTY_CONFIGS } from '../types/game';
import {
  DailyChallenge,
  DailyChallengeAttempt,
  DailyChallengeStats,
} from '../types/dailyChallenge';
import { getTodayDateString, getTodaySeed } from './seededRandom';

const DAILY_CHALLENGE_KEY = 'minesweeper-daily-challenge';
const DAILY_STATS_KEY = 'minesweeper-daily-stats';

/**
 * Get today's daily challenge configuration
 */
export function getTodayChallenge(): DailyChallenge {
  const date = getTodayDateString();
  const seed = getTodaySeed();
  // Daily challenges are always intermediate difficulty
  const config = DIFFICULTY_CONFIGS.intermediate;

  const attempt = loadTodayAttempt();

  return {
    date,
    seed,
    config,
    attempt,
  };
}

/**
 * Load today's attempt from storage
 */
export function loadTodayAttempt(): DailyChallengeAttempt | null {
  try {
    const stored = localStorage.getItem(DAILY_CHALLENGE_KEY);
    if (!stored) return null;

    const attempt: DailyChallengeAttempt = JSON.parse(stored);

    // Check if the attempt is for today
    if (attempt.date !== getTodayDateString()) {
      // Old attempt, clear it
      localStorage.removeItem(DAILY_CHALLENGE_KEY);
      return null;
    }

    return attempt;
  } catch (error) {
    console.error('Failed to load daily challenge attempt:', error);
    return null;
  }
}

/**
 * Save today's attempt
 */
export function saveTodayAttempt(attempt: DailyChallengeAttempt): void {
  try {
    localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(attempt));
  } catch (error) {
    console.error('Failed to save daily challenge attempt:', error);
  }
}

/**
 * Initialize a new attempt for today
 */
export function initializeTodayAttempt(): DailyChallengeAttempt {
  const attempt: DailyChallengeAttempt = {
    date: getTodayDateString(),
    completed: false,
    time: null,
    seed: getTodaySeed(),
    config: DIFFICULTY_CONFIGS.intermediate,
    attempts: 1,
  };

  saveTodayAttempt(attempt);
  return attempt;
}

/**
 * Complete today's challenge
 */
export function completeTodayChallenge(time: number): void {
  const attempt = loadTodayAttempt() || initializeTodayAttempt();

  // Only update if this is the first completion or a better time
  if (!attempt.completed || (attempt.time !== null && time < attempt.time)) {
    attempt.completed = true;
    attempt.time = time;
    saveTodayAttempt(attempt);

    // Update stats
    updateStats(time, true);
  }
}

/**
 * Increment attempt counter
 */
export function incrementAttempts(): void {
  const attempt = loadTodayAttempt() || initializeTodayAttempt();
  attempt.attempts += 1;
  saveTodayAttempt(attempt);
}

/**
 * Load daily challenge stats
 */
export function loadDailyStats(): DailyChallengeStats {
  try {
    const stored = localStorage.getItem(DAILY_STATS_KEY);
    if (!stored) {
      return initializeStats();
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load daily stats:', error);
    return initializeStats();
  }
}

/**
 * Save daily challenge stats
 */
export function saveDailyStats(stats: DailyChallengeStats): void {
  try {
    localStorage.setItem(DAILY_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save daily stats:', error);
  }
}

/**
 * Initialize stats
 */
function initializeStats(): DailyChallengeStats {
  const stats: DailyChallengeStats = {
    totalCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageTime: 0,
    bestTime: null,
    lastPlayedDate: null,
  };

  saveDailyStats(stats);
  return stats;
}

/**
 * Update stats after completing a challenge
 */
function updateStats(time: number, completed: boolean): void {
  const stats = loadDailyStats();
  const today = getTodayDateString();

  if (completed && stats.lastPlayedDate !== today) {
    // First completion today
    stats.totalCompleted += 1;

    // Update streak
    if (isConsecutiveDay(stats.lastPlayedDate, today)) {
      stats.currentStreak += 1;
    } else {
      stats.currentStreak = 1;
    }

    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }

    // Update times
    if (stats.bestTime === null || time < stats.bestTime) {
      stats.bestTime = time;
    }

    // Update average time
    const totalTime = stats.averageTime * (stats.totalCompleted - 1) + time;
    stats.averageTime = Math.round(totalTime / stats.totalCompleted);

    stats.lastPlayedDate = today;
    saveDailyStats(stats);
  }
}

/**
 * Check if two dates are consecutive days
 */
function isConsecutiveDay(lastDate: string | null, currentDate: string): boolean {
  if (!lastDate) return false;

  const last = new Date(lastDate);
  const current = new Date(currentDate);

  // Calculate difference in days
  const diffTime = current.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays === 1;
}

/**
 * Check if challenge is available (resets at midnight)
 */
export function isChallengeAvailable(): boolean {
  const attempt = loadTodayAttempt();
  return !attempt || !attempt.completed;
}

/**
 * Get time until next challenge (milliseconds until midnight)
 */
export function getTimeUntilNextChallenge(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return tomorrow.getTime() - now.getTime();
}

/**
 * Format time until next challenge
 */
export function formatTimeUntilNext(): string {
  const ms = getTimeUntilNextChallenge();
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}
