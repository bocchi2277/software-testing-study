"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppState,
  CardState,
  ExamResult,
  Note,
  Profile,
  Session,
  Task,
} from "./types";
import { addDays, todayStr } from "./dates";

const EMPTY: AppState = {
  profile: {
    examDate: null,
    startDate: todayStr(),
    dailyHours: 2,
    startTime: "18:00",
    theme: "auto",
    focusMin: 25,
    breakMin: 5,
  },
  progress: {},
  sessions: [],
  cards: {},
  attempts: [],
  exams: [],
  notes: [],
  tasks: [],
};

async function post<T = unknown>(body: Record<string, unknown>): Promise<T | null> {
  try {
    const r = await fetch("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

type Ctx = {
  state: AppState;
  ready: boolean;
  error: boolean;
  reload: () => Promise<void>;
  updateProfile: (f: Partial<Profile>) => void;
  setProgress: (key: string, value: string | null) => void;
  addSession: (minutes: number, kind: string, topic?: string | null, day?: string) => Promise<void>;
  deleteSession: (id: number) => void;
  reviewCard: (cardId: string, known: boolean) => void;
  resetCards: () => void;
  recordAttempt: (questionId: string, correct: boolean, mode: string) => void;
  recordAttempts: (items: { questionId: string; correct: boolean }[], mode: string) => void;
  importState: (data: unknown) => Promise<boolean>;
  clearAttempts: () => void;
  saveExam: (r: Omit<ExamResult, "id" | "createdAt">) => Promise<void>;
  saveNote: (n: { id?: number; title: string; body: string; topic?: string | null }) => Promise<Note | null>;
  deleteNote: (id: number) => void;
  addTask: (title: string, day: string) => Promise<void>;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  resetAll: () => Promise<void>;
};

const AppCtx = createContext<Ctx | null>(null);

export const BOX_DAYS = [0, 1, 2, 4, 8, 16];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  const reload = useCallback(async () => {
    try {
      const r = await fetch("/api/state", { cache: "no-store" });
      if (!r.ok) throw new Error("bad");
      const s = (await r.json()) as AppState;
      setState(s);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  // تطبيق السمة
  useEffect(() => {
    const t = state.profile.theme;
    const el = document.documentElement;
    if (t === "auto") el.removeAttribute("data-theme");
    else el.setAttribute("data-theme", t);
    try {
      localStorage.setItem("qa-theme", t);
    } catch {}
  }, [state.profile.theme]);

  const fail = useCallback(<T,>(res: T | null) => {
    if (res === null) setError(true);
    return res;
  }, []);

  const api = useMemo<Ctx>(
    () => ({
      state,
      ready,
      error,
      reload,
      updateProfile: (f) => {
        setState((s) => ({ ...s, profile: { ...s.profile, ...f } }));
        void post({ type: "profile.update", fields: f }).then(fail);
      },
      setProgress: (key, value) => {
        setState((s) => {
          const p = { ...s.progress };
          if (value === null) delete p[key];
          else p[key] = value;
          return { ...s, progress: p };
        });
        void post({ type: "progress.set", key, value }).then(fail);
      },
      addSession: async (minutes, kind, topic, day) => {
        const res = await post<Session>({
          type: "session.add",
          minutes,
          kind,
          topic: topic ?? null,
          day: day ?? todayStr(),
        }).then(fail);
        if (res) setState((s) => ({ ...s, sessions: [res, ...s.sessions] }));
      },
      deleteSession: (id) => {
        setState((s) => ({ ...s, sessions: s.sessions.filter((x) => x.id !== id) }));
        void post({ type: "session.delete", id }).then(fail);
      },
      reviewCard: (cardId, known) => {
        setState((s) => {
          const old: CardState = s.cards[cardId] ?? { box: 1, due: todayStr(), reps: 0, lapses: 0 };
          const box = known ? Math.min(5, old.box + 1) : 1;
          const next: CardState = {
            box,
            due: addDays(todayStr(), known ? BOX_DAYS[box] : 0),
            reps: old.reps + 1,
            lapses: old.lapses + (known ? 0 : 1),
          };
          void post({ type: "card.set", cardId, ...next }).then(fail);
          return { ...s, cards: { ...s.cards, [cardId]: next } };
        });
      },
      resetCards: () => {
        setState((s) => ({ ...s, cards: {} }));
        void post({ type: "card.reset" }).then(fail);
      },
      recordAttempt: (questionId, correct, mode) => {
        setState((s) => ({
          ...s,
          attempts: [{ questionId, correct, mode, at: new Date().toISOString() }, ...s.attempts],
        }));
        void post({ type: "quiz.attempt", questionId, correct, mode }).then(fail);
      },
      recordAttempts: (items, mode) => {
        if (!items.length) return;
        const at = new Date().toISOString();
        setState((s) => ({
          ...s,
          attempts: [...items.map((i) => ({ ...i, mode, at })).reverse(), ...s.attempts],
        }));
        void post({ type: "quiz.attempts", items, mode }).then(fail);
      },
      importState: async (data) => {
        const res = await post<{ ok: boolean }>({ type: "data.import", state: data });
        if (!res) {
          setError(true);
          return false;
        }
        await reload();
        return true;
      },
      clearAttempts: () => {
        setState((s) => ({ ...s, attempts: [] }));
        void post({ type: "quiz.clear" }).then(fail);
      },
      saveExam: async (r) => {
        const res = await post<{ id: number; createdAt: string }>({ type: "exam.save", ...r }).then(fail);
        if (res) setState((s) => ({ ...s, exams: [{ ...r, id: res.id, createdAt: res.createdAt }, ...s.exams] }));
      },
      saveNote: async (n) => {
        const res = await post<Note>({ type: "note.save", ...n }).then(fail);
        if (res) {
          setState((s) => ({
            ...s,
            notes: [res, ...s.notes.filter((x) => x.id !== res.id)],
          }));
        }
        return res;
      },
      deleteNote: (id) => {
        setState((s) => ({ ...s, notes: s.notes.filter((x) => x.id !== id) }));
        void post({ type: "note.delete", id }).then(fail);
      },
      addTask: async (title, day) => {
        const res = await post<Task>({ type: "task.add", title, day }).then(fail);
        if (res) setState((s) => ({ ...s, tasks: [...s.tasks, res] }));
      },
      toggleTask: (id) => {
        setState((s) => {
          const t = s.tasks.find((x) => x.id === id);
          if (t) void post({ type: "task.toggle", id, done: !t.done }).then(fail);
          return { ...s, tasks: s.tasks.map((x) => (x.id === id ? { ...x, done: !x.done } : x)) };
        });
      },
      deleteTask: (id) => {
        setState((s) => ({ ...s, tasks: s.tasks.filter((x) => x.id !== id) }));
        void post({ type: "task.delete", id }).then(fail);
      },
      resetAll: async () => {
        await post({ type: "data.reset" });
        await reload();
      },
    }),
    [state, ready, error, reload, fail],
  );

  return <AppCtx.Provider value={api}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside StoreProvider");
  return c;
}
