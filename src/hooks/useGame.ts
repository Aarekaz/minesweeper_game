import { useState, useEffect, useCallback, useRef } from 'react';
import { Cell, GameConfig, GameStatus, GameStats, Difficulty } from '../types/game';
import {
  createBoard,
  placeMines,
  placeMinesSeeded,
  revealCell,
  revealAllMines,
  toggleFlag,
  checkWin,
  countFlags,
  chordReveal,
} from '../utils/gameLogic';
import { loadStats, saveStats, updateStats } from '../utils/storage';
import { saveGameState, clearSavedGame, SavedGameState } from '../utils/gameState';

interface BoardHistory {
  board: Cell[][];
  time: number;
  combo: number;
}

const MAX_UNDO_HISTORY = 10;

interface UseGameOptions {
  onSound?: (type: 'click' | 'flag' | 'reveal' | 'explosion' | 'victory' | 'combo', options?: { comboLevel?: number }) => void;
  savedState?: SavedGameState | null;
  seed?: number; // For daily challenges
}

export function useGame(config: GameConfig, difficulty: Difficulty, options?: UseGameOptions) {
  const { onSound, savedState, seed } = options || {};
  const [board, setBoard] = useState<Cell[][]>(() => savedState?.board || createBoard(config));
  const [gameStatus, setGameStatus] = useState<GameStatus>(savedState?.gameStatus || 'idle');
  const [minesPlaced, setMinesPlaced] = useState(savedState?.minesPlaced || false);
  const [time, setTime] = useState(savedState?.time || 0);
  const [stats, setStats] = useState<GameStats>(loadStats);
  const [combo, setCombo] = useState(savedState?.combo || 0);
  const [maxCombo, setMaxCombo] = useState(savedState?.maxCombo || 0);
  const [isPaused, setIsPaused] = useState(false);
  const [history, setHistory] = useState<BoardHistory[]>([]);
  const timerRef = useRef<number | null>(null);
  const comboTimerRef = useRef<number | null>(null);
  const autoSaveIntervalRef = useRef<number | null>(null);

  const flagCount = countFlags(board);
  const remainingMines = config.mines - flagCount;

  // Reset game when config changes (for difficulty/grid size changes)
  useEffect(() => {
    // Only reset if the board dimensions don't match the config
    // or if mines count changed (important for custom difficulty)
    const currentRows = board.length;
    const currentCols = board[0]?.length || 0;
    const currentMines = board.flat().filter(cell => cell.isMine).length;

    if (currentRows !== config.rows || currentCols !== config.cols || (minesPlaced && currentMines !== config.mines)) {
      setBoard(createBoard(config));
      setGameStatus('idle');
      setMinesPlaced(false);
      setTime(0);
      setCombo(0);
      setMaxCombo(0);
      setIsPaused(false);
      setHistory([]);
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (comboTimerRef.current !== null) {
        clearTimeout(comboTimerRef.current);
        comboTimerRef.current = null;
      }
    }
  }, [config.rows, config.cols, config.mines, minesPlaced]);

  const togglePause = useCallback(() => {
    if (gameStatus === 'playing') {
      setIsPaused(prev => !prev);
    }
  }, [gameStatus]);

  const saveToHistory = useCallback((currentBoard: Cell[][]) => {
    setHistory(prev => {
      // Create a deep copy of the board to avoid reference issues
      const boardCopy = currentBoard.map(row => row.map(cell => ({ ...cell })));
      const newHistory = [...prev, { board: boardCopy, time, combo }];
      // Keep only the last MAX_UNDO_HISTORY states
      if (newHistory.length > MAX_UNDO_HISTORY) {
        return newHistory.slice(-MAX_UNDO_HISTORY);
      }
      return newHistory;
    });
  }, [time, combo]);

  const undo = useCallback(() => {
    if (history.length === 0 || gameStatus !== 'playing' || isPaused) {
      return;
    }

    const previousState = history[history.length - 1];
    setBoard(previousState.board.map(row => row.map(cell => ({ ...cell }))));
    setTime(previousState.time);
    setCombo(previousState.combo);
    setHistory(prev => prev.slice(0, -1));
  }, [history, gameStatus, isPaused]);

  // Timer effect
  useEffect(() => {
    if (gameStatus === 'playing' && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    } else {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStatus, isPaused]);

  // Save stats when they change
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  // Auto-save game state when playing
  useEffect(() => {
    if (gameStatus === 'playing' && !isPaused) {
      // Save every 10 seconds
      autoSaveIntervalRef.current = window.setInterval(() => {
        saveGameState({
          board,
          gameStatus,
          minesPlaced,
          time,
          combo,
          maxCombo,
          difficulty,
          config,
        });
      }, 10000);
    } else {
      if (autoSaveIntervalRef.current !== null) {
        clearInterval(autoSaveIntervalRef.current);
        autoSaveIntervalRef.current = null;
      }
    }

    // Clear saved game when game ends
    if (gameStatus === 'won' || gameStatus === 'lost') {
      clearSavedGame();
    }

    return () => {
      if (autoSaveIntervalRef.current !== null) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [gameStatus, isPaused, board, minesPlaced, time, combo, maxCombo, difficulty, config]);

  const incrementCombo = useCallback(() => {
    setCombo(prev => {
      const newCombo = prev + 1;
      setMaxCombo(max => Math.max(max, newCombo));

      // Play combo sound if combo is above 1
      if (newCombo > 1) {
        onSound?.('combo', { comboLevel: Math.min(newCombo, 10) });
      }

      return newCombo;
    });

    // Reset combo timer
    if (comboTimerRef.current !== null) {
      clearTimeout(comboTimerRef.current);
    }

    // Combo expires after 2 seconds of inactivity
    comboTimerRef.current = window.setTimeout(() => {
      setCombo(0);
    }, 2000);
  }, [onSound]);

  const resetCombo = useCallback(() => {
    setCombo(0);
    if (comboTimerRef.current !== null) {
      clearTimeout(comboTimerRef.current);
      comboTimerRef.current = null;
    }
  }, []);

  const resetGame = useCallback(() => {
    setBoard(createBoard(config));
    setGameStatus('idle');
    setMinesPlaced(false);
    setTime(0);
    setCombo(0);
    setMaxCombo(0);
    setIsPaused(false);
    setHistory([]);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (comboTimerRef.current !== null) {
      clearTimeout(comboTimerRef.current);
      comboTimerRef.current = null;
    }
  }, [config]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost' || isPaused) {
        return;
      }

      // Use functional update to ALWAYS get the current board state
      setBoard(currentBoard => {
        const cell = currentBoard[row][col];

        if (cell.state === 'flagged') {
          return currentBoard; // No change
        }

        // First click - place mines and start game
        if (!minesPlaced) {
          // Play click sound immediately for first click
          onSound?.('click');
          const newBoard = seed !== undefined
            ? placeMinesSeeded(currentBoard, config.mines, row, col, seed)
            : placeMines(currentBoard, config.mines, row, col);
          const revealedBoard = revealCell(newBoard, row, col);
          setMinesPlaced(true);
          setGameStatus('playing');
          onSound?.('reveal');
          return revealedBoard;
        }

        // Save state before making changes (with CURRENT board)
        saveToHistory(currentBoard);

        // Regular click
        if (cell.state === 'hidden' || cell.state === 'questioned') {
          // Play click sound immediately
          onSound?.('click');

          if (cell.isMine) {
            // Game over - hit a mine
            const revealedBoard = revealAllMines(currentBoard);
            setGameStatus('lost');
            setStats(prevStats => updateStats(prevStats, difficulty, false, time));
            resetCombo();
            // Play explosion sound immediately
            onSound?.('explosion');
            return revealedBoard;
          } else {
            const newBoard = revealCell(currentBoard, row, col);
            // Play reveal sound immediately
            onSound?.('reveal');

            // Increment combo for successful reveal
            incrementCombo();

            // Check win condition
            if (checkWin(newBoard)) {
              setGameStatus('won');
              setStats(prevStats => updateStats(prevStats, difficulty, true, time));
              // Play victory sound immediately
              onSound?.('victory');
            }
            return newBoard;
          }
        }

        return currentBoard; // No change if cell is already revealed
      });
    },
    [gameStatus, minesPlaced, config.mines, time, incrementCombo, resetCombo, isPaused, difficulty, saveToHistory, onSound, seed]
  );

  const handleCellRightClick = useCallback(
    (row: number, col: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost' || isPaused) {
        return;
      }

      onSound?.('flag');

      setBoard(currentBoard => {
        const newBoard = toggleFlag(currentBoard, row, col);

        // Check win condition with flags
        if (minesPlaced && checkWin(newBoard)) {
          setGameStatus('won');
          setStats(prevStats => updateStats(prevStats, difficulty, true, time));
          onSound?.('victory');
        }

        return newBoard;
      });

      // Start game on first right click if not started
      if (!minesPlaced && gameStatus === 'idle') {
        setGameStatus('idle'); // Stay idle until first left click
      }
    },
    [gameStatus, minesPlaced, time, isPaused, difficulty, onSound]
  );

  const handleCellMiddleClick = useCallback(
    (row: number, col: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost' || !minesPlaced || isPaused) {
        return;
      }

      // Play click sound immediately
      onSound?.('click');

      setBoard(currentBoard => {
        const newBoard = chordReveal(currentBoard, row, col);

        // Check if any mine was revealed
        let hitMine = false;
        for (let r = 0; r < newBoard.length; r++) {
          for (let c = 0; c < newBoard[0].length; c++) {
            if (
              newBoard[r][c].isMine &&
              newBoard[r][c].state === 'revealed' &&
              currentBoard[r][c].state !== 'revealed'
            ) {
              hitMine = true;
              break;
            }
          }
          if (hitMine) break;
        }

        if (hitMine) {
          const revealedBoard = revealAllMines(newBoard);
          setGameStatus('lost');
          setStats(prevStats => updateStats(prevStats, difficulty, false, time));
          // Play explosion sound immediately
          onSound?.('explosion');
          return revealedBoard;
        } else {
          // Play reveal sound immediately
          onSound?.('reveal');

          // Check win condition
          if (checkWin(newBoard)) {
            setGameStatus('won');
            setStats(prevStats => updateStats(prevStats, difficulty, true, time));
            // Play victory sound immediately
            onSound?.('victory');
          }
          return newBoard;
        }
      });
    },
    [gameStatus, minesPlaced, time, isPaused, difficulty, onSound]
  );

  const canUndo = history.length > 0 && gameStatus === 'playing' && !isPaused;

  return {
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
  };
}
