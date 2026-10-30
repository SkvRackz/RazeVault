/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import initialGamesData from './data/games.json';
import { Header } from './components/Header.jsx';
import { HeroBanner } from './components/HeroBanner.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayerModal } from './components/GamePlayerModal.jsx';
import { TabCloakModal } from './components/TabCloakModal.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonViewerModal } from './components/JsonViewerModal.jsx';
import { History } from 'lucide-react';

export default function App() {
  // Initialize games: combine initial JSON data with user-added games in localStorage
  const [games, setGames] = useState(() => {
    try {
      const savedCustom = localStorage.getItem('vault_custom_games');
      if (savedCustom) {
        const customParsed = JSON.parse(savedCustom);
        return [...initialGamesData, ...customParsed];
      }
    } catch (e) {
      console.error('Error loading custom games from storage', e);
    }
    return initialGamesData;
  });

  // Category & search state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('vault_favorites');
      return saved ? JSON.parse(saved) : ['2048', 'tetris', 'snake'];
    } catch (e) {
      return ['2048', 'tetris', 'snake'];
    }
  });

  // Recently played state
  const [recentlyPlayedIds, setRecentlyPlayedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('vault_recent_games');
      return saved ? JSON.parse(saved) : ['2048', 'dino'];
    } catch (e) {
      return ['2048', 'dino'];
    }
  });

  // Modals state
  const [activeGame, setActiveGame] = useState(null);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Restore saved cloak on startup
  useEffect(() => {
    const savedTitle = localStorage.getItem('vault_cloak_title');
    const savedIcon = localStorage.getItem('vault_cloak_icon');
    if (savedTitle) document.title = savedTitle;
    if (savedIcon) {
      let link = document.querySelector("link[rel*='icon']");
      if (link) link.href = savedIcon;
    }
  }, []);

  // Global Panic Key Listener
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const panicKey = localStorage.getItem('vault_panic_key') || ']';
      const panicUrl = localStorage.getItem('vault_panic_url') || 'https://classroom.google.com';

      // Ignore if user is currently typing in an input or textarea
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === panicKey) {
        window.location.href = panicUrl;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Toggle favorite
  const handleToggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem('vault_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Launch game player and update recently played
  const handlePlayGame = (game) => {
    setActiveGame(game);
    setRecentlyPlayedIds((prev) => {
      const filtered = prev.filter((id) => id !== game.id);
      const updated = [game.id, ...filtered].slice(0, 5);
      localStorage.setItem('vault_recent_games', JSON.stringify(updated));
      return updated;
    });
  };

  // Add custom game
  const handleAddCustomGame = (newGame) => {
    setGames((prev) => {
      const updated = [newGame, ...prev];
      const customOnly = updated.filter((g) => g.isCustom);
      localStorage.setItem('vault_custom_games', JSON.stringify(customOnly));
      return updated;
    });
    handlePlayGame(newGame);
  };

  // Import custom JSON
  const handleImportJson = (importedList) => {
    setGames(importedList);
    const customOnly = importedList.filter((g) => g.isCustom);
    localStorage.setItem('vault_custom_games', JSON.stringify(customOnly));
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Category filter
      if (selectedCategory === 'Favorites') {
        if (!favorites.includes(game.id)) return false;
      } else if (selectedCategory !== 'All') {
        if (game.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(q);
        const matchesCategory = game.category.toLowerCase().includes(q);
        const matchesAuthor = game.author.toLowerCase().includes(q);
        const matchesDesc = game.description.toLowerCase().includes(q);
        return matchesTitle || matchesCategory || matchesAuthor || matchesDesc;
      }

      return true;
    });
  }, [games, selectedCategory, searchQuery, favorites]);

  // Recently played game items
  const recentGames = useMemo(() => {
    return recentlyPlayedIds
      .map((id) => games.find((g) => g.id === id))
      .filter(Boolean);
  }, [games, recentlyPlayedIds]);

  const featuredGame = games.find((g) => g.id === '2048') || games[0];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1-Row 3-Zone Header */}
      <Header
        currentCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Hero Spotlight & Search Banner */}
      <HeroBanner
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        featuredGame={featuredGame}
        onPlayGame={handlePlayGame}
        totalGames={games.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Recently Played Bar (if available and no active search) */}
        {!searchQuery && recentGames.length > 0 && selectedCategory === 'All' && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <History className="w-4 h-4 text-indigo-400" />
              <span>Resume Playing</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {recentGames.map((game) => (
                <button
                  key={game.id}
                  onClick={() => handlePlayGame(game)}
                  className="flex items-center gap-2.5 p-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all text-left group"
                >
                  <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-indigo-400 truncate">
                      {game.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {game.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Section Header: Title & Counts */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : selectedCategory === 'All'
                  ? 'All Games Library'
                  : selectedCategory === 'Favorites'
                  ? 'Your Bookmarked Favorites'
                  : `${selectedCategory} Games`}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>{filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} available</span>
                <span aria-hidden="true">·</span>
                <span>Loaded from games.json</span>
                <span aria-hidden="true">·</span>
                <span>Iframe Sandboxed</span>
              </div>
            </div>

            {/* Quick Interactive Category Pill/Tab Strip */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80 overflow-x-auto no-scrollbar">
              {['All', 'Arcade', 'Puzzle', 'Retro', 'Action', 'Strategy', 'Favorites'].map((cat) => {
                const active = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSearchQuery('');
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Games Grid */}
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onPlay={handlePlayGame}
                  onViewIframe={(g) => {
                    setActiveGame(g);
                  }}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-white font-display mb-1">
                No games found
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                {searchQuery 
                  ? `No matching games for "${searchQuery}". Try searching for puzzle, snake, 2048, or clear your query.`
                  : selectedCategory === 'Favorites'
                  ? "You haven't bookmarked any favorites yet. Click the heart icon on any game to pin it here!"
                  : "No games found in this category."}
              </p>
              <div className="flex items-center justify-center gap-3">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg transition-colors"
                >
                  + Add Custom Game
                </button>
              </div>
            </div>
          )}
        </section>

      </main>

      {/* Quiet, Anti-Slop Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#070A10] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">RazeGames</span>
            <span aria-hidden="true">·</span>
            <span>WatkinsM Hub</span>
            <span aria-hidden="true">·</span>
            <span>Unblocked Iframe Gaming Portal</span>
            <span aria-hidden="true">·</span>
            <button 
              onClick={() => setIsJsonModalOpen(true)}
              className="text-indigo-400 hover:underline"
            >
              Inspect games.json
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button 
              onClick={() => setIsCloakModalOpen(true)} 
              className="hover:text-white transition-colors"
            >
              Stealth Hotkey
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)} 
              className="hover:text-white transition-colors"
            >
              Add Game
            </button>
            <span>&copy; {new Date().getFullYear()} RazeGames · WatkinsM Hub</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GamePlayerModal
        game={activeGame}
        onClose={() => setActiveGame(null)}
        isFavorite={activeGame ? favorites.includes(activeGame.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      <TabCloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
      />

      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddCustomGame}
      />

      <JsonViewerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onImportJson={handleImportJson}
      />
    </div>
  );
}
