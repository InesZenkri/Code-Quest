import assert from 'node:assert/strict';
import { test } from 'node:test';
import { codeChallenges as challenges } from '../src/data/challenges';
import { initialState, startRound, submitAnswer, tick, revealHint, finishRound, nextRound, matchesSolution } from '../src/lib/game';
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
test('wrong answers may be retried without losing lives', () => {
  const state = submitAnswer(start(), challenges[0], 'wrong', 2000);
  assert.equal(state.status, 'playing'); assert.equal(state.lives, 3); assert.equal(state.attempts, 1);
});
test('hint penalty applies once to the potential reward', () => {
  const state = submitAnswer(revealHint(revealHint(start())), challenges[0], challenges[0].solution, 1000);
  assert.equal(state.score, 125);
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
test('matching tolerates outer whitespace and CRLF, not arbitrary rewrites', () => {
  assert.ok(matchesSolution('  a\r\nb\n', 'a\nb'));
  assert.equal(matchesSolution('a +b', 'a + b'), false);
});
test('challenge IDs are unique and every challenge has a fix and explanation', () => {
  assert.equal(new Set(challenges.map(c => c.id)).size, challenges.length);
  for (const c of challenges) {
    assert.notEqual(c.code, c.solution); assert.ok(c.timeLimit > 0);
    assert.ok(c.hint && c.explanation && c.topic);
  }
});
