// Tiny regex tokenizer for JavaScript snippets. Display-only, no execution.
export interface Token { cls: 'tok-c' | 'tok-s' | 'tok-k' | 'tok-n' | 'tok-f' | null; text: string }

const TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(const|let|var|function|return|if|else|for|while|do|of|in|new|await|async|class|extends|import|from|export|default|try|catch|finally|throw|typeof|instanceof|true|false|null|undefined|this)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*(?=\s*\())/g;

export function tokenize(code: string): Token[] {
  const out: Token[] = [];
  let last = 0, m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(code)) !== null) {
    if (m.index > last) out.push({ cls: null, text: code.slice(last, m.index) });
    const cls = m[1] ? 'tok-c' : m[2] ? 'tok-s' : m[3] ? 'tok-k' : m[4] ? 'tok-n' : 'tok-f';
    out.push({ cls, text: m[0] });
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push({ cls: null, text: code.slice(last) });
  return out;
}
