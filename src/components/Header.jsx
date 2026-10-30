import React from 'react';
import { Gamepad2, ShieldAlert, Plus, Code2 } from 'lucide-react';

export const Header = ({
  currentCategory,
  onSelectCategory,
  onOpenAddModal,
  onOpenCloakModal,
  onOpenJsonModal,
  favoritesCount,
}) => {
  const categories = ['All', 'Arcade', 'Puzzle', 'Retro', 'Action', 'Strategy', 'Favorites'];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => onSelectCategory('All')}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight text-white">
            Raze<span className="text-indigo-400">Games</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {categories.map((cat) => {
            const isActive = currentCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive 
                    ? 'text-indigo-400 font-semibold' 
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {cat}
                {cat === 'Favorites' && favoritesCount > 0 && (
                  <span className="ml-1 text-xs text-indigo-400 font-mono">({favoritesCount})</span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenJsonModal}
            title="View games.json Database"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>games.json</span>
          </button>

          <button
            onClick={onOpenCloakModal}
            title="Stealth & Tab Cloaking Settings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Stealth Cloak</span>
            <span className="sm:hidden">Cloak</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg transition-colors shadow-sm shadow-indigo-600/30 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Game</span>
          </button>
        </div>
      </div>

      {/* Mobile Category Bar */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2 border-t border-slate-800/60 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isActive = currentCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
              {cat === 'Favorites' && favoritesCount > 0 && ` (${favoritesCount})`}
            </button>
          );
        })}
      </div>
    </header>
  );
};
