import type { useGameLogic } from '../hooks/useGameLogic';

type Props = { session: ReturnType<typeof useGameLogic> };
export function GameBoard({ session: s }: Props) {
  const { game: g, challenge: c } = s;
  const review = g.status === 'review';
  return <section className="board" aria-label="Debugging round">
    <div className="round-meta"><span>Round {g.index + 1} / {s.total}</span><span>{c.topic} / {c.difficulty}</span></div>
    <div className="metrics">
      <span>Score <strong>{g.score}</strong></span>
      <span>{g.mode === 'sprint' ? <>Lives <strong>{g.lives} / 3</strong></> : 'Practice / no timer'}</span>
      {g.mode === 'sprint' && <span className={g.secondsLeft <= 10 ? 'urgent' : ''}>Time <strong>{g.secondsLeft}s</strong></span>}
    </div>
    <h2>{c.title}</h2>
    <p className="eyebrow">Buggy code</p>
    <pre><code>{c.code}</code></pre>
    {review ? <div className="review">
      <h3>{g.correct ? 'Bug fixed' : 'Reference fix'}</h3>
      <pre className="fixed"><code>{c.solution}</code></pre>
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
        <button type="button" onClick={s.hint} disabled={g.hintUsed}>Hint{g.hintUsed ? ' shown' : ' (-20 potential points)'}</button>
        <button type="button" onClick={s.skip}>Skip{g.mode === 'sprint' ? ' (-1 life)' : ' / show fix'}</button></div>
      {g.hintUsed && <p className="hint">Hint: {c.hint}</p>}
    </form>}
    <p role="status" className="feedback">{g.feedback}</p>
  </section>;
}
