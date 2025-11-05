import React from 'react';
import { Achievement } from '../types/achievement';
import './AchievementsModal.css';

interface AchievementsModalProps {
  achievements: Achievement[];
  unlockedCount: number;
  totalCount: number;
  completionPercentage: number;
  onClose: () => void;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  unlockedCount,
  totalCount,
  completionPercentage,
  onClose,
}) => {
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const sortedAchievements = [...achievements].sort((a, b) => {
    // Unlocked achievements first, sorted by unlock time
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    if (a.unlocked && b.unlocked) {
      return (b.unlockedAt || 0) - (a.unlockedAt || 0);
    }
    return 0;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content achievements-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Achievements</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="achievements-summary">
          <div className="summary-stat">
            <div className="summary-label">Unlocked</div>
            <div className="summary-value">
              {unlockedCount} / {totalCount}
            </div>
          </div>
          <div className="summary-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="progress-label">{completionPercentage}% Complete</div>
          </div>
        </div>

        <div className="achievements-grid">
          {sortedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-card-icon">{achievement.icon}</div>
              <div className="achievement-card-content">
                <h3 className="achievement-card-title">{achievement.title}</h3>
                <p className="achievement-card-description">
                  {achievement.description}
                </p>
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="achievement-card-date">
                    Unlocked {formatDate(achievement.unlockedAt)}
                  </p>
                )}
                {!achievement.unlocked &&
                  achievement.maxProgress &&
                  achievement.progress !== undefined && (
                    <div className="achievement-card-progress">
                      <div className="achievement-progress-bar">
                        <div
                          className="achievement-progress-fill"
                          style={{
                            width: `${Math.min(
                              (achievement.progress / achievement.maxProgress) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="achievement-progress-text">
                        {achievement.progress} / {achievement.maxProgress}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;
