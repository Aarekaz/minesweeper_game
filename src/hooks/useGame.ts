import { useState, useEffect, useCallback, useRef } from 'react';
import { Cell, GameConfig, GameStatus, GameStats, Difficulty } from '../types/game';
import {
  createBoard,
  placeMines,
  revealCell,
  revealAllMines,
  toggleFlag,
  checkWin,
  countFlags,
  chordReveal,
} from '../utils/gameLogic';
import { loadStats, saveStats, updateStats } from '../utils/storage';

interface BoardHistory {
  board: Cell[][];
  time: number;
  combo: number;
}

const MAX_UNDO_HISTORY = 10;

interface UseGameOptions {
  onSound?: (type: 'click' | 'flag' | 'reveal' | 'explosion' | 'victory' | 'combo', options?: { comboLevel?: number }) => void;
}

export function useGame(config: GameConfig, difficulty: Difficulty, options?: UseGameOptions) {
  const { onSound } = options || {};
  const [board, setBoard] = useState<Cell[][]>(() => createBoard(config));
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [minesPlaced, setMinesPlaced] = useState(false);
  const [time, setTime] = useState(0);
  const [stats, setStats] = useState<GameStats>(loadStats);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [history, setHistory] = useState<BoardHistory[]>([]);
  const timerRef = useRef<number | null>(null);
  const comboTimerRef = useRef<number | null>(null);

  const flagCount = countFlags(board);
  const remainingMines = config.mines - flagCount;

  const togglePause = useCallback(() => {
    if (gameStatus === 'playing') {
      setIsPaused(prev => !prev);
    }
  }, [gameStatus]);

  const saveToHistory = useCallback(() => {
    setHistory(prev => {
      const newHistory = [...prev, { board, time, combo }];
      // Keep only the last MAX_UNDO_HISTORY states
      if (newHistory.length > MAX_UNDO_HISTORY) {
        return newHistory.slice(-MAX_UNDO_HISTORY);
      }
      return newHistory;
    });
  }, [board, time, combo]);

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

      const cell = board[row][col];

      if (cell.state === 'flagged') {
        return;
      }

      // First click - place mines and start game
      if (!minesPlaced) {
        const newBoard = placeMines(board, config.mines, row, col);
        const revealedBoard = revealCell(newBoard, row, col);
        setBoard(revealedBoard);
        setMinesPlaced(true);
        setGameStatus('playing');
        return;
      }

      // Save state before making changes
      saveToHistory();

      // Regular click
      if (cell.state === 'hidden' || cell.state === 'questioned') {
        onSound?.('click');

        if (cell.isMine) {
          // Game over - hit a mine
          const revealedBoard = revealAllMines(board);
          setBoard(revealedBoard);
          setGameStatus('lost');
          setStats(prevStats => updateStats(prevStats, difficulty, false, time));
          resetCombo();
          onSound?.('explosion');
        } else {
          const newBoard = revealCell(board, row, col);
          setBoard(newBoard);
          onSound?.('reveal');

          // Increment combo for successful reveal
          incrementCombo();

          // Check win condition
          if (checkWin(newBoard)) {
            setGameStatus('won');
            setStats(prevStats => updateStats(prevStats, difficulty, true, time));
            onSound?.('victory');
          }
        }
      }
    },
    [board, gameStatus, minesPlaced, config.mines, time, incrementCombo, resetCombo, isPaused, difficulty, saveToHistory, onSound]
  );

  const handleCellRightClick = useCallback(
    (row: number, col: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost' || isPaused) {
        return;
      }

      onSound?.('flag');
      const newBoard = toggleFlag(board, row, col);
      setBoard(newBoard);

      // Start game on first right click if not started
      if (!minesPlaced && gameStatus === 'idle') {
        setGameStatus('idle'); // Stay idle until first left click
      }

      // Check win condition with flags
      if (minesPlaced && checkWin(newBoard)) {
        setGameStatus('won');
        setStats(prevStats => updateStats(prevStats, difficulty, true, time));
        onSound?.('victory');
      }
    },
    [board, gameStatus, minesPlaced, config.mines, time, isPaused, difficulty, onSound]
  );

  const handleCellMiddleClick = useCallback(
    (row: number, col: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost' || !minesPlaced || isPaused) {
        return;
      }

      const newBoard = chordReveal(board, row, col);

      // Check if any mine was revealed
      let hitMine = false;
      for (let r = 0; r < newBoard.length; r++) {
        for (let c = 0; c < newBoard[0].length; c++) {
          if (
            newBoard[r][c].isMine &&
            newBoard[r][c].state === 'revealed' &&
            board[r][c].state !== 'revealed'
          ) {
            hitMine = true;
            break;
          }
        }
        if (hitMine) break;
      }

      if (hitMine) {
        const revealedBoard = revealAllMines(newBoard);
        setBoard(revealedBoard);
        setGameStatus('lost');
        setStats(prevStats => updateStats(prevStats, difficulty, false, time));
        onSound?.('explosion');
      } else {
        setBoard(newBoard);
        onSound?.('reveal');

        // Check win condition
        if (checkWin(newBoard)) {
          setGameStatus('won');
          setStats(prevStats => updateStats(prevStats, difficulty, true, time));
          onSound?.('victory');
        }
      }
    },
    [board, gameStatus, minesPlaced, config.mines, time, isPaused, difficulty, onSound]
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
