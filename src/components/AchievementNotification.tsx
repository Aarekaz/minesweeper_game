import React, { useEffect } from 'react';
import { Achievement } from '../types/achievement';
import './AchievementNotification.css';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
}) => {
  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="achievement-notification">
      <div className="achievement-glow" />
      <div className="achievement-content">
        <div className="achievement-header">
          <span className="achievement-badge">🏆</span>
          <span className="achievement-label">Achievement Unlocked!</span>
        </div>
        <div className="achievement-details">
          <span className="achievement-icon">{achievement.icon}</span>
          <div className="achievement-info">
            <h3 className="achievement-title">{achievement.title}</h3>
            <p className="achievement-description">{achievement.description}</p>
          </div>
        </div>
      </div>
      <button className="achievement-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default AchievementNotification;
