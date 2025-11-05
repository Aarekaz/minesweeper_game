import React, { useMemo, useState, useEffect } from 'react';
import { Cell as CellType } from '../types/game';
import Cell from './Cell';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import './Board.css';

interface BoardProps {
  board: CellType[][];
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
  onCellMiddleClick: (row: number, col: number) => void;
  gameOver: boolean;
}

const Board: React.FC<BoardProps> = ({
  board,
  onCellClick,
  onCellRightClick,
  onCellMiddleClick,
  gameOver,
}) => {
  const rows = board.length;
  const cols = board[0]?.length || 0;

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
    const headerHeight = 120; // Space for floating header + margin
    const padding = 40; // Minimal padding around board
    const availableHeight = windowSize.height - headerHeight - padding;
    const availableWidth = windowSize.width - padding;

    // Calculate cell size based on available space, accounting for grid gaps
    const gapSize = 2; // Must match CSS gap value
    const totalGapHeight = (rows - 1) * gapSize;
    const totalGapWidth = (cols - 1) * gapSize;

    const cellSizeByHeight = (availableHeight - totalGapHeight) / rows;
    const cellSizeByWidth = (availableWidth - totalGapWidth) / cols;

    // Use the smaller dimension to ensure board fits
    const cellSize = Math.min(cellSizeByHeight, cellSizeByWidth, 56); // Max 56px per cell
    const minCellSize = 24; // Minimum 24px per cell

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
            gameOver={gameOver}
            isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
          />
        ))
      )}
    </div>
  );
};

export default Board;
