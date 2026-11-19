import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import {
  cardStates,
  examResults,
  notes,
  profiles,
  progress,
  quizAttempts,
  studySessions,
  tasks,
} from "@/db/schema";
import { getUid } from "@/lib/uid";
import { addDays } from "@/lib/dates";
import type { AppState, ExamResult, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const uid = await getUid();
    const today = new Date().toISOString().slice(0, 10);
    await db
      .insert(profiles)
      .values({ uid, startDate: today })
      .onConflictDoNothing();

    const [p] = await db.select().from(profiles).where(eq(profiles.uid, uid));
    const prog = await db.select().from(progress).where(eq(progress.uid, uid));
    const sess = await db
      .select()
      .from(studySessions)
      .where(and(eq(studySessions.uid, uid), gte(studySessions.day, addDays(today, -400))))
      .orderBy(desc(studySessions.id))
      .limit(3000);
    const cs = await db.select().from(cardStates).where(eq(cardStates.uid, uid));
    const att = await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.uid, uid))
      .orderBy(desc(quizAttempts.id))
      .limit(4000);
    const ex = await db
      .select()
      .from(examResults)
      .where(eq(examResults.uid, uid))
      .orderBy(desc(examResults.id))
      .limit(100);
    const nt = await db
      .select()
      .from(notes)
      .where(eq(notes.uid, uid))
      .orderBy(desc(notes.updatedAt));
    const tk = await db.select().from(tasks).where(eq(tasks.uid, uid)).orderBy(tasks.id);

    const profile: Profile = {
      examDate: p.examDate,
      startDate: p.startDate,
      dailyHours: p.dailyHours,
      startTime: p.startTime,
      theme: (["auto", "light", "dark"].includes(p.theme) ? p.theme : "auto") as Profile["theme"],
      focusMin: p.focusMin,
      breakMin: p.breakMin,
    };

    const state: AppState = {
      profile,
      progress: Object.fromEntries(prog.map((r) => [r.key, r.value])),
      sessions: sess.map((s) => ({
        id: s.id,
        day: s.day,
        minutes: s.minutes,
        kind: s.kind,
        topic: s.topic,
      })),
      cards: Object.fromEntries(
        cs.map((c) => [c.cardId, { box: c.box, due: c.due, reps: c.reps, lapses: c.lapses }]),
      ),
      attempts: att.map((a) => ({
        questionId: a.questionId,
        correct: a.correct,
        mode: a.mode,
        at: a.createdAt.toISOString(),
      })),
      exams: ex.map((e) => ({
        id: e.id,
        score: e.score,
        total: e.total,
        seconds: e.seconds,
        breakdown: e.breakdown as ExamResult["breakdown"],
        createdAt: e.createdAt.toISOString(),
      })),
      notes: nt.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        topic: n.topic,
        updatedAt: n.updatedAt.toISOString(),
      })),
      tasks: tk.map((t) => ({ id: t.id, title: t.title, day: t.day, done: t.done })),
    };
    return Response.json(state, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "db" }, { status: 500 });
  }
}
