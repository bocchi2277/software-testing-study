export type Profile = {
  examDate: string | null;
  startDate: string;
  dailyHours: number;
  startTime: string;
  theme: "auto" | "light" | "dark";
  focusMin: number;
  breakMin: number;
};

export type Session = {
  id: number;
  day: string;
  minutes: number;
  kind: string;
  topic: string | null;
};

export type CardState = { box: number; due: string; reps: number; lapses: number };

export type Attempt = { questionId: string; correct: boolean; mode: string; at: string };

export type ExamResult = {
  id: number;
  score: number;
  total: number;
  seconds: number;
  breakdown: Record<string, { c: number; t: number }>;
  createdAt: string;
};

export type Note = {
  id: number;
  title: string;
  body: string;
  topic: string | null;
  updatedAt: string;
};

export type Task = { id: number; title: string; day: string; done: boolean };

export type AppState = {
  profile: Profile;
  progress: Record<string, string>;
  sessions: Session[];
  cards: Record<string, CardState>;
  attempts: Attempt[];
  exams: ExamResult[];
  notes: Note[];
  tasks: Task[];
};

export type TopicStatus = "learning" | "review" | "done";
