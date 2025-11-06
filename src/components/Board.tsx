import React, { useMemo, useState, useEffect } from 'react';
import { Cell as CellType, GameStatus } from '../types/game';
import Cell from './Cell';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import './Board.css';

interface BoardProps {
  board: CellType[][];
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
  onCellMiddleClick: (row: number, col: number) => void;
  gameStatus: GameStatus;
}

const Board: React.FC<BoardProps> = ({
  board,
  onCellClick,
  onCellRightClick,
  onCellMiddleClick,
  gameStatus,
}) => {
  const rows = board.length;
  const cols = board[0]?.length || 0;
  const gameOver = gameStatus === 'won' || gameStatus === 'lost';

  // Keyboard controls
  const { selectedCell } = useKeyboardControls({
    rows,
    cols,
    onCellClick,
    onCellRightClick,
    gameOver,
  });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Listen for window resize events
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate optimal cell size to fill screen while maintaining square cells
  const boardDimensions = useMemo(() => {
    const isMobile = windowSize.width <= 768;
    const isSmallMobile = windowSize.width <= 480;
    const isTinyMobile = windowSize.width <= 380;

    // Responsive header height calculation
    let headerHeight = 120;
    if (isTinyMobile) {
      headerHeight = 110;
    } else if (isSmallMobile) {
      headerHeight = 120;
    } else if (isMobile) {
      headerHeight = 140;
    }

    // Responsive padding
    const padding = isTinyMobile ? 16 : isSmallMobile ? 20 : isMobile ? 24 : 40;

    const availableHeight = windowSize.height - headerHeight - padding;
    const availableWidth = windowSize.width - padding;

    // Calculate cell size based on available space, accounting for grid gaps
    let gapSize = 2; // Must match CSS gap value
    if (isSmallMobile) gapSize = 1;
    if (isMobile && !isSmallMobile) gapSize = 1.5;

    const totalGapHeight = (rows - 1) * gapSize;
    const totalGapWidth = (cols - 1) * gapSize;

    const cellSizeByHeight = (availableHeight - totalGapHeight) / rows;
    const cellSizeByWidth = (availableWidth - totalGapWidth) / cols;

    // Use the smaller dimension to ensure board fits
    const maxCellSize = isMobile ? 48 : 56;
    const cellSize = Math.min(cellSizeByHeight, cellSizeByWidth, maxCellSize);
    const minCellSize = isTinyMobile ? 20 : isSmallMobile ? 22 : 24;

    const finalCellSize = Math.max(minCellSize, Math.floor(cellSize));

    return {
      width: `${cols * finalCellSize + totalGapWidth}px`,
      height: `${rows * finalCellSize + totalGapHeight}px`,
      cellSize: `${finalCellSize}px`,
    };
  }, [rows, cols, windowSize]);

  return (
    <div
      className="board"
      style={{
        gridTemplateRows: `repeat(${rows}, ${boardDimensions.cellSize})`,
        gridTemplateColumns: `repeat(${cols}, ${boardDimensions.cellSize})`,
        width: boardDimensions.width,
        height: boardDimensions.height,
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
            onRightClick={() => onCellRightClick(rowIndex, colIndex)}
            onMiddleClick={() => onCellMiddleClick(rowIndex, colIndex)}
            gameStatus={gameStatus}
            isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
          />
        ))
      )}
    </div>
  );
};

export default Board;
