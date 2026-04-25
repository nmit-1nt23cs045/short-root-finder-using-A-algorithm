import React from 'react';
import { Code2 } from 'lucide-react';

const PSEUDOCODE = {
  astar: {
    name: 'A* Search',
    lines: [
      'function A*(start, end):',
      '  openSet ← MinHeap with start',
      '  gScore[start] ← 0',
      '  fScore[start] ← h(start, end)',
      '',
      '  while openSet is not empty:',
      '    current ← node with lowest f',
      '    if current = end:',
      '      return reconstruct_path()',
      '',
      '    for each neighbor of current:',
      '      tentative_g ← g[current] + cost',
      '      if tentative_g < g[neighbor]:',
      '        cameFrom[neighbor] ← current',
      '        g[neighbor] ← tentative_g',
      '        f[neighbor] ← g + h(neighbor, end)',
      '        add neighbor to openSet',
      '',
      '  return "No path found"',
    ],
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    lines: [
      "function Dijkstra(start, end):",
      '  dist[start] ← 0',
      '  dist[all others] ← ∞',
      '  queue ← MinHeap with start',
      '',
      '  while queue is not empty:',
      '    current ← node with min dist',
      '    if current = end:',
      '      return reconstruct_path()',
      '',
      '    for each neighbor of current:',
      '      newDist ← dist[current] + cost',
      '      if newDist < dist[neighbor]:',
      '        dist[neighbor] ← newDist',
      '        cameFrom[neighbor] ← current',
      '        add neighbor to queue',
      '',
      '  return "No path found"',
    ],
  },
  bfs: {
    name: 'Breadth-First Search',
    lines: [
      'function BFS(start, end):',
      '  queue ← [start]',
      '  visited[start] ← true',
      '',
      '  while queue is not empty:',
      '    current ← queue.dequeue()',
      '    if current = end:',
      '      return reconstruct_path()',
      '',
      '    for each neighbor of current:',
      '      if not visited[neighbor]:',
      '        visited[neighbor] ← true',
      '        cameFrom[neighbor] ← current',
      '        queue.enqueue(neighbor)',
      '',
      '  return "No path found"',
    ],
  },
  dfs: {
    name: 'Depth-First Search',
    lines: [
      'function DFS(start, end):',
      '  stack ← [start]',
      '',
      '  while stack is not empty:',
      '    current ← stack.pop()',
      '    if visited[current]: continue',
      '    visited[current] ← true',
      '',
      '    if current = end:',
      '      return reconstruct_path()',
      '',
      '    for each neighbor of current:',
      '      if not visited[neighbor]:',
      '        cameFrom[neighbor] ← current',
      '        stack.push(neighbor)',
      '',
      '  return "No path found"',
    ],
  },
  greedy: {
    name: 'Greedy Best-First',
    lines: [
      'function Greedy(start, end):',
      '  openSet ← MinHeap with start',
      '  // Uses ONLY heuristic, no g cost!',
      '',
      '  while openSet is not empty:',
      '    current ← node with lowest h',
      '    if current = end:',
      '      return reconstruct_path()',
      '',
      '    visited[current] ← true',
      '',
      '    for each neighbor of current:',
      '      if not visited[neighbor]:',
      '        cameFrom[neighbor] ← current',
      '        h[neighbor] ← heuristic(→end)',
      '        add neighbor to openSet',
      '',
      '  return "No path found"',
    ],
  },
};

function AlgorithmExplainer({ algorithm, isRunning, theme }) {
  const isDark = theme === 'dark';
  const algo = PSEUDOCODE[algorithm];

  if (!algo) return null;

  return (
    <div className={`rounded-xl p-4 ${isDark ? 'glass' : 'glass-light'}`}>
      <h3 className={`text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        <Code2 size={14} /> {algo.name} — Pseudocode
      </h3>

      <div className={`rounded-lg p-3 font-mono text-[11px] leading-5 overflow-x-auto ${isDark ? 'bg-slate-900/80' : 'bg-slate-100'}`}>
        {algo.lines.map((line, idx) => (
          <div
            key={idx}
            className={`${
              line.trim() === ''
                ? 'h-2'
                : `transition-colors duration-200 ${
                    isRunning
                      ? isDark ? 'text-indigo-300' : 'text-indigo-600'
                      : isDark ? 'text-slate-400' : 'text-slate-600'
                  }`
            }`}
          >
            <span className={`inline-block w-5 text-right mr-3 select-none ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              {line.trim() !== '' ? idx + 1 : ''}
            </span>
            {line}
          </div>
        ))}
      </div>

      <div className={`mt-3 text-[10px] leading-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {algorithm === 'astar' && '💡 A* is optimal when the heuristic never overestimates (admissible).'}
        {algorithm === 'dijkstra' && '💡 Dijkstra explores uniformly — guaranteed optimal but slower than A*.'}
        {algorithm === 'bfs' && '💡 BFS is optimal for unweighted graphs — ignores terrain costs.'}
        {algorithm === 'dfs' && '⚠️ DFS does NOT guarantee shortest path — it may find long, winding routes.'}
        {algorithm === 'greedy' && '⚠️ Greedy is fast but NOT optimal — it can be fooled by obstacles.'}
      </div>
    </div>
  );
}

export default AlgorithmExplainer;
