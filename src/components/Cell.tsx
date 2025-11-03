import React, { useState, useEffect } from 'react';
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
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [justRevealed, setJustRevealed] = useState(false);
  const [exploding, setExploding] = useState(false);

  // Track when cell is revealed for animation
  useEffect(() => {
    if (cell.state === 'revealed' && !justRevealed) {
      setJustRevealed(true);

      // Check if it's a mine for explosion effect
      if (cell.isMine) {
        setExploding(true);
        createExplosionParticles();
        setTimeout(() => setExploding(false), 600);
      }
    }
  }, [cell.state, cell.isMine]);

  const createExplosionParticles = () => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      color: ['#ff0000', '#ff6600', '#ffaa00'][Math.floor(Math.random() * 3)]
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  const createClickParticles = (color: string) => {
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 60 - 30,
      y: Math.random() * 60 - 30,
      color
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 600);
  };
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameOver) {
      return;
    }
    if (e.button === 0) {
      if (cell.state === 'hidden') {
        createClickParticles('#60a5fa');
      }
      onClick();
    } else if (e.button === 1) {
      onMiddleClick();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cell.state === 'hidden' || cell.state === 'flagged' || cell.state === 'questioned') {
      createClickParticles('#ff0000');
    }
    onRightClick();
  };

  const getNumberColor = (num: number): string => {
    const colors = [
      '',
      '#60a5fa', // 1 - bright blue
      '#34d399', // 2 - bright green
      '#f87171', // 3 - bright red
      '#818cf8', // 4 - bright indigo
      '#fb923c', // 5 - bright orange
      '#a78bfa', // 6 - bright purple
      '#fbbf24', // 7 - bright yellow
      '#e879f9', // 8 - bright pink
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
      if (justRevealed) {
        classes.push('cell-reveal-animation');
      }
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

    if (exploding) {
      classes.push('cell-exploding');
    }

    return classes.join(' ');
  };

  return (
    <button
      className={getCellClassName()}
      onContextMenu={handleContextMenu}
      onMouseDown={handleClick}
      disabled={false}
    >
      {getCellContent()}

      {/* Particle effects */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `calc(50% + ${particle.x}px)`,
            top: `calc(50% + ${particle.y}px)`,
            background: particle.color,
          }}
        />
      ))}

      {/* Ripple effect on hover */}
      <div className="cell-ripple" />
    </button>
  );
};

export default Cell;
