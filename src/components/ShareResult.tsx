import { Share2 } from 'lucide-react';
import { useState } from 'react';
import { shareText } from '../lib/share';
import type { GameState } from '../types/game';

export function ShareResult({ g, total, accuracyPct }: { g: GameState; total: number; accuracyPct: number }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const text = shareText(g, total, accuracyPct, g.mode);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text; document.body.appendChild(area); area.select();
      document.execCommand('copy'); area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return <button type="button" onClick={copy}><Share2 aria-hidden="true" /> {copied ? 'Copied!' : 'Copy result'}</button>;
}
