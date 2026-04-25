import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, GraduationCap } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to A★ Pathfinder! 🎯',
    content: 'This interactive tool helps you visualize how pathfinding algorithms work. You\'ll see how a computer finds the shortest route between two points — just like GPS navigation!',
    highlight: null,
  },
  {
    title: 'The Grid 🗺️',
    content: 'The grid is your playground. The GREEN cell with ▶ is the START, and the RED cell with ⊙ is the END. The algorithm will find a path between them.',
    highlight: 'grid',
  },
  {
    title: 'Drawing Walls 🧱',
    content: 'Left-click and drag on the grid to draw walls. Walls are obstacles the algorithm must go around. Right-click to erase walls.',
    highlight: 'grid',
  },
  {
    title: 'Moving Start & End 🔄',
    content: 'Click and drag the green start or red end node to move them anywhere on the grid.',
    highlight: 'grid',
  },
  {
    title: 'How A★ Works 🧠',
    content: 'A* uses a formula: f(n) = g(n) + h(n)\n\n• g(n) = actual cost from start to current node\n• h(n) = estimated cost from current to end (heuristic)\n• f(n) = total estimated cost\n\nIt always explores the node with the LOWEST f(n) first!',
    highlight: null,
  },
  {
    title: 'Understanding Colors 🎨',
    content: '• 🟦 BLUE cells = nodes the algorithm visited (explored)\n• 🟨 GOLD cells = the shortest path found\n• ⬛ DARK cells = walls (obstacles)\n\nMore blue = more explored = less efficient!',
    highlight: null,
  },
  {
    title: 'Try Different Algorithms 🔬',
    content: 'Select different algorithms from the toolbar:\n• A★ — Smart and optimal\n• Dijkstra — Thorough, explores uniformly\n• BFS — Layer by layer, good for unweighted\n• DFS — Goes deep, often non-optimal\n• Greedy — Fast but may miss optimal path',
    highlight: 'toolbar',
  },
  {
    title: 'Generate Mazes 🏗️',
    content: 'Use the Maze Generation panel to auto-generate interesting obstacles! Try Recursive Division for room-like structures or Recursive Backtracker for winding corridors.',
    highlight: 'maze',
  },
  {
    title: 'Weighted Terrain ⛰️',
    content: 'Select a terrain type and paint it on the grid. Different terrains have different movement costs:\n• Grass (3x) • Forest (5x) • Sand (8x) • Water (15x)\n\nAlgorithms like A★ and Dijkstra will prefer cheaper paths!',
    highlight: 'terrain',
  },
  {
    title: 'You\'re Ready! 🚀',
    content: 'Press the green "Visualize" button to run the algorithm! Experiment with different setups to see how each algorithm behaves. Have fun exploring! 🎉',
    highlight: 'run',
  },
];

function Tutorial({ isOpen, onClose, theme }) {
  const [step, setStep] = useState(0);
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const currentStep = TUTORIAL_STEPS[step];
  const progress = ((step + 1) / TUTORIAL_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
        {/* Progress Bar */}
        <div className={`h-1 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-indigo-400" />
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Step {step + 1} of {TUTORIAL_STEPS.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <h2 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currentStep.title}
          </h2>
          <p className={`text-sm leading-relaxed whitespace-pre-line ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {currentStep.content}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-5">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              step === 0
                ? 'opacity-30 cursor-not-allowed'
                : isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <ChevronLeft size={16} /> Back
          </button>

          <div className="flex gap-1">
            {TUTORIAL_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === step
                    ? 'bg-indigo-500 scale-125'
                    : idx < step
                    ? 'bg-indigo-400/40'
                    : isDark ? 'bg-slate-600' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          {step < TUTORIAL_STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
            >
              Start Exploring! 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
