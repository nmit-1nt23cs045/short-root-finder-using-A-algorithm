// ===== Cell Types =====
export const CELL_TYPES = {
  EMPTY: 'empty',
  WALL: 'wall',
  START: 'start',
  END: 'end',
  VISITED: 'visited',
  PATH: 'path',
  CURRENT: 'current',
};

// ===== Terrain Types =====
export const TERRAIN_TYPES = {
  NONE: { id: 'none', label: 'None', cost: 1, color: 'transparent', darkColor: 'transparent' },
  GRASS: { id: 'grass', label: 'Grass', cost: 3, color: '#86efac', darkColor: '#166534' },
  FOREST: { id: 'forest', label: 'Forest', cost: 5, color: '#22c55e', darkColor: '#14532d' },
  SAND: { id: 'sand', label: 'Sand', cost: 8, color: '#fde68a', darkColor: '#92400e' },
  WATER: { id: 'water', label: 'Water', cost: 15, color: '#93c5fd', darkColor: '#1e3a5f' },
};

// ===== Cell Colors =====
export const CELL_COLORS = {
  dark: {
    [CELL_TYPES.EMPTY]: '#1e293b',
    [CELL_TYPES.WALL]: '#0f172a',
    [CELL_TYPES.START]: '#22c55e',
    [CELL_TYPES.END]: '#ef4444',
    [CELL_TYPES.VISITED]: '#6366f1',
    [CELL_TYPES.PATH]: '#facc15',
    [CELL_TYPES.CURRENT]: '#f97316',
  },
  light: {
    [CELL_TYPES.EMPTY]: '#e2e8f0',
    [CELL_TYPES.WALL]: '#334155',
    [CELL_TYPES.START]: '#16a34a',
    [CELL_TYPES.END]: '#dc2626',
    [CELL_TYPES.VISITED]: '#818cf8',
    [CELL_TYPES.PATH]: '#eab308',
    [CELL_TYPES.CURRENT]: '#ea580c',
  },
};

// ===== Speed Presets =====
export const SPEED_PRESETS = [
  { label: 'Slow', delay: 150, key: '1' },
  { label: 'Normal', delay: 40, key: '2' },
  { label: 'Fast', delay: 10, key: '3' },
  { label: 'Blazing', delay: 2, key: '4' },
  { label: 'Instant', delay: 0, key: '5' },
];

// ===== Algorithm Options =====
export const ALGORITHMS = [
  { id: 'astar', label: 'A* Search', description: 'Optimal — uses f(n) = g(n) + h(n)' },
  { id: 'dijkstra', label: "Dijkstra's", description: 'Optimal — no heuristic, explores uniformly' },
  { id: 'bfs', label: 'BFS', description: 'Optimal for unweighted — layer by layer' },
  { id: 'dfs', label: 'DFS', description: 'Not optimal — explores depth first' },
  { id: 'greedy', label: 'Greedy Best-First', description: 'Fast but not optimal — uses only h(n)' },
];

// ===== Heuristic Options =====
export const HEURISTICS = [
  { id: 'manhattan', label: 'Manhattan' },
  { id: 'euclidean', label: 'Euclidean' },
  { id: 'chebyshev', label: 'Chebyshev' },
];

// ===== Maze Options =====
export const MAZE_TYPES = [
  { id: 'random', label: 'Random Walls' },
  { id: 'recursiveDivision', label: 'Recursive Division' },
  { id: 'recursiveBacktracker', label: 'Recursive Backtracker' },
];

// ===== Default Grid Settings =====
export const DEFAULT_COLS = 30;
export const DEFAULT_ROWS = 15;
export const MIN_COLS = 10;
export const MAX_COLS = 60;
export const MIN_ROWS = 8;
export const MAX_ROWS = 30;

// ===== Preset Puzzles =====
export const PRESET_PUZZLES = [
  {
    name: 'The Maze Runner',
    description: 'Navigate through a complex maze',
    difficulty: 'Medium',
    cols: 25,
    rows: 15,
  },
  {
    name: 'Island Hopper',
    description: 'Cross water and terrain to reach the goal',
    difficulty: 'Hard',
    cols: 30,
    rows: 18,
  },
  {
    name: 'The Spiral',
    description: 'Find the shortest path through a spiral',
    difficulty: 'Easy',
    cols: 20,
    rows: 15,
  },
];

// ===== Keyboard Shortcuts =====
export const SHORTCUTS = {
  ' ': 'Run / Pause',
  'Escape': 'Stop Algorithm',
  'c': 'Clear Grid',
  'r': 'Reset All',
  '1': 'Slow Speed',
  '2': 'Normal Speed',
  '3': 'Fast Speed',
  '4': 'Blazing Speed',
  '5': 'Instant Speed',
  't': 'Toggle Theme',
  'h': 'Toggle Help',
  'e': 'Export Grid',
};
