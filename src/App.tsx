import React, { useState } from 'react';
import { Piano } from './components/Piano';
import { CircleOfFifths } from './components/CircleOfFifths';
import { TheoryChat } from './components/TheoryChat';
import { ImageGenerator } from './components/ImageGenerator';
import { TheoryResponse } from './types';
import { Music, Info, Layers, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [analysis, setAnalysis] = useState<TheoryResponse | null>(null);
  const [activeNote, setActiveNote] = useState<string>('C');

  const highlightedNotes = analysis?.scale?.notes || analysis?.chord?.notes || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Harmonic Lab</h1>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Theory Visualization Engine</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <button className="text-xs font-medium text-zinc-400 hover:text-emerald-400 transition-colors uppercase tracking-wider">Explorer</button>
          <button className="text-xs font-medium text-zinc-400 hover:text-emerald-400 transition-colors uppercase tracking-wider">Library</button>
          <button className="text-xs font-medium text-zinc-400 hover:text-emerald-400 transition-colors uppercase tracking-wider">Settings</button>
        </nav>
      </header>

      <main className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Left Sidebar - Chat & Image Gen */}
        <aside className="w-full lg:w-[400px] border-r border-zinc-800 flex flex-col p-4 gap-4 overflow-y-auto bg-zinc-950">
          <div className="flex-1 min-h-[400px]">
            <TheoryChat onAnalysisUpdate={setAnalysis} />
          </div>
          <div className="flex-shrink-0">
            <ImageGenerator />
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 overflow-y-auto p-6 space-y-8 bg-zinc-900/20">
          <AnimatePresence mode="wait">
            {analysis ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Analysis Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Structure</span>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-100">
                      {analysis.scale?.name || analysis.chord?.name || "Custom Concept"}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">Root: {analysis.scale?.root || analysis.chord?.root}</p>
                  </div>
                  
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Theoretical Context</span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {analysis.explanation}
                    </p>
                  </div>
                </div>

                {/* Visualizations */}
                <div className="space-y-6">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-widest">Interactive Keyboard</h2>
                      </div>
                      <div className="flex gap-2">
                        {highlightedNotes.map((note, i) => (
                          <span key={i} className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-mono text-emerald-400">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Piano highlightedNotes={highlightedNotes} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-500" />
                        <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-widest">Circle of Fifths</h2>
                      </div>
                      <CircleOfFifths 
                        activeNote={analysis.scale?.root || analysis.chord?.root || activeNote} 
                        onNoteClick={setActiveNote}
                      />
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                      <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-widest mb-4">Related Concepts</h2>
                      <div className="space-y-3">
                        {analysis.suggestions.map((suggestion, i) => (
                          <div key={i} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-400 hover:border-emerald-500/50 transition-colors cursor-pointer group">
                            <span className="group-hover:text-emerald-400 transition-colors">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
                <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 shadow-2xl">
                  <Music className="w-10 h-10 text-zinc-700" />
                </div>
                <div className="max-w-md">
                  <h2 className="text-2xl font-bold text-zinc-200 mb-2">Ready to Explore?</h2>
                  <p className="text-zinc-500 text-sm">
                    Ask the Theory Assistant in the sidebar to visualize a scale, chord, or musical concept. Try "Show me the G Major scale" or "What is a Cmaj7 chord?"
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-left">
                    <h4 className="text-xs font-bold text-emerald-500 uppercase mb-1">Scales</h4>
                    <p className="text-[11px] text-zinc-500 italic">"Explain the Phrygian Dominant scale in E"</p>
                  </div>
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-left">
                    <h4 className="text-xs font-bold text-emerald-500 uppercase mb-1">Chords</h4>
                    <p className="text-[11px] text-zinc-500 italic">"What are the notes in an F# diminished 7th?"</p>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
