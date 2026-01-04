import { useState, useEffect, useRef } from 'react';

export const useTypingStats = (typed: string, code: string, status: string) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  
  const typedRef = useRef(typed);
  const codeRef = useRef(code);

  useEffect(() => {
    typedRef.current = typed;
  }, [typed]);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    if (status === 'pending') {
      setStartTime(null);
      setWpm(0);
      setAccuracy(100);
    } else if (status === 'running' && startTime === null && typed.length > 0) {
      setStartTime(Date.now());
    }
  }, [status, typed.length, startTime]);

  useEffect(() => {
    if (status === 'running' && startTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const diffInMinutes = (now - startTime) / 60000;
        const currentTyped = typedRef.current;
        const currentCode = codeRef.current;
        
        if (diffInMinutes > 0) {
          const words = currentTyped.length / 5;
          setWpm(Math.round(words / diffInMinutes));
        }

        let correctCount = 0;
        for (let i = 0; i < currentTyped.length; i++) {
          if (currentTyped[i] === currentCode[i]) correctCount++;
        }
        setAccuracy(currentTyped.length > 0 ? Math.round((correctCount / currentTyped.length) * 100) : 100);

      }, 100);
      return () => clearInterval(interval);
    }
  }, [status, startTime]);

  return { wpm, accuracy };
};