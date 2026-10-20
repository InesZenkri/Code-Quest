export type Mode = 'sprint' | 'practice';
export interface CodeChallenge {
  id: string;
  title: string;
  topic: string;
  difficulty: 'easy' | 'medium';
  code: string;
  solution: string;
  hint: string;
  explanation: string;
  timeLimit: number;
}
export interface GameState {
  status: 'idle' | 'playing' | 'review' | 'finished';
  mode: Mode;
  index: number;
  score: number;
  lives: number;
  solved: number;
  attempts: number;
  hintUsed: boolean;
  secondsLeft: number;
  deadline: number;
  feedback: string;
  correct: boolean;
}
