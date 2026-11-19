"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { BOOKING_STEPS, EXAM_FACTS, EXAM_TIPS } from "@/data/career";
import { CHAPTERS, chapterLabel } from "@/data/syllabus";
import { readiness } from "@/lib/stats";
import { PageTitle, Ring } from "@/components/ui";

export default function CertificatePage() {
  const { state, setProgress } = useApp();
  const last = state.exams.slice(0, 3);
  const avg = last.length ? Math.round(last.reduce((a, e) => a + (e.score / e.total) * 100, 0) / last.length) : null;
  const ready = avg !== null && avg >= 80 && last.length >= 3;

  return (
    <>
      <PageTitle title="شهادة ISTQB CTFL 🎓" sub="كل ما تحتاجه لتعرف الامتحان وتحجزه وتجتازه." />

      <section className="card mb-4 flex flex-wrap items-center gap-4">
        <Ring pct={readiness(state)} sub="الجاهزية" />
        <div className="min-w-48 flex-1">
          <b>هل أنت جاهز للحجز؟</b>
          <p className="m-0 text-sm text-mu">
            المعيار الجيد: آخر 3 محاكاة بمتوسط ≥ 80%.{" "}
            {avg === null ? "لم تجرِ محاكاة بعد." : `متوسط آخر ${last.length}: ${avg}%.`}
          </p>
          <p className={`m-0 mt-1 font-bold ${ready ? "text-ok" : "text-warn"}`}>{ready ? "✅ نعم، احجز الآن" : "⏳ استمر في التدريب"}</p>
          <Link href="/practice?mode=exam" className="btn btn-sm mt-2">ابدأ محاكاة الآن</Link>
        </div>
      </section>

      <section className="card mb-4">
        <h2 className="mb-2 mt-0 text-lg font-bold">حقائق الامتحان</h2>
        {EXAM_FACTS.map((f) => (
          <div key={f.k} className="flex gap-3 border-t border-ln py-2 first:border-t-0">
            <b className="min-w-28">{f.k}</b>
            <span>{f.v}</span>
          </div>
        ))}
      </section>

      <section className="card mb-4">
        <h2 className="mb-2 mt-0 text-lg font-bold">توزيع الأسئلة على الفصول</h2>
        <table className="tbl">
          <thead>
            <tr><th>الفصل</th><th>الأسئلة</th><th>النسبة</th><th>وقت الدراسة المقترح</th></tr>
          </thead>
          <tbody>
            {CHAPTERS.map((c) => (
              <tr key={c.id}>
                <td className="text-start">{chapterLabel(c)}</td>
                <td>{c.examQ}</td>
                <td>{Math.round((c.examQ / 40) * 100)}%</td>
                <td>{Math.round(c.minutes / 60 * 10) / 10} س</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mb-0 mt-2 text-sm text-mu">الفصلان 4 و5 يشكلان 50% من الامتحان: ركّز عليهما.</p>
      </section>

      <section className="card mb-4">
        <h2 className="mb-2 mt-0 text-lg font-bold">خطوات الحجز والتحضير</h2>
        {BOOKING_STEPS.map((b) => {
          const done = state.progress[`cert:${b.id}`] === "1";
          return (
            <label key={b.id} className="flex items-start gap-2 border-t border-ln py-2 first:border-t-0">
              <input type="checkbox" className="mt-1.5" checked={done} onChange={() => setProgress(`cert:${b.id}`, done ? null : "1")} />
              <span className={done ? "text-mu line-through" : ""}>{b.t}</span>
            </label>
          );
        })}
        <a className="mt-2 inline-block text-sm" href="https://www.istqb.org/certifications/certified-tester-foundation-level" target="_blank" rel="noopener noreferrer">
          الصفحة الرسمية للشهادة ↗
        </a>
      </section>

      <section className="card">
        <h2 className="mb-2 mt-0 text-lg font-bold">نصائح يوم الامتحان</h2>
        <ul className="m-0 ps-5">
          {EXAM_TIPS.map((t) => (
            <li key={t} className="mb-1">{t}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
