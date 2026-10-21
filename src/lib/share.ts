import type { GameState, Mode } from '../types/game';

function roundEmoji(o: 'fixed' | 'timeout' | 'skipped', clean: boolean): string {
  if (o === 'fixed') return clean ? '✅' : '🟨';
  return o === 'timeout' ? '⏱️' : '⏭️';
}

export function shareText(g: GameState, total: number, accuracyPct: number, mode: Mode): string {
  const lines = [`Debug Sprint${mode === 'daily' ? ' (daily)' : ''}`];
  if (mode !== 'practice') lines.push(`${g.score} points · ${g.solved}/${total} fixed · ${accuracyPct}% accuracy`);
  else lines.push(`${g.solved}/${total} fixed · ${accuracyPct}% accuracy`);
  lines.push(g.results.map(r => roundEmoji(r.outcome, r.clean)).join(' '));
  lines.push('https://debugit.netlify.app');
  return lines.join('\n');
}
