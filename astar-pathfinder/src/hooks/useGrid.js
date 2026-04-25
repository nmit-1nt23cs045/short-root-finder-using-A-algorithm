import { useState, useCallback, useRef } from 'react';
import { createGrid, clearGrid, clearVisualization, findStartEnd } from '../utils/gridHelpers';
import { CELL_TYPES, TERRAIN_TYPES, DEFAULT_ROWS, DEFAULT_COLS } from '../utils/constants';

export function useGrid() {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [grid, setGrid] = useState(() => createGrid(DEFAULT_ROWS, DEFAULT_COLS));
  const [activeTerrain, setActiveTerrain] = useState(null);
  const isDragging = useRef(false);
  const dragType = useRef(null); // 'wall', 'erase', 'start', 'end', 'terrain'
  const isRunning = useRef(false);

  const setIsRunning = useCallback((val) => {
    isRunning.current = val;
  }, []);

  const handleMouseDown = useCallback((row, col, e) => {
    if (isRunning.current) return;
    e.preventDefault();
    isDragging.current = true;

    const cell = grid[row][col];

    if (cell.type === CELL_TYPES.START) {
      dragType.current = 'start';
    } else if (cell.type === CELL_TYPES.END) {
      dragType.current = 'end';
    } else if (e.button === 2 || e.ctrlKey) {
      // Right-click or ctrl+click = erase
      dragType.current = 'erase';
      setGrid(prev => {
        const newGrid = prev.map(r => r.map(c => ({ ...c })));
        newGrid[row][col].type = CELL_TYPES.EMPTY;
        newGrid[row][col].terrain = TERRAIN_TYPES.NONE;
        return newGrid;
      });
    } else if (activeTerrain) {
      dragType.current = 'terrain';
      setGrid(prev => {
        const newGrid = prev.map(r => r.map(c => ({ ...c })));
        if (newGrid[row][col].type !== CELL_TYPES.START && newGrid[row][col].type !== CELL_TYPES.END) {
          newGrid[row][col].type = CELL_TYPES.EMPTY;
          newGrid[row][col].terrain = activeTerrain;
        }
        return newGrid;
      });
    } else {
      dragType.current = 'wall';
      setGrid(prev => {
        const newGrid = prev.map(r => r.map(c => ({ ...c })));
        if (newGrid[row][col].type !== CELL_TYPES.START && newGrid[row][col].type !== CELL_TYPES.END) {
          newGrid[row][col].type = CELL_TYPES.WALL;
          newGrid[row][col].terrain = TERRAIN_TYPES.NONE;
        }
        return newGrid;
      });
    }
  }, [grid, activeTerrain]);

  const handleMouseEnter = useCallback((row, col) => {
    if (!isDragging.current || isRunning.current) return;

    setGrid(prev => {
      const newGrid = prev.map(r => r.map(c => ({ ...c })));
      const cell = newGrid[row][col];

      if (dragType.current === 'start') {
        if (cell.type !== CELL_TYPES.END) {
          // Clear old start
          for (const r of newGrid) for (const c of r) {
            if (c.type === CELL_TYPES.START) c.type = CELL_TYPES.EMPTY;
          }
          newGrid[row][col].type = CELL_TYPES.START;
        }
      } else if (dragType.current === 'end') {
        if (cell.type !== CELL_TYPES.START) {
          for (const r of newGrid) for (const c of r) {
            if (c.type === CELL_TYPES.END) c.type = CELL_TYPES.EMPTY;
          }
          newGrid[row][col].type = CELL_TYPES.END;
        }
      } else if (dragType.current === 'wall') {
        if (cell.type !== CELL_TYPES.START && cell.type !== CELL_TYPES.END) {
          newGrid[row][col].type = CELL_TYPES.WALL;
          newGrid[row][col].terrain = TERRAIN_TYPES.NONE;
        }
      } else if (dragType.current === 'erase') {
        if (cell.type !== CELL_TYPES.START && cell.type !== CELL_TYPES.END) {
          newGrid[row][col].type = CELL_TYPES.EMPTY;
          newGrid[row][col].terrain = TERRAIN_TYPES.NONE;
        }
      } else if (dragType.current === 'terrain') {
        if (cell.type !== CELL_TYPES.START && cell.type !== CELL_TYPES.END && activeTerrain) {
          newGrid[row][col].type = CELL_TYPES.EMPTY;
          newGrid[row][col].terrain = activeTerrain;
        }
      }

      return newGrid;
    });
  }, [activeTerrain]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    dragType.current = null;
  }, []);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleClearGrid = useCallback(() => {
    if (isRunning.current) return;
    setGrid(prev => clearGrid(prev));
  }, []);

  const handleClearVisualization = useCallback(() => {
    setGrid(prev => clearVisualization(prev));
  }, []);

  const handleResetAll = useCallback(() => {
    if (isRunning.current) return;
    setGrid(createGrid(rows, cols));
  }, [rows, cols]);

  const handleGridResize = useCallback((newCols, newRows) => {
    if (isRunning.current) return;
    const { start, end } = findStartEnd(grid);
    const sRow = Math.min(start?.row ?? Math.floor(newRows / 2), newRows - 1);
    const sCol = Math.min(start?.col ?? Math.floor(newCols / 4), newCols - 1);
    const eRow = Math.min(end?.row ?? Math.floor(newRows / 2), newRows - 1);
    const eCol = Math.min(end?.col ?? Math.floor((newCols * 3) / 4), newCols - 1);

    setCols(newCols);
    setRows(newRows);
    setGrid(createGrid(newRows, newCols, { row: sRow, col: sCol }, { row: eRow, col: eCol }));
  }, [grid]);

  const handleSetGrid = useCallback((newGrid) => {
    setGrid(newGrid);
  }, []);

  return {
    grid,
    rows,
    cols,
    activeTerrain,
    setActiveTerrain,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    handleContextMenu,
    handleClearGrid,
    handleClearVisualization,
    handleResetAll,
    handleGridResize,
    handleSetGrid,
    setIsRunning,
    isRunningRef: isRunning,
  };
}
