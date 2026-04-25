import { useState, useCallback, useRef } from 'react';
import { CELL_TYPES, SPEED_PRESETS } from '../utils/constants';
import { findStartEnd } from '../utils/gridHelpers';
import { astar } from '../algorithms/astar';
import { dijkstra } from '../algorithms/dijkstra';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { greedy } from '../algorithms/greedy';

const algorithmMap = { astar, dijkstra, bfs, dfs, greedy };

export function useAlgorithm(gridRef, setGrid, clearVisualization, setIsRunning) {
  const [algorithm, setAlgorithm] = useState('astar');
  const [heuristic, setHeuristic] = useState('manhattan');
  const [allowDiagonal, setAllowDiagonal] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1); // Normal
  const [isRunning, setRunningState] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState({ visitedCount: 0, pathLength: 0, pathCost: 0, time: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [noPath, setNoPath] = useState(false);

  const isPausedRef = useRef(false);
  const isStoppedRef = useRef(false);
  const animationRef = useRef(null);
  const startTimeRef = useRef(0);

  const speed = SPEED_PRESETS[speedIndex]?.delay ?? 40;

  const sleep = (ms) => new Promise(resolve => {
    animationRef.current = setTimeout(resolve, ms);
  });

  const waitWhilePaused = async () => {
    while (isPausedRef.current && !isStoppedRef.current) {
      await sleep(100);
    }
  };

  const runAlgorithm = useCallback(async () => {
    const grid = gridRef.current ?? gridRef;
    const currentGrid = typeof grid === 'function' ? grid() : (Array.isArray(grid) ? grid : []);

    if (currentGrid.length === 0) return;

    const { start, end } = findStartEnd(currentGrid);
    if (!start || !end) return;

    // Clear previous visualization
    clearVisualization();

    // Get fresh grid after clearing
    await new Promise(r => setTimeout(r, 50));
    const freshGrid = typeof gridRef === 'function' ? gridRef() : (gridRef.current ?? gridRef);
    const runGrid = Array.isArray(freshGrid) ? freshGrid : currentGrid;

    setRunningState(true);
    setIsRunning(true);
    setIsPaused(false);
    setIsComplete(false);
    setNoPath(false);
    isPausedRef.current = false;
    isStoppedRef.current = false;
    startTimeRef.current = performance.now();

    const algoFn = algorithmMap[algorithm];
    if (!algoFn) return;

    const generator = algoFn(runGrid, start, end, heuristic, allowDiagonal);

    try {
      for (const step of generator) {
        if (isStoppedRef.current) break;
        await waitWhilePaused();
        if (isStoppedRef.current) break;

        if (step.type === 'visited') {
          setGrid(prev => {
            const newGrid = prev.map(r => r.map(c => ({ ...c })));
            if (newGrid[step.row][step.col].type !== CELL_TYPES.START &&
                newGrid[step.row][step.col].type !== CELL_TYPES.END) {
              newGrid[step.row][step.col].type = CELL_TYPES.VISITED;
              newGrid[step.row][step.col].isVisited = true;
              newGrid[step.row][step.col].visitCount = (newGrid[step.row][step.col].visitCount || 0) + 1;
            }
            return newGrid;
          });
          setStats(prev => ({
            ...prev,
            visitedCount: step.visitedCount,
            time: ((performance.now() - startTimeRef.current) / 1000).toFixed(2),
          }));

          if (speed > 0) await sleep(speed);
        } else if (step.type === 'path') {
          // Animate path
          for (let i = 0; i < step.path.length; i++) {
            if (isStoppedRef.current) break;
            const p = step.path[i];
            setGrid(prev => {
              const newGrid = prev.map(r => r.map(c => ({ ...c })));
              if (newGrid[p.row][p.col].type !== CELL_TYPES.START &&
                  newGrid[p.row][p.col].type !== CELL_TYPES.END) {
                newGrid[p.row][p.col].type = CELL_TYPES.PATH;
                newGrid[p.row][p.col].isPath = true;
              }
              return newGrid;
            });
            if (speed > 0) await sleep(Math.max(speed, 20));
          }
          setStats({
            visitedCount: step.visitedCount,
            pathLength: step.path.length,
            pathCost: typeof step.pathCost === 'number' ? step.pathCost.toFixed(1) : step.path.length - 1,
            time: ((performance.now() - startTimeRef.current) / 1000).toFixed(2),
          });
          setIsComplete(true);
        } else if (step.type === 'nopath') {
          setStats(prev => ({
            ...prev,
            visitedCount: step.visitedCount,
            time: ((performance.now() - startTimeRef.current) / 1000).toFixed(2),
          }));
          setNoPath(true);
        }
      }
    } catch (err) {
      console.error('Algorithm error:', err);
    }

    setRunningState(false);
    setIsRunning(false);
  }, [algorithm, heuristic, allowDiagonal, speed, gridRef, setGrid, clearVisualization, setIsRunning]);

  const pause = useCallback(() => {
    isPausedRef.current = true;
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    isPausedRef.current = false;
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    isStoppedRef.current = true;
    isPausedRef.current = false;
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setRunningState(false);
    setIsRunning(false);
    setIsPaused(false);
    clearVisualization();
  }, [clearVisualization, setIsRunning]);

  return {
    algorithm,
    setAlgorithm,
    heuristic,
    setHeuristic,
    allowDiagonal,
    setAllowDiagonal,
    speedIndex,
    setSpeedIndex,
    isRunning,
    isPaused,
    stats,
    isComplete,
    noPath,
    runAlgorithm,
    pause,
    resume,
    stop,
  };
}
