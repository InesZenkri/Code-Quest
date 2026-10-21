import { useEffect, useState } from 'react';
import { codeChallenges } from '../data/challenges';
import { buildDailyDeck, buildDeck } from '../lib/deck';
import { finishRound, initialState, nextRound, startRound, submitAnswer, tick, revealHint } from '../lib/game';
import type { CodeChallenge, Mode } from '../types/game';

const BEST_KEYS: Record<Mode, string | null> = {
  sprint: 'debug-game:sprint-best:v1',
  daily: 'debug-game:daily-best:v1',
  practice: null,
};
function readBest(key: string | null) {
  if (!key) return 0;
  try {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) && value >= 0 ? value : 0;
  } catch { return 0; }
}
export function useGameLogic() {
  const [game, setGame] = useState(initialState());
  const [deck, setDeck] = useState<CodeChallenge[]>(codeChallenges);
  const [input, setInput] = useState('');
  const [bestSprint, setBestSprint] = useState(() => readBest(BEST_KEYS.sprint));
  const [bestDaily, setBestDaily] = useState(() => readBest(BEST_KEYS.daily));
  const timed = game.mode !== 'practice';
  useEffect(() => {
    if (game.status !== 'playing' || !timed) return;
    const timer = window.setInterval(() => setGame(prev => tick(prev, Date.now(), deck[prev.index])), 200);
    return () => window.clearInterval(timer);
  }, [game.status, timed, deck]);
  useEffect(() => {
    if (game.status !== 'finished' || !timed) return;
    const key = BEST_KEYS[game.mode];
    const best = game.mode === 'daily' ? bestDaily : bestSprint;
    if (!key || game.score <= best) return;
    if (game.mode === 'daily') setBestDaily(game.score); else setBestSprint(game.score);
    try { localStorage.setItem(key, String(game.score)); } catch { /* Storage may be disabled. Play still works. */ }
  }, [game.status, game.mode, game.score, timed, bestSprint, bestDaily]);
  return {
    game, input, setInput, bestSprint, bestDaily, deck, challenge: deck[game.index], total: deck.length,
    start: (mode: Mode) => {
      const next = mode === 'daily' ? buildDailyDeck(codeChallenges) : buildDeck(mode, codeChallenges);
      setDeck(next); setInput(''); setGame(startRound(initialState(mode), next[0], Date.now()));
    },
    submit: () => setGame(prev => submitAnswer(prev, deck[prev.index], input, Date.now())),
    hint: () => setGame(prev => revealHint(prev)),
    skip: () => setGame(prev => { const done = tick(prev, Date.now(), deck[prev.index]); return done.status === 'playing' ? finishRound(done, false, false, deck[done.index]) : done; }),
    next: () => { setInput(''); setGame(prev => nextRound(prev, deck, Date.now())); },
    home: () => { setInput(''); setGame(initialState()); },
  };
}
