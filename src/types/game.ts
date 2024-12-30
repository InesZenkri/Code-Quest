export interface CodeChallenge {
  id: string;
  code: string;
  timeLimit: number;
}

export interface GameState {
  score: number;
  level: number;
  health: number;
  currentChallenge: CodeChallenge | null;
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameOver';
}

export interface PlayerStats {
  accuracy: number;
  wpm: number;
  timeElapsed: number;
}