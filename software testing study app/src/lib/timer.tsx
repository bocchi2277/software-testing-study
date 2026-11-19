"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useApp } from "./store";

type Mode = "focus" | "break";

type TimerCtx = {
  mode: Mode;
  left: number;
  running: boolean;
  topic: string;
  setTopic: (t: string) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  completedToday: number;
};

const Ctx = createContext<TimerCtx | null>(null);

function beep() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.value = 0.15;
    o.start();
    o.stop(ctx.currentTime + 0.4);
  } catch {}
  try {
    navigator.vibrate?.(300);
  } catch {}
}

export function TimerProvider({ children }: { children: ReactNode }) {
  const { state, addSession } = useApp();
  const focusMin = state.profile.focusMin;
  const breakMin = state.profile.breakMin;

  const [mode, setMode] = useState<Mode>("focus");
  const [left, setLeft] = useState(focusMin * 60);
  const [running, setRunning] = useState(false);
  const [topic, setTopic] = useState("");
  const endAt = useRef(0);
  const [completedToday, setCompleted] = useState(0);

  // إعادة ضبط المدة عند تغيير الإعدادات أو الوضع (عند عدم التشغيل)
  useEffect(() => {
    if (!running) setLeft((mode === "focus" ? focusMin : breakMin) * 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusMin, breakMin, mode]);

  const complete = useCallback(() => {
    setRunning(false);
    beep();
    if (mode === "focus") {
      void addSession(focusMin, "focus", topic || null);
      setCompleted((c) => c + 1);
      setMode("break");
    } else {
      setMode("focus");
    }
  }, [mode, focusMin, topic, addSession]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const l = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(l);
      if (l <= 0 && endAt.current > 0) {
        endAt.current = 0;
        complete();
      }
    }, 250);
    return () => clearInterval(id);
  }, [running, complete]);

  const api = useMemo<TimerCtx>(
    () => ({
      mode,
      left,
      running,
      topic,
      setTopic,
      completedToday,
      start: () => {
        endAt.current = Date.now() + left * 1000;
        setRunning(true);
      },
      pause: () => {
        setRunning(false);
        endAt.current = 0;
      },
      reset: () => {
        setRunning(false);
        endAt.current = 0;
        setLeft((mode === "focus" ? focusMin : breakMin) * 60);
      },
      skip: () => {
        setRunning(false);
        endAt.current = 0;
        setMode((m) => (m === "focus" ? "break" : "focus"));
      },
    }),
    [mode, left, running, topic, completedToday, focusMin, breakMin],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useTimer(): TimerCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTimer must be used inside TimerProvider");
  return c;
}
