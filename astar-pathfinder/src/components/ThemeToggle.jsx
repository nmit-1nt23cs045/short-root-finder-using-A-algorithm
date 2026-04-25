import React from 'react';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 cursor-pointer ${
        isDark
          ? 'bg-slate-700 hover:bg-slate-600'
          : 'bg-amber-200 hover:bg-amber-300'
      }`}
      aria-label="Toggle theme"
      id="theme-toggle"
    >
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center shadow-md ${
          isDark
            ? 'left-0.5 bg-indigo-500'
            : 'left-7 bg-amber-500'
        }`}
      >
        {isDark ? <Moon size={12} className="text-white" /> : <Sun size={12} className="text-white" />}
      </div>
    </button>
  );
}

export default ThemeToggle;
