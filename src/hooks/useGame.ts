import { useState, useEffect, useCallback, useRef } from 'react';
import { Cell, GameConfig, GameStatus, GameStats } from '../types/game';
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

export function useGame(config: GameConfig) {
  const [board, setBoard] = useState<Cell[][]>(() => createBoard(config));
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [minesPlaced, setMinesPlaced] = useState(false);
  const [time, setTime] = useState(0);
  const [stats, setStats] = useState<GameStats>(loadStats);
  const timerRef = useRef<number | null>(null);

  const flagCount = countFlags(board);
  const remainingMines = config.mines - flagCount;

  // Timer effect
  useEffect(() => {
    if (gameStatus === 'playing') {
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
  }, [gameStatus]);

  // Save stats when they change
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  const resetGame = useCallback(() => {
    setBoard(createBoard(config));
    setGameStatus('idle');
    setMinesPlaced(false);
    setTime(0);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [config]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost') {
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

      // Regular click
      if (cell.state === 'hidden' || cell.state === 'questioned') {
        if (cell.isMine) {
          // Game over - hit a mine
          const revealedBoard = revealAllMines(board);
          setBoard(revealedBoard);
          setGameStatus('lost');
          setStats(prevStats => updateStats(prevStats, false, time));
        } else {
          const newBoard = revealCell(board, row, col);
          setBoard(newBoard);

          // Check win condition
          if (checkWin(newBoard, config.mines)) {
            setGameStatus('won');
            setStats(prevStats => updateStats(prevStats, true, time));
          }
        }
      }
    },
    [board, gameStatus, minesPlaced, config.mines, time]
  );

  const handleCellRightClick = useCallback(
    (row: number, col: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost') {
        return;
      }

      const newBoard = toggleFlag(board, row, col);
      setBoard(newBoard);

      // Start game on first right click if not started
      if (!minesPlaced && gameStatus === 'idle') {
        setGameStatus('idle'); // Stay idle until first left click
      }

      // Check win condition with flags
      if (minesPlaced && checkWin(newBoard, config.mines)) {
        setGameStatus('won');
        setStats(prevStats => updateStats(prevStats, true, time));
      }
    },
    [board, gameStatus, minesPlaced, config.mines, time]
  );

  const handleCellMiddleClick = useCallback(
    (row: number, col: number) => {
      if (gameStatus === 'won' || gameStatus === 'lost' || !minesPlaced) {
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
        setStats(prevStats => updateStats(prevStats, false, time));
      } else {
        setBoard(newBoard);

        // Check win condition
        if (checkWin(newBoard, config.mines)) {
          setGameStatus('won');
          setStats(prevStats => updateStats(prevStats, true, time));
        }
      }
    },
    [board, gameStatus, minesPlaced, config.mines, time]
  );

  return {
    board,
    gameStatus,
    time,
    remainingMines,
    stats,
    resetGame,
    handleCellClick,
    handleCellRightClick,
    handleCellMiddleClick,
  };
}
