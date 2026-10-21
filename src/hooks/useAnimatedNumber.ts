import { useEffect, useRef, useState } from 'react';

// Tween a displayed number toward its target; off when reduced motion is preferred.
export function useAnimatedNumber(target: number, duration = 500): number {
  const [value, setValue] = useState(target);
  const previous = useRef(target);
  useEffect(() => {
    const from = previous.current;
    previous.current = target;
    if (from === target) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(target); return;
    }
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      setValue(Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}
