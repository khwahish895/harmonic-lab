import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Send, Music, Sparkles, Loader2 } from 'lucide-react';
import { getTheoryAnalysis } from '../services/gemini';
import { TheoryResponse } from '../types';
import { cn } from '../lib/utils';

interface TheoryChatProps {
  onAnalysisUpdate: (analysis: TheoryResponse) => void;
}

export const TheoryChat: React.FC<TheoryChatProps> = ({ onAnalysisUpdate }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const analysis = await getTheoryAnalysis(userMessage);
      onAnalysisUpdate(analysis);
      setMessages(prev => [...prev, { role: 'assistant', content: analysis.explanation }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error analyzing that musical concept." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
      <div className="p-4 border-bottom border-zinc-800 bg-zinc-900/50 flex items-center gap-2">
        <Music className="w-4 h-4 text-emerald-500" />
        <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Theory Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
            <Sparkles className="w-12 h-12 mb-4 text-zinc-600" />
            <p className="text-sm text-zinc-400">Ask about scales, chords, or complex musical concepts.<br/>"What are the notes in C Lydian?"</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "max-w-[85%] p-3 rounded-lg text-sm",
            msg.role === 'user' ? "bg-emerald-600/20 text-emerald-100 ml-auto border border-emerald-500/30" : "bg-zinc-800 text-zinc-300 border border-zinc-700"
          )}>
            <div className="markdown-body">
              <Markdown>{msg.content}</Markdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-zinc-500 text-xs animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Analyzing theory...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-zinc-950 border-t border-zinc-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a theory question..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-4 pr-10 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-emerald-500 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
