"use client";

import { useApp } from "@/lib/store";
import { CERTS, CV_TIPS, INTERVIEW, PORTFOLIO, STAGES } from "@/data/career";
import { Bar, PageTitle } from "@/components/ui";

export default function CareerPage() {
  const { state, setProgress } = useApp();
  const all = STAGES.flatMap((s) => s.items);
  const done = all.filter((i) => state.progress[`career:${i.id}`] === "1").length;

  return (
    <>
      <PageTitle title="المسار المهني 🚀" sub="من شهادة ISTQB إلى وظيفة مختبر/مهندس جودة." />

      <div className="card mb-4">
        <div className="mb-1 flex justify-between text-sm">
          <b>تقدمك في المسار</b>
          <span>{done}/{all.length}</span>
        </div>
        <Bar pct={(done / all.length) * 100} />
        <p className="mb-0 mt-2 text-sm text-mu">
          الشهادة تفتح الباب، لكن أصحاب العمل يوظفون من يُثبت مهارته. اجمع بين الشهادة وأعمال حقيقية.
        </p>
      </div>

      {STAGES.map((s) => (
        <section key={s.id} className="card mb-3">
          <h2 className="m-0 text-lg font-bold">{s.title}</h2>
          <p className="mb-2 mt-0 text-sm text-mu">{s.why}</p>
          {s.items.map((i) => {
            const on = state.progress[`career:${i.id}`] === "1";
            return (
              <label key={i.id} className="flex items-start gap-2 border-t border-ln py-2">
                <input type="checkbox" className="mt-1.5" checked={on} onChange={() => setProgress(`career:${i.id}`, on ? null : "1")} />
                <span className={on ? "text-mu line-through" : ""}>{i.text}</span>
              </label>
            );
          })}
        </section>
      ))}

      <section className="card mb-4">
        <h2 className="mb-2 mt-0 text-lg font-bold">💼 أفكار لمحفظة الأعمال (Portfolio)</h2>
        {PORTFOLIO.map((p) => (
          <div key={p.t} className="border-t border-ln py-2 first:border-t-0">
            <b>{p.t}</b>
            <div className="text-sm text-mu">{p.d}</div>
          </div>
        ))}
      </section>

      <section className="card mb-4">
        <h2 className="mb-2 mt-0 text-lg font-bold">🎤 أسئلة مقابلات شائعة ({INTERVIEW.length})</h2>
        {INTERVIEW.map((x, i) => (
          <details key={i} className="border-t border-ln py-2 first:border-t-0">
            <summary className="font-medium text-ac">
              {i + 1}. {x.q}
            </summary>
            <p className="m-0 mt-1 text-sm">{x.a}</p>
          </details>
        ))}
        <p className="mb-0 mt-2 text-xs text-mu">حاول الإجابة بصوت عالٍ قبل فتح الجواب.</p>
      </section>

      <section className="card mb-4">
        <h2 className="mb-2 mt-0 text-lg font-bold">📄 نصائح CV وLinkedIn</h2>
        <ul className="m-0 ps-5">
          {CV_TIPS.map((t) => (
            <li key={t} className="mb-1">{t}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2 className="mb-2 mt-0 text-lg font-bold">🏅 شهادات ISTQB التالية</h2>
        {CERTS.map((c) => (
          <div key={c.n} className="border-t border-ln py-2 first:border-t-0">
            <b className="ltr block">{c.n}</b>
            <span className="text-sm text-mu">{c.d}</span>
          </div>
        ))}
        <p className="mb-0 mt-2 text-xs text-mu">تحقق من توفر كل شهادة ومتطلباتها على istqb.org.</p>
      </section>
    </>
  );
}
