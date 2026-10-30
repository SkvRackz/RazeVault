import React, { useState } from 'react';
import { X, Copy, Check, Download, Upload, Code2 } from 'lucide-react';

export const JsonViewerModal = ({
  isOpen,
  onClose,
  games,
  onImportJson,
}) => {
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

  const jsonString = JSON.stringify(games, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          onImportJson(parsed);
          setImportError('');
          onClose();
        } else {
          setImportError('JSON must be an array of game objects.');
        }
      } catch (err) {
        setImportError('Invalid JSON format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-[#0B0F17] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">games.json Database</h3>
              <p className="text-xs text-slate-400">
                All {games.length} games stored with sandboxed iframe HTML tags &amp; metadata
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {importError && (
          <div className="mb-3 p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
            {importError}
          </div>
        )}

        {/* JSON Code Viewer */}
        <div className="flex-1 overflow-auto rounded-xl bg-slate-950 border border-slate-900 p-4 font-mono text-xs text-indigo-300 leading-relaxed select-all">
          <pre>{jsonString}</pre>
        </div>

        {/* Footer actions: Import Custom JSON */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0 mt-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Import external games.json</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
