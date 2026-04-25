import React from 'react';
import { Sliders } from 'lucide-react';

function GridSizeControl({ cols, rows, onResize, isRunning, theme }) {
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-xl p-4 ${isDark ? 'glass' : 'glass-light'}`}>
      <h3 className={`text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        <Sliders size={14} /> Grid Size
      </h3>

      <div className="space-y-3">
        <div>
          <label className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Columns: {cols}
          </label>
          <input
            type="range"
            min={10}
            max={60}
            value={cols}
            onChange={(e) => !isRunning && onResize(parseInt(e.target.value), rows)}
            disabled={isRunning}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-indigo-500 mt-1"
            style={{
              background: `linear-gradient(to right, #6366f1 ${((cols - 10) / 50) * 100}%, ${isDark ? '#334155' : '#cbd5e1'} ${((cols - 10) / 50) * 100}%)`,
            }}
          />
        </div>
        <div>
          <label className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Rows: {rows}
          </label>
          <input
            type="range"
            min={8}
            max={30}
            value={rows}
            onChange={(e) => !isRunning && onResize(cols, parseInt(e.target.value))}
            disabled={isRunning}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-indigo-500 mt-1"
            style={{
              background: `linear-gradient(to right, #6366f1 ${((rows - 8) / 22) * 100}%, ${isDark ? '#334155' : '#cbd5e1'} ${((rows - 8) / 22) * 100}%)`,
            }}
          />
        </div>
      </div>

      <p className={`mt-2 text-center text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
        {cols} × {rows} = {cols * rows} cells
      </p>
    </div>
  );
}

export default GridSizeControl;
