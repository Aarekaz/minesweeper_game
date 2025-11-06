import React from 'react';
import { ThemeName } from '../hooks/useTheme';
import './SettingsModal.css';

interface SettingsModalProps {
  soundEnabled: boolean;
  volume: number;
  currentTheme: ThemeName;
  themes: ThemeName[];
  onToggleSound: () => void;
  onVolumeChange: (volume: number) => void;
  onThemeChange: (theme: ThemeName) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  soundEnabled,
  volume,
  currentTheme,
  themes,
  onToggleSound,
  onVolumeChange,
  onThemeChange,
  onClose,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="settings-grid">
          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-icon">🔊</span>
              <span>Sound Effects</span>
            </div>
            <button
              className={`toggle-button ${soundEnabled ? 'active' : ''}`}
              onClick={onToggleSound}
            >
              <div className="toggle-slider" />
            </button>
          </div>

          {soundEnabled && (
            <div className="setting-item">
              <div className="setting-label">
                <span className="setting-icon">🔉</span>
                <span>Volume</span>
              </div>
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => onVolumeChange(parseInt(e.target.value) / 100)}
                  className="volume-slider"
                />
                <span className="volume-value">{Math.round(volume * 100)}%</span>
              </div>
            </div>
          )}

          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-icon">🎨</span>
              <span>Theme</span>
            </div>
            <div className="theme-selector">
              {themes.map((theme) => (
                <button
                  key={theme}
                  className={`theme-option ${currentTheme === theme ? 'active' : ''}`}
                  onClick={() => onThemeChange(theme)}
                  title={`Switch to ${theme} theme`}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-section">
            <h3>Keyboard Shortcuts</h3>
            <div className="shortcuts-list">
              <div className="shortcut-item">
                <span className="shortcut-key">Arrow Keys</span>
                <span className="shortcut-desc">Navigate cells</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-key">Space / Enter</span>
                <span className="shortcut-desc">Reveal cell</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-key">F</span>
                <span className="shortcut-desc">Flag cell</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-key">P</span>
                <span className="shortcut-desc">Pause game</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-key">Ctrl+Z</span>
                <span className="shortcut-desc">Undo move</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
