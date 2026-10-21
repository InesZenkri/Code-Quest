import type { RoundResult } from '../types/game';

// Trailing run of rounds fixed cleanly (no hint, no wrong guess).
export function cleanStreak(results: RoundResult[]): number {
  let n = 0;
  for (let i = results.length - 1; i >= 0 && results[i].outcome === 'fixed' && results[i].clean; i--) n++;
  return n;
}
