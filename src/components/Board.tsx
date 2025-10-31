import React, { useMemo } from 'react';
import { Cell as CellType } from '../types/game';
import Cell from './Cell';
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

  // Calculate optimal cell size to fill screen while maintaining square cells
  const boardDimensions = useMemo(() => {
    const headerHeight = 60; // Approximate header height
    const padding = 40; // Total padding
    const availableHeight = window.innerHeight - headerHeight - padding;
    const availableWidth = window.innerWidth - padding;

    // Calculate cell size based on available space
    const cellSizeByHeight = availableHeight / rows;
    const cellSizeByWidth = availableWidth / cols;

    // Use the smaller dimension to ensure board fits
    const cellSize = Math.min(cellSizeByHeight, cellSizeByWidth, 48); // Max 48px per cell
    const minCellSize = 24; // Minimum 24px per cell

    const finalCellSize = Math.max(minCellSize, Math.floor(cellSize));

    return {
      width: `${cols * finalCellSize}px`,
      height: `${rows * finalCellSize}px`,
      cellSize: `${finalCellSize}px`,
    };
  }, [rows, cols]);

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
          />
        ))
      )}
    </div>
  );
};

export default Board;
