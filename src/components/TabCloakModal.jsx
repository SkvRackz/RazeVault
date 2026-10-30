import React, { useState } from 'react';
import { X, Shield, AlertTriangle, Check, RefreshCw } from 'lucide-react';

const PRESETS = [
  {
    name: 'Google Classroom',
    title: 'Classes - Google Classroom',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png',
    url: 'https://classroom.google.com',
  },
  {
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png',
    url: 'https://drive.google.com',
  },
  {
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    url: 'https://docs.google.com',
  },
  {
    name: 'Canvas LMS',
    title: 'Dashboard - Canvas',
    icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
    url: 'https://canvas.instructure.com',
  },
  {
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    icon: 'https://www.desmos.com/favicon.ico',
    url: 'https://www.desmos.com/calculator',
  },
];

export const TabCloakModal = ({ isOpen, onClose }) => {
  const [activePreset, setActivePreset] = useState(() => {
    return localStorage.getItem('vault_cloak_preset') || null;
  });
  const [panicKey, setPanicKey] = useState(() => {
    return localStorage.getItem('vault_panic_key') || ']';
  });
  const [panicUrl, setPanicUrl] = useState(() => {
    return localStorage.getItem('vault_panic_url') || 'https://classroom.google.com';
  });

  const applyCloak = (preset) => {
    document.title = preset.title;
    
    // Change favicon
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = preset.icon;

    setActivePreset(preset.name);
    localStorage.setItem('vault_cloak_preset', preset.name);
    localStorage.setItem('vault_cloak_title', preset.title);
    localStorage.setItem('vault_cloak_icon', preset.icon);
  };

  const resetCloak = () => {
    document.title = 'RazeGames - WatkinsM Hub';
    let link = document.querySelector("link[rel*='icon']");
    if (link) {
      link.href = '/favicon.ico';
    }
    setActivePreset(null);
    localStorage.removeItem('vault_cloak_preset');
    localStorage.removeItem('vault_cloak_title');
    localStorage.removeItem('vault_cloak_icon');
  };

  const handlePanicKeyChange = (key) => {
    setPanicKey(key);
    localStorage.setItem('vault_panic_key', key);
  };

  const handlePanicUrlChange = (url) => {
    setPanicUrl(url);
    localStorage.setItem('vault_panic_url', url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#0B0F17] border border-slate-800 rounded-2xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Stealth &amp; Tab Cloaking</h3>
              <p className="text-xs text-slate-400">Disguise browser tab &amp; enable emergency hotkey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Choose Tab Disguise:</label>
            {activePreset && (
              <button
                onClick={resetCloak}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to Default</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2">
            {PRESETS.map((preset) => {
              const isSelected = activePreset === preset.name;
              return (
                <button
                  key={preset.name}
                  onClick={() => applyCloak(preset)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={preset.icon} 
                      alt="" 
                      className="w-5 h-5 rounded shrink-0 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div>
                      <div className="text-xs font-bold">{preset.name}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[240px]">
                        {preset.title}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panic Button Settings */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Emergency Panic Hotkey</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Pressing this key anytime immediately redirects this tab to your safe destination.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Hotkey:</label>
              <input
                type="text"
                maxLength={1}
                value={panicKey}
                onChange={(e) => handlePanicKeyChange(e.target.value)}
                className="w-full text-center px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Redirect Target:</label>
              <input
                type="text"
                value={panicUrl}
                onChange={(e) => handlePanicUrlChange(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
