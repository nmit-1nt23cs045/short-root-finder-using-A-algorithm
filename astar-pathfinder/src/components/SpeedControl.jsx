import React from 'react';
import { Gauge } from 'lucide-react';
import { SPEED_PRESETS } from '../utils/constants';

function SpeedControl({ speedIndex, setSpeedIndex, theme }) {
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-xl p-4 ${isDark ? 'glass' : 'glass-light'}`}>
      <h3 className={`text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        <Gauge size={14} /> Speed Control
      </h3>

      <input
        type="range"
        min={0}
        max={SPEED_PRESETS.length - 1}
        value={speedIndex}
        onChange={(e) => setSpeedIndex(parseInt(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-indigo-500"
        style={{
          background: `linear-gradient(to right, #6366f1 ${(speedIndex / (SPEED_PRESETS.length - 1)) * 100}%, ${isDark ? '#334155' : '#cbd5e1'} ${(speedIndex / (SPEED_PRESETS.length - 1)) * 100}%)`,
        }}
        id="speed-slider"
      />

      <div className="flex justify-between mt-2">
        {SPEED_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => setSpeedIndex(idx)}
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded transition-all cursor-pointer ${
              idx === speedIndex
                ? 'text-indigo-400 bg-indigo-500/20'
                : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className={`mt-2 text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        Delay: {SPEED_PRESETS[speedIndex].delay}ms
        <span className="ml-2 text-slate-600">({SPEED_PRESETS[speedIndex].key})</span>
      </div>
    </div>
  );
}

export default SpeedControl;
