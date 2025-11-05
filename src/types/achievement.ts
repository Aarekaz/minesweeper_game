export type AchievementId =
  // Win-based achievements
  | 'first_win'
  | 'beginner_master'
  | 'intermediate_master'
  | 'expert_master'
  | 'speed_demon'
  | 'perfectionist'
  // Combo achievements
  | 'combo_starter'
  | 'combo_master'
  | 'combo_legend'
  // Play-based achievements
  | 'persistent'
  | 'dedicated'
  | 'veteran'
  // Skill achievements
  | 'quick_thinker'
  | 'flagging_expert'
  | 'no_flags_needed';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

export interface AchievementProgress {
  // Win tracking
  totalWins: number;
  beginnerWins: number;
  intermediateWins: number;
  expertWins: number;

  // Speed tracking
  bestBeginnerTime: number | null;
  bestIntermediateTime: number | null;
  bestExpertTime: number | null;

  // Combo tracking
  maxCombo: number;

  // Play tracking
  totalGames: number;

  // Special tracking
  flagsUsedInWins: number;
  totalFlags: number;
}

export const ACHIEVEMENT_DEFINITIONS: Record<AchievementId, Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>> = {
  // Win-based
  first_win: {
    id: 'first_win',
    title: 'First Victory',
    description: 'Win your first game',
    icon: '🎉',
  },
  beginner_master: {
    id: 'beginner_master',
    title: 'Beginner Master',
    description: 'Win 10 beginner games',
    icon: '🥉',
    maxProgress: 10,
  },
  intermediate_master: {
    id: 'intermediate_master',
    title: 'Intermediate Master',
    description: 'Win 10 intermediate games',
    icon: '🥈',
    maxProgress: 10,
  },
  expert_master: {
    id: 'expert_master',
    title: 'Expert Master',
    description: 'Win 10 expert games',
    icon: '🥇',
    maxProgress: 10,
  },
  speed_demon: {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Win an expert game in under 120 seconds',
    icon: '⚡',
  },
  perfectionist: {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Win without making any mistakes',
    icon: '💎',
  },

  // Combo achievements
  combo_starter: {
    id: 'combo_starter',
    title: 'Combo Starter',
    description: 'Achieve a 5x combo',
    icon: '🔥',
  },
  combo_master: {
    id: 'combo_master',
    title: 'Combo Master',
    description: 'Achieve a 10x combo',
    icon: '💥',
  },
  combo_legend: {
    id: 'combo_legend',
    title: 'Combo Legend',
    description: 'Achieve a 20x combo',
    icon: '⭐',
  },

  // Play-based
  persistent: {
    id: 'persistent',
    title: 'Persistent',
    description: 'Play 25 games',
    icon: '🎮',
    maxProgress: 25,
  },
  dedicated: {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Play 100 games',
    icon: '🎯',
    maxProgress: 100,
  },
  veteran: {
    id: 'veteran',
    title: 'Veteran',
    description: 'Play 500 games',
    icon: '👑',
    maxProgress: 500,
  },

  // Skill achievements
  quick_thinker: {
    id: 'quick_thinker',
    title: 'Quick Thinker',
    description: 'Win a beginner game in under 30 seconds',
    icon: '🧠',
  },
  flagging_expert: {
    id: 'flagging_expert',
    title: 'Flagging Expert',
    description: 'Win a game with perfect flag placement',
    icon: '🚩',
  },
  no_flags_needed: {
    id: 'no_flags_needed',
    title: 'No Flags Needed',
    description: 'Win a game without using any flags',
    icon: '🎖️',
  },
};

export function checkAchievementUnlock(
  achievementId: AchievementId,
  progress: AchievementProgress
): boolean {
  switch (achievementId) {
    case 'first_win':
      return progress.totalWins >= 1;

    case 'beginner_master':
      return progress.beginnerWins >= 10;

    case 'intermediate_master':
      return progress.intermediateWins >= 10;

    case 'expert_master':
      return progress.expertWins >= 10;

    case 'speed_demon':
      return progress.bestExpertTime !== null && progress.bestExpertTime < 120;

    case 'combo_starter':
      return progress.maxCombo >= 5;

    case 'combo_master':
      return progress.maxCombo >= 10;

    case 'combo_legend':
      return progress.maxCombo >= 20;

    case 'persistent':
      return progress.totalGames >= 25;

    case 'dedicated':
      return progress.totalGames >= 100;

    case 'veteran':
      return progress.totalGames >= 500;

    case 'quick_thinker':
      return progress.bestBeginnerTime !== null && progress.bestBeginnerTime < 30;

    default:
      return false;
  }
}

export function getAchievementProgress(
  achievementId: AchievementId,
  progress: AchievementProgress
): number {
  switch (achievementId) {
    case 'beginner_master':
      return progress.beginnerWins;

    case 'intermediate_master':
      return progress.intermediateWins;

    case 'expert_master':
      return progress.expertWins;

    case 'persistent':
      return progress.totalGames;

    case 'dedicated':
      return progress.totalGames;

    case 'veteran':
      return progress.totalGames;

    default:
      return 0;
  }
}
