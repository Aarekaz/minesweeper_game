import React, { useState } from 'react';
import { GameStats, Difficulty, DifficultyStats } from '../types/game';
import './StatsModal.css';

interface StatsModalProps {
  stats: GameStats;
  currentDifficulty?: Difficulty;
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ stats, currentDifficulty = 'beginner', onClose }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(currentDifficulty);
  const diffStats: DifficultyStats = stats[selectedDifficulty];

  const winRate =
    diffStats.gamesPlayed > 0
      ? ((diffStats.gamesWon / diffStats.gamesPlayed) * 100).toFixed(1)
      : '0.0';

  const formatTime = (seconds: number): string => {
    if (seconds === Infinity) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const difficulties: Array<{ key: Difficulty; label: string }> = [
    { key: 'beginner', label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'expert', label: 'Expert' },
    { key: 'custom', label: 'Custom' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content stats-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Statistics</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Difficulty tabs */}
        <div className="difficulty-tabs">
          {difficulties.map((diff) => (
            <button
              key={diff.key}
              className={`difficulty-tab ${selectedDifficulty === diff.key ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty(diff.key)}
            >
              {diff.label}
            </button>
          ))}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-number">{diffStats.gamesPlayed}</div>
            <div className="stat-label">Games Played</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-number">{diffStats.gamesWon}</div>
            <div className="stat-label">Games Won</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💔</div>
            <div className="stat-number">{diffStats.gamesLost}</div>
            <div className="stat-label">Games Lost</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-number">{winRate}%</div>
            <div className="stat-label">Win Rate</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-number">{formatTime(diffStats.bestTime)}</div>
            <div className="stat-label">Best Time</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-number">{diffStats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-number">{diffStats.longestStreak}</div>
            <div className="stat-label">Longest Streak</div>
          </div>
        </div>

        {diffStats.gamesPlayed === 0 && (
          <div className="empty-state">
            <p>Start playing to track your statistics!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsModal;
