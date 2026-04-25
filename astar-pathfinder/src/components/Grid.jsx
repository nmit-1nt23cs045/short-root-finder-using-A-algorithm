import React, { memo, useMemo, useState, useEffect, useRef } from 'react';
import { CELL_TYPES, CELL_COLORS, TERRAIN_TYPES } from '../utils/constants';

const Cell = memo(({ cell, theme, onMouseDown, onMouseEnter }) => {
  const colors = CELL_COLORS[theme] || CELL_COLORS.dark;

  const style = useMemo(() => {
    let bg = colors[cell.type] || colors[CELL_TYPES.EMPTY];

    // Apply terrain color if cell is empty and has terrain
    if ((cell.type === CELL_TYPES.EMPTY || cell.type === CELL_TYPES.VISITED) &&
        cell.terrain && cell.terrain.id !== 'none') {
      bg = theme === 'dark' ? cell.terrain.darkColor : cell.terrain.color;
      if (cell.type === CELL_TYPES.VISITED) {
        bg = colors[CELL_TYPES.VISITED];
      }
    }

    return { backgroundColor: bg };
  }, [cell.type, cell.terrain, theme, colors]);

  const animClass = cell.isVisited && cell.type === CELL_TYPES.VISITED
    ? 'cell-visited'
    : cell.isPath && cell.type === CELL_TYPES.PATH
    ? 'cell-path'
    : cell.type === CELL_TYPES.WALL
    ? 'cell-wall'
    : '';

  const specialClass = cell.type === CELL_TYPES.START
    ? 'animate-pulse-custom'
    : cell.type === CELL_TYPES.END
    ? 'animate-pulse-custom'
    : '';

  return (
    <div
      className={`grid-cell ${animClass} ${specialClass}`}
      style={style}
      onMouseDown={(e) => onMouseDown(cell.row, cell.col, e)}
      onMouseEnter={() => onMouseEnter(cell.row, cell.col)}
      onContextMenu={(e) => e.preventDefault()}
      role="gridcell"
      aria-label={`Cell ${cell.row},${cell.col} - ${cell.type}${cell.terrain?.id !== 'none' ? ` (${cell.terrain.label})` : ''}`}
    >
      {cell.type === CELL_TYPES.START && (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
      {cell.type === CELL_TYPES.END && (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="white">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
            <circle cx="12" cy="12" r="6" fill="white" />
            <circle cx="12" cy="12" r="2" fill="#ef4444" />
          </svg>
        </div>
      )}
    </div>
  );
});

Cell.displayName = 'Cell';

function Grid({ grid, theme, onMouseDown, onMouseEnter, onMouseUp, onContextMenu }) {
  const cols = grid[0]?.length || 1;
  const rows = grid.length;
  const containerRef = useRef(null);
  const [cellSize, setCellSize] = useState(20);

  // Responsive cell size calculation
  useEffect(() => {
    const calculateCellSize = () => {
      if (!containerRef.current) return;

      // Get available space in the viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Estimate margins and padding based on screen size
      let horizontalReduction = 40; // padding
      let verticalReduction = 280; // header + toolbar + bottom spacing

      // On mobile (< 640px), reduce sidebars consideration
      // On tablet (640-1024px), consider narrower sidebars
      // On desktop (> 1024px), consider full sidebars
      if (viewportWidth < 640) {
        horizontalReduction = 30;
        verticalReduction = 240;
      } else if (viewportWidth < 1024) {
        horizontalReduction = 40;
        verticalReduction = 260;
      } else {
        horizontalReduction = 550; // Account for sidebars on desktop
        verticalReduction = 280;
      }

      const maxWidth = viewportWidth - horizontalReduction;
      const maxHeight = viewportHeight - verticalReduction;

      // Calculate cell size based on grid dimensions
      const cellWidth = Math.floor(maxWidth / cols);
      const cellHeight = Math.floor(maxHeight / rows);

      // Use the smaller dimension to fit the grid, with a reasonable minimum
      const newCellSize = Math.max(8, Math.min(cellWidth, cellHeight, 40));

      setCellSize(newCellSize);
    };

    calculateCellSize();

    // Recalculate on window resize
    window.addEventListener('resize', calculateCellSize);
    return () => window.removeEventListener('resize', calculateCellSize);
  }, [cols, rows]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full overflow-auto"
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onContextMenu={onContextMenu}
    >
      <div
        className="grid gap-[1px] p-2 sm:p-3 rounded-xl shadow-2xl shrink-0"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          background: theme === 'dark'
            ? 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))'
            : 'linear-gradient(135deg, rgba(241,245,249,0.9), rgba(226,232,240,0.9))',
          border: theme === 'dark'
            ? '1px solid rgba(99,102,241,0.2)'
            : '1px solid rgba(99,102,241,0.15)',
          boxShadow: theme === 'dark'
            ? '0 0 40px rgba(99,102,241,0.1), 0 20px 60px rgba(0,0,0,0.3)'
            : '0 0 40px rgba(99,102,241,0.05), 0 20px 60px rgba(0,0,0,0.08)',
        }}
        role="grid"
        aria-label="Pathfinding Grid"
      >
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <Cell
              key={`${rIdx}-${cIdx}`}
              cell={cell}
              theme={theme}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default memo(Grid);
