import { Cell, GameConfig } from '../types/game';

export function createBoard(config: GameConfig): Cell[][] {
  const { rows, cols } = config;
  const board: Cell[][] = [];

  for (let row = 0; row < rows; row++) {
    board[row] = [];
    for (let col = 0; col < cols; col++) {
      board[row][col] = {
        isMine: false,
        neighborMines: 0,
        state: 'hidden',
        row,
        col,
      };
    }
  }

  return board;
}

export function placeMines(
  board: Cell[][],
  mineCount: number,
  firstClickRow: number,
  firstClickCol: number
): Cell[][] {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));

  let minesPlaced = 0;
  const safeZone = new Set<string>();

  // Create safe zone around first click (3x3 area)
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = firstClickRow + dr;
      const c = firstClickCol + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        safeZone.add(`${r},${c}`);
      }
    }
  }

  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    const key = `${row},${col}`;

    if (!newBoard[row][col].isMine && !safeZone.has(key)) {
      newBoard[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighbor mines
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!newBoard[row][col].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < rows && c >= 0 && c < cols && newBoard[r][c].isMine) {
              count++;
            }
          }
        }
        newBoard[row][col].neighborMines = count;
      }
    }
  }

  return newBoard;
}

// Helper function that mutates the board directly (more efficient)
function revealCellMutate(board: Cell[][], row: number, col: number): void {
  if (
    row < 0 ||
    row >= board.length ||
    col < 0 ||
    col >= board[0].length ||
    board[row][col].state !== 'hidden'
  ) {
    return;
  }

  board[row][col].state = 'revealed';

  // If cell has no neighbor mines, reveal adjacent cells recursively
  if (board[row][col].neighborMines === 0 && !board[row][col].isMine) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        revealCellMutate(board, newRow, newCol);
      }
    }
  }
}

// Public function that creates a single copy and uses the mutating helper
export function revealCell(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = board.map(r => r.map(c => ({ ...c })));
  revealCellMutate(newBoard, row, col);
  return newBoard;
}

export function revealAllMines(board: Cell[][]): Cell[][] {
  return board.map(row =>
    row.map(cell => ({
      ...cell,
      state: cell.isMine ? 'revealed' : cell.state,
    }))
  );
}

export function toggleFlag(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = board.map(r => r.map(c => ({ ...c })));
  const cell = newBoard[row][col];

  if (cell.state === 'hidden') {
    cell.state = 'flagged';
  } else if (cell.state === 'flagged') {
    cell.state = 'questioned';
  } else if (cell.state === 'questioned') {
    cell.state = 'hidden';
  }

  return newBoard;
}

export function checkWin(board: Cell[][]): boolean {
  let hiddenNonMineCount = 0;

  for (const row of board) {
    for (const cell of row) {
      // Count only non-mine cells that are not revealed
      if (!cell.isMine && cell.state !== 'revealed') {
        hiddenNonMineCount++;
      }
    }
  }

  // Win if all non-mine cells are revealed
  return hiddenNonMineCount === 0;
}

export function countFlags(board: Cell[][]): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === 'flagged') {
        count++;
      }
    }
  }
  return count;
}

export function chordReveal(board: Cell[][], row: number, col: number): Cell[][] {
  const cell = board[row][col];

  if (cell.state !== 'revealed' || cell.neighborMines === 0) {
    return board;
  }

  // Count flagged neighbors
  let flaggedCount = 0;
  const rows = board.length;
  const cols = board[0].length;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        if (board[r][c].state === 'flagged') {
          flaggedCount++;
        }
      }
    }
  }

  // If flagged count matches neighbor mines, reveal all non-flagged neighbors
  if (flaggedCount === cell.neighborMines) {
    let newBoard = board;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          if (board[r][c].state === 'hidden' || board[r][c].state === 'questioned') {
            newBoard = revealCell(newBoard, r, c);
          }
        }
      }
    }
    return newBoard;
  }

  return board;
}
