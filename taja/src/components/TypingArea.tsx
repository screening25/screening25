import React, { useMemo } from 'react';
import Caret from './Caret';
import cn from '../utils/cn';

interface TypingAreaProps {
  code: string;
  typed: string;
}

const TypingArea = ({ code, typed }: TypingAreaProps) => {
  const characters = useMemo(() => {
    return code.split('').map((char, index) => {
      const isTyped = index < typed.length;
      const isCorrect = isTyped ? typed[index] === char : false;
      
      return {
        char,
        isTyped,
        isCorrect,
        isCursor: index === typed.length,
      };
    });
  }, [code, typed]);

  return (
    <div className="text-base leading-relaxed relative bg-vscode-bg p-4 rounded-md border border-dracula-comment whitespace-pre-wrap break-words">
      {characters.map(({ char, isTyped, isCorrect, isCursor }, index) => (
        <span
          key={index}
          className={cn({
            'text-vscode-fg': isTyped && isCorrect,
            'text-dracula-red bg-red-900/50': isTyped && !isCorrect,
            'text-vscode-fg opacity-30': !isTyped,
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