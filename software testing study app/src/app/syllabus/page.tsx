"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { chapterAccuracy, chapterProgress, syllabusPct, topicStatus } from "@/lib/stats";
import { CHAPTERS, EXAM_TOTAL_Q } from "@/data/syllabus";
import { Bar, PageTitle } from "@/components/ui";

import { STATUS_LABEL } from "@/lib/status";

export default function SyllabusPage() {
  const { state, setProgress } = useApp();
  const acc = chapterAccuracy(state);
  const cycle = (id: string) => {
    const c = topicStatus(state, id);
    const n = c === "" ? "learning" : c === "learning" ? "done" : c === "done" ? "review" : "";
    setProgress(`t:${id}`, n || null);
  };

  return (
    <>
      <PageTitle title="منهج ISTQB CTFL v4.0" sub={`${CHAPTERS.length} فصول، ${EXAM_TOTAL_Q} سؤالاً في الامتحان. تقدمك ${syllabusPct(state)}%`} />
      <div className="card mb-4">
        <Bar pct={syllabusPct(state)} />
        <p className="mb-0 mt-2 text-sm text-mu">
          ادخل كل موضوع لقراءة الملخص والأهداف التعليمية (Learning objectives) والمصادر المرتبطة. اضغط على الحالة لتغييرها
          بسرعة: لم أبدأ ← أتعلم ← أتقنته ← يحتاج مراجعة.
        </p>
      </div>

      {CHAPTERS.map((c) => (
        <section key={c.id} className="card mb-4">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="m-0 text-lg font-bold">
                الفصل {c.id}: {c.ar}
              </h2>
            </div>
            <div className="text-xs text-mu">
              ≈ {c.examQ} أسئلة · {Math.round(c.minutes / 60 * 10) / 10} ساعة دراسة
              {acc[c.id].t > 0 && <> · دقتك {acc[c.id].pct}%</>}
            </div>
          </div>
          <Bar pct={chapterProgress(state, c.id)} />
          <ul className="m-0 mt-2 list-none p-0">
            {c.topics.map((t) => {
              const st = topicStatus(state, t.id);
              const L = STATUS_LABEL[st];
              return (
                <li key={t.id} className="flex items-center gap-3 border-t border-ln py-2 first:border-t-0">
                  <button
                    onClick={() => cycle(t.id)}
                    className={`min-w-24 shrink-0 cursor-pointer rounded-md border bg-transparent px-2 py-0.5 text-xs font-bold ${L.cls}`}
                    aria-label={`حالة ${t.ar}: ${L.t}. اضغط للتغيير`}
                  >
                    {L.t}
                  </button>
                  <Link href={`/syllabus/${t.id}`} className="flex-1 text-tx no-underline hover:text-ac">
                    <span className="ltr me-2 inline-block text-xs text-mu">{t.id}</span>
                    {t.ar}
                  </Link>
                  <span className="text-xs text-mu">{t.minutes} د</span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
