"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import { chapterAccuracy, latestByQuestion, mistakeIds } from "@/lib/stats";
import { CHAPTERS, chapterLabel } from "@/data/syllabus";
import { QUESTIONS, prepare, shuffle, type PreparedQuestion } from "@/data/questions";
import { fmtTime } from "@/lib/dates";
import { Bar, PageTitle } from "@/components/ui";

type View =
  | { kind: "menu" }
  | { kind: "practice"; qs: PreparedQuestion[]; title: string }
  | { kind: "exam"; qs: PreparedQuestion[]; minutes: number };

export default function PracticePage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-mu">جارٍ التحميل…</p>}>
      <PracticeInner />
    </Suspense>
  );
}

function PracticeInner() {
  const { state } = useApp();
  const sp = useSearchParams();
  const [view, setView] = useState<View>({ kind: "menu" });
  const [ch, setCh] = useState("all");
  const [filter, setFilter] = useState<"all" | "unseen" | "mistakes">("all");
  const [count, setCount] = useState(10);
  const [examMin, setExamMin] = useState(60);
  const started = useRef(false);

  const acc = chapterAccuracy(state);
  const latest = latestByQuestion(state);

  const build = useCallback(
    (chapter: string, f: "all" | "unseen" | "mistakes", n: number) => {
      let pool = QUESTIONS.filter((q) => chapter === "all" || q.ch === Number(chapter));
      if (f === "mistakes") pool = pool.filter((q) => latest[q.id] === false);
      if (f === "unseen") {
        const unseen = pool.filter((q) => !(q.id in latest));
        const rest = pool.filter((q) => q.id in latest);
        pool = [...shuffle(unseen), ...shuffle(rest)];
      } else pool = shuffle(pool);
      return pool.slice(0, n).map(prepare);
    },
    [latest],
  );

  const startPractice = (chapter: string, f: "all" | "unseen" | "mistakes", n: number) => {
    const qs = build(chapter, f, n);
    if (!qs.length) return false;
    const title =
      f === "mistakes"
        ? "مراجعة الأخطاء"
        : chapter === "all"
          ? "تدريب شامل"
          : `الفصل ${chapter}: ${CHAPTERS.find((c) => c.id === Number(chapter))?.ar}`;
    setView({ kind: "practice", qs, title });
    return true;
  };

  const startExam = () => {
    let picked: typeof QUESTIONS = [];
    for (const c of CHAPTERS) {
      picked = picked.concat(shuffle(QUESTIONS.filter((q) => q.ch === c.id)).slice(0, c.examQ));
    }
    if (picked.length < 40) {
      const rest = shuffle(QUESTIONS.filter((q) => !picked.includes(q)));
      picked = picked.concat(rest.slice(0, 40 - picked.length));
    }
    setView({ kind: "exam", qs: shuffle(picked).map(prepare), minutes: examMin });
  };

  // بدء تلقائي من الروابط
  useEffect(() => {
    if (started.current) return;
    const c = sp.get("ch");
    const m = sp.get("mode");
    if (c && /^[1-6]$/.test(c)) {
      started.current = true;
      setCh(c);
      startPractice(c, "unseen", 10);
    } else if (m === "mistakes") {
      started.current = true;
      setFilter("mistakes");
      if (!startPractice("all", "mistakes", 20)) setFilter("mistakes");
    } else if (m === "exam") {
      started.current = true;
      startExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  if (view.kind === "practice") {
    return <Practice qs={view.qs} title={view.title} onExit={() => setView({ kind: "menu" })} />;
  }
  if (view.kind === "exam") {
    return <Exam qs={view.qs} minutes={view.minutes} onExit={() => setView({ kind: "menu" })} />;
  }

  const mistakeCount = mistakeIds(state).length;
  const pool =
    filter === "mistakes"
      ? QUESTIONS.filter((q) => (ch === "all" || q.ch === Number(ch)) && latest[q.id] === false).length
      : QUESTIONS.filter((q) => ch === "all" || q.ch === Number(ch)).length;

  return (
    <>
      <PageTitle title="اختبارات وتدريب" sub={`${QUESTIONS.length} سؤالاً بتفسير لكل إجابة، والبنك يتوسع باستمرار.`} />

      <section className="card mb-4">
        <h2 className="mb-3 mt-0 text-lg font-bold">📝 تدريب مخصص</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm">
            الفصل
            <select className="mt-1 block w-full" value={ch} onChange={(e) => setCh(e.target.value)}>
              <option value="all">كل الفصول</option>
              {CHAPTERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {chapterLabel(c)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            نوع الأسئلة
            <select className="mt-1 block w-full" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
              <option value="all">عشوائي</option>
              <option value="unseen">الجديدة أولاً</option>
              <option value="mistakes">أخطائي فقط ({mistakeCount})</option>
            </select>
          </label>
          <label className="text-sm">
            العدد
            <select className="mt-1 block w-full" value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[5, 10, 20, 40].map((n) => (
                <option key={n} value={n}>
                  {n} أسئلة
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button className="btn" disabled={pool === 0} onClick={() => startPractice(ch, filter, count)}>
            ابدأ التدريب
          </button>
          <span className="text-sm text-mu">{pool} سؤالاً متاحاً بهذه الإعدادات</span>
        </div>
      </section>

      <section className="card mb-4 border-ac">
        <h2 className="mb-1 mt-0 text-lg font-bold">⏱️ محاكاة الامتحان الحقيقي</h2>
        <p className="mt-0 text-sm text-mu">
          40 سؤالاً بنفس توزيع الفصول في الامتحان، بدون إظهار الإجابات حتى النهاية. النجاح من 65% (26/40).
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm">
            المدة{" "}
            <select value={examMin} onChange={(e) => setExamMin(Number(e.target.value))}>
              <option value={60}>60 دقيقة (قياسي)</option>
              <option value={75}>75 دقيقة (غير ناطق بالإنجليزية)</option>
            </select>
          </label>
          <button className="btn" onClick={startExam}>ابدأ المحاكاة</button>
        </div>
        {state.exams.length > 0 && (
          <div className="mt-4">
            <b className="text-sm">آخر النتائج</b>
            <div className="mt-1 flex flex-wrap gap-2">
              {state.exams.slice(0, 8).map((e) => {
                const p = Math.round((e.score / e.total) * 100);
                return (
                  <span key={e.id} className={`rounded-md border px-2 py-1 text-xs ${p >= 65 ? "border-ok bg-okb text-ok" : "border-bad bg-badb text-bad"}`}>
                    {e.score}/{e.total} ({p}%)
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="mb-3 mt-0 text-lg font-bold">دقتك حسب الفصل</h2>
        {CHAPTERS.map((c) => (
          <div key={c.id} className="mb-3 last:mb-0">
            <div className="mb-1 flex justify-between text-sm">
              <span>{chapterLabel(c)}</span>
              <span className="text-mu">
                {acc[c.id].t ? `${acc[c.id].c}/${acc[c.id].t} (${acc[c.id].pct}%)` : "لم تجرّب بعد"}
              </span>
            </div>
            <Bar pct={acc[c.id].pct} color={acc[c.id].pct >= 65 ? "var(--ok)" : "var(--bad)"} />
          </div>
        ))}
      </section>
    </>
  );
}

/* ------------------------------ التدريب ------------------------------ */

function Practice({ qs, title, onExit }: { qs: PreparedQuestion[]; title: string; onExit: () => void }) {
  const { recordAttempt } = useApp();
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<PreparedQuestion[]>([]);
  const q = qs[i];

  if (!q) {
    return (
      <>
        <PageTitle title="النتيجة" sub={title} />
        <div className="card text-center">
          <div className="text-5xl font-bold text-ac">
            {score}/{qs.length}
          </div>
          <p className="text-mu">{Math.round((score / qs.length) * 100)}%</p>
          {wrong.length > 0 && (
            <div className="mt-4 text-start">
              <b>أسئلة أخطأت فيها:</b>
              {wrong.map((w) => (
                <div key={w.id} className="mt-3 border-t border-ln pt-3">
                  <p className="m-0">{w.q}</p>
                  <p className="ltr m-0 mt-1 text-ok">✓ {w.options[0]}</p>
                  <p className="m-0 text-sm text-mu">{w.exp}</p>
                </div>
              ))}
            </div>
          )}
          <button className="btn mt-4" onClick={onExit}>العودة</button>
        </div>
      </>
    );
  }

  const choose = (displayIdx: number) => {
    if (sel !== null) return;
    setSel(displayIdx);
    const ok = displayIdx === q.correctIdx;
    recordAttempt(q.id, ok, "practice");
    if (ok) setScore((s) => s + 1);
    else setWrong((w) => [...w, q]);
  };

  return (
    <>
      <PageTitle title={title} sub={`سؤال ${i + 1} من ${qs.length}`}>
        <button className="btn btn-ghost btn-sm" onClick={onExit}>إنهاء</button>
      </PageTitle>
      <Bar pct={(i / qs.length) * 100} />
      <div className="card mt-3">
        <p className="mt-0 font-medium">{q.q}</p>
        {q.order.map((orig, d) => (
          <button
            key={d}
            disabled={sel !== null}
            onClick={() => choose(d)}
            className={`opt ${sel !== null && d === q.correctIdx ? "ok" : ""} ${sel === d && d !== q.correctIdx ? "no" : ""}`}
          >
            {q.options[orig]}
          </button>
        ))}
        {sel !== null && (
          <div className="mt-3 rounded-lg bg-bg p-3 text-sm">
            <b>{sel === q.correctIdx ? "✅ صحيح" : "❌ إجابة خاطئة"}</b>
            <p className="m-0 mt-1">{q.exp}</p>
          </div>
        )}
        {sel !== null && (
          <button
            className="btn mt-3"
            onClick={() => {
              setI(i + 1);
              setSel(null);
            }}
          >
            {i + 1 === qs.length ? "عرض النتيجة" : "التالي"}
          </button>
        )}
      </div>
    </>
  );
}

/* ------------------------------ المحاكاة ------------------------------ */

function Exam({ qs, minutes, onExit }: { qs: PreparedQuestion[]; minutes: number; onExit: () => void }) {
  const { recordAttempts, saveExam } = useApp();
  const [answers, setAnswers] = useState<(number | null)[]>(() => qs.map(() => null));
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(minutes * 60);
  const [done, setDone] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const endAt = useRef(Date.now() + minutes * 60_000);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const doneRef = useRef(false);
  const [elapsed, setElapsed] = useState(0);

  const submit = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    const used = Math.round((Date.now() - (endAt.current - minutes * 60_000)) / 1000);
    setElapsed(Math.min(used, minutes * 60));
    const a = answersRef.current;
    let score = 0;
    const breakdown: Record<string, { c: number; t: number }> = {};
    const items: { questionId: string; correct: boolean }[] = [];
    qs.forEach((q, k) => {
      const ok = a[k] === q.correctIdx;
      if (ok) score++;
      breakdown[q.ch] = breakdown[q.ch] ?? { c: 0, t: 0 };
      breakdown[q.ch].t++;
      if (ok) breakdown[q.ch].c++;
      items.push({ questionId: q.id, correct: ok });
    });
    recordAttempts(items, "exam");
    void saveExam({ score, total: qs.length, seconds: Math.min(used, minutes * 60), breakdown });
    setDone(true);
  }, [qs, minutes, recordAttempts, saveExam]);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      const l = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(l);
      if (l <= 0) submit();
    }, 500);
    return () => clearInterval(id);
  }, [done, submit]);

  const result = useMemo(() => {
    if (!done) return null;
    let score = 0;
    const by: Record<number, { c: number; t: number }> = {};
    qs.forEach((q, k) => {
      by[q.ch] = by[q.ch] ?? { c: 0, t: 0 };
      by[q.ch].t++;
      if (answers[k] === q.correctIdx) {
        score++;
        by[q.ch].c++;
      }
    });
    return { score, by };
  }, [done, qs, answers]);

  if (done && result) {
    const pct = Math.round((result.score / qs.length) * 100);
    const pass = pct >= 65;
    return (
      <>
        <PageTitle title="نتيجة المحاكاة" />
        <div className={`card mb-4 text-center ${pass ? "border-ok" : "border-bad"}`}>
          <div className={`text-6xl font-bold ${pass ? "text-ok" : "text-bad"}`}>
            {result.score}/{qs.length}
          </div>
          <p className="my-1 text-lg">
            {pct}% — {pass ? "ناجح ✅ (الحد 65%)" : "لم تبلغ حد النجاح 65% ❌"}
          </p>
          <p className="m-0 text-sm text-mu">الزمن المستغرق: {fmtTime(elapsed)}</p>
          {pass && pct < 80 && (
            <p className="mb-0 mt-2 text-sm text-warn">نصيحة: كرر المحاكاة حتى تتجاوز 80% باستمرار قبل الحجز.</p>
          )}
        </div>
        <section className="card mb-4">
          <h2 className="mb-3 mt-0 text-lg font-bold">الأداء حسب الفصل</h2>
          {CHAPTERS.map((c) => {
            const r = result.by[c.id];
            if (!r) return null;
            const p = Math.round((r.c / r.t) * 100);
            return (
              <div key={c.id} className="mb-3">
                <div className="mb-1 flex justify-between text-sm">
                  <span>{chapterLabel(c)}</span>
                  <span className="text-mu">{r.c}/{r.t}</span>
                </div>
                <Bar pct={p} color={p >= 65 ? "var(--ok)" : "var(--bad)"} />
              </div>
            );
          })}
        </section>
        <section className="card mb-4">
          <h2 className="mb-2 mt-0 text-lg font-bold">مراجعة الإجابات</h2>
          {qs.map((q, k) => {
            const ok = answers[k] === q.correctIdx;
            return (
              <div key={q.id} className="border-t border-ln py-3 first:border-t-0">
                <p className="m-0">
                  <b>{k + 1}.</b> {ok ? "✅" : answers[k] === null ? "⚪" : "❌"} {q.q}
                </p>
                {!ok && answers[k] !== null && (
                  <p className="ltr m-0 mt-1 text-bad">✗ {q.options[q.order[answers[k] as number]]}</p>
                )}
                <p className="ltr m-0 mt-1 text-ok">✓ {q.options[0]}</p>
                <p className="m-0 text-sm text-mu">{q.exp}</p>
              </div>
            );
          })}
        </section>
        <button className="btn" onClick={onExit}>العودة</button>
      </>
    );
  }

  const q = qs[i];
  const answered = answers.filter((a) => a !== null).length;
  const low = left < 300;

  return (
    <>
      <div className="sticky top-0 z-10 -mx-4 mb-3 flex items-center justify-between gap-2 border-b border-ln bg-bg px-4 py-2">
        <span className="text-sm">
          سؤال {i + 1}/{qs.length} · أجبت {answered}
        </span>
        <span className={`ltr text-xl font-bold tabular-nums ${low ? "text-bad" : ""}`}>⏱ {fmtTime(left)}</span>
        <button className="btn btn-sm" onClick={() => setConfirm(true)}>إنهاء وتسليم</button>
      </div>

      {confirm && (
        <div className="mb-3 rounded-xl border border-warn bg-warnb p-3 text-sm" role="alertdialog">
          <p className="m-0">
            لديك {qs.length - answered} سؤالاً بلا إجابة. هل تريد التسليم الآن؟
          </p>
          <div className="mt-2 flex gap-2">
            <button className="btn btn-sm" onClick={submit}>نعم، سلّم</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirm(false)}>متابعة</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="mb-2 flex justify-between text-xs text-mu">
          <span>الفصل {q.ch}</span>
          <button className="chip" aria-pressed={!!flags[i]} onClick={() => setFlags({ ...flags, [i]: !flags[i] })}>
            🚩 علّمه للمراجعة
          </button>
        </div>
        <p className="mt-0 font-medium">{q.q}</p>
        {q.order.map((orig, d) => (
          <button
            key={d}
            className={`opt ${answers[i] === d ? "sel" : ""}`}
            onClick={() => setAnswers(answers.map((a, k) => (k === i ? d : a)))}
          >
            {q.options[orig]}
          </button>
        ))}
        <div className="mt-3 flex justify-between">
          <button className="btn btn-ghost btn-sm" disabled={i === 0} onClick={() => setI(i - 1)}>→ السابق</button>
          <button className="btn btn-ghost btn-sm" disabled={i === qs.length - 1} onClick={() => setI(i + 1)}>التالي ←</button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" dir="ltr" aria-label="خريطة الأسئلة">
        {qs.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            className={`h-8 w-8 cursor-pointer rounded-md border text-xs ${
              k === i ? "border-ac bg-ac text-acfg" : answers[k] !== null ? "border-ok bg-okb text-ok" : "border-ln bg-surface"
            } ${flags[k] ? "ring-2 ring-warn" : ""}`}
          >
            {k + 1}
          </button>
        ))}
      </div>
      <button className="btn btn-danger btn-sm mt-4" onClick={() => { doneRef.current = true; onExit(); }}>
        إلغاء المحاكاة بدون حفظ
      </button>
    </>
  );
}
