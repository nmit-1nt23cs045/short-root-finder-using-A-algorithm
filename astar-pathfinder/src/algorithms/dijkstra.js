import { MinHeap } from '../utils/minHeap';
import { getNeighbors, getMovementCost } from '../utils/gridHelpers';
import { CELL_TYPES } from '../utils/constants';

// Dijkstra's Algorithm — like A* but h(n) = 0, explores uniformly
export function* dijkstra(grid, startPos, endPos, _heuristicType = 'manhattan', allowDiagonal = false) {
  const rows = grid.length;
  const cols = grid[0].length;

  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const cameFrom = Array.from({ length: rows }, () => Array(cols).fill(null));
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  const openSet = new MinHeap();
  dist[startPos.row][startPos.col] = 0;
  openSet.push({ row: startPos.row, col: startPos.col, f: 0 });

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
      yield { type: 'path', path, visitedCount, pathCost: dist[row][col] };
      return;
    }

    if (!(row === startPos.row && col === startPos.col)) {
      yield { type: 'visited', row, col, visitedCount };
    }

    const neighbors = getNeighbors(grid, row, col, allowDiagonal);
    for (const neighbor of neighbors) {
      if (visited[neighbor.row][neighbor.col]) continue;

      const moveCost = getMovementCost(grid[row][col], neighbor);
      const newDist = dist[row][col] + moveCost;

      if (newDist < dist[neighbor.row][neighbor.col]) {
        dist[neighbor.row][neighbor.col] = newDist;
        cameFrom[neighbor.row][neighbor.col] = { row, col };
        openSet.push({ row: neighbor.row, col: neighbor.col, f: newDist });
      }
    }
  }

  yield { type: 'nopath', visitedCount };
}
