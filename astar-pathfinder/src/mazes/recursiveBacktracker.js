import { CELL_TYPES } from '../utils/constants';

// Recursive Backtracker Maze — classic winding perfect maze using DFS
export function* recursiveBacktracker(grid) {
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

  // First fill everything with walls
  const wallCells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!startEnd.some(p => p.row === r && p.col === c)) {
        wallCells.push({ row: r, col: c, type: CELL_TYPES.WALL });
      }
    }
  }

  // Yield all walls at once
  for (const wall of wallCells) {
    yield wall;
  }

  // Now carve passages using recursive backtracker
  const cellRows = Math.floor((rows - 1) / 2);
  const cellCols = Math.floor((cols - 1) / 2);
  const visited = Array.from({ length: cellRows }, () => Array(cellCols).fill(false));

  const stack = [];
  const startCellRow = 0;
  const startCellCol = 0;
  visited[startCellRow][startCellCol] = true;
  stack.push({ row: startCellRow, col: startCellCol });

  // Carve starting cell
  const gridRow = startCellRow * 2 + 1;
  const gridCol = startCellCol * 2 + 1;
  if (gridRow < rows && gridCol < cols) {
    yield { row: gridRow, col: gridCol, type: CELL_TYPES.EMPTY };
  }

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];

    // Find unvisited neighbors
    const unvisited = [];
    for (const [dr, dc] of directions) {
      const nr = current.row + dr;
      const nc = current.col + dc;
      if (nr >= 0 && nr < cellRows && nc >= 0 && nc < cellCols && !visited[nr][nc]) {
        unvisited.push({ row: nr, col: nc, dr, dc });
      }
    }

    if (unvisited.length === 0) {
      stack.pop();
      continue;
    }

    // Choose random unvisited neighbor
    const next = unvisited[Math.floor(Math.random() * unvisited.length)];
    visited[next.row][next.col] = true;
    stack.push({ row: next.row, col: next.col });

    // Carve passage between current and next
    const wallRow = current.row * 2 + 1 + next.dr;
    const wallCol = current.col * 2 + 1 + next.dc;
    const nextGridRow = next.row * 2 + 1;
    const nextGridCol = next.col * 2 + 1;

    if (wallRow >= 0 && wallRow < rows && wallCol >= 0 && wallCol < cols) {
      if (!startEnd.some(p => p.row === wallRow && p.col === wallCol)) {
        yield { row: wallRow, col: wallCol, type: CELL_TYPES.EMPTY };
      }
    }
    if (nextGridRow >= 0 && nextGridRow < rows && nextGridCol >= 0 && nextGridCol < cols) {
      if (!startEnd.some(p => p.row === nextGridRow && p.col === nextGridCol)) {
        yield { row: nextGridRow, col: nextGridCol, type: CELL_TYPES.EMPTY };
      }
    }
  }

  // Ensure start and end are not walled
  for (const se of startEnd) {
    // Also clear adjacent cells to ensure connectivity
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of dirs) {
      const nr = se.row + dr;
      const nc = se.col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        yield { row: nr, col: nc, type: CELL_TYPES.EMPTY };
      }
    }
  }

  yield { type: 'done' };
}
