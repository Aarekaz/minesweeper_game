import React from 'react';
import { GameStats } from '../types/game';
import './StatsModal.css';

interface StatsModalProps {
  stats: GameStats;
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose }) => {
  const winRate =
    stats.gamesPlayed > 0
      ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1)
      : '0.0';

  const formatTime = (seconds: number): string => {
    if (seconds === Infinity) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content stats-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Statistics</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-number">{stats.gamesPlayed}</div>
            <div className="stat-label">Games Played</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-number">{stats.gamesWon}</div>
            <div className="stat-label">Games Won</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💔</div>
            <div className="stat-number">{stats.gamesLost}</div>
            <div className="stat-label">Games Lost</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-number">{winRate}%</div>
            <div className="stat-label">Win Rate</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-number">{formatTime(stats.bestTime)}</div>
            <div className="stat-label">Best Time</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-number">{stats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-number">{stats.longestStreak}</div>
            <div className="stat-label">Longest Streak</div>
          </div>
        </div>

        {stats.gamesPlayed === 0 && (
          <div className="empty-state">
            <p>Start playing to track your statistics!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsModal;
