// ===== Heuristic Functions =====

export function manhattan(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function euclidean(a, b) {
  return Math.sqrt((a.row - b.row) ** 2 + (a.col - b.col) ** 2);
}

export function chebyshev(a, b) {
  return Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col));
}

export function getHeuristic(type) {
  switch (type) {
    case 'euclidean': return euclidean;
    case 'chebyshev': return chebyshev;
    case 'manhattan':
    default: return manhattan;
  }
}
