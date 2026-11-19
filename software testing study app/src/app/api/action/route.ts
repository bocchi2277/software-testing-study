import { and, eq } from "drizzle-orm";
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

export const dynamic = "force-dynamic";

type Body = Record<string, unknown>;

const str = (v: unknown, max = 5000) => String(v ?? "").slice(0, max);
const num = (v: unknown, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
const dayOk = (v: unknown) => /^\d{4}-\d{2}-\d{2}$/.test(String(v));

export async function POST(req: Request) {
  try {
    const uid = await getUid();
    const b = (await req.json()) as Body;
    const type = str(b.type, 50);

    switch (type) {
      case "profile.update": {
        const f = (b.fields ?? {}) as Body;
        const set: Record<string, unknown> = {};
        if ("examDate" in f) set.examDate = f.examDate && dayOk(f.examDate) ? String(f.examDate) : null;
        if (dayOk(f.startDate)) set.startDate = String(f.startDate);
        if ("dailyHours" in f) set.dailyHours = Math.min(12, Math.max(0.5, num(f.dailyHours, 2)));
        if (/^\d{2}:\d{2}$/.test(String(f.startTime))) set.startTime = String(f.startTime);
        if (["auto", "light", "dark"].includes(String(f.theme))) set.theme = String(f.theme);
        if ("focusMin" in f) set.focusMin = Math.min(120, Math.max(5, Math.round(num(f.focusMin, 25))));
        if ("breakMin" in f) set.breakMin = Math.min(60, Math.max(1, Math.round(num(f.breakMin, 5))));
        if (Object.keys(set).length)
          await db.update(profiles).set(set).where(eq(profiles.uid, uid));
        return Response.json({ ok: true });
      }

      case "progress.set": {
        const key = str(b.key, 120);
        if (!key) return Response.json({ error: "key" }, { status: 400 });
        if (b.value === null || b.value === undefined || b.value === "") {
          await db.delete(progress).where(and(eq(progress.uid, uid), eq(progress.key, key)));
        } else {
          const value = str(b.value, 200);
          await db
            .insert(progress)
            .values({ uid, key, value })
            .onConflictDoUpdate({
              target: [progress.uid, progress.key],
              set: { value, updatedAt: new Date() },
            });
        }
        return Response.json({ ok: true });
      }

      case "session.add": {
        if (!dayOk(b.day)) return Response.json({ error: "day" }, { status: 400 });
        const minutes = Math.min(600, Math.max(1, Math.round(num(b.minutes, 0))));
        const [row] = await db
          .insert(studySessions)
          .values({
            uid,
            day: String(b.day),
            minutes,
            kind: str(b.kind || "focus", 30),
            topic: b.topic ? str(b.topic, 30) : null,
          })
          .returning();
        return Response.json({
          id: row.id,
          day: row.day,
          minutes: row.minutes,
          kind: row.kind,
          topic: row.topic,
        });
      }

      case "session.delete": {
        await db
          .delete(studySessions)
          .where(and(eq(studySessions.uid, uid), eq(studySessions.id, num(b.id))));
        return Response.json({ ok: true });
      }

      case "card.set": {
        const cardId = str(b.cardId, 80);
        if (!cardId || !dayOk(b.due)) return Response.json({ error: "bad" }, { status: 400 });
        const vals = {
          box: Math.min(5, Math.max(1, Math.round(num(b.box, 1)))),
          due: String(b.due),
          reps: Math.max(0, Math.round(num(b.reps))),
          lapses: Math.max(0, Math.round(num(b.lapses))),
        };
        await db
          .insert(cardStates)
          .values({ uid, cardId, ...vals })
          .onConflictDoUpdate({ target: [cardStates.uid, cardStates.cardId], set: vals });
        return Response.json({ ok: true });
      }

      case "card.reset": {
        await db.delete(cardStates).where(eq(cardStates.uid, uid));
        return Response.json({ ok: true });
      }

      case "quiz.attempt": {
        await db.insert(quizAttempts).values({
          uid,
          questionId: str(b.questionId, 30),
          correct: Boolean(b.correct),
          mode: str(b.mode || "practice", 20),
        });
        return Response.json({ ok: true });
      }

      case "quiz.attempts": {
        const items = Array.isArray(b.items)
          ? (b.items as Body[]).slice(0, 200).filter((x) => x && typeof x === "object")
          : [];
        if (!items.length) return Response.json({ error: "bad" }, { status: 400 });
        const mode = str(b.mode || "practice", 20);
        await db.insert(quizAttempts).values(
          items.map((i) => ({
            uid,
            questionId: str(i.questionId, 30),
            correct: Boolean(i.correct),
            mode,
          })),
        );
        return Response.json({ ok: true });
      }

      case "quiz.clear": {
        await db.delete(quizAttempts).where(eq(quizAttempts.uid, uid));
        return Response.json({ ok: true });
      }

      case "exam.save": {
        const [row] = await db
          .insert(examResults)
          .values({
            uid,
            score: Math.max(0, Math.round(num(b.score))),
            total: Math.max(1, Math.round(num(b.total, 1))),
            seconds: Math.max(0, Math.round(num(b.seconds))),
            breakdown: (b.breakdown ?? {}) as Record<string, unknown>,
          })
          .returning();
        return Response.json({ id: row.id, createdAt: row.createdAt.toISOString() });
      }

      case "note.save": {
        const title = str(b.title, 200);
        const body = str(b.body, 20000);
        const topic = b.topic ? str(b.topic, 30) : null;
        const id = num(b.id, 0);
        if (id) {
          const [row] = await db
            .update(notes)
            .set({ title, body, topic, updatedAt: new Date() })
            .where(and(eq(notes.uid, uid), eq(notes.id, id)))
            .returning();
          if (row)
            return Response.json({
              id: row.id,
              title: row.title,
              body: row.body,
              topic: row.topic,
              updatedAt: row.updatedAt.toISOString(),
            });
        }
        const [row] = await db.insert(notes).values({ uid, title, body, topic }).returning();
        return Response.json({
          id: row.id,
          title: row.title,
          body: row.body,
          topic: row.topic,
          updatedAt: row.updatedAt.toISOString(),
        });
      }

      case "note.delete": {
        await db.delete(notes).where(and(eq(notes.uid, uid), eq(notes.id, num(b.id))));
        return Response.json({ ok: true });
      }

      case "task.add": {
        const title = str(b.title, 200).trim();
        if (!title || !dayOk(b.day)) return Response.json({ error: "bad" }, { status: 400 });
        const [row] = await db.insert(tasks).values({ uid, title, day: String(b.day) }).returning();
        return Response.json({ id: row.id, title: row.title, day: row.day, done: row.done });
      }

      case "task.toggle": {
        await db
          .update(tasks)
          .set({ done: Boolean(b.done) })
          .where(and(eq(tasks.uid, uid), eq(tasks.id, num(b.id))));
        return Response.json({ ok: true });
      }

      case "task.delete": {
        await db.delete(tasks).where(and(eq(tasks.uid, uid), eq(tasks.id, num(b.id))));
        return Response.json({ ok: true });
      }

      case "data.reset": {
        await db.delete(progress).where(eq(progress.uid, uid));
        await db.delete(studySessions).where(eq(studySessions.uid, uid));
        await db.delete(cardStates).where(eq(cardStates.uid, uid));
        await db.delete(quizAttempts).where(eq(quizAttempts.uid, uid));
        await db.delete(examResults).where(eq(examResults.uid, uid));
        await db.delete(notes).where(eq(notes.uid, uid));
        await db.delete(tasks).where(eq(tasks.uid, uid));
        await db.update(profiles).set({ examDate: null }).where(eq(profiles.uid, uid));
        return Response.json({ ok: true });
      }

      case "data.import": {
        const s = (b.state ?? {}) as Body;
        const list = (v: unknown, max: number) =>
          Array.isArray(v) ? (v.slice(0, max).filter((x) => x && typeof x === "object") as Body[]) : [];
        const when = (v: unknown) => {
          const d = new Date(String(v));
          return Number.isNaN(d.getTime()) ? new Date() : d;
        };
        const day = (v: unknown) => (dayOk(v) ? String(v) : null);
        const insertAll = async <T,>(rows: T[], run: (chunk: T[]) => Promise<unknown>) => {
          for (let i = 0; i < rows.length; i += 500) await run(rows.slice(i, i + 500));
        };

        const plain = (v: unknown) => (v && typeof v === "object" && !Array.isArray(v) ? (v as Body) : {});
        const prog = Object.entries(plain(s.progress))
          .slice(0, 500)
          .map(([k, v]) => ({ uid, key: str(k, 120), value: str(v, 200) }))
          .filter((r) => r.key && r.value);
        const sess = list(s.sessions, 5000).flatMap((x) => {
          const d = day(x.day);
          return d
            ? [{ uid, day: d, minutes: Math.min(600, Math.max(1, Math.round(num(x.minutes)))), kind: str(x.kind || "focus", 30), topic: x.topic ? str(x.topic, 30) : null }]
            : [];
        });
        const cardRows = Object.entries(plain(s.cards) as Record<string, Body>)
          .slice(0, 1000)
          .filter(([, c]) => c && typeof c === "object")
          .flatMap(([id, c]) => {
            const d = day(c?.due);
            return d && id
              ? [{ uid, cardId: str(id, 80), due: d, box: Math.min(5, Math.max(1, Math.round(num(c.box, 1)))), reps: Math.max(0, Math.round(num(c.reps))), lapses: Math.max(0, Math.round(num(c.lapses))) }]
              : [];
          });
        const atts = list(s.attempts, 20000).map((x) => ({
          uid,
          questionId: str(x.questionId, 30),
          correct: Boolean(x.correct),
          mode: str(x.mode || "practice", 20),
          createdAt: when(x.at),
        }));
        const exs = list(s.exams, 1000).map((x) => ({
          uid,
          score: Math.max(0, Math.round(num(x.score))),
          total: Math.max(1, Math.round(num(x.total, 1))),
          seconds: Math.max(0, Math.round(num(x.seconds))),
          breakdown: (x.breakdown ?? {}) as Record<string, unknown>,
          createdAt: when(x.createdAt),
        }));
        const nts = list(s.notes, 2000).map((x) => ({
          uid,
          title: str(x.title, 200),
          body: str(x.body, 20000),
          topic: x.topic ? str(x.topic, 30) : null,
          updatedAt: when(x.updatedAt),
        }));
        const tks = list(s.tasks, 2000).flatMap((x) => {
          const d = day(x.day);
          const title = str(x.title, 200).trim();
          return d && title ? [{ uid, title, day: d, done: Boolean(x.done) }] : [];
        });
        const f = plain(s.profile);
        const set: Record<string, unknown> = {};
        set.examDate = day(f.examDate);
        if (dayOk(f.startDate)) set.startDate = String(f.startDate);
        if ("dailyHours" in f) set.dailyHours = Math.min(12, Math.max(0.5, num(f.dailyHours, 2)));
        if (/^\d{2}:\d{2}$/.test(String(f.startTime))) set.startTime = String(f.startTime);
        if (["auto", "light", "dark"].includes(String(f.theme))) set.theme = String(f.theme);
        if ("focusMin" in f) set.focusMin = Math.min(120, Math.max(5, Math.round(num(f.focusMin, 25))));
        if ("breakMin" in f) set.breakMin = Math.min(60, Math.max(1, Math.round(num(f.breakMin, 5))));

        await db.transaction(async (tx) => {
          await tx.delete(progress).where(eq(progress.uid, uid));
          await tx.delete(studySessions).where(eq(studySessions.uid, uid));
          await tx.delete(cardStates).where(eq(cardStates.uid, uid));
          await tx.delete(quizAttempts).where(eq(quizAttempts.uid, uid));
          await tx.delete(examResults).where(eq(examResults.uid, uid));
          await tx.delete(notes).where(eq(notes.uid, uid));
          await tx.delete(tasks).where(eq(tasks.uid, uid));
          await tx.update(profiles).set(set).where(eq(profiles.uid, uid));
          await insertAll(prog, (c) => tx.insert(progress).values(c));
          await insertAll([...sess].reverse(), (c) => tx.insert(studySessions).values(c));
          await insertAll(cardRows, (c) => tx.insert(cardStates).values(c));
          await insertAll([...atts].reverse(), (c) => tx.insert(quizAttempts).values(c));
          await insertAll([...exs].reverse(), (c) => tx.insert(examResults).values(c));
          await insertAll(nts, (c) => tx.insert(notes).values(c));
          await insertAll(tks, (c) => tx.insert(tasks).values(c));
        });
        return Response.json({ ok: true });
      }

      default:
        return Response.json({ error: "unknown" }, { status: 400 });
    }
  } catch (e) {
    console.error(e);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
