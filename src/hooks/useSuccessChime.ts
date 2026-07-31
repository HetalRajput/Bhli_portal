"use client";

import { useCallback, useEffect, useRef } from "react";

export function useSuccessChime() {
  const contextRef = useRef<AudioContext | null>(null);

  const arm = useCallback(() => {
    if (typeof window === "undefined" || !window.AudioContext) return;
    try {
      const context = contextRef.current ?? new window.AudioContext();
      contextRef.current = context;
      if (context.state === "suspended") void context.resume();
    } catch {
      // Audio is an enhancement; booking completion must never depend on it.
    }
  }, []);

  const play = useCallback(() => {
    const context = contextRef.current;
    if (!context) return;

    const schedule = () => {
      const start = context.currentTime + 0.03;
      [523.25, 659.25, 783.99].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const noteStart = start + index * 0.11;
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, noteStart);
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.12, noteStart + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.42);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteStart + 0.45);
      });
    };

    if (context.state === "suspended") void context.resume().then(schedule).catch(() => undefined);
    else schedule();
  }, []);

  useEffect(() => () => {
    const context = contextRef.current;
    if (context && context.state !== "closed") void context.close();
  }, []);

  return { arm, play };
}
