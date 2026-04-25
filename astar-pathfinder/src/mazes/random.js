import { CELL_TYPES } from '../utils/constants';

// Random Wall Placement — configurable density 10-60%
export function* randomMaze(grid, density = 30) {
  const rows = grid.length;
  const cols = grid[0].length;
  const startEnd = [];

  // Find start and end positions
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].type === CELL_TYPES.START || grid[r][c].type === CELL_TYPES.END) {
        startEnd.push({ row: r, col: c });
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Skip start and end
      if (startEnd.some(p => p.row === r && p.col === c)) continue;

      if (Math.random() * 100 < density) {
        yield { row: r, col: c, type: CELL_TYPES.WALL };
      }
    }
  }

  yield { type: 'done' };
}
