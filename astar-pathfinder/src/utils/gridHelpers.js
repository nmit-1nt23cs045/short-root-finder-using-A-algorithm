import { CELL_TYPES, TERRAIN_TYPES } from './constants';

// Create a fresh grid with all empty cells
export function createGrid(rows, cols, startPos = null, endPos = null) {
  const sRow = startPos?.row ?? Math.floor(rows / 2);
  const sCol = startPos?.col ?? Math.floor(cols / 4);
  const eRow = endPos?.row ?? Math.floor(rows / 2);
  const eCol = endPos?.col ?? Math.floor((cols * 3) / 4);

  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        type: CELL_TYPES.EMPTY,
        terrain: TERRAIN_TYPES.NONE,
        isVisited: false,
        isPath: false,
        isCurrent: false,
        visitCount: 0,
      });
    }
    grid.push(row);
  }

  grid[sRow][sCol].type = CELL_TYPES.START;
  grid[eRow][eCol].type = CELL_TYPES.END;

  return grid;
}

// Clear visited/path cells but keep walls and terrain
export function clearVisualization(grid) {
  return grid.map(row =>
    row.map(cell => ({
      ...cell,
      isVisited: false,
      isPath: false,
      isCurrent: false,
      visitCount: 0,
      type: cell.type === CELL_TYPES.VISITED || cell.type === CELL_TYPES.PATH || cell.type === CELL_TYPES.CURRENT
        ? CELL_TYPES.EMPTY
        : cell.type,
    }))
  );
}

// Clear everything except start and end
export function clearGrid(grid) {
  return grid.map(row =>
    row.map(cell => ({
      ...cell,
      type: cell.type === CELL_TYPES.START || cell.type === CELL_TYPES.END ? cell.type : CELL_TYPES.EMPTY,
      terrain: TERRAIN_TYPES.NONE,
      isVisited: false,
      isPath: false,
      isCurrent: false,
      visitCount: 0,
    }))
  );
}

// Find start and end positions
export function findStartEnd(grid) {
  let start = null, end = null;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.type === CELL_TYPES.START) start = { row: cell.row, col: cell.col };
      if (cell.type === CELL_TYPES.END) end = { row: cell.row, col: cell.col };
    }
  }
  return { start, end };
}

// Get neighbors for a cell (4 or 8 directions)
export function getNeighbors(grid, row, col, allowDiagonal = false) {
  const rows = grid.length;
  const cols = grid[0].length;
  const neighbors = [];
  const dirs4 = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const dirs8 = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
  const dirs = allowDiagonal ? dirs8 : dirs4;

  for (const [dr, dc] of dirs) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].type !== CELL_TYPES.WALL) {
      // For diagonal moves, check that we don't cut through walls
      if (Math.abs(dr) + Math.abs(dc) === 2) {
        if (grid[row + dr][col].type === CELL_TYPES.WALL && grid[row][col + dc].type === CELL_TYPES.WALL) {
          continue;
        }
      }
      neighbors.push(grid[nr][nc]);
    }
  }
  return neighbors;
}

// Get movement cost between cells
export function getMovementCost(fromCell, toCell) {
  const isDiagonal = Math.abs(fromCell.row - toCell.row) + Math.abs(fromCell.col - toCell.col) === 2;
  const baseCost = isDiagonal ? 1.414 : 1;
  const terrainCost = toCell.terrain?.cost ?? 1;
  return baseCost * terrainCost;
}

// Serialize grid to JSON
export function serializeGrid(grid, rows, cols) {
  const cells = [];
  for (const row of grid) {
    for (const cell of row) {
      if (cell.type === CELL_TYPES.WALL || cell.type === CELL_TYPES.START || cell.type === CELL_TYPES.END || cell.terrain.id !== 'none') {
        cells.push({
          r: cell.row,
          c: cell.col,
          t: cell.type,
          tr: cell.terrain.id !== 'none' ? cell.terrain.id : undefined,
        });
      }
    }
  }
  return JSON.stringify({ rows, cols, cells, version: 1 });
}

// Deserialize grid from JSON
export function deserializeGrid(json) {
  try {
    const data = JSON.parse(json);
    const grid = createGrid(data.rows, data.cols);
    // Clear default start/end
    for (const row of grid) {
      for (const cell of row) {
        if (cell.type === CELL_TYPES.START || cell.type === CELL_TYPES.END) {
          cell.type = CELL_TYPES.EMPTY;
        }
      }
    }
    for (const c of data.cells) {
      if (c.r < data.rows && c.c < data.cols) {
        grid[c.r][c.c].type = c.t;
        if (c.tr) {
          const terrainKey = Object.keys(TERRAIN_TYPES).find(k => TERRAIN_TYPES[k].id === c.tr);
          if (terrainKey) grid[c.r][c.c].terrain = TERRAIN_TYPES[terrainKey];
        }
      }
    }
    return { grid, rows: data.rows, cols: data.cols };
  } catch {
    return null;
  }
}
