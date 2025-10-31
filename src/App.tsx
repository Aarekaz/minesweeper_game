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


  const handleDifficultyChange = (newDifficulty: Difficulty, newConfig: GameConfig) => {
    setDifficulty(newDifficulty);
    setConfig(newConfig);
    setShowDifficultySelector(false);
    // Reset will be called automatically by the useGame hook when config changes
    setTimeout(resetGame, 0);
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
    </div>
  );
}

export default App;
