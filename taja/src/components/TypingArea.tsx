import React, { useMemo } from 'react';
import Caret from './Caret';
import cn from '../utils/cn';
import { tokenize, TokenType } from '../utils/syntax';

interface TypingAreaProps {
  code: string;
  typed: string;
}

const TypingArea = ({ code, typed }: TypingAreaProps) => {
  const tokenMap = useMemo(() => {
    const tokens = tokenize(code);
    const map = new Array(code.length).fill('default');
    tokens.forEach(t => {
      for (let i = t.start; i < t.end; i++) map[i] = t.type;
    });
    return map;
  }, [code]);

  const currentTokenType = useMemo(() => {
    if (typed.length < code.length) {
      return tokenMap[typed.length];
    }
    return null;
  }, [typed, code, tokenMap]);

  const characters = useMemo(() => {
    return code.split('').map((char, index) => {
      const isTyped = index < typed.length;
      const isCorrect = isTyped ? typed[index] === char : false;
      const tokenType = tokenMap[index] as TokenType;

      let colorClass = 'text-dracula-fg';
      switch (tokenType) {
        case 'keyword': colorClass = 'text-dracula-pink'; break;
        case 'class': colorClass = 'text-dracula-cyan'; break;
        case 'method': colorClass = 'text-dracula-green'; break;
        case 'string': colorClass = 'text-dracula-yellow'; break;
        case 'number': colorClass = 'text-dracula-orange'; break;
        case 'comment': colorClass = 'text-dracula-comment'; break;
        default: colorClass = 'text-dracula-fg';
      }
      
      return {
        char,
        isTyped,
        isCorrect,
        isCursor: index === typed.length,
        colorClass,
      };
    });
  }, [code, typed, tokenMap]);

  return (
    <div className="text-base leading-relaxed relative bg-vscode-bg p-4 rounded-md border border-dracula-comment whitespace-pre-wrap break-words">
      <div className="absolute top-2 right-2 text-xs text-dracula-comment font-bold uppercase tracking-wider opacity-70">
        {currentTokenType && `Current: ${currentTokenType}`}
      </div>
      {characters.map(({ char, isTyped, isCorrect, isCursor, colorClass }, index) => (
        <span
          key={index}
          className={cn({
            [colorClass]: isTyped ? isCorrect : true,
            'text-dracula-red bg-red-900/50': isTyped && !isCorrect,
            'opacity-100': isTyped && isCorrect,
            'opacity-40': !isTyped,
            'relative': isCursor,
          })}
        >
          {isCursor && <Caret />}
          {char}
        </span>
      ))}
    </div>
  );
};

export default TypingArea;