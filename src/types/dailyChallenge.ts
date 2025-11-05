import { GameConfig } from './game';

export interface DailyChallengeAttempt {
  date: string;
  completed: boolean;
  time: number | null;
  seed: number;
  config: GameConfig;
  attempts: number;
}

export interface DailyChallengeStats {
  totalCompleted: number;
  currentStreak: number;
  longestStreak: number;
  averageTime: number;
  bestTime: number | null;
  lastPlayedDate: string | null;
}

export interface DailyChallenge {
  date: string;
  seed: number;
  config: GameConfig;
  attempt: DailyChallengeAttempt | null;
}
