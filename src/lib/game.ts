import type { CodeChallenge, GameState, Mode, RoundReward } from '../types/game';

// Ignore line-ending differences and outer whitespace only. No eval or code execution.
export const matchesSolution = (input: string, target: string) =>
  input.replace(/\r\n/g, '\n').trim() === target.replace(/\r\n/g, '\n').trim();

export const BASE_POINTS = 100;
export const HINT_PENALTY = 20;
export const WRONG_ATTEMPT_PENALTY = 10;

export function roundReward(state: GameState): RoundReward {
  const timeBonus = state.mode === 'sprint' ? state.secondsLeft : 0;
  const hintPenalty = state.hintUsed ? HINT_PENALTY : 0;
  const attemptPenalty = state.wrongAttempts * WRONG_ATTEMPT_PENALTY;
  const total = Math.max(0, BASE_POINTS + timeBonus - hintPenalty - attemptPenalty);
  return { base: BASE_POINTS, timeBonus, hintPenalty, attemptPenalty, total };
}

export function initialState(mode: Mode = 'sprint'): GameState {
  return { status: 'idle', mode, index: 0, score: 0, lives: 3, solved: 0,
    attempts: 0, wrongAttempts: 0, hintUsed: false, secondsLeft: 0, deadline: 0,
    feedback: '', correct: false, reward: null, results: [], totalWrong: 0 };
}
export function startRound(state: GameState, challenge: CodeChallenge, now: number): GameState {
  return { ...state, status: 'playing', hintUsed: false, wrongAttempts: 0,
    secondsLeft: challenge.timeLimit, deadline: now + challenge.timeLimit * 1000,
    feedback: '', correct: false, reward: null };
}
export function finishRound(state: GameState, correct: boolean, timedOut = false, challenge?: CodeChallenge): GameState {
  if (state.status !== 'playing') return state;
  const reward = correct ? roundReward(state) : null;
  const result = challenge ? { id: challenge.id, title: challenge.title,
    outcome: correct ? 'fixed' as const : timedOut ? 'timeout' as const : 'skipped' as const,
    clean: correct && !state.hintUsed && state.wrongAttempts === 0,
    reward: reward ? reward.total : null } : null;
  return { ...state, status: 'review', correct, solved: state.solved + Number(correct),
    score: state.score + (reward ? reward.total : 0), reward,
    results: result ? [...state.results, result] : state.results,
    totalWrong: state.totalWrong + state.wrongAttempts,
    lives: state.lives - Number(!correct && state.mode === 'sprint'),
    feedback: correct ? 'Correct. Read the explanation, then move on.' : timedOut ? 'Time is up. Review the fix before continuing.' : 'Round skipped. Here is the reference fix.' };
}
export function submitAnswer(state: GameState, challenge: CodeChallenge, input: string, now: number): GameState {
  if (state.status !== 'playing') return state;
  const current = tick(state, now);
  if (current.status !== 'playing') return current;
  const attempted = { ...current, attempts: current.attempts + 1 };
  if (matchesSolution(input, challenge.solution)) return finishRound(attempted, true, false, challenge);
  return { ...attempted, wrongAttempts: attempted.wrongAttempts + 1,
    feedback: `Not the reference fix yet (-${WRONG_ATTEMPT_PENALTY} from this round's reward). Check spelling, punctuation and spacing, or use the hint.` };
}
export function tick(state: GameState, now: number, challenge?: CodeChallenge): GameState {
  if (state.status !== 'playing' || state.mode === 'practice') return state;
  const remaining = Math.max(0, state.deadline - now);
  const next = { ...state, secondsLeft: Math.floor(remaining / 1000) };
  return remaining <= 0 ? finishRound(next, false, true, challenge) : next;
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
