import { Bug, Heart, Lightbulb, SkipForward, Trophy, Zap } from 'lucide-react';
import type { useGameLogic } from '../hooks/useGameLogic';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { diffLines } from '../lib/diff';
import { cleanStreak } from '../lib/streak';
import type { RoundReward } from '../types/game';
import { CodeBlock, InlineCode } from './CodeBlock';

type Props = { session: ReturnType<typeof useGameLogic> };

function RewardLine({ reward }: { reward: RoundReward }) {
  const parts = [`${reward.base} base`];
  if (reward.timeBonus > 0) parts.push(`+ ${reward.timeBonus} time`);
  if (reward.hintPenalty > 0) parts.push(`- ${reward.hintPenalty} hint`);
  if (reward.attemptPenalty > 0) parts.push(`- ${reward.attemptPenalty} wrong ${reward.attemptPenalty === 10 ? 'try' : 'tries'}`);
  return <p className="reward">+{reward.total} points <span>({parts.join(' ')})</span></p>;
}

export function GameBoard({ session: s }: Props) {
  const { game: g, challenge: c } = s;
  const review = g.status === 'review';
  const score = useAnimatedNumber(g.score);
  const streak = cleanStreak(g.results);
  const diff = review ? diffLines(c.code, c.solution) : [];
  return <section className="board" aria-label="Debugging round">
    <div className="round-meta"><span>Round {g.index + 1} / {s.total}</span><span>{c.topic} / {c.difficulty}</span></div>
    <div className="metrics">
      {g.mode === 'sprint'
        ? <><span className="metric"><Trophy aria-hidden="true" /> Score <strong>{score}</strong></span>
          <span className="metric"><Heart aria-hidden="true" /> Lives <strong>{g.lives} / 3</strong></span></>
        : <span className="metric"><Trophy aria-hidden="true" /> Fixed <strong>{g.solved} / {s.total}</strong></span>}
      {streak >= 2 && !review && <span className="metric streak"><Zap aria-hidden="true" /> {streak}x streak</span>}
      {g.mode === 'sprint' && g.status === 'playing' &&
        <span className={`metric ${g.secondsLeft <= 10 ? 'urgent' : ''}`}>Time <strong>{g.secondsLeft}s</strong></span>}
    </div>
    <h2><Bug className="title-bug" aria-hidden="true" />{c.title}</h2>
    <p className="eyebrow">Buggy code</p>
    <CodeBlock code={c.code} />
    {review ? <div className="review">
      <h3>{g.correct ? 'Bug fixed' : 'Reference fix'}</h3>
      {g.correct && g.reward && g.mode === 'sprint' && <RewardLine reward={g.reward} />}
      {g.correct && g.mode === 'practice' && <p className="reward">Counted as fixed. Practice earns no points.</p>}
      <div className="diff" role="img" aria-label="Line by line difference between the buggy code and the fix">
        {diff.map((l, i) => <div key={i} className={`diff-${l.type}`}>
          <span className="diff-sign">{l.type === 'add' ? '+' : l.type === 'del' ? '-' : ' '}</span>
          <InlineCode code={l.text} />
        </div>)}
      </div>
      <p>{c.explanation}</p>
      <button className="primary" onClick={s.next}>{g.lives <= 0 || g.index + 1 === s.total ? 'See results' : 'Next challenge'}</button>
    </div> : <form onSubmit={e => { e.preventDefault(); s.submit(); }}>
      <label htmlFor="answer">Your fix</label>
      <textarea id="answer" key={c.id} autoFocus value={s.input} onChange={e => s.setInput(e.target.value)}
        spellCheck={false} autoCapitalize="off" autoComplete="off" rows={4}
        aria-describedby="answer-help" placeholder="Type the corrected snippet..."
        onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); s.submit(); } }} />
      <p id="answer-help" className="muted">Match the reference spelling and spacing. Outer whitespace is ignored. Ctrl/Cmd + Enter submits.</p>
      <div className="actions"><button className="primary" type="submit" disabled={!s.input.trim()}>Check fix</button>
        <button type="button" onClick={s.hint} disabled={g.hintUsed}><Lightbulb aria-hidden="true" /> Hint{g.hintUsed ? ' shown' : ' (-20 from this round)'}</button>
        <button type="button" onClick={s.skip}><SkipForward aria-hidden="true" /> Skip{g.mode === 'sprint' ? ' (-1 life)' : ' / show fix'}</button></div>
      {g.hintUsed && <p className="hint">Hint: {c.hint}</p>}
    </form>}
    <p role="status" className="feedback">{g.feedback}</p>
  </section>;
}
