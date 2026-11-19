"use client";

import { useState } from "react";

type Check = { id: string; label: string; tip: string; ok: (t: string) => boolean };

const LABEL = /^\s*(title|العنوان)\s*[:：]\s*/i;
const GENERIC = /^(bug|issue|error|problem|not working|doesn'?t work|لا يعمل|مش شغال|خطأ|مشكلة|عطل)[\s!.؟?]*$/i;

const CHECKS: Check[] = [
  {
    id: "title",
    label: "Title محدد",
    tip: "اذكر المكان والمشكلة والشرط، مثل: Checkout: زر الدفع لا يستجيب عند تطبيق كوبون.",
    ok: (t) => {
      const lines = t.split("\n").filter((l) => l.trim());
      const first = (lines.find((l) => LABEL.test(l)) ?? lines[0] ?? "").replace(LABEL, "").trim();
      return first.length >= 15 && first.length <= 160 && !GENERIC.test(first);
    },
  },
  {
    id: "steps",
    label: "Steps to reproduce مرقّمة",
    tip: "اكتب خطوتين مرقّمتين على الأقل (1. 2. ...) بأفعال واضحة.",
    ok: (t) => (t.match(/^\s*\d+\s*[.)\-]\s*\S/gm) ?? []).length >= 2,
  },
  {
    id: "actual",
    label: "Actual result (النتيجة الفعلية)",
    tip: "أضف سطراً بعنوان Actual result أو «النتيجة الفعلية» يصف ما حدث.",
    ok: (t) => /(actual|النتيجة الفعلية|الفعلي|ما حدث|what happens)/i.test(t),
  },
  {
    id: "expected",
    label: "Expected result (النتيجة المتوقعة)",
    tip: "أضف سطراً بعنوان Expected result أو «النتيجة المتوقعة» مع مرجعها إن وجد.",
    ok: (t) => /(expected|النتيجة المتوقعة|المتوقع)/i.test(t),
  },
  {
    id: "env",
    label: "Environment (البيئة)",
    tip: "اذكر الإصدار (Build) والنظام والمتصفح أو الجهاز.",
    ok: (t) => /(environment|البيئة|build|version|الإصدار|الاصدار|chrome|firefox|safari|edge|android|ios|windows|macos|linux|browser|المتصفح)/i.test(t),
  },
  {
    id: "repro",
    label: "Reproducibility (معدل التكرار)",
    tip: "اكتب كم مرة تكرر الـ defect، مثل: 3 من 3 محاولات، أو Always، أو Intermittent.",
    ok: (t) => /(reproducib|frequency|التكرار|تكرار|\d+\s*(of|\/|من)\s*\d+|always|intermittent|every time|دائماً|دائما|أحياناً|احيانا|كل مرة)/i.test(t),
  },
  {
    id: "sev",
    label: "Severity وPriority",
    tip: "أضف Severity وPriority (أو الخطورة والأولوية).",
    ok: (t) => /(severity|priority|الخطورة|الأولوية|الاولوية)/i.test(t),
  },
];

const PASS_AT = 6;

export default function BugChecker() {
  const [text, setText] = useState("");
  const [shown, setShown] = useState(false);
  const results = CHECKS.map((c) => ({ ...c, pass: c.ok(text) }));
  const score = results.filter((r) => r.pass).length;
  const good = score >= PASS_AT;

  return (
    <section className="card mt-4">
      <h2 className="mb-1 mt-0 text-lg font-bold">🔎 مدقّق Defect report</h2>
      <p className="mt-0 text-sm text-mu">
        الصق تقريرك (عربي أو إنجليزي) لتفحص اكتمال عناصره السبعة. هذا فحص للشكل فقط، ولا يحكم على جودة المحتوى.
      </p>
      <textarea
        dir="auto"
        className="block w-full"
        rows={9}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setShown(false);
        }}
        placeholder={"Title: ...\nSteps to reproduce:\n1. ...\n2. ...\nActual result: ...\nExpected result: ..."}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button className="btn" disabled={!text.trim()} onClick={() => setShown(true)}>
          افحص التقرير
        </button>
        <button className="btn btn-ghost" onClick={() => { setText(""); setShown(false); }}>
          مسح
        </button>
      </div>
      {shown && (
        <div className="mt-3" aria-live="polite">
          <b className={good ? "text-ok" : "text-bad"}>
            {good ? "مقبول" : "ناقص"} ({score}/{CHECKS.length})
          </b>
          <ul className="m-0 mt-2 list-none p-0">
            {results.map((r) => (
              <li key={r.id} className="mb-2 text-sm">
                <span className={r.pass ? "text-ok" : "text-bad"}>{r.pass ? "✓" : "✗"}</span> {r.label}
                {!r.pass && <div className="text-mu">{r.tip}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
