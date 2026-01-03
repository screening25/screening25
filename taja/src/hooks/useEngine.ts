import { useState, useEffect, useCallback, useRef } from "react";

export type State = "pending" | "running" | "finished";

// This is the final, simplified, and robust engine using a hidden input.
export const useEngine = (source: string) => {
  const [status, setStatus] = useState<State>("pending");
  const [errors, setErrors] = useState<number>(0);
  const [typed, setTyped] = useState<string>("");
  const cursor = typed.length;

  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const startTime = useRef<number | null>(null);

  // This function is now called directly from the App's input `onChange`.
  const handleTyped = (newTyped: string) => {
    if (status === "finished") return;

    // Start the timer on the first character typed.
    if (status === "pending" && newTyped.length > 0) {
      setStatus("running");
      startTime.current = Date.now();
    }
    // Prevent typing beyond the source length
    if (newTyped.length > source.length) {
      return;
    }
    setTyped(newTyped);
  };
  
  // Calculate errors on every change to `typed`.
  useEffect(() => {
    if (status === 'running' || status === 'finished') {
      let errorCount = 0;
      const sourceCharsToCompare = source.slice(0, typed.length);
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] !== sourceCharsToCompare[i]) {
          errorCount++;
        }
      }
      setErrors(errorCount);
    }
  }, [typed, source, status]);

  // Calculate WPM and Accuracy on a timer, and check for finish state.
  useEffect(() => {
    const interval = setInterval(() => {
      if (status !== "running" || startTime.current === null) return;
      
      const now = Date.now();
      const minutes = (now - startTime.current) / 1000 / 60;
      
      const wordsTyped = cursor / 5;
      const currentWpm = minutes > 0 ? wordsTyped / minutes : 0;
      setWpm(currentWpm);
      
      const currentAccuracy = cursor > 0 ? ((cursor - errors) / cursor) * 100 : 100;
      setAccuracy(Math.max(0, currentAccuracy));

    }, 1000);
    
    // Check for finish state inside this effect as well, immediately after typed changes
    if (cursor === source.length && source.length > 0) {
      setStatus("finished");
    }

    return () => clearInterval(interval);
  }, [status, startTime, cursor, errors, source]);

  const restart = useCallback(() => {
    setStatus("pending");
    setTyped("");
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    startTime.current = null;
  }, []);

  // Reset engine when the source text changes.
  useEffect(() => {
    restart();
  }, [source, restart]);

  return {
    state: { status, typed, cursor, wpm, accuracy, errors },
    actions: { restart, handleTyped },
  };
};