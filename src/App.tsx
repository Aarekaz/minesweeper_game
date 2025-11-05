import { useState, useEffect } from 'react';
import { Difficulty, GameConfig, DIFFICULTY_CONFIGS } from './types/game';
import { useGame } from './hooks/useGame';
import { useSoundEffects } from './hooks/useSoundEffects';
import { useTheme } from './hooks/useTheme';
import { useAchievements } from './hooks/useAchievements';
import { loadGameState, SavedGameState } from './utils/gameState';
import { countFlags } from './utils/gameLogic';
import Header from './components/Header';
import Board from './components/Board';
import DifficultySelector from './components/DifficultySelector';
import StatsModal from './components/StatsModal';
import SettingsModal from './components/SettingsModal';
import AchievementsModal from './components/AchievementsModal';
import AchievementNotification from './components/AchievementNotification';
import './App.css';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [config, setConfig] = useState<GameConfig>(DIFFICULTY_CONFIGS.beginner);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [savedGameState, setSavedGameState] = useState<SavedGameState | null>(null);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);

  const { playSound, toggleSound, setVolume, soundEnabled, volume} = useSoundEffects();
  const { currentTheme, setTheme, themes } = useTheme();
  const {
    achievements,
    newlyUnlocked,
    updateProgress,
    clearNewlyUnlocked,
    getUnlockedCount,
    getTotalCount,
    getCompletionPercentage,
  } = useAchievements();

  // Check for saved game on mount
  useEffect(() => {
    const saved = loadGameState();
    if (saved) {
      setSavedGameState(saved);
      setShowContinuePrompt(true);
    }
  }, []);

  const {
    board,
    gameStatus,
    time,
    remainingMines,
    stats,
    combo,
    maxCombo,
    isPaused,
    canUndo,
    togglePause,
    undo,
    resetGame,
    handleCellClick,
    handleCellRightClick,
    handleCellMiddleClick,
  } = useGame(
    savedGameState?.config || config,
    savedGameState?.difficulty || difficulty,
    { onSound: playSound, savedState: showContinuePrompt ? null : savedGameState }
  );

  const handleContinueGame = () => {
    if (savedGameState) {
      setDifficulty(savedGameState.difficulty);
      setConfig(savedGameState.config);
    }
    setShowContinuePrompt(false);
  };

  const handleNewGame = () => {
    setSavedGameState(null);
    setShowContinuePrompt(false);
  };


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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Pause (P key)
      if (e.key === 'p' || e.key === 'P') {
        if (gameStatus === 'playing') {
          togglePause();
        }
      }

      // Undo (Ctrl+Z or Cmd+Z)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (canUndo) {
          undo();
        }
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStatus, togglePause, canUndo, undo]);

  // Track achievements when game ends
  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      updateProgress({
        won: gameStatus === 'won',
        difficulty,
        time,
        maxCombo,
        flagsUsed: countFlags(board),
        mistakesMade: 0, // We don't track this yet, but it's in the interface
      });
    }
  }, [gameStatus, difficulty, time, maxCombo, board, updateProgress]);

  return (
    <div className="app">
      <div className="app-container">

        <Header
          time={time}
          remainingMines={remainingMines}
          gameStatus={gameStatus}
          isPaused={isPaused}
          canUndo={canUndo}
          onReset={resetGame}
          onDifficultyChange={() => setShowDifficultySelector(true)}
          onStatsClick={() => setShowStats(true)}
          onAchievementsClick={() => setShowAchievements(true)}
          onSettingsClick={() => setShowSettings(true)}
          onPauseClick={togglePause}
          onUndo={undo}
        />

        <Board
          board={board}
          onCellClick={handleCellClick}
          onCellRightClick={handleCellRightClick}
          onCellMiddleClick={handleCellMiddleClick}
          gameOver={gameStatus === 'won' || gameStatus === 'lost'}
        />

        {/* Combo Counter */}
        {combo > 1 && gameStatus === 'playing' && (
          <div className={`combo-counter ${combo > 5 ? 'combo-hot' : ''} ${combo > 10 ? 'combo-fire' : ''}`}>
            <div className="combo-text">
              {combo}x COMBO
            </div>
            {combo > 5 && <div className="combo-streak">🔥</div>}
          </div>
        )}

        {gameStatus === 'won' && (
          <div className="game-message victory-message">
            <div className="message-content">
              <span className="message-icon">🎉</span>
              <div className="message-text">
                <h2>Victory!</h2>
                <p>Completed in {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</p>
                {maxCombo > 1 && <p className="combo-stat">Max Combo: {maxCombo}x 🔥</p>}
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

        {/* Pause Overlay */}
        {isPaused && (
          <div className="game-message pause-message" onClick={togglePause}>
            <div className="message-content">
              <div className="message-text">
                <h2>Paused</h2>
                <p>Press 'P' or click to resume</p>
              </div>
            </div>
          </div>
        )}

        {/* Continue Game Prompt */}
        {showContinuePrompt && savedGameState && (
          <div className="game-message continue-prompt">
            <div className="message-content">
              <div className="message-text">
                <h2>Continue Game?</h2>
                <p>{savedGameState.difficulty.charAt(0).toUpperCase() + savedGameState.difficulty.slice(1)} • {Math.floor(savedGameState.time / 60)}:{(savedGameState.time % 60).toString().padStart(2, '0')}</p>
                <div className="continue-buttons">
                  <button className="continue-button primary" onClick={handleContinueGame}>
                    Continue
                  </button>
                  <button className="continue-button secondary" onClick={handleNewGame}>
                    New Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attribution link */}
        <a
          href="https://app.tembo.io/sign-up?utm_source=aarekaz&utm_id=aarekaz"
          target="_blank"
          rel="noopener noreferrer"
          className="tembo-attribution"
        >
          Made by my background agent at Tembo
        </a>

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
          currentDifficulty={difficulty}
          onClose={() => setShowStats(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          soundEnabled={soundEnabled}
          volume={volume}
          currentTheme={currentTheme}
          themes={themes}
          onToggleSound={toggleSound}
          onVolumeChange={setVolume}
          onThemeChange={setTheme}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showAchievements && (
        <AchievementsModal
          achievements={achievements}
          unlockedCount={getUnlockedCount()}
          totalCount={getTotalCount()}
          completionPercentage={getCompletionPercentage()}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* Achievement Notifications */}
      {newlyUnlocked.length > 0 && (
        <AchievementNotification
          achievement={newlyUnlocked[0]}
          onClose={clearNewlyUnlocked}
        />
      )}
    </div>
  );
}

export default App;
