import React, { useState } from 'react';
import { Play, Heart, Code2, Check } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlay,
  onViewIframe,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyIframe = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(game.iframe);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={() => onPlay(game)}
      className="group relative flex flex-col justify-between bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-lg hover:shadow-black/40"
    >
      <div>
        {/* Card Header: Icon + Favorite Action */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-200 shrink-0">
            {game.icon}
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleCopyIframe}
              title="Copy iframe HTML embed code"
              className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Code2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => onToggleFavorite(game.id)}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-1.5 rounded-lg transition-colors ${
                isFavorite 
                  ? 'text-rose-500 hover:text-rose-400 bg-rose-500/10' 
                  : 'text-slate-500 hover:text-rose-400 hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="space-y-1.5 mb-2.5">
          <h3 className="font-display text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {game.title}
          </h3>

          {/* Zero-Pill unboxed metadata */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{game.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400 font-medium">{game.rating} ★</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-500">{game.plays}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
          {game.description}
        </p>
      </div>

      {/* Card Footer: Play Action */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-500 truncate max-w-[130px]">
          By {game.author}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay(game);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Play</span>
        </button>
      </div>
    </div>
  );
};
