import React, { useState } from 'react';
import { X, Plus, Eye, Code, Globe, AlertCircle } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎮');
  const [inputType, setInputType] = useState('url');
  const [iframeUrl, setIframeUrl] = useState('');
  const [rawIframeCode, setRawIframeCode] = useState('');
  const [previewActive, setPreviewActive] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTestPreview = () => {
    let resolvedUrl = '';
    if (inputType === 'url') {
      resolvedUrl = iframeUrl.trim();
    } else {
      const match = rawIframeCode.match(/src=["'](.*?)["']/);
      resolvedUrl = match ? match[1] : '';
    }

    if (!resolvedUrl) {
      setError('Please provide a valid iframe URL or embed code to preview.');
      return;
    }

    setError('');
    setPreviewActive(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    let finalUrl = '';
    let finalIframeCode = '';

    if (inputType === 'url') {
      if (!iframeUrl.trim()) {
        setError('Please enter a valid game URL.');
        return;
      }
      finalUrl = iframeUrl.trim();
      finalIframeCode = `<iframe src="${finalUrl}" title="${title}" width="100%" height="100%" frameborder="0" allowfullscreen="true" sandbox="allow-scripts allow-same-origin allow-pointer-lock"></iframe>`;
    } else {
      if (!rawIframeCode.trim()) {
        setError('Please enter raw iframe HTML code.');
        return;
      }
      finalIframeCode = rawIframeCode.trim();
      const match = rawIframeCode.match(/src=["'](.*?)["']/);
      finalUrl = match ? match[1] : '';
      if (!finalUrl) {
        setError('Could not extract "src" attribute from the iframe code.');
        return;
      }
    }

    const newGame = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      category: category,
      author: author.trim() || 'Community Contributor',
      description: description.trim() || 'Custom user game loaded via iframe container.',
      icon: icon || '🎮',
      rating: 5.0,
      plays: '1',
      iframeUrl: finalUrl,
      iframe: finalIframeCode,
      controls: ['Standard Web / Mouse controls'],
      isCustom: true,
    };

    onAddGame(newGame);
    onClose();
  };

  const previewUrl = inputType === 'url' ? iframeUrl : (rawIframeCode.match(/src=["'](.*?)["']/)?.[1] || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0B0F17] border border-slate-800 rounded-2xl p-6 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Add Custom Game</h3>
              <p className="text-xs text-slate-400">Embed any HTML5 game directly into your JSON library</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Game Title:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Slope, Drift Hunters, 1v1.lol..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
                <option value="Retro">Retro</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>
          </div>

          {/* Author & Icon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Creator / Author:</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Developer name"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Emoji Icon:</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                maxLength={4}
                className="w-full px-3 py-2 text-center bg-slate-900 border border-slate-800 rounded-lg text-base text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Description:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the game..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Input Method Toggle */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => { setInputType('url'); setPreviewActive(false); }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                  inputType === 'url'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Embed URL</span>
              </button>
              <button
                type="button"
                onClick={() => { setInputType('iframe'); setPreviewActive(false); }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                  inputType === 'iframe'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Raw &lt;iframe&gt; Tag</span>
              </button>
            </div>

            {inputType === 'url' ? (
              <input
                type="url"
                value={iframeUrl}
                onChange={(e) => { setIframeUrl(e.target.value); setPreviewActive(false); }}
                placeholder="https://example.com/games/my-game/index.html"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            ) : (
              <textarea
                rows={3}
                value={rawIframeCode}
                onChange={(e) => { setRawIframeCode(e.target.value); setPreviewActive(false); }}
                placeholder='<iframe src="https://..." width="100%" height="100%" ...></iframe>'
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-indigo-500 resize-none"
              />
            )}
          </div>

          {/* Test Preview Box */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleTestPreview}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Test Preview</span>
            </button>
          </div>

          {previewActive && previewUrl && (
            <div className="w-full h-48 border border-slate-800 rounded-lg overflow-hidden bg-black">
              <iframe
                src={previewUrl}
                title="Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock"
              />
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              Save to Library
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
