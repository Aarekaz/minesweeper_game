import React from 'react';
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

  return (
    <div
      className="board"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
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
