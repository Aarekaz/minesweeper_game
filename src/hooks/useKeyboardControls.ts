import { useState, useEffect, useCallback } from 'react';

interface UseKeyboardControlsProps {
  rows: number;
  cols: number;
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
  gameOver: boolean;
  enabled?: boolean;
}

export function useKeyboardControls({
  rows,
  cols,
  onCellClick,
  onCellRightClick,
  gameOver,
  enabled = true,
}: UseKeyboardControlsProps) {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled || gameOver) return;

      // Initialize selection at center if not set
      if (!selectedCell && (e.key.startsWith('Arrow') || e.key === ' ' || e.key === 'f')) {
        const centerRow = Math.floor(rows / 2);
        const centerCol = Math.floor(cols / 2);
        setSelectedCell({ row: centerRow, col: centerCol });
        e.preventDefault();
        return;
      }

      if (!selectedCell) return;

      const { row, col } = selectedCell;

      switch (e.key) {
        case 'ArrowUp':
          if (row > 0) {
            setSelectedCell({ row: row - 1, col });
          }
          e.preventDefault();
          break;

        case 'ArrowDown':
          if (row < rows - 1) {
            setSelectedCell({ row: row + 1, col });
          }
          e.preventDefault();
          break;

        case 'ArrowLeft':
          if (col > 0) {
            setSelectedCell({ row, col: col - 1 });
          }
          e.preventDefault();
          break;

        case 'ArrowRight':
          if (col < cols - 1) {
            setSelectedCell({ row, col: col + 1 });
          }
          e.preventDefault();
          break;

        case ' ':
        case 'Enter':
          onCellClick(row, col);
          e.preventDefault();
          break;

        case 'f':
        case 'F':
          onCellRightClick(row, col);
          e.preventDefault();
          break;

        default:
          break;
      }
    },
    [selectedCell, rows, cols, onCellClick, onCellRightClick, gameOver, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  // Reset selection when game is reset or dimensions change
  useEffect(() => {
    setSelectedCell(null);
  }, [rows, cols]);

  return { selectedCell };
}
