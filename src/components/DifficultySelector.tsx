import React, { useState } from 'react';
import { Difficulty, DIFFICULTY_CONFIGS, GameConfig } from '../types/game';
import './DifficultySelector.css';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty, config: GameConfig) => void;
  onClose: () => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelect,
  onClose,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(currentDifficulty);
  const [customRows, setCustomRows] = useState(16);
  const [customCols, setCustomCols] = useState(16);
  const [customMines, setCustomMines] = useState(40);

  const difficulties: Array<{ key: Difficulty; label: string; description: string }> = [
    { key: 'beginner', label: 'Beginner', description: '9×9 • 10 mines • Perfect for starters' },
    { key: 'intermediate', label: 'Intermediate', description: '16×16 • 40 mines • Balanced challenge' },
    { key: 'expert', label: 'Expert', description: '16×30 • 99 mines • Maximum intensity' },
    { key: 'custom', label: 'Custom', description: 'Design your perfect grid size' },
  ];

  const handleSelect = () => {
    if (selectedDifficulty === 'custom') {
      const maxMines = customRows * customCols - 9; // Leave room for first click safe zone
      const validMines = Math.min(customMines, maxMines);
      onSelect(selectedDifficulty, {
        rows: customRows,
        cols: customCols,
        mines: validMines,
      });
    } else {
      onSelect(selectedDifficulty, DIFFICULTY_CONFIGS[selectedDifficulty]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Select Difficulty</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="difficulty-grid">
          {difficulties.map((diff) => (
            <button
              key={diff.key}
              className={`difficulty-card ${selectedDifficulty === diff.key ? 'selected' : ''}`}
              onClick={() => setSelectedDifficulty(diff.key)}
            >
              <div className="difficulty-label">{diff.label}</div>
              <div className="difficulty-description">{diff.description}</div>
            </button>
          ))}
        </div>

        {selectedDifficulty === 'custom' && (
          <div className="custom-settings">
            <h3>Custom Settings</h3>
            <div className="preset-buttons">
              <button
                className="preset-button"
                onClick={() => { setCustomRows(12); setCustomCols(12); setCustomMines(20); }}
              >
                Small (12×12)
              </button>
              <button
                className="preset-button"
                onClick={() => { setCustomRows(20); setCustomCols(20); setCustomMines(60); }}
              >
                Large (20×20)
              </button>
              <button
                className="preset-button"
                onClick={() => { setCustomRows(20); setCustomCols(30); setCustomMines(120); }}
              >
                XL (20×30)
              </button>
            </div>
            <div className="custom-inputs">
              <div className="input-group">
                <label htmlFor="rows">Rows</label>
                <input
                  id="rows"
                  type="number"
                  min="5"
                  max="30"
                  value={customRows}
                  onChange={(e) => setCustomRows(parseInt(e.target.value) || 5)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="cols">Columns</label>
                <input
                  id="cols"
                  type="number"
                  min="5"
                  max="50"
                  value={customCols}
                  onChange={(e) => setCustomCols(parseInt(e.target.value) || 5)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="mines">Mines</label>
                <input
                  id="mines"
                  type="number"
                  min="1"
                  max={customRows * customCols - 9}
                  value={customMines}
                  onChange={(e) => setCustomMines(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button className="button button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button button-primary" onClick={handleSelect}>
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelector;
