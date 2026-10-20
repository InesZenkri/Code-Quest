import type { CodeChallenge, GameState, Mode } from '../types/game';

// Ignore line-ending differences and outer whitespace only. No eval or code execution.
export const matchesSolution = (input: string, target: string) =>
  input.replace(/\r\n/g, '\n').trim() === target.replace(/\r\n/g, '\n').trim();

export function initialState(mode: Mode = 'sprint'): GameState {
  return { status: 'idle', mode, index: 0, score: 0, lives: 3, solved: 0,
    attempts: 0, hintUsed: false, secondsLeft: 0, deadline: 0, feedback: '', correct: false };
}
export function startRound(state: GameState, challenge: CodeChallenge, now: number): GameState {
  return { ...state, status: 'playing', hintUsed: false, secondsLeft: challenge.timeLimit,
    deadline: now + challenge.timeLimit * 1000, feedback: '', correct: false };
}
export function finishRound(state: GameState, correct: boolean, timedOut = false): GameState {
  if (state.status !== 'playing') return state;
  return { ...state, status: 'review', correct, solved: state.solved + Number(correct),
    score: state.score + (correct ? Math.max(0, 100 + (state.mode === 'sprint' ? state.secondsLeft : 0) - (state.hintUsed ? 20 : 0)) : 0),
    lives: state.lives - Number(!correct && state.mode === 'sprint'),
    feedback: correct ? 'Correct. Read the explanation, then move on.' : timedOut ? 'Time is up. Review the fix before continuing.' : 'Round skipped. Here is the reference fix.' };
}
export function submitAnswer(state: GameState, challenge: CodeChallenge, input: string, now: number): GameState {
  if (state.status !== 'playing') return state;
  const current = tick(state, now);
  if (current.status !== 'playing') return current;
  const attempted = { ...current, attempts: current.attempts + 1 };
  return matchesSolution(input, challenge.solution)
    ? finishRound(attempted, true)
    : { ...attempted, feedback: 'Not the reference fix yet. Check spelling, punctuation and spacing, or use the hint.' };
}
export function tick(state: GameState, now: number): GameState {
  if (state.status !== 'playing' || state.mode === 'practice') return state;
  const next = { ...state, secondsLeft: Math.max(0, Math.ceil((state.deadline - now) / 1000)) };
  return next.secondsLeft === 0 ? finishRound(next, false, true) : next;
}
export function revealHint(state: GameState): GameState {
  return state.status === 'playing' ? { ...state, hintUsed: true } : state;
}
export function nextRound(state: GameState, challenges: CodeChallenge[], now: number): GameState {
  if (state.status !== 'review') return state;
  const index = state.index + 1;
  return state.lives <= 0 || index >= challenges.length
    ? { ...state, status: 'finished' }
    : startRound({ ...state, index }, challenges[index], now);
}
