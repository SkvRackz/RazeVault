import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  ExternalLink, 
  Heart, 
  Keyboard, 
  Code2, 
  Check, 
  Tv
} from 'lucide-react';

export const GamePlayerModal = ({
  game,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showIframeCode, setShowIframeCode] = useState(false);
  const modalContainerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!game) return null;

  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (!document.fullscreenElement) {
      modalContainerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Exit fullscreen failed:', err);
      });
    }
  };

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  // Stealth about:blank cloak feature
  const openInAboutBlank = () => {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Pop-up blocked. Please enable pop-ups to open in stealth tab.');
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Docs</title>
          <link rel="icon" href="https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico">
          <style>
            body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
            iframe { border: none; width: 100%; height: 100%; }
          </style>
        </head>
        <body>
          <iframe src="${window.location.origin}${game.iframeUrl}" allow="autoplay; fullscreen" allowfullscreen="true"></iframe>
        </body>
      </html>
    `;
    win.document.write(htmlContent);
    win.document.close();
  };

  const handleCopyIframe = () => {
    navigator.clipboard.writeText(game.iframe);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
      <div
        ref={modalContainerRef}
        className={`relative flex flex-col bg-[#0B0F17] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 ${
          isFullscreen 
            ? 'w-full h-full rounded-none border-none' 
            : isTheater 
              ? 'w-full max-w-6xl h-[92vh]' 
              : 'w-full max-w-4xl h-[84vh]'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/95 border-b border-slate-800 shrink-0">
          
          {/* Left: Game Title & Badges */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">{game.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-white">
                  {game.title}
                </h2>
                <span className="text-xs text-slate-500 font-medium">({game.category})</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">By {game.author}</p>
            </div>
          </div>

          {/* Right: Player Controls & Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* View Iframe Code Button */}
            <button
              onClick={() => setShowIframeCode(!showIframeCode)}
              title="View Iframe JSON snippet"
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                showIframeCode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Code2 className="w-4 h-4" />
            </button>

            {/* Controls Drawer Toggle */}
            <button
              onClick={() => setShowControls(!showControls)}
              title="Show Key Controls"
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                showControls ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Favorite Toggle */}
            <button
              onClick={() => onToggleFavorite(game.id)}
              title="Favorite game"
              className={`p-2 rounded-lg transition-colors ${
                isFavorite 
                  ? 'text-rose-500 bg-rose-500/10' 
                  : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Reload Iframe */}
            <button
              onClick={handleReload}
              title="Restart / Reload Game"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Stealth about:blank cloak */}
            <button
              onClick={openInAboutBlank}
              title="Stealth Mode: Open in disguised about:blank window"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Stealth Tab</span>
            </button>

            {/* Theater Mode Toggle */}
            {!isFullscreen && (
              <button
                onClick={() => setIsTheater(!isTheater)}
                title={isTheater ? "Standard View" : "Theater View"}
                className="hidden sm:inline-flex p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Tv className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              title="Close Player (Esc)"
              className="p-2 text-slate-400 hover:text-white hover:bg-rose-900/30 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5 text-rose-400" />
            </button>
          </div>
        </div>

        {/* Collapsible Iframe Code Drawer */}
        {showIframeCode && (
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="w-full">
              <span className="text-slate-400 font-semibold block mb-1">Stored Iframe JSON Definition:</span>
              <code className="font-mono text-indigo-300 bg-slate-900 px-3 py-2 rounded block overflow-x-auto select-all border border-slate-800">
                {game.iframe}
              </code>
            </div>
            <button
              onClick={handleCopyIframe}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold shrink-0 flex items-center gap-1.5 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Snippet'}</span>
            </button>
          </div>
        )}

        {/* Collapsible Controls Drawer */}
        {showControls && (
          <div className="bg-slate-950/90 p-4 border-b border-slate-800 flex flex-wrap gap-4 text-xs">
            <div className="font-semibold text-slate-300">Controls:</div>
            {game.controls.map((ctrl, i) => (
              <span key={i} className="text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                {ctrl}
              </span>
            ))}
          </div>
        )}

        {/* Game Iframe Body */}
        <div className="relative flex-1 w-full bg-[#020617] flex items-center justify-center overflow-hidden">
          <iframe
            key={iframeKey}
            src={game.iframeUrl}
            title={game.title}
            className="w-full h-full border-0 select-none"
            allow="autoplay; fullscreen"
            allowFullScreen={true}
            sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          />
        </div>
      </div>
    </div>
  );
};
