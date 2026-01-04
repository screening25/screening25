export type TokenType = 'keyword' | 'class' | 'method' | 'string' | 'number' | 'comment' | 'operator' | 'default';

const KEYWORDS = new Set([
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const',
  'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float',
  'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native',
  'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super',
  'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while',
  'true', 'false', 'null', 'var', 'let', 'const', 'function', 'export', 'import', 'from', 'as'
]);

export interface Token {
  type: TokenType;
  start: number;
  end: number;
}

export const tokenize = (code: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;
  
  while (i < code.length) {
    const char = code[i];

    // Comments
    if (char === '/' && code[i + 1] === '/') {
      const start = i;
      while (i < code.length && code[i] !== '\n') i++;
      tokens.push({ type: 'comment', start, end: i });
      continue;
    }
    if (char === '/' && code[i + 1] === '*') {
      const start = i;
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
      tokens.push({ type: 'comment', start, end: i });
      continue;
    }

    // Strings
    if (char === '"' || char === "'") {
      const start = i;
      const quote = char;
      i++;
      while (i < code.length && (code[i] !== quote || code[i-1] === '\\')) i++;
      i++;
      tokens.push({ type: 'string', start, end: i });
      continue;
    }

    // Numbers
    if (/\d/.test(char)) {
      const start = i;
      while (i < code.length && /[\d.]/.test(code[i])) i++;
      tokens.push({ type: 'number', start, end: i });
      continue;
    }

    // Identifiers
    if (/[a-zA-Z_$]/.test(char)) {
      const start = i;
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) i++;
      const text = code.slice(start, i);
      
      let type: TokenType = 'default';
      if (KEYWORDS.has(text)) {
        type = 'keyword';
      } else if (/^[A-Z]/.test(text)) {
        type = 'class';
      } else if (i < code.length && code[i] === '(') {
        type = 'method';
      }
      
      tokens.push({ type, start, end: i });
      continue;
    }

    // Operators/Punctuation
    if (/[{}()\[\].,;+\-*/%=<>!&|^~?]/.test(char)) {
        tokens.push({ type: 'operator', start: i, end: i + 1 });
        i++;
        continue;
    }

    // Whitespace/Other
    i++;
  }
  return tokens;
};