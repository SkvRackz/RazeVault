import React from 'react';
import { Search, Play, Flame } from 'lucide-react';

export const HeroBanner = ({
  searchQuery,
  onSearchChange,
  featuredGame,
  onPlayGame,
  totalGames,
}) => {
  return (
    <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#111827]/80 to-[#0B0F17]">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[220px] bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading, Search & Value Prop */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-indigo-400 font-semibold">RazeGames</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300 font-medium">WatkinsM Hub</span>
              <span aria-hidden="true">·</span>
              <span>{totalGames} Games Indexed</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">Zero Blockers</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-[1.15] text-balance">
              Instant Arcade &amp; Retro Games, Encapsulated in Clean Iframes.
            </h1>

            <p className="text-base text-slate-400 max-w-xl leading-relaxed">
              Every title runs directly inside a sandboxed iframe loaded from a clean JSON database. No installation, fast framerates, and built-in tab disguises.
            </p>

            {/* Search Input Bar */}
            <div className="relative max-w-md w-full pt-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search games by title, category, or author..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Featured Game Spotlight Card */}
          {featuredGame && (
            <div className="lg:col-span-5">
              <div className="relative group rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 shadow-xl hover:border-slate-700 transition-all duration-300">
                
                {/* Header kicker */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                    <Flame className="w-4 h-4" />
                    <span>Featured Spotlight</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {featuredGame.plays} plays
                  </div>
                </div>

                {/* Game Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-3xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                    {featuredGame.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-display mb-1">
                      {featuredGame.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <span>{featuredGame.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>By {featuredGame.author}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-400 font-semibold">{featuredGame.rating} ★</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {featuredGame.description}
                    </p>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => onPlayGame(featuredGame)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-indigo-600/25"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play {featuredGame.title}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
