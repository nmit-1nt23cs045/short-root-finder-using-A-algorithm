import React from 'react';
import { Play, Pause, Square, RotateCcw, Trash2, Zap } from 'lucide-react';
import { ALGORITHMS, HEURISTICS } from '../utils/constants';

function Toolbar({
  algorithm, setAlgorithm,
  heuristic, setHeuristic,
  allowDiagonal, setAllowDiagonal,
  isRunning, isPaused,
  onRun, onPause, onResume, onStop,
  onClearGrid, onClearVisualization, onResetAll,
  theme,
}) {
  const isDark = theme === 'dark';
  const btnBase = `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer`;
  const btnPrimary = isDark
    ? `${btnBase} bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20`
    : `${btnBase} bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20`;
  const btnSecondary = isDark
    ? `${btnBase} bg-slate-700 hover:bg-slate-600 text-slate-200`
    : `${btnBase} bg-slate-200 hover:bg-slate-300 text-slate-700`;
  const btnDanger = isDark
    ? `${btnBase} bg-red-600/80 hover:bg-red-500 text-white`
    : `${btnBase} bg-red-500 hover:bg-red-400 text-white`;
  const btnWarning = isDark
    ? `${btnBase} bg-amber-600/80 hover:bg-amber-500 text-white`
    : `${btnBase} bg-amber-500 hover:bg-amber-400 text-white`;
  const btnSuccess = isDark
    ? `${btnBase} bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20`
    : `${btnBase} bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20`;

  const selectClass = isDark
    ? 'bg-slate-700 text-slate-200 border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer'
    : 'bg-white text-slate-700 border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer';

  return (
    <div className={`flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl ${isDark ? 'glass' : 'glass-light'}`}>
      {/* Algorithm Selector */}
      <div className="flex flex-col gap-0.5">
        <label className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Algorithm
        </label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={isRunning}
          className={selectClass}
          id="algorithm-select"
        >
          {ALGORITHMS.map(a => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
      </div>

      {/* Heuristic Selector */}
      {(algorithm === 'astar' || algorithm === 'greedy') && (
        <div className="flex flex-col gap-0.5">
          <label className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Heuristic
          </label>
          <select
            value={heuristic}
            onChange={(e) => setHeuristic(e.target.value)}
            disabled={isRunning}
            className={selectClass}
            id="heuristic-select"
          >
            {HEURISTICS.map(h => (
              <option key={h.id} value={h.id}>{h.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Diagonal Toggle */}
      <div className="flex flex-col gap-0.5">
        <label className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Movement
        </label>
        <button
          onClick={() => !isRunning && setAllowDiagonal(!allowDiagonal)}
          className={`${btnSecondary} ${allowDiagonal ? '!bg-indigo-600 !text-white' : ''}`}
          disabled={isRunning}
          id="diagonal-toggle"
        >
          {allowDiagonal ? '8-Dir' : '4-Dir'}
        </button>
      </div>

      {/* Divider */}
      <div className={`w-px h-10 ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />

      {/* Run/Pause/Resume Controls */}
      {!isRunning ? (
        <button onClick={onRun} className={btnSuccess} id="run-btn">
          <Play size={16} /> Visualize
        </button>
      ) : isPaused ? (
        <button onClick={onResume} className={btnPrimary} id="resume-btn">
          <Play size={16} /> Resume
        </button>
      ) : (
        <button onClick={onPause} className={btnWarning} id="pause-btn">
          <Pause size={16} /> Pause
        </button>
      )}

      {isRunning && (
        <button onClick={onStop} className={btnDanger} id="stop-btn">
          <Square size={16} /> Stop
        </button>
      )}

      {/* Divider */}
      <div className={`w-px h-10 ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />

      {/* Grid Controls */}
      <button onClick={onClearVisualization} className={btnSecondary} disabled={isRunning} id="clear-viz-btn">
        <RotateCcw size={14} /> Clear Path
      </button>
      <button onClick={onClearGrid} className={btnSecondary} disabled={isRunning} id="clear-grid-btn">
        <Trash2 size={14} /> Clear Walls
      </button>
      <button onClick={onResetAll} className={btnDanger} disabled={isRunning} id="reset-btn">
        <Zap size={14} /> Reset All
      </button>
    </div>
  );
}

export default Toolbar;
