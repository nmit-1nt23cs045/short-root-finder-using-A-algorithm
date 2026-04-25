import React from 'react';
import { Mountain } from 'lucide-react';
import { TERRAIN_TYPES } from '../utils/constants';

function TerrainPicker({ activeTerrain, setActiveTerrain, isRunning, theme }) {
  const isDark = theme === 'dark';

  const terrains = Object.values(TERRAIN_TYPES).filter(t => t.id !== 'none');

  return (
    <div className={`rounded-xl p-4 ${isDark ? 'glass' : 'glass-light'}`}>
      <h3 className={`text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        <Mountain size={14} /> Weighted Terrain
      </h3>

      <div className="flex flex-col gap-1.5">
        {/* None option */}
        <button
          onClick={() => !isRunning && setActiveTerrain(null)}
          disabled={isRunning}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
            !activeTerrain
              ? 'bg-indigo-600 text-white'
              : isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
          }`}
        >
          🖱️ Draw Walls (Default)
        </button>

        {terrains.map(terrain => (
          <button
            key={terrain.id}
            onClick={() => !isRunning && setActiveTerrain(terrain)}
            disabled={isRunning}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer flex items-center justify-between ${
              activeTerrain?.id === terrain.id
                ? 'bg-indigo-600 text-white'
                : isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-sm border border-white/20"
                style={{ backgroundColor: isDark ? terrain.darkColor : terrain.color }}
              />
              {terrain.label}
            </span>
            <span className={`text-[10px] ${activeTerrain?.id === terrain.id ? 'text-white/70' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Cost: {terrain.cost}
            </span>
          </button>
        ))}
      </div>

      <p className={`mt-3 text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
        💡 Select a terrain, then paint on the grid. Higher cost = slower to traverse.
      </p>
    </div>
  );
}

export default TerrainPicker;
