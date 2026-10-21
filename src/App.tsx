import { GameBoard } from './components/GameBoard';
import { useGameLogic } from './hooks/useGameLogic';

export default function App() {
  const s = useGameLogic();
  const g = s.game;
  return <main className="shell">
    <header><div className="brand-mark" aria-hidden="true">{'</>'}</div><p className="eyebrow">JavaScript debugging practice</p>
      <h1>Debug Sprint</h1><p className="intro">Small snippets. One bug at a time.</p></header>
    {g.status === 'idle' ? <section className="board welcome">
      <h2>Find the bug. Write the fix.</h2>
      <p>{s.total} short challenges covering syntax, arrays, loops, operators and async code. Each round includes a hint and an explanation.</p>
      <div className="mode-grid"><div><h3>Sprint</h3><p>Race the clock with three lives. A timeout or skip costs a life. Wrong guesses lower that round's reward.</p><button className="primary" onClick={() => s.start('sprint')}>Start sprint</button></div>
        <div><h3>Practice</h3><p>No clock, no lives, no points. Take your time, try a fix, then read why it works.</p><button onClick={() => s.start('practice')}>Start practice</button></div></div>
      <p className="muted">Sprint best on this browser: {s.best} points</p>
      <details><summary>How answers and scores work</summary><p>Answers are compared with a reference string, not executed. Equivalent code with different formatting may not be accepted. This is a reading and repair exercise, not a JavaScript judge.</p><p>Sprint scoring, shown after every round: 100 base points plus the exact seconds left on the clock. A hint costs 20, each wrong guess costs 10. Practice tracks rounds fixed and earns no points, so only sprint sets the best score.</p></details>
    </section> : g.status === 'finished' ? <section className="board welcome">
      <p className="eyebrow">{g.mode === 'sprint' ? 'Sprint' : 'Practice'} complete</p>
      <h2>{g.mode === 'practice' ? 'Every round reviewed.' : g.lives === 0 ? 'Out of lives. Keep practicing.' : 'Every round reviewed.'}</h2>
      {g.mode === 'sprint'
        ? <><div className="results"><strong>{g.score} points</strong><span>{g.solved} / {s.total} fixed</span><span>{g.attempts} answer submissions</span></div>
          <p className="muted">Sprint best on this browser: {s.best}</p></>
        : <div className="results"><strong>{g.solved} / {s.total} fixed</strong><span>{g.attempts} answer submissions</span></div>}
      <div className="actions"><button className="primary" onClick={() => s.start(g.mode)}>Try again</button><button onClick={s.home}>Choose mode</button></div>
    </section> : <><GameBoard session={s} /><button className="quiet" onClick={s.home}>Leave round / choose mode</button></>}
    <footer>No sign-in. No code execution. Best score stays in this browser.</footer>
  </main>;
}
