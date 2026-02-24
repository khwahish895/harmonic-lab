import React from 'react';
import { cn } from '../lib/utils';

interface PianoProps {
  highlightedNotes?: string[];
  onNoteClick?: (note: string) => void;
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [3, 4, 5];

export const Piano: React.FC<PianoProps> = ({ highlightedNotes = [], onNoteClick }) => {
  const isHighlighted = (note: string, octave: number) => {
    const fullNote = `${note}${octave}`;
    // Also check for enharmonics if needed, but for now simple match
    return highlightedNotes.includes(note) || highlightedNotes.includes(fullNote);
  };

  return (
    <div className="flex select-none overflow-x-auto pb-4 pt-2">
      <div className="flex min-w-max border-l border-zinc-800">
        {OCTAVES.map((octave) => (
          <div key={octave} className="flex">
            {NOTES.map((note) => {
              const isBlack = note.includes('#');
              const highlighted = isHighlighted(note, octave);
              
              return (
                <div
                  key={`${note}${octave}`}
                  onClick={() => onNoteClick?.(`${note}${octave}`)}
                  className={cn(
                    "relative flex items-end justify-center transition-colors cursor-pointer",
                    isBlack 
                      ? "w-8 h-32 -mx-4 z-10 bg-zinc-900 border border-zinc-700 rounded-b-sm" 
                      : "w-12 h-48 bg-zinc-100 border border-zinc-300 rounded-b-md",
                    highlighted && (isBlack ? "bg-emerald-600 border-emerald-400" : "bg-emerald-400 border-emerald-300"),
                    !highlighted && !isBlack && "hover:bg-zinc-200",
                    !highlighted && isBlack && "hover:bg-zinc-800"
                  )}
                >
                  {!isBlack && (
                    <span className="mb-2 text-[10px] font-mono text-zinc-400 uppercase">
                      {note}{octave}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
