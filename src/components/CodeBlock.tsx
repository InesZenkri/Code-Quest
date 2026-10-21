import { tokenize } from '../lib/highlight';

export function CodeBlock({ code, className = '' }: { code: string; className?: string }) {
  return <pre className={className}><code>
    {tokenize(code).map((t, i) => t.cls ? <span key={i} className={t.cls}>{t.text}</span> : t.text)}
  </code></pre>;
}

export function InlineCode({ code }: { code: string }) {
  return <code>{tokenize(code).map((t, i) => t.cls ? <span key={i} className={t.cls}>{t.text}</span> : t.text)}</code>;
}
