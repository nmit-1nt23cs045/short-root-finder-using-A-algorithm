import { MinHeap } from '../utils/minHeap';
import { getHeuristic } from '../utils/heuristics';
import { getNeighbors } from '../utils/gridHelpers';
import { CELL_TYPES } from '../utils/constants';

// Greedy Best-First Search — uses only h(n), ignores g(n)
// Fast but NOT optimal
export function* greedy(grid, startPos, endPos, heuristicType = 'manhattan', allowDiagonal = false) {
  const heuristic = getHeuristic(heuristicType);
  const rows = grid.length;
  const cols = grid[0].length;

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const cameFrom = Array.from({ length: rows }, () => Array(cols).fill(null));

  const openSet = new MinHeap();
  openSet.push({
    row: startPos.row,
    col: startPos.col,
    f: heuristic(startPos, endPos),
  });

  let visitedCount = 0;

  while (!openSet.isEmpty()) {
    const current = openSet.pop();
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
        openSet.push({
          row: neighbor.row,
          col: neighbor.col,
          f: heuristic(neighbor, endPos),
        });
      }
    }
  }

  yield { type: 'nopath', visitedCount };
}
