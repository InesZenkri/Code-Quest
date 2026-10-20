import { useEffect, useState } from 'react';
import { codeChallenges } from '../data/challenges';
import { finishRound, initialState, nextRound, startRound, submitAnswer, tick, revealHint } from '../lib/game';
import type { Mode } from '../types/game';

const BEST_KEY = 'debug-game:sprint-best:v1';
function readBest() {
  try {
    const value = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(value) && value >= 0 ? value : 0;
  } catch { return 0; }
}
export function useGameLogic() {
  const [game, setGame] = useState(initialState());
  const [input, setInput] = useState('');
  const [best, setBest] = useState(readBest);
  useEffect(() => {
    if (game.status !== 'playing' || game.mode !== 'sprint') return;
    const timer = window.setInterval(() => setGame(prev => tick(prev, Date.now())), 200);
    return () => window.clearInterval(timer);
  }, [game.status, game.mode]);
  useEffect(() => {
    if (game.status !== 'finished' || game.mode !== 'sprint' || game.score <= best) return;
    setBest(game.score);
    try { localStorage.setItem(BEST_KEY, String(game.score)); } catch { /* Storage may be disabled. Play still works. */ }
  }, [game.status, game.mode, game.score, best]);
  return {
    game, input, setInput, best, challenge: codeChallenges[game.index], total: codeChallenges.length,
    start: (mode: Mode) => { setInput(''); setGame(startRound(initialState(mode), codeChallenges[0], Date.now())); },
    submit: () => setGame(prev => submitAnswer(prev, codeChallenges[prev.index], input, Date.now())),
    hint: () => setGame(prev => revealHint(prev)),
    skip: () => setGame(prev => finishRound(tick(prev, Date.now()), false)),
    next: () => { setInput(''); setGame(prev => nextRound(prev, codeChallenges, Date.now())); },
    home: () => { setInput(''); setGame(initialState()); },
  };
}
