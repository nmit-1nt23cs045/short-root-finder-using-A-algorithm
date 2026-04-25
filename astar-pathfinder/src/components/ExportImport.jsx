import React, { useRef } from 'react';
import { Download, Upload, Link2, Copy } from 'lucide-react';
import { serializeGrid, deserializeGrid } from '../utils/gridHelpers';

function ExportImport({ grid, rows, cols, setGrid, onResize, isRunning, theme }) {
  const isDark = theme === 'dark';
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const json = serializeGrid(grid, rows, cols);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pathfinder-grid-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    if (isRunning) return;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = deserializeGrid(event.target.result);
      if (result) {
        onResize(result.cols, result.rows);
        setTimeout(() => setGrid(result.grid), 100);
      } else {
        alert('Invalid grid file!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleShareURL = () => {
    const json = serializeGrid(grid, rows, cols);
    const encoded = btoa(json);
    const url = `${window.location.origin}${window.location.pathname}#grid=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Share URL copied to clipboard!');
    }).catch(() => {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      alert('Share URL copied!');
    });
  };

  const handleCopyJSON = () => {
    const json = serializeGrid(grid, rows, cols);
    navigator.clipboard.writeText(json).then(() => {
      alert('Grid JSON copied to clipboard!');
    });
  };

  const btnClass = isDark
    ? 'w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-700 transition-all text-slate-300 flex items-center gap-2 cursor-pointer'
    : 'w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-200 transition-all text-slate-600 flex items-center gap-2 cursor-pointer';

  return (
    <div className={`rounded-xl p-4 ${isDark ? 'glass' : 'glass-light'}`}>
      <h3 className={`text-xs uppercase tracking-wider font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        💾 Export / Import
      </h3>

      <div className="flex flex-col gap-1.5">
        <button onClick={handleExport} className={btnClass} id="export-btn">
          <Download size={14} className="text-emerald-400" /> Export Grid (JSON)
        </button>

        <button
          onClick={() => !isRunning && fileInputRef.current?.click()}
          className={btnClass}
          disabled={isRunning}
          id="import-btn"
        >
          <Upload size={14} className="text-blue-400" /> Import Grid
        </button>

        <button onClick={handleShareURL} className={btnClass} id="share-url-btn">
          <Link2 size={14} className="text-purple-400" /> Share via URL
        </button>

        <button onClick={handleCopyJSON} className={btnClass} id="copy-json-btn">
          <Copy size={14} className="text-amber-400" /> Copy JSON
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
}

export default ExportImport;
