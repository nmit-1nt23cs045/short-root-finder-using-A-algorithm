import React, { useState } from 'react';
import { Grid3x3, Shuffle } from 'lucide-react';
import { MAZE_TYPES, CELL_TYPES } from '../utils/constants';
import { randomMaze } from '../mazes/random';
import { recursiveDivision } from '../mazes/recursiveDivision';
import { recursiveBacktracker } from '../mazes/recursiveBacktracker';
import { clearGrid } from '../utils/gridHelpers';

const mazeGenerators = {
  random: randomMaze,
  recursiveDivision,
  recursiveBacktracker,
};

function MazeMenu({ grid, setGrid, isRunning, rows, cols, theme }) {
  const [density, setDensity] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const isDark = theme === 'dark';

  const generateMaze = async (mazeType) => {
    if (isRunning || isGenerating) return;
    setIsGenerating(true);

    // Clear grid first but keep start/end
    const clearedGrid = clearGrid(grid);
    setGrid(clearedGrid);
    await new Promise(r => setTimeout(r, 50));

    const generator = mazeType === 'random'
      ? mazeGenerators[mazeType](clearedGrid, density)
      : mazeGenerators[mazeType](clearedGrid);

    const animateStep = async () => {
      for (const step of generator) {
        if (step.type === 'done') break;

        setGrid(prev => {
          const newGrid = prev.map(r => r.map(c => ({ ...c })));
          if (step.row !== undefined && step.col !== undefined) {
            if (newGrid[step.row]?.[step.col]) {
              if (newGrid[step.row][step.col].type !== CELL_TYPES.START &&
                  newGrid[step.row][step.col].type !== CELL_TYPES.END) {
                newGrid[step.row][step.col].type = step.type;
              }
            }
          }
          return newGrid;
        });

        await new Promise(r => setTimeout(r, 5));
      }
    };

    await animateStep();
    setIsGenerating(false);
  };

  const btnClass = isDark
    ? 'w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-700 transition-all text-slate-300 cursor-pointer disabled:opacity-50'
    : 'w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-200 transition-all text-slate-600 cursor-pointer disabled:opacity-50';

  return (
    <div className={`rounded-xl p-4 ${isDark ? 'glass' : 'glass-light'}`}>
      <h3 className={`text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        <Grid3x3 size={14} /> Maze Generation
      </h3>

      <div className="flex flex-col gap-1.5">
        {MAZE_TYPES.map(maze => (
          <button
            key={maze.id}
            onClick={() => generateMaze(maze.id)}
            disabled={isRunning || isGenerating}
            className={btnClass}
          >
            <Shuffle size={12} className="inline mr-2 opacity-60" />
            {maze.label}
            {isGenerating && ' ...'}
          </button>
        ))}
      </div>

      {/* Density Slider for Random */}
      <div className="mt-3">
        <label className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Random Density: {density}%
        </label>
        <input
          type="range"
          min={10}
          max={60}
          value={density}
          onChange={(e) => setDensity(parseInt(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-indigo-500 mt-1"
          style={{
            background: `linear-gradient(to right, #6366f1 ${((density - 10) / 50) * 100}%, ${isDark ? '#334155' : '#cbd5e1'} ${((density - 10) / 50) * 100}%)`,
          }}
        />
      </div>
    </div>
  );
}

export default MazeMenu;
