import { CELL_TYPES } from '../utils/constants';

// Recursive Division Maze — creates room-like structures with corridors
export function* recursiveDivision(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  const startEnd = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].type === CELL_TYPES.START || grid[r][c].type === CELL_TYPES.END) {
        startEnd.push({ row: r, col: c });
      }
    }
  }

  // Add border walls
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        if (!startEnd.some(p => p.row === r && p.col === c)) {
          yield { row: r, col: c, type: CELL_TYPES.WALL };
        }
      }
    }
  }

  // Recursive division
  const walls = [];
  divide(1, rows - 2, 1, cols - 2, chooseOrientation(cols - 2, rows - 2), walls, startEnd, rows, cols);

  for (const wall of walls) {
    yield wall;
  }

  yield { type: 'done' };
}

function divide(rowStart, rowEnd, colStart, colEnd, orientation, walls, startEnd, totalRows, totalCols) {
  if (rowEnd - rowStart < 1 || colEnd - colStart < 1) return;

  const horizontal = orientation === 'horizontal';

  if (horizontal) {
    // Draw horizontal wall
    const possibleRows = [];
    for (let r = rowStart; r <= rowEnd; r += 2) possibleRows.push(r);
    if (possibleRows.length === 0) return;
    const wallRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];

    // Choose passage
    const possibleCols = [];
    for (let c = colStart; c <= colEnd; c += 1) possibleCols.push(c);
    if (possibleCols.length === 0) return;
    const passage = possibleCols[Math.floor(Math.random() * possibleCols.length)];

    for (let c = colStart; c <= colEnd; c++) {
      if (c === passage) continue;
      if (startEnd.some(p => p.row === wallRow && p.col === c)) continue;
      walls.push({ row: wallRow, col: c, type: CELL_TYPES.WALL });
    }

    divide(rowStart, wallRow - 1, colStart, colEnd, chooseOrientation(colEnd - colStart, wallRow - 1 - rowStart), walls, startEnd, totalRows, totalCols);
    divide(wallRow + 1, rowEnd, colStart, colEnd, chooseOrientation(colEnd - colStart, rowEnd - wallRow - 1), walls, startEnd, totalRows, totalCols);
  } else {
    // Draw vertical wall
    const possibleCols = [];
    for (let c = colStart; c <= colEnd; c += 2) possibleCols.push(c);
    if (possibleCols.length === 0) return;
    const wallCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];

    const possibleRows = [];
    for (let r = rowStart; r <= rowEnd; r += 1) possibleRows.push(r);
    if (possibleRows.length === 0) return;
    const passage = possibleRows[Math.floor(Math.random() * possibleRows.length)];

    for (let r = rowStart; r <= rowEnd; r++) {
      if (r === passage) continue;
      if (startEnd.some(p => p.row === r && p.col === wallCol)) continue;
      walls.push({ row: r, col: wallCol, type: CELL_TYPES.WALL });
    }

    divide(rowStart, rowEnd, colStart, wallCol - 1, chooseOrientation(wallCol - 1 - colStart, rowEnd - rowStart), walls, startEnd, totalRows, totalCols);
    divide(rowStart, rowEnd, wallCol + 1, colEnd, chooseOrientation(colEnd - wallCol - 1, rowEnd - rowStart), walls, startEnd, totalRows, totalCols);
  }
}

function chooseOrientation(width, height) {
  if (width < height) return 'horizontal';
  if (height < width) return 'vertical';
  return Math.random() < 0.5 ? 'horizontal' : 'vertical';
}
