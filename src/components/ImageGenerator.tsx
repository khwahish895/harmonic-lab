import React, { useState, useEffect } from 'react';
import { ImageIcon, Loader2, Sparkles, Key } from 'lucide-react';
import { generateMusicImage } from '../services/gemini';
import { cn } from '../lib/utils';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    try {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } catch (e) {
      setHasKey(false);
    }
  };

  const handleOpenKey = async () => {
    await window.aistudio.openSelectKey();
    setHasKey(true);
  };

  const handleGenerate = async () => {
    if (!prompt || loading) return;
    setLoading(true);
    try {
      const url = await generateMusicImage(prompt, size);
      setImage(url);
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("Requested entity was not found")) {
        setHasKey(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (hasKey === false) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-zinc-900 border border-zinc-800 rounded-xl text-center space-y-4">
        <Key className="w-12 h-12 text-amber-500" />
        <div>
          <h3 className="text-lg font-semibold text-zinc-200">API Key Required</h3>
          <p className="text-sm text-zinc-400 max-w-xs mx-auto">
            To generate high-quality musical visualizations, you need to select a paid Gemini API key.
          </p>
        </div>
        <button
          onClick={handleOpenKey}
          className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
        >
          Select API Key
        </button>
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 underline"
        >
          Learn about Gemini API billing
        </a>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Visualizer AI</h2>
        </div>
        <div className="flex gap-2">
          {(["1K", "2K", "4K"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={cn(
                "px-2 py-1 text-[10px] font-bold rounded border transition-colors",
                size === s ? "bg-amber-600 border-amber-500 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="relative aspect-video bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 flex items-center justify-center">
          {image ? (
            <img src={image} alt="Generated visualization" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8 opacity-30">
              <Sparkles className="w-12 h-12 mx-auto mb-2" />
              <p className="text-xs">Visualize the "vibe" of your scale or chord</p>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-xs text-amber-500 font-medium animate-pulse">Generating Masterpiece...</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the musical vibe..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
