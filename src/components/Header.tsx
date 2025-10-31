import React from 'react';
import { GameStatus } from '../types/game';
import './Header.css';

interface HeaderProps {
  time: number;
  remainingMines: number;
  gameStatus: GameStatus;
  onReset: () => void;
  onDifficultyChange: () => void;
  onStatsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  time,
  remainingMines,
  gameStatus,
  onReset,
  onDifficultyChange,
  onStatsClick,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusEmoji = () => {
    switch (gameStatus) {
      case 'won':
        return '🎉';
      case 'lost':
        return '💀';
      case 'playing':
        return '🎮';
      default:
        return '😊';
    }
  };

  const getStatusText = () => {
    switch (gameStatus) {
      case 'won':
        return 'Victory!';
      case 'lost':
        return 'Game Over';
      case 'playing':
        return 'Playing';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="header">
      <div className="header-section">
        <button className="icon-button" onClick={onStatsClick} title="Statistics">
          📊
        </button>
        <button className="icon-button" onClick={onDifficultyChange} title="Change Difficulty">
          ⚙️
        </button>
      </div>

      <div className="header-stats">
        <div className="stat-display">
          <div className="stat-label">Mines</div>
          <div className="stat-value">{remainingMines}</div>
        </div>

        <button className="reset-button" onClick={onReset} title={`Reset Game - ${getStatusText()}`}>
          <span className="reset-emoji">{getStatusEmoji()}</span>
        </button>

        <div className="stat-display">
          <div className="stat-label">Time</div>
          <div className="stat-value">{formatTime(time)}</div>
        </div>
      </div>

      <div className="header-section header-section-right">
        <div className="status-indicator">
          <span className="status-text">{getStatusText()}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
