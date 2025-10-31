import { useState, useEffect } from 'react';
import { Difficulty, GameConfig, DIFFICULTY_CONFIGS } from './types/game';
import { useGame } from './hooks/useGame';
import Header from './components/Header';
import Board from './components/Board';
import DifficultySelector from './components/DifficultySelector';
import StatsModal from './components/StatsModal';
import './App.css';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [config, setConfig] = useState<GameConfig>(DIFFICULTY_CONFIGS.beginner);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const {
    board,
    gameStatus,
    time,
    remainingMines,
    stats,
    resetGame,
    handleCellClick,
    handleCellRightClick,
    handleCellMiddleClick,
  } = useGame(config);

  // Show welcome screen on first load
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('minesweeper-welcome-seen');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
  }, []);

  const handleDifficultyChange = (newDifficulty: Difficulty, newConfig: GameConfig) => {
    setDifficulty(newDifficulty);
    setConfig(newConfig);
    setShowDifficultySelector(false);
    // Reset will be called automatically by the useGame hook when config changes
    setTimeout(resetGame, 0);
  };

  const handleWelcomeClose = () => {
    localStorage.setItem('minesweeper-welcome-seen', 'true');
    setShowWelcome(false);
  };

  // Prevent context menu on the entire app
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', preventContextMenu);
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  return (
    <div className="app">
      <div className="app-container">
        <div className="app-header">
          <h1 className="app-title">
            <span className="title-icon">💣</span>
            Minesweeper Pro
          </h1>
          <p className="app-subtitle">
            The ultimate minesweeper experience
          </p>
        </div>

        <Header
          time={time}
          remainingMines={remainingMines}
          gameStatus={gameStatus}
          onReset={resetGame}
          onDifficultyChange={() => setShowDifficultySelector(true)}
          onStatsClick={() => setShowStats(true)}
        />

        <Board
          board={board}
          onCellClick={handleCellClick}
          onCellRightClick={handleCellRightClick}
          onCellMiddleClick={handleCellMiddleClick}
          gameOver={gameStatus === 'won' || gameStatus === 'lost'}
        />

        {gameStatus === 'won' && (
          <div className="game-message victory-message">
            <div className="message-content">
              <span className="message-icon">🎉</span>
              <div className="message-text">
                <h2>Victory!</h2>
                <p>Completed in {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</p>
              </div>
            </div>
          </div>
        )}

        {gameStatus === 'lost' && (
          <div className="game-message defeat-message">
            <div className="message-content">
              <span className="message-icon">💥</span>
              <div className="message-text">
                <h2>Game Over</h2>
                <p>Better luck next time!</p>
              </div>
            </div>
          </div>
        )}

        <div className="app-footer">
          <div className="controls-hint">
            <div className="hint-item">
              <span className="hint-icon">🖱️</span>
              <span>Left Click: Reveal</span>
            </div>
            <div className="hint-item">
              <span className="hint-icon">🚩</span>
              <span>Right Click: Flag</span>
            </div>
            <div className="hint-item">
              <span className="hint-icon">⚡</span>
              <span>Middle Click: Chord</span>
            </div>
          </div>
        </div>
      </div>

      {showDifficultySelector && (
        <DifficultySelector
          currentDifficulty={difficulty}
          onSelect={handleDifficultyChange}
          onClose={() => setShowDifficultySelector(false)}
        />
      )}

      {showStats && (
        <StatsModal
          stats={stats}
          onClose={() => setShowStats(false)}
        />
      )}

      {showWelcome && (
        <div className="modal-overlay" onClick={handleWelcomeClose}>
          <div className="modal-content welcome-modal" onClick={(e) => e.stopPropagation()}>
            <div className="welcome-header">
              <span className="welcome-icon">💣</span>
              <h1>Welcome to Minesweeper Pro</h1>
            </div>
            <div className="welcome-content">
              <p>The most beautiful minesweeper game you've ever played!</p>
              <div className="welcome-features">
                <div className="feature">
                  <span className="feature-icon">✨</span>
                  <span>Gorgeous gradients & animations</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🎮</span>
                  <span>Multiple difficulty levels</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📊</span>
                  <span>Track your statistics</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">⚡</span>
                  <span>Smooth gameplay</span>
                </div>
              </div>
            </div>
            <button className="button button-primary welcome-button" onClick={handleWelcomeClose}>
              Let's Play!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
