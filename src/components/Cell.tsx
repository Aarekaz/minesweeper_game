import React from 'react';
import { Cell as CellType } from '../types/game';
import './Cell.css';

interface CellProps {
  cell: CellType;
  onClick: () => void;
  onRightClick: () => void;
  onMiddleClick: () => void;
  gameOver: boolean;
}

const Cell: React.FC<CellProps> = ({
  cell,
  onClick,
  onRightClick,
  onMiddleClick,
  gameOver,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button === 0) {
      onClick();
    } else if (e.button === 1) {
      onMiddleClick();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick();
  };

  const getNumberColor = (num: number): string => {
    const colors = [
      '',
      '#0051ff', // 1 - blue
      '#00aa00', // 2 - green
      '#ff0000', // 3 - red
      '#000088', // 4 - dark blue
      '#880000', // 5 - dark red
      '#008888', // 6 - teal
      '#000000', // 7 - black
      '#666666', // 8 - gray
    ];
    return colors[num] || '';
  };

  const getCellContent = () => {
    if (cell.state === 'flagged') {
      return <span className="cell-flag">🚩</span>;
    }

    if (cell.state === 'questioned') {
      return <span className="cell-question">?</span>;
    }

    if (cell.state === 'revealed') {
      if (cell.isMine) {
        return <span className="cell-mine">💣</span>;
      }

      if (cell.neighborMines > 0) {
        return (
          <span
            className="cell-number"
            style={{ color: getNumberColor(cell.neighborMines) }}
          >
            {cell.neighborMines}
          </span>
        );
      }
    }

    return null;
  };

  const getCellClassName = () => {
    const classes = ['cell'];

    if (cell.state === 'revealed') {
      classes.push('cell-revealed');
      if (cell.isMine) {
        classes.push('cell-mine-revealed');
      }
    } else {
      classes.push('cell-hidden');
    }

    if (cell.state === 'flagged') {
      classes.push('cell-flagged');
    }

    if (cell.state === 'questioned') {
      classes.push('cell-questioned');
    }

    return classes.join(' ');
  };

  return (
    <button
      className={getCellClassName()}
      onContextMenu={handleContextMenu}
      onMouseDown={handleClick}
      disabled={gameOver && cell.state !== 'revealed'}
    >
      {getCellContent()}
    </button>
  );
};

export default Cell;
