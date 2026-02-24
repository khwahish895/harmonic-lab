export type Note = string;

export interface Scale {
  name: string;
  root: Note;
  notes: Note[];
  intervals: string[];
}

export interface Chord {
  name: string;
  root: Note;
  notes: Note[];
  type: string;
}

export interface TheoryResponse {
  scale?: Scale;
  chord?: Chord;
  explanation: string;
  suggestions: string[];
}
