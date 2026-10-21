import { CheckCircle2, Clock3, Crosshair, Home, Target, Terminal, Timer, Trophy } from 'lucide-react';
import { GameBoard } from './components/GameBoard';
import { MatrixRain } from './components/MatrixRain';
import { useGameLogic } from './hooks/useGameLogic';
import { useAnimatedNumber } from './hooks/useAnimatedNumber';
import type { GameState } from './types/game';

function accuracy(g: GameState): number {
  return g.attempts === 0 ? 100 : Math.round((100 * (g.attempts - g.totalWrong)) / g.attempts);
}

function Recap({ g }: { g: GameState }) {
  if (g.results.length === 0) return null;
  return <ol className="recap" aria-label="Round by round recap">
    {g.results.map(r => <li key={r.id} className={`recap-${r.outcome}`}>
      <span className="recap-icon" aria-hidden="true">{r.outcome === 'fixed' ? '✅' : r.outcome === 'timeout' ? '⏱️' : '⏭️'}</span>
      <span className="recap-title">{r.title}</span>
      <span className="recap-points">{r.reward !== null ? `+${r.reward}` : r.outcome === 'timeout' ? 'time up' : 'skipped'}</span>
    </li>)}
  </ol>;
}

export default function App() {
  const s = useGameLogic();
  const g = s.game;
  const best = useAnimatedNumber(s.best);
  return <main className="shell">
    <MatrixRain />
    <header><div className="brand-mark" aria-hidden="true"><Terminal size={28} /></div><p className="eyebrow">JavaScript debugging practice</p>
      <h1>Debug Sprint</h1><p className="intro">Small snippets. One bug at a time.</p></header>
    {g.status === 'idle' ? <section className="board welcome">
      <h2>Find the bug. Write the fix.</h2>
      <p>{s.total} short challenges covering syntax, arrays, loops, operators and async code. Each round includes a hint and an explanation.</p>
      <div className="mode-grid"><div><h3><Timer aria-hidden="true" /> Sprint</h3><p>Race the clock with three lives. A timeout or skip costs a life. Wrong guesses lower that round's reward.</p><button className="primary" onClick={() => s.start('sprint')}>Start sprint</button></div>
        <div><h3><Crosshair aria-hidden="true" /> Practice</h3><p>No clock, no lives, no points. Take your time, try a fix, then read why it works.</p><button onClick={() => s.start('practice')}>Start practice</button></div></div>
      <p className="muted">Sprint best on this browser: {s.best} points</p>
      <details><summary>How answers and scores work</summary><p>Answers are compared with a reference string, not executed. Equivalent code with different formatting may not be accepted. This is a reading and repair exercise, not a JavaScript judge.</p><p>Sprint scoring, shown after every round: 100 base points plus the exact seconds left on the clock. A hint costs 20, each wrong guess costs 10. Practice tracks rounds fixed and earns no points, so only sprint sets the best score.</p></details>
    </section> : g.status === 'finished' ? <section className="board welcome">
      <p className="eyebrow">{g.mode === 'sprint' ? 'Sprint' : 'Practice'} complete</p>
      <h2>{g.mode === 'practice' ? 'Every round reviewed.' : g.lives === 0 ? 'Out of lives. Keep practicing.' : 'Every round reviewed.'}</h2>
      <div className="stats">
        {g.mode === 'sprint' && <div className="stat"><Trophy aria-hidden="true" /><strong>{g.score}</strong><span>points</span></div>}
        <div className="stat"><CheckCircle2 aria-hidden="true" /><strong>{g.solved} / {s.total}</strong><span>fixed</span></div>
        <div className="stat"><Target aria-hidden="true" /><strong>{accuracy(g)}%</strong><span>accuracy</span></div>
        {g.mode === 'sprint' && <div className="stat"><Clock3 aria-hidden="true" /><strong>{best}</strong><span>best</span></div>}
      </div>
      {g.mode === 'sprint' && g.score >= s.best && g.score > 0 && <p className="reward">New best on this browser.</p>}
      <Recap g={g} />
      <div className="actions"><button className="primary" onClick={() => s.start(g.mode)}>Try again</button><button onClick={s.home}><Home aria-hidden="true" /> Choose mode</button></div>
    </section> : <><GameBoard session={s} /><button className="quiet" onClick={s.home}>Leave round / choose mode</button></>}
    <footer>No sign-in. No code execution. Best score stays in this browser.</footer>
  </main>;
}
