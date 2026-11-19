import type { AppState } from "./types";
import { addDays, lastNDays, todayStr } from "./dates";
import { ALL_TOPICS, CHAPTERS } from "@/data/syllabus";
import { QUESTIONS, QMAP } from "@/data/questions";
import { CARDS } from "@/data/cards";

export function minutesByDay(s: AppState): Record<string, number> {
  const m: Record<string, number> = {};
  for (const x of s.sessions) m[x.day] = (m[x.day] ?? 0) + x.minutes;
  return m;
}

export function streak(s: AppState): number {
  const m = minutesByDay(s);
  let day = todayStr();
  // اليوم الحالي لا يكسر السلسلة إن لم يبدأ بعد
  if (!m[day]) day = addDays(day, -1);
  let n = 0;
  while (m[day]) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}

export function weekMinutes(s: AppState): { day: string; min: number }[] {
  const m = minutesByDay(s);
  return lastNDays(7).map((d) => ({ day: d, min: m[d] ?? 0 }));
}

export function topicStatus(s: AppState, id: string): string {
  return s.progress[`t:${id}`] ?? "";
}

export function syllabusPct(s: AppState): number {
  const done = ALL_TOPICS.filter((t) => topicStatus(s, t.id) === "done").length;
  return Math.round((done / ALL_TOPICS.length) * 100);
}

// آخر محاولة لكل سؤال
export function latestByQuestion(s: AppState): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  // attempts مرتبة من الأحدث إلى الأقدم
  for (const a of s.attempts) if (!(a.questionId in out)) out[a.questionId] = a.correct;
  return out;
}

export function mistakeIds(s: AppState): string[] {
  const l = latestByQuestion(s);
  return Object.keys(l).filter((k) => l[k] === false && QMAP[k]);
}

export function chapterAccuracy(s: AppState): Record<number, { c: number; t: number; pct: number }> {
  const l = latestByQuestion(s);
  const r: Record<number, { c: number; t: number; pct: number }> = {};
  for (const ch of CHAPTERS) r[ch.id] = { c: 0, t: 0, pct: 0 };
  for (const [id, ok] of Object.entries(l)) {
    const q = QMAP[id];
    if (!q) continue;
    r[q.ch].t++;
    if (ok) r[q.ch].c++;
  }
  for (const ch of CHAPTERS) r[ch.id].pct = r[ch.id].t ? Math.round((r[ch.id].c / r[ch.id].t) * 100) : 0;
  return r;
}

export function chapterProgress(s: AppState, ch: number): number {
  const c = CHAPTERS.find((x) => x.id === ch)!;
  const done = c.topics.filter((t) => topicStatus(s, t.id) === "done").length;
  return Math.round((done / c.topics.length) * 100);
}

export function weakestChapter(s: AppState): number {
  const acc = chapterAccuracy(s);
  let best = 4;
  let score = Infinity;
  for (const ch of CHAPTERS) {
    const a = acc[ch.id];
    // الأقل دقة، والفصول غير المجرّبة تأخذ قيمة صفر لكن الأوزان الأعلى تأخذ أولوية
    const v = (a.t ? a.pct : 0) - ch.examQ * 0.5;
    if (v < score) {
      score = v;
      best = ch.id;
    }
  }
  return best;
}

export function readiness(s: AppState): number {
  const acc = chapterAccuracy(s);
  let total = 0;
  let w = 0;
  for (const ch of CHAPTERS) {
    const study = chapterProgress(s, ch.id);
    const quiz = acc[ch.id].t >= 3 ? acc[ch.id].pct : acc[ch.id].t ? acc[ch.id].pct * 0.7 : 0;
    total += (study * 0.35 + quiz * 0.65) * ch.examQ;
    w += ch.examQ;
  }
  return Math.round(total / w);
}

export function dueCards(s: AppState): string[] {
  const t = todayStr();
  return CARDS.filter((c) => {
    const st = s.cards[c.id];
    return !st || st.due <= t;
  }).map((c) => c.id);
}

export function masteredCards(s: AppState): number {
  return CARDS.filter((c) => (s.cards[c.id]?.box ?? 0) >= 4).length;
}

export function nextTopic(s: AppState) {
  return (
    ALL_TOPICS.find((t) => topicStatus(s, t.id) === "learning") ??
    ALL_TOPICS.find((t) => !topicStatus(s, t.id)) ??
    ALL_TOPICS.find((t) => topicStatus(s, t.id) === "review") ??
    null
  );
}

export function totalAnswered(s: AppState): number {
  return s.attempts.length;
}

export function overallAccuracy(s: AppState): number {
  if (!s.attempts.length) return 0;
  return Math.round((s.attempts.filter((a) => a.correct).length / s.attempts.length) * 100);
}

export const QUESTION_COUNT = QUESTIONS.length;
