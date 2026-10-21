import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildDailyDeck, buildDeck, dailySeed, mulberry32, shuffle } from '../src/lib/deck';
import { codeChallenges as pool } from '../src/data/challenges';
import { shareText } from '../src/lib/share';
import { topicStats } from '../src/lib/topics';
import { initialState } from '../src/lib/game';

test('daily deck is stable within a date and changes across dates', () => {
  const a = buildDailyDeck(pool, new Date('2026-10-21T08:00:00')).map(c => c.id);
  const b = buildDailyDeck(pool, new Date('2026-10-21T22:00:00')).map(c => c.id);
  const c = buildDailyDeck(pool, new Date('2026-10-22T08:00:00')).map(c => c.id);
  assert.deepEqual(a, b); assert.notDeepEqual(a, c);
  assert.equal(dailySeed(new Date('2026-10-21T08:00:00')), '2026-10-21');
});
test('sprint deck has 12 unique rounds, easy first, and is seeded', () => {
  const a = buildDeck('sprint', pool, 42).map(c => c.id);
  const b = buildDeck('sprint', pool, 42).map(c => c.id);
  assert.deepEqual(a, b);
  const deck = buildDeck('sprint', pool, 42);
  assert.equal(deck.length, 12);
  assert.equal(new Set(a).size, 12);
  assert.ok(deck.slice(0, 3).every(c => c.difficulty === 'easy'));
});
test('practice deck is a shuffled permutation of the pool', () => {
  const deck = buildDeck('practice', pool, 7);
  assert.equal(deck.length, pool.length);
  assert.deepEqual([...deck].map(c => c.id).sort(), pool.map(c => c.id).sort());
});
test('shuffle keeps every element', () => {
  const rand = mulberry32(1);
  const out = shuffle([1, 2, 3, 4, 5], rand);
  assert.deepEqual([...out].sort(), [1, 2, 3, 4, 5]);
});
test('every challenge solution parses as JavaScript', () => {
  for (const c of pool) {
    assert.doesNotThrow(() => new Function(c.solution), c.id);
    assert.notEqual(c.code, c.solution, c.id);
  }
});
test('shareText summarizes a finished sprint', () => {
  const g = { ...initialState('sprint'), score: 240, solved: 2, results: [
    { id: 'a', title: 'A', outcome: 'fixed' as const, clean: true, reward: 140 },
    { id: 'b', title: 'B', outcome: 'fixed' as const, clean: false, reward: 100 },
    { id: 'c', title: 'C', outcome: 'timeout' as const, clean: false, reward: null },
  ] };
  const text = shareText(g, 12, 90, 'sprint');
  assert.match(text, /Debug Sprint\n240 points · 2\/12 fixed · 90% accuracy\n✅ 🟨 ⏱️\nhttps:\/\/debugit\.netlify\.app/);
});
test('topicStats tallies fixed per topic', () => {
  const deck = pool.slice(0, 3);
  const stats = topicStats([
    { id: deck[0].id, title: '', outcome: 'fixed', clean: true, reward: 100 },
    { id: deck[0].id, title: '', outcome: 'skipped', clean: false, reward: null },
  ], deck);
  assert.deepEqual(stats, [{ topic: deck[0].topic, fixed: 1, total: 2 }]);
});
