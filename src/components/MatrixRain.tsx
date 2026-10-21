import { useMemo } from 'react';

const CHARS = '01{}<>();=+-*/constletbugfix'.split('');
interface Column { left: number; delay: number; duration: number; chars: string[] }

// Pure-CSS-animated ambient rain. Hidden entirely under prefers-reduced-motion.
export function MatrixRain({ columns = 18 }: { columns?: number }) {
  const cols = useMemo<Column[]>(() => Array.from({ length: columns }, (_, i) => ({
    left: (i * 97) % 100,
    delay: -((i * 137) % 9000) / 1000,
    duration: 7 + ((i * 53) % 60) / 10,
    chars: Array.from({ length: 14 }, (_, j) => CHARS[(i * 31 + j * 17) % CHARS.length]),
  })), [columns]);
  return <div className="rain" aria-hidden="true">
    {cols.map((c, i) => <span key={i} className="rain-col"
      style={{ left: `${c.left}%`, animationDelay: `${c.delay}s`, animationDuration: `${c.duration}s` }}>
      {c.chars.map((ch, j) => <span key={j}>{ch}</span>)}
    </span>)}
  </div>;
}
