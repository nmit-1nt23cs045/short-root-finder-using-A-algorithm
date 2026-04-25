import React from 'react';
import { BarChart3, Route, Clock, Coins, AlertTriangle, CheckCircle } from 'lucide-react';

function StatsPanel({ stats, isComplete, noPath, algorithm, theme }) {
  const isDark = theme === 'dark';

  const statItems = [
    {
      icon: <BarChart3 size={16} className="text-indigo-400" />,
      label: 'Nodes Visited',
      value: stats.visitedCount || 0,
      color: 'text-indigo-400',
    },
    {
      icon: <Route size={16} className="text-amber-400" />,
      label: 'Path Length',
      value: stats.pathLength || '—',
      color: 'text-amber-400',
    },
    {
      icon: <Coins size={16} className="text-emerald-400" />,
      label: 'Path Cost',
      value: stats.pathCost || '—',
      color: 'text-emerald-400',
    },
    {
      icon: <Clock size={16} className="text-cyan-400" />,
      label: 'Time',
      value: stats.time ? `${stats.time}s` : '—',
      color: 'text-cyan-400',
    },
  ];

  return (
    <div className={`rounded-xl p-4 ${isDark ? 'glass' : 'glass-light'} animate-slide-up`}>
      <h3 className={`text-xs uppercase tracking-wider font-bold mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        📊 Live Statistics
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 p-2.5 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-white/50'} transition-all`}
          >
            {item.icon}
            <div>
              <div className={`text-[10px] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {item.label}
              </div>
              <div className={`text-sm font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Badge */}
      {isComplete && (
        <div className="mt-3 flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">Path Found!</span>
        </div>
      )}
      {noPath && (
        <div className="mt-3 flex items-center gap-2 text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
          <AlertTriangle size={16} />
          <span className="text-sm font-medium">No Path Exists</span>
        </div>
      )}
    </div>
  );
}

export default StatsPanel;
