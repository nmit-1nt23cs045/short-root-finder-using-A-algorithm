import { getNeighbors } from '../utils/gridHelpers';
import { CELL_TYPES } from '../utils/constants';

// Depth-First Search — explores as deep as possible, NOT optimal
export function* dfs(grid, startPos, endPos, _heuristicType = 'manhattan', allowDiagonal = false) {
  const rows = grid.length;
  const cols = grid[0].length;

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const cameFrom = Array.from({ length: rows }, () => Array(cols).fill(null));

  const stack = [{ row: startPos.row, col: startPos.col }];
  let visitedCount = 0;

  while (stack.length > 0) {
    const current = stack.pop();
    const { row, col } = current;

    if (visited[row][col]) continue;
    visited[row][col] = true;
    visitedCount++;

    if (row === endPos.row && col === endPos.col) {
      const path = [];
      let curr = { row, col };
      while (curr) {
        path.unshift(curr);
        curr = cameFrom[curr.row][curr.col];
      }
      yield { type: 'path', path, visitedCount, pathCost: path.length - 1 };
      return;
    }

    if (!(row === startPos.row && col === startPos.col)) {
      yield { type: 'visited', row, col, visitedCount };
    }

    const neighbors = getNeighbors(grid, row, col, allowDiagonal);
    for (const neighbor of neighbors) {
      if (!visited[neighbor.row][neighbor.col]) {
        cameFrom[neighbor.row][neighbor.col] = { row, col };
        stack.push({ row: neighbor.row, col: neighbor.col });
      }
    }
  }

  yield { type: 'nopath', visitedCount };
}
