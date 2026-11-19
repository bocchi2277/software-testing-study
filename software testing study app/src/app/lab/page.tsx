"use client";

import { useMemo, useState } from "react";
import { PageTitle } from "@/components/ui";

function EpBva() {
  const [min, setMin] = useState(18);
  const [max, setMax] = useState(60);
  const [label, setLabel] = useState("العمر");
  const ok = Number.isFinite(min) && Number.isFinite(max) && min <= max;
  const two = ok ? Array.from(new Set([min - 1, min, max, max + 1])) : [];
  const three = ok ? Array.from(new Set([min - 1, min, min + 1, max - 1, max, max + 1])).sort((a, b) => a - b) : [];
  const parts = ok
    ? [
        { n: `${label} < ${min}`, v: min - 5, valid: false },
        { n: `${min} ≤ ${label} ≤ ${max}`, v: Math.floor((min + max) / 2), valid: true },
        { n: `${label} > ${max}`, v: max + 5, valid: false },
      ]
    : [];
  const isValid = (x: number) => x >= min && x <= max;

  return (
    <section className="card mb-4">
      <h2 className="mb-1 mt-0 text-lg font-bold">1) مولّد EP و BVA</h2>
      <p className="mt-0 text-sm text-mu">أدخل مجالاً صالحاً (أعداد صحيحة) لترى الأقسام وقيم الحدود.</p>
      <div className="mb-3 flex flex-wrap gap-3 text-sm">
        <label>الحقل <input value={label} onChange={(e) => setLabel(e.target.value)} className="w-28" /></label>
        <label>أدنى <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className="w-24" /></label>
        <label>أعلى <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-24" /></label>
      </div>
      {!ok ? (
        <p className="text-bad">الحد الأدنى يجب ألا يتجاوز الأعلى.</p>
      ) : (
        <>
          <b className="text-sm">Equivalence partitions (قيمة تمثيلية من كل قسم)</b>
          <table className="tbl my-2">
            <thead>
              <tr><th>القسم</th><th>النوع</th><th>قيمة الاختبار</th></tr>
            </thead>
            <tbody>
              {parts.map((p) => (
                <tr key={p.n}>
                  <td className="ltr">{p.n}</td>
                  <td className={p.valid ? "text-ok" : "text-bad"}>{p.valid ? "صالح" : "غير صالح"}</td>
                  <td className="ltr">{p.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {[
            ["2-value BVA", two],
            ["3-value BVA", three],
          ].map(([name, vals]) => (
            <div key={name as string} className="mb-2">
              <b className="text-sm">{name as string}</b>
              <div className="ltr mt-1 flex flex-wrap gap-2">
                {(vals as number[]).map((v) => (
                  <span key={v} className={`rounded-md border px-3 py-1 text-sm ${isValid(v) ? "border-ok bg-okb text-ok" : "border-bad bg-badb text-bad"}`}>
                    {v}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <p className="mb-0 text-xs text-mu">الأخضر = قيمة صالحة، الأحمر = غير صالحة. إجمالي القيم: {two.length} (2-value) و{three.length} (3-value).</p>
        </>
      )}
    </section>
  );
}

function DecisionTable() {
  const [conds, setConds] = useState(["عميل مسجل", "رصيد كافٍ", "عنوان صحيح"]);
  const [acts, setActs] = useState<Record<number, string>>({});
  const n = conds.length;
  const rules = useMemo(
    () => Array.from({ length: 2 ** n }, (_, r) => conds.map((_, c) => !((r >> (n - 1 - c)) & 1))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [n],
  );
  return (
    <section className="card mb-4">
      <h2 className="mb-1 mt-0 text-lg font-bold">2) مولّد Decision table</h2>
      <p className="mt-0 text-sm text-mu">عدّل أسماء الشروط (حتى 4)، وسيولّد الجدول الكامل 2<sup>n</sup>. اكتب النتيجة المتوقعة لكل قاعدة ثم فكّر أي القواعد يمكن طيّها.</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {conds.map((c, i) => (
          <input key={i} value={c} onChange={(e) => setConds(conds.map((x, k) => (k === i ? e.target.value : x)))} className="w-36" aria-label={`شرط ${i + 1}`} />
        ))}
        {n < 4 && <button className="btn btn-ghost btn-sm" onClick={() => setConds([...conds, `شرط ${n + 1}`])}>+ شرط</button>}
        {n > 1 && <button className="btn btn-ghost btn-sm" onClick={() => setConds(conds.slice(0, -1))}>− شرط</button>}
      </div>
      <div className="overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th>الشرط / القاعدة</th>
              {rules.map((_, r) => (<th key={r}>R{r + 1}</th>))}
            </tr>
          </thead>
          <tbody>
            {conds.map((c, i) => (
              <tr key={i}>
                <td className="text-start">{c}</td>
                {rules.map((rule, r) => (<td key={r} className={rule[i] ? "text-ok" : "text-bad"}>{rule[i] ? "T" : "F"}</td>))}
              </tr>
            ))}
            <tr>
              <td className="text-start font-bold">الإجراء المتوقع</td>
              {rules.map((_, r) => (
                <td key={r}>
                  <input value={acts[r] ?? ""} onChange={(e) => setActs({ ...acts, [r]: e.target.value })} className="w-24" aria-label={`نتيجة R${r + 1}`} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mb-0 mt-2 text-xs text-mu">للحصول على 100% Decision table coverage اختبر كل قاعدة ممكنة ({2 ** n} قاعدة هنا).</p>
    </section>
  );
}

function CoverageSim() {
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const cases = [
    { id: "TT", a: true, b: true },
    { id: "TF", a: true, b: false },
    { id: "FT", a: false, b: true },
    { id: "FF", a: false, b: false },
  ].filter((c) => sel[c.id]);
  const stmts = new Set<number>();
  const branches = new Set<string>();
  cases.forEach((c) => {
    stmts.add(1);
    stmts.add(2);
    stmts.add(4);
    if (c.a) stmts.add(3);
    if (c.b) stmts.add(5);
    branches.add(c.a ? "if1-T" : "if1-F");
    branches.add(c.b ? "if2-T" : "if2-F");
  });
  return (
    <section className="card mb-4">
      <h2 className="mb-1 mt-0 text-lg font-bold">3) محاكي Statement و Branch Coverage</h2>
      <pre className="code">{`1  read(a, b)
2  if (a > 0)
3      x = 1
4  if (b > 0)
5      y = 1`}</pre>
      <p className="text-sm text-mu">اختر Test cases (قيمة a وقيمة b) وراقب الـ coverage. جرّب: ما أقل عدد حالات يعطي 100% Statement؟ وما أقل عدد لـ 100% Branch؟</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {[["TT", "a>0, b>0"], ["TF", "a>0, b≤0"], ["FT", "a≤0, b>0"], ["FF", "a≤0, b≤0"]].map(([id, t]) => (
          <button key={id} className="chip" aria-pressed={!!sel[id]} onClick={() => setSel({ ...sel, [id]: !sel[id] })}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl border border-ln p-3">
          <div className="text-3xl font-bold text-ac">{Math.round((stmts.size / 5) * 100)}%</div>
          <div className="text-xs text-mu">Statement ({stmts.size}/5)</div>
        </div>
        <div className="rounded-xl border border-ln p-3">
          <div className="text-3xl font-bold text-ac">{Math.round((branches.size / 4) * 100)}%</div>
          <div className="text-xs text-mu">Branch ({branches.size}/4)</div>
        </div>
      </div>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-ac">الحل</summary>
        <p>Statement 100%: حالة واحدة تكفي (a&gt;0, b&gt;0). Branch 100%: حالتان على الأقل: (a&gt;0, b&gt;0) و (a≤0, b≤0). هذا يوضح أن Branch أقوى من Statement.</p>
      </details>
    </section>
  );
}

function Estimate() {
  const [o, setO] = useState(2);
  const [m, setM] = useState(5);
  const [p, setP] = useState(14);
  const e = (o + 4 * m + p) / 6;
  const sd = (p - o) / 6;
  return (
    <section className="card mb-4">
      <h2 className="mb-1 mt-0 text-lg font-bold">4) تقدير الجهد (Three-point)</h2>
      <p className="mt-0 text-sm text-mu">E = (a + 4m + b) ÷ 6 — a متفائل، m الأرجح، b متشائم.</p>
      <div className="mb-2 flex flex-wrap gap-3 text-sm">
        <label>a <input type="number" className="w-20" value={o} onChange={(e2) => setO(Number(e2.target.value))} /></label>
        <label>m <input type="number" className="w-20" value={m} onChange={(e2) => setM(Number(e2.target.value))} /></label>
        <label>b <input type="number" className="w-20" value={p} onChange={(e2) => setP(Number(e2.target.value))} /></label>
      </div>
      <p className="m-0">
        الجهد المقدّر: <b className="text-2xl text-ac">{Number.isFinite(e) ? Math.round(e * 100) / 100 : "—"}</b> ± {Number.isFinite(sd) ? Math.round(sd * 100) / 100 : "—"}
      </p>
    </section>
  );
}

function Risk() {
  const [l, setL] = useState(3);
  const [i, setI] = useState(4);
  const lvl = l * i;
  const label = lvl >= 15 ? ["عالية جداً", "text-bad"] : lvl >= 9 ? ["عالية", "text-warn"] : lvl >= 4 ? ["متوسطة", "text-ac"] : ["منخفضة", "text-ok"];
  return (
    <section className="card mb-4">
      <h2 className="mb-1 mt-0 text-lg font-bold">5) حاسبة مستوى المخاطرة</h2>
      <p className="mt-0 text-sm text-mu">المخاطرة = الاحتمال × الأثر (من 1 إلى 5).</p>
      <div className="flex flex-wrap gap-4 text-sm">
        <label>الاحتمال <input type="range" min={1} max={5} value={l} onChange={(e) => setL(Number(e.target.value))} /> {l}</label>
        <label>الأثر <input type="range" min={1} max={5} value={i} onChange={(e) => setI(Number(e.target.value))} /> {i}</label>
      </div>
      <p className="mb-0 mt-2">المستوى: <b className="text-2xl">{lvl}</b> — <b className={label[1]}>{label[0]}</b></p>
    </section>
  );
}

export default function LabPage() {
  return (
    <>
      <PageTitle title="المختبر التفاعلي 🧪" sub="تدرب على تقنيات الامتحان الحسابية (K3) بنفسك." />
      <EpBva />
      <DecisionTable />
      <CoverageSim />
      <Estimate />
      <Risk />
    </>
  );
}
