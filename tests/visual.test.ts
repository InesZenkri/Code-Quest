import assert from 'node:assert/strict';
import { test } from 'node:test';
import { tokenize } from '../src/lib/highlight';
import { diffLines } from '../src/lib/diff';
import { cleanStreak } from '../src/lib/streak';
import { codeChallenges as challenges } from '../src/data/challenges';

test('tokenize covers the input and classifies keywords, strings and comments', () => {
  const code = 'const x = "hi"; // done\nreturn x.length + 42;';
  const toks = tokenize(code);
  assert.equal(toks.map(t => t.text).join(''), code);
  const byText = Object.fromEntries(toks.filter(t => t.cls).map(t => [t.text, t.cls]));
  assert.equal(byText['const'], 'tok-k'); assert.equal(byText['"hi"'], 'tok-s');
  assert.equal(byText['// done'], 'tok-c'); assert.equal(byText['42'], 'tok-n'); assert.equal(byText['return'], 'tok-k');
});
test('tokenize survives every challenge snippet', () => {
  for (const c of challenges) {
    assert.equal(tokenize(c.code).map(t => t.text).join(''), c.code);
    assert.equal(tokenize(c.solution).map(t => t.text).join(''), c.solution);
  }
});
test('diffLines marks changed lines', () => {
  const d = diffLines('a\nb\nc', 'a\nB\nc');
  assert.deepEqual(d, [
    { type: 'same', text: 'a' },
    { type: 'del', text: 'b' },
    { type: 'add', text: 'B' },
    { type: 'same', text: 'c' },
  ]);
});
test('diffLines of identical input is all same', () => {
  assert.ok(diffLines('x\ny', 'x\ny').every(l => l.type === 'same'));
});
test('cleanStreak counts trailing clean fixes only', () => {
  const r = (clean: boolean) => ({ id: 'x', title: 't', outcome: 'fixed' as const, clean, reward: 100 });
  assert.equal(cleanStreak([]), 0);
  assert.equal(cleanStreak([r(true), r(true)]), 2);
  assert.equal(cleanStreak([r(true), r(false), r(true)]), 1);
  assert.equal(cleanStreak([{ ...r(true), outcome: 'skipped' as const, reward: null }]), 0);
});
