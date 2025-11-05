import React from 'react';
import { DailyChallenge, DailyChallengeStats } from '../types/dailyChallenge';
import { formatTimeUntilNext } from '../utils/dailyChallengeStorage';
import './DailyChallengeModal.css';

interface DailyChallengeModalProps {
  challenge: DailyChallenge;
  stats: DailyChallengeStats;
  onStart: () => void;
  onClose: () => void;
}

const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  challenge,
  stats,
  onStart,
  onClose,
}) => {
  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isCompleted = challenge.attempt?.completed || false;
  const canPlay = !isCompleted;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content daily-challenge-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <span className="daily-icon">📅</span>
            Daily Challenge
          </h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="daily-challenge-content">
          {/* Today's Challenge */}
          <div className="challenge-section">
            <h3>Today's Challenge</h3>
            <div className="challenge-info">
              <div className="challenge-date">
                <span className="info-label">Date:</span>
                <span className="info-value">{challenge.date}</span>
              </div>
              <div className="challenge-difficulty">
                <span className="info-label">Difficulty:</span>
                <span className="info-value">Intermediate</span>
              </div>
              <div className="challenge-grid">
                <span className="info-label">Grid:</span>
                <span className="info-value">
                  {challenge.config.rows} × {challenge.config.cols}
                </span>
              </div>
              <div className="challenge-mines">
                <span className="info-label">Mines:</span>
                <span className="info-value">{challenge.config.mines}</span>
              </div>
            </div>

            {isCompleted && challenge.attempt && (
              <div className="challenge-completed">
                <div className="completed-badge">
                  <span className="completed-icon">✓</span>
                  <span>Completed!</span>
                </div>
                <div className="completed-time">
                  Your time: <strong>{formatTime(challenge.attempt.time)}</strong>
                </div>
                <div className="completed-attempts">
                  Attempts: {challenge.attempt.attempts}
                </div>
                <div className="next-challenge">
                  Next challenge in: <strong>{formatTimeUntilNext()}</strong>
                </div>
              </div>
            )}

            {canPlay && (
              <button className="start-challenge-button" onClick={onStart}>
                {challenge.attempt ? 'Continue Challenge' : 'Start Challenge'}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="stats-section">
            <h3>Your Stats</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <div className="stat-label">Completed</div>
                  <div className="stat-value">{stats.totalCompleted}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-content">
                  <div className="stat-label">Current Streak</div>
                  <div className="stat-value">{stats.currentStreak}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <div className="stat-label">Longest Streak</div>
                  <div className="stat-value">{stats.longestStreak}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <div className="stat-label">Best Time</div>
                  <div className="stat-value">{formatTime(stats.bestTime)}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <div className="stat-label">Average Time</div>
                  <div className="stat-value">
                    {stats.totalCompleted > 0 ? formatTime(stats.averageTime) : '--:--'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="info-section">
            <p className="info-text">
              🌟 Everyone gets the same board each day! Compare your times with friends.
            </p>
            <p className="info-text">
              🎯 Complete daily challenges to build your streak and improve your stats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyChallengeModal;
