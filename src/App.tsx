import { GameBoard } from './components/GameBoard';
import { useGameLogic } from './hooks/useGameLogic';

export default function App() {
  const s = useGameLogic();
  return <main className="shell">
    <header><div className="brand-mark" aria-hidden="true">{'</>'}</div><p className="eyebrow">JavaScript debugging practice</p>
      <h1>Debug Sprint</h1><p className="intro">Small snippets. One bug at a time.</p></header>
    {s.game.status === 'idle' ? <section className="board welcome">
      <h2>Find the bug. Write the fix.</h2>
      <p>{s.total} short challenges covering syntax, arrays, loops, operators and async code. Each round includes a hint and an explanation.</p>
      <div className="mode-grid"><div><h3>Sprint</h3><p>Race the clock with three lives. A timeout or skip costs a life; wrong answers can be retried until time runs out.</p><button className="primary" onClick={() => s.start('sprint')}>Start sprint</button></div>
        <div><h3>Practice</h3><p>No clock, no lost lives. Take your time, try a fix, then read why it works.</p><button onClick={() => s.start('practice')}>Start practice</button></div></div>
      <p className="muted">Sprint best on this browser: {s.best} points</p>
      <details><summary>How answers and scores work</summary><p>Answers are compared with a reference string, not executed. Equivalent code with different formatting may not be accepted. This is a reading and repair exercise, not a JavaScript judge.</p><p>A correct fix earns 100 points plus whole seconds remaining in sprint mode. A hint reduces that round's potential reward by 20 once. Practice has no time bonus and does not change your sprint best.</p></details>
    </section> : s.game.status === 'finished' ? <section className="board welcome">
      <p className="eyebrow">{s.game.mode === 'sprint' ? 'Sprint' : 'Practice'} complete</p>
      <h2>{s.game.lives === 0 ? 'Out of lives. Keep practicing.' : 'Every round reviewed.'}</h2>
      <div className="results"><strong>{s.game.score} points</strong><span>{s.game.solved} / {s.total} fixed</span><span>{s.game.attempts} answer submissions</span></div>
      <p className="muted">Sprint best on this browser: {s.best}</p>
      <div className="actions"><button className="primary" onClick={() => s.start(s.game.mode)}>Try again</button><button onClick={s.home}>Choose mode</button></div>
    </section> : <><GameBoard session={s} /><button className="quiet" onClick={s.home}>Leave round / choose mode</button></>}
    <footer>No sign-in. No code execution. Best score stays in this browser.</footer>
  </main>;
}
