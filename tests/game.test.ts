import assert from 'node:assert/strict';
import { test } from 'node:test';
import { codeChallenges as challenges } from '../src/data/challenges';
import { initialState, startRound, submitAnswer, tick, revealHint, finishRound, nextRound, matchesSolution, roundReward, WRONG_ATTEMPT_PENALTY } from '../src/lib/game';
const start = (mode: 'sprint' | 'practice' = 'sprint') => startRound(initialState(mode), challenges[0], 1000);
test('starts with three lives and a deadline', () => {
  assert.equal(start().lives, 3); assert.equal(start().deadline, 46000);
});
test('last answer earns points and the session finishes', () => {
  let state = start();
  for (const c of challenges) {
    state = submitAnswer(state, c, c.solution, 1000);
    assert.equal(state.status, 'review');
    state = nextRound(state, challenges, 1000);
  }
  assert.equal(state.status, 'finished'); assert.equal(state.solved, challenges.length);
  assert.equal(state.score, challenges.reduce((sum, c) => sum + 100 + c.timeLimit, 0));
});
test('timer expires without typing and only costs one life', () => {
  const expired = tick(start(), 46000);
  assert.equal(expired.lives, 2); assert.equal(expired.status, 'review');
  assert.deepEqual(tick(expired, 90000), expired);
});
test('late submissions cannot beat the deadline', () => {
  const state = submitAnswer(start(), challenges[0], challenges[0].solution, 46000);
  assert.equal(state.correct, false); assert.equal(state.score, 0);
});
test('wrong answers cost reward but not lives and can be retried', () => {
  const state = submitAnswer(start(), challenges[0], 'wrong', 2000);
  assert.equal(state.status, 'playing'); assert.equal(state.lives, 3);
  assert.equal(state.attempts, 1); assert.equal(state.wrongAttempts, 1);
  assert.match(state.feedback, new RegExp(`-${WRONG_ATTEMPT_PENALTY}`));
});
test('wrong guesses reduce the round reward by ten each', () => {
  let state = start();
  state = submitAnswer(state, challenges[0], 'wrong', 1500);
  state = submitAnswer(state, challenges[0], 'still wrong', 1600);
  state = submitAnswer(state, challenges[0], challenges[0].solution, 2000);
  assert.equal(state.correct, true);
  assert.deepEqual(state.reward, { base: 100, timeBonus: 44, hintPenalty: 0, attemptPenalty: 20, total: 124 });
  assert.equal(state.score, 124);
});
test('the displayed seconds are exactly what the bonus awards', () => {
  let state = start();
  state = tick(state, 11200); // 34.8s remaining shows as 34
  assert.equal(state.secondsLeft, 34);
  state = submitAnswer(state, challenges[0], challenges[0].solution, 11200);
  assert.equal(state.reward?.timeBonus, 34);
});
test('hint penalty applies once to the potential reward', () => {
  const state = submitAnswer(revealHint(revealHint(start())), challenges[0], challenges[0].solution, 1000);
  assert.equal(state.score, 125);
  assert.equal(state.reward?.hintPenalty, 20);
});
test('reward never drops below zero', () => {
  let state = revealHint(start());
  for (let i = 0; i < 15; i++) state = submitAnswer(state, challenges[0], 'wrong', 1500 + i);
  state = submitAnswer(state, challenges[0], challenges[0].solution, 2000);
  assert.equal(state.reward?.total, 0); assert.equal(state.score, 0);
});
test('practice has no deadline or time bonus', () => {
  const state = tick(start('practice'), 999999);
  assert.equal(state.status, 'playing');
  assert.equal(submitAnswer(state, challenges[0], challenges[0].solution, 999999).score, 100);
});
test('practice skips never cost lives', () => {
  assert.equal(finishRound(start('practice'), false).lives, 3);
});
test('three failed rounds end sprint', () => {
  let state = start();
  for (let i = 0; i < 3; i++) state = nextRound(finishRound(state, false), challenges, 1000);
  assert.equal(state.status, 'finished'); assert.equal(state.lives, 0);
});
test('review actions cannot double-score or advance twice', () => {
  const review = finishRound(start(), true);
  assert.deepEqual(finishRound(review, true), review);
  const playing = nextRound(review, challenges, 1000);
  assert.deepEqual(nextRound(playing, challenges, 1000), playing);
});
test('a fresh round resets hint, wrong guesses and the breakdown', () => {
  let state = revealHint(start());
  state = submitAnswer(state, challenges[0], 'wrong', 1500);
  state = submitAnswer(state, challenges[0], challenges[0].solution, 2000);
  const next = nextRound(state, challenges, 3000);
  assert.equal(next.hintUsed, false); assert.equal(next.wrongAttempts, 0); assert.equal(next.reward, null);
});
test('matching tolerates outer whitespace and CRLF, not arbitrary rewrites', () => {
  assert.ok(matchesSolution('  a\r\nb\n', 'a\nb'));
  assert.equal(matchesSolution('a +b', 'a + b'), false);
});
test('roundReward breakdown adds up', () => {
  const r = roundReward({ ...start(), hintUsed: true, wrongAttempts: 2, secondsLeft: 30 });
  assert.equal(r.base + r.timeBonus - r.hintPenalty - r.attemptPenalty, r.total);
});
test('challenge IDs are unique and every challenge has a fix and explanation', () => {
  assert.equal(new Set(challenges.map(c => c.id)).size, challenges.length);
  for (const c of challenges) {
    assert.notEqual(c.code, c.solution); assert.ok(c.timeLimit > 0);
    assert.ok(c.hint && c.explanation && c.topic);
  }
});
