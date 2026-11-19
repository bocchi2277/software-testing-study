"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { CARDS } from "@/data/cards";
import { CHAPTERS, chapterLabel } from "@/data/syllabus";
import { shuffle } from "@/data/questions";
import { todayStr } from "@/lib/dates";
import { Bar, PageTitle } from "@/components/ui";

export default function CardsPage() {
  const { state, reviewCard, resetCards } = useApp();
  const [ch, setCh] = useState("all");
  const [scope, setScope] = useState<"due" | "all">("due");
  const [queue, setQueue] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const [session, setSession] = useState({ known: 0, again: 0 });
  const [started, setStarted] = useState(false);

  const today = todayStr();
  const pool = useMemo(
    () =>
      CARDS.filter((c) => ch === "all" || c.ch === Number(ch)).filter((c) => {
        if (scope === "all") return true;
        const st = state.cards[c.id];
        return !st || st.due <= today;
      }),
    [ch, scope, state.cards, today],
  );

  const boxes = [1, 2, 3, 4, 5].map((b) => CARDS.filter((c) => (state.cards[c.id]?.box ?? 0) === b).length);
  const fresh = CARDS.filter((c) => !state.cards[c.id]).length;

  const start = () => {
    setQueue(shuffle(pool.map((c) => c.id)));
    setIdx(0);
    setFlip(false);
    setSession({ known: 0, again: 0 });
    setStarted(true);
  };

  useEffect(() => {
    setStarted(false);
  }, [ch, scope]);

  const cur = started ? CARDS.find((c) => c.id === queue[idx]) : undefined;
  const finished = started && !cur;

  const grade = (known: boolean) => {
    if (!cur) return;
    reviewCard(cur.id, known);
    setSession((s) => ({ known: s.known + (known ? 1 : 0), again: s.again + (known ? 0 : 1) }));
    if (!known) setQueue((q) => [...q, cur.id]);
    setIdx((i) => i + 1);
    setFlip(false);
  };

  return (
    <>
      <PageTitle title="بطاقات المصطلحات" sub={`${CARDS.length} بطاقة بنظام المراجعة المتباعدة (Leitner): ما تعرفه يتباعد ظهوره، وما تنساه يعود غداً.`} />

      <div className="card mb-4">
        <div className="mb-3 grid grid-cols-6 gap-2 text-center text-xs">
          <div>
            <div className="text-xl font-bold text-mu">{fresh}</div>جديدة
          </div>
          {boxes.map((n, i) => (
            <div key={i}>
              <div className="text-xl font-bold text-ac">{n}</div>صندوق {i + 1}
            </div>
          ))}
        </div>
        <Bar pct={(CARDS.filter((c) => (state.cards[c.id]?.box ?? 0) >= 4).length / CARDS.length) * 100} />
        <p className="mb-0 mt-1 text-xs text-mu">الصناديق 4–5 تعني أنك تحفظها جيداً.</p>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select className="max-w-full" value={ch} onChange={(e) => setCh(e.target.value)} aria-label="الفصل">
          <option value="all">كل الفصول</option>
          {CHAPTERS.map((c) => (
            <option key={c.id} value={c.id}>
              {chapterLabel(c)}
            </option>
          ))}
        </select>
        <button className="chip" aria-pressed={scope === "due"} onClick={() => setScope("due")}>المستحقة اليوم</button>
        <button className="chip" aria-pressed={scope === "all"} onClick={() => setScope("all")}>الكل</button>
      </div>

      {!started && (
        <div className="card text-center">
          <p className="mt-0 text-lg">
            <b>{pool.length}</b> بطاقة {scope === "due" ? "مستحقة" : "في هذه المجموعة"}
          </p>
          <button className="btn" disabled={pool.length === 0} onClick={start}>
            ابدأ المراجعة
          </button>
          {pool.length === 0 && <p className="mb-0 mt-2 text-sm text-ok">أحسنت! لا شيء مستحق الآن 🎉</p>}
        </div>
      )}

      {started && cur && (
        <>
          <div className="mb-1 flex justify-between text-sm text-mu">
            <span>{Math.min(idx + 1, queue.length)} / {queue.length}</span>
            <span>
              ✅ {session.known} · 🔁 {session.again}
            </span>
          </div>
          <button
            className="card flex min-h-52 w-full cursor-pointer flex-col items-center justify-center text-center"
            onClick={() => setFlip((f) => !f)}
            aria-label="اضغط لقلب البطاقة"
          >
            <span className="mb-2 text-xs text-mu">الفصل {cur.ch} {flip ? "· التعريف" : "· المصطلح"}</span>
            {flip ? (
              <span className="text-lg">{cur.def}</span>
            ) : (
              <span className="ltr text-3xl font-bold text-ac">{cur.term}</span>
            )}
            {!flip && <span className="mt-4 text-xs text-mu">فكّر في التعريف ثم اضغط للقلب</span>}
          </button>
          <div className="mt-3 flex gap-2">
            <button className="btn btn-danger flex-1" disabled={!flip} onClick={() => grade(false)}>
              🔁 لم أعرفها
            </button>
            <button className="btn flex-1" disabled={!flip} onClick={() => grade(true)}>
              ✅ عرفتها
            </button>
          </div>
        </>
      )}

      {finished && (
        <div className="card text-center">
          <div className="text-5xl">🎉</div>
          <p className="text-lg">انتهت الجلسة: عرفت {session.known} وأعدت {session.again}.</p>
          <button className="btn" onClick={() => setStarted(false)}>رجوع</button>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            if (confirm("سيتم تصفير تقدم كل البطاقات. متأكد؟")) resetCards();
          }}
        >
          تصفير تقدم البطاقات
        </button>
      </div>
    </>
  );
}
