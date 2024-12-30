export interface CodeChallenge {
  id: string;
  code: string;
  solution: string;
  hint: string;
  timeLimit: number;
}

export interface GameState {
  score: number;
  level: number;
  health: number;
  currentChallenge: CodeChallenge | null;
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameOver';
  showHint: boolean;
}

export interface PlayerStats {
  accuracy: number;
  wpm: number;
  timeElapsed: number;
}