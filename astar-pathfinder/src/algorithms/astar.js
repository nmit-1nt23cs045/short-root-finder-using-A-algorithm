import { MinHeap } from '../utils/minHeap';
import { getHeuristic } from '../utils/heuristics';
import { getNeighbors, getMovementCost } from '../utils/gridHelpers';
import { CELL_TYPES } from '../utils/constants';

// A* Search Algorithm — generator function for step-by-step animation
// f(n) = g(n) + h(n) where g = actual cost, h = estimated cost to goal
export function* astar(grid, startPos, endPos, heuristicType = 'manhattan', allowDiagonal = false) {
  const heuristic = getHeuristic(heuristicType);
  const rows = grid.length;
  const cols = grid[0].length;

  // Initialize data structures
  const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const cameFrom = Array.from({ length: rows }, () => Array(cols).fill(null));
  const closedSet = Array.from({ length: rows }, () => Array(cols).fill(false));

  const openSet = new MinHeap();
  gScore[startPos.row][startPos.col] = 0;
  fScore[startPos.row][startPos.col] = heuristic(startPos, endPos);

  openSet.push({
    row: startPos.row,
    col: startPos.col,
    f: fScore[startPos.row][startPos.col],
  });

  let visitedCount = 0;

  while (!openSet.isEmpty()) {
    const current = openSet.pop();
    const { row, col } = current;

    // Skip if already processed
    if (closedSet[row][col]) continue;
    closedSet[row][col] = true;
    visitedCount++;

    // Check if we reached the end
    if (row === endPos.row && col === endPos.col) {
      // Reconstruct path
      const path = [];
      let curr = { row, col };
      while (curr) {
        path.unshift(curr);
        curr = cameFrom[curr.row][curr.col];
      }
      yield { type: 'path', path, visitedCount, pathCost: gScore[row][col] };
      return;
    }

    // Yield visited cell for animation
    if (!(row === startPos.row && col === startPos.col)) {
      yield { type: 'visited', row, col, visitedCount };
    }

    // Explore neighbors
    const neighbors = getNeighbors(grid, row, col, allowDiagonal);
    for (const neighbor of neighbors) {
      if (closedSet[neighbor.row][neighbor.col]) continue;

      const moveCost = getMovementCost(grid[row][col], neighbor);
      const tentativeG = gScore[row][col] + moveCost;

      if (tentativeG < gScore[neighbor.row][neighbor.col]) {
        cameFrom[neighbor.row][neighbor.col] = { row, col };
        gScore[neighbor.row][neighbor.col] = tentativeG;
        fScore[neighbor.row][neighbor.col] = tentativeG + heuristic(neighbor, endPos);
        openSet.push({
          row: neighbor.row,
          col: neighbor.col,
          f: fScore[neighbor.row][neighbor.col],
        });
      }
    }
  }

  // No path found
  yield { type: 'nopath', visitedCount };
}
