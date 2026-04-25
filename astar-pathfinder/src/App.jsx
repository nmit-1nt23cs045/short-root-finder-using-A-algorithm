import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HelpCircle, Keyboard as KeyboardIcon, Star } from 'lucide-react';
import Grid from './components/Grid';
import Toolbar from './components/Toolbar';
import StatsPanel from './components/StatsPanel';
import SpeedControl from './components/SpeedControl';
import MazeMenu from './components/MazeMenu';
import TerrainPicker from './components/TerrainPicker';
import GridSizeControl from './components/GridSizeControl';
import ExportImport from './components/ExportImport';
import ThemeToggle from './components/ThemeToggle';
import Tutorial from './components/Tutorial';
import AlgorithmExplainer from './components/AlgorithmExplainer';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import { useGrid } from './hooks/useGrid';
import { useAlgorithm } from './hooks/useAlgorithm';
import { useTheme } from './hooks/useTheme';
import { ALGORITHMS } from './utils/constants';
import { deserializeGrid } from './utils/gridHelpers';

function App() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const {
    grid, rows, cols,
    activeTerrain, setActiveTerrain,
    handleMouseDown, handleMouseEnter, handleMouseUp, handleContextMenu,
    handleClearGrid, handleClearVisualization, handleResetAll,
    handleGridResize, handleSetGrid, setIsRunning: setGridRunning, isRunningRef,
  } = useGrid();

  // Create a ref that always points to the latest grid
  const gridRef = useRef(grid);
  gridRef.current = grid;

  const getGrid = useCallback(() => gridRef.current, []);

  const {
    algorithm, setAlgorithm,
    heuristic, setHeuristic,
    allowDiagonal, setAllowDiagonal,
    speedIndex, setSpeedIndex,
    isRunning, isPaused,
    stats, isComplete, noPath,
    runAlgorithm, pause, resume, stop,
  } = useAlgorithm(getGrid, handleSetGrid, handleClearVisualization, setGridRunning);

  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem('pathfinder-tutorial-seen');
  });
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Close tutorial and mark as seen
  const closeTutorial = useCallback(() => {
    setShowTutorial(false);
    localStorage.setItem('pathfinder-tutorial-seen', 'true');
  }, []);

  // Load grid from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#grid=')) {
      try {
        const encoded = hash.substring(6);
        const json = atob(encoded);
        const result = deserializeGrid(json);
        if (result) {
          handleGridResize(result.cols, result.rows);
          setTimeout(() => handleSetGrid(result.grid), 100);
        }
      } catch (e) {
        console.error('Failed to load grid from URL:', e);
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (isRunning) {
            isPaused ? resume() : pause();
          } else {
            runAlgorithm();
          }
          break;
        case 'Escape':
          if (isRunning) stop();
          if (showShortcuts) setShowShortcuts(false);
          if (showTutorial) closeTutorial();
          break;
        case 'c':
        case 'C':
          if (!isRunning) handleClearGrid();
          break;
        case 'r':
        case 'R':
          if (!isRunning) handleResetAll();
          break;
        case '1': setSpeedIndex(0); break;
        case '2': setSpeedIndex(1); break;
        case '3': setSpeedIndex(2); break;
        case '4': setSpeedIndex(3); break;
        case '5': setSpeedIndex(4); break;
        case 't':
        case 'T':
          toggleTheme();
          break;
        case 'h':
        case 'H':
          setShowShortcuts(s => !s);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, isPaused, showShortcuts, showTutorial, runAlgorithm, pause, resume, stop, handleClearGrid, handleResetAll, toggleTheme, closeTutorial, setSpeedIndex]);

  const currentAlgo = ALGORITHMS.find(a => a.id === algorithm);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <header className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-[1800px] mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
              <Star size={16} className="sm:w-[18px] sm:h-[18px] text-white" fill="white" />
            </div>
            <div className="min-w-0">
              <h1 className={`text-base sm:text-lg font-bold tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                A★ Pathfinder
              </h1>
              <p className={`text-[8px] sm:text-[10px] truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                AI-Based Shortest Path Finder
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Current Algorithm Badge */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              {currentAlgo?.label}: <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{currentAlgo?.description}</span>
            </div>

            <button
              onClick={() => setShowTutorial(true)}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
              title="Tutorial"
              id="tutorial-btn"
            >
              <HelpCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>

            <button
              onClick={() => setShowShortcuts(s => !s)}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
              title="Keyboard Shortcuts (H)"
              id="shortcuts-btn"
            >
              <KeyboardIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>

            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="max-w-[1800px] mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <Toolbar
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          heuristic={heuristic}
          setHeuristic={setHeuristic}
          allowDiagonal={allowDiagonal}
          setAllowDiagonal={setAllowDiagonal}
          isRunning={isRunning}
          isPaused={isPaused}
          onRun={runAlgorithm}
          onPause={pause}
          onResume={resume}
          onStop={stop}
          onClearGrid={handleClearGrid}
          onClearVisualization={handleClearVisualization}
          onResetAll={handleResetAll}
          theme={theme}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-2 sm:px-4 pb-4 sm:pb-6">
        <div className="flex gap-2 sm:gap-4 flex-col lg:flex-row">
          {/* Left Sidebar */}
          <div className="hidden lg:flex flex-col gap-3 w-64 shrink-0">
            <SpeedControl speedIndex={speedIndex} setSpeedIndex={setSpeedIndex} theme={theme} />
            <MazeMenu
              grid={grid}
              setGrid={handleSetGrid}
              isRunning={isRunning}
              rows={rows}
              cols={cols}
              theme={theme}
            />
            <TerrainPicker
              activeTerrain={activeTerrain}
              setActiveTerrain={setActiveTerrain}
              isRunning={isRunning}
              theme={theme}
            />
          </div>

          {/* Grid Area */}
          <div className="flex-1 flex items-start justify-center pt-2 min-h-[300px] sm:min-h-[400px] overflow-x-auto">
            <Grid
              grid={grid}
              theme={theme}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              onMouseUp={handleMouseUp}
              onContextMenu={handleContextMenu}
            />
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:flex flex-col gap-3 w-64 shrink-0">
            <StatsPanel
              stats={stats}
              isComplete={isComplete}
              noPath={noPath}
              algorithm={algorithm}
              theme={theme}
            />
            <GridSizeControl
              cols={cols}
              rows={rows}
              onResize={handleGridResize}
              isRunning={isRunning}
              theme={theme}
            />
            <AlgorithmExplainer algorithm={algorithm} isRunning={isRunning} theme={theme} />
            <ExportImport
              grid={grid}
              rows={rows}
              cols={cols}
              setGrid={handleSetGrid}
              onResize={handleGridResize}
              isRunning={isRunning}
              theme={theme}
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Panels (shown on smaller screens) */}
      <div className="lg:hidden px-2 sm:px-4 pb-4 sm:pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <StatsPanel stats={stats} isComplete={isComplete} noPath={noPath} algorithm={algorithm} theme={theme} />
          <SpeedControl speedIndex={speedIndex} setSpeedIndex={setSpeedIndex} theme={theme} />
          <MazeMenu grid={grid} setGrid={handleSetGrid} isRunning={isRunning} rows={rows} cols={cols} theme={theme} />
          <TerrainPicker activeTerrain={activeTerrain} setActiveTerrain={setActiveTerrain} isRunning={isRunning} theme={theme} />
          <GridSizeControl cols={cols} rows={rows} onResize={handleGridResize} isRunning={isRunning} theme={theme} />
          <AlgorithmExplainer algorithm={algorithm} isRunning={isRunning} theme={theme} />
          <ExportImport grid={grid} rows={rows} cols={cols} setGrid={handleSetGrid} onResize={handleGridResize} isRunning={isRunning} theme={theme} />
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t py-2 sm:py-3 text-center text-[10px] sm:text-xs ${isDark ? 'border-slate-800 text-slate-600' : 'border-slate-200 text-slate-400'}`}>
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <Star size={10} className="sm:w-3 sm:h-3 text-indigo-500" />
          AI-Based A★ Shortest Path Finder — Built with React + Tailwind CSS
          <Star size={10} className="sm:w-3 sm:h-3 text-indigo-500" />
        </div>
        <p className="mt-1">Press <kbd className="px-1 py-0.5 rounded bg-slate-700 text-slate-300 text-[8px] sm:text-[10px] font-mono">H</kbd> for keyboard shortcuts</p>
      </footer>

      {/* Modals */}
      <Tutorial isOpen={showTutorial} onClose={closeTutorial} theme={theme} />
      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} theme={theme} />
    </div>
  );
}

export default App;
