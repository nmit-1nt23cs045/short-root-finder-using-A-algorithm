import React from 'react';
import { Keyboard } from 'lucide-react';
import { SHORTCUTS } from '../utils/constants';

function KeyboardShortcuts({ isOpen, onClose, theme }) {
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className={`w-full max-w-md mx-4 rounded-2xl shadow-2xl p-6 ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4">
          <Keyboard size={20} className="text-indigo-400" />
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Keyboard Shortcuts
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Object.entries(SHORTCUTS).map(([key, action]) => (
            <div
              key={key}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}
            >
              <kbd className={`px-2 py-0.5 rounded text-xs font-mono font-bold min-w-[28px] text-center ${
                isDark
                  ? 'bg-slate-600 text-slate-200 border border-slate-500'
                  : 'bg-white text-slate-700 border border-slate-300 shadow-sm'
              }`}>
                {key === ' ' ? '⎵' : key === 'Escape' ? 'Esc' : key.toUpperCase()}
              </kbd>
              <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {action}
              </span>
            </div>
          ))}
        </div>

        <p className={`mt-4 text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-600 text-slate-200 text-[10px] font-mono">H</kbd> to toggle this panel
        </p>
      </div>
    </div>
  );
}

export default KeyboardShortcuts;
