import type { CodeChallenge, Mode } from '../types/game';

// Deterministic PRNG so daily decks are the same for everyone on a date.
export function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle<T>(items: T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const SPRINT_ROUNDS = 12;

export function dailySeed(date: Date = new Date()): string {
  const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, '0'), d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildDeck(mode: Mode, pool: CodeChallenge[], seed: number = Math.floor(Math.random() * 2 ** 32)): CodeChallenge[] {
  if (mode === 'practice') return shuffle(pool, mulberry32(seed));
  // Easy rounds first, then a shuffled mix of medium and hard.
  const easy = shuffle(pool.filter(c => c.difficulty === 'easy'), mulberry32(seed ^ 0xea50));
  const rest = shuffle(pool.filter(c => c.difficulty !== 'easy'), mulberry32(seed));
  return [...easy.slice(0, 3), ...rest.slice(0, SPRINT_ROUNDS - 3)];
}

export function buildDailyDeck(pool: CodeChallenge[], date: Date = new Date()): CodeChallenge[] {
  return buildDeck('daily', pool, hashSeed(dailySeed(date)));
}
