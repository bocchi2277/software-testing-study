"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { RESOURCES, RES_CATS } from "@/data/resources";
import { PageTitle } from "@/components/ui";

type Mark = "saved" | "done" | "";

export default function ResourcesPage() {
  const { state, setProgress } = useApp();
  const [cat, setCat] = useState<string>("الكل");
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("الكل");
  const [lang, setLang] = useState("الكل");
  const [only, setOnly] = useState<"" | "saved" | "done" | "top">("");

  const mark = (id: string): Mark => (state.progress[`r:${id}`] as Mark) ?? "";

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return RESOURCES.filter(
      (r) =>
        (cat === "الكل" || r.cat === cat) &&
        (level === "الكل" || r.level === level) &&
        (lang === "الكل" || r.lang === (lang === "عربي" ? "ar" : "en")) &&
        (!s || r.title.toLowerCase().includes(s) || r.desc.includes(s)) &&
        (only === "" || (only === "top" ? r.top : state.progress[`r:${r.id}`] === only)),
    );
  }, [cat, q, level, lang, only, state.progress]);

  const doneCount = RESOURCES.filter((r) => mark(r.id) === "done").length;

  return (
    <>
      <PageTitle
        title={`مصادر مجانية (${RESOURCES.length})`}
        sub={`رسمية وتعليمية وتدريب عملي ومجتمعات. أنجزت منها ${doneCount}.`}
      />

      <div className="mb-3 flex flex-wrap gap-2">
        <input className="min-w-52 flex-1" placeholder="ابحث في المصادر…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="بحث" />
        <select value={level} onChange={(e) => setLevel(e.target.value)} aria-label="المستوى">
          {["الكل", "مبتدئ", "متوسط", "متقدم"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="اللغة">
          {["الكل", "عربي", "English"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>

      <div className="mb-2 flex flex-wrap gap-2">
        {["الكل", ...RES_CATS].map((c) => (
          <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button className="chip" aria-pressed={only === "top"} onClick={() => setOnly(only === "top" ? "" : "top")}>⭐ الأفضل للبداية</button>
        <button className="chip" aria-pressed={only === "saved"} onClick={() => setOnly(only === "saved" ? "" : "saved")}>🔖 المحفوظة</button>
        <button className="chip" aria-pressed={only === "done"} onClick={() => setOnly(only === "done" ? "" : "done")}>✅ المنجزة</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((r) => {
          const m = mark(r.id);
          return (
            <div key={r.id} className={`card flex flex-col ${m === "done" ? "opacity-70" : ""}`}>
              <div className="mb-1 flex flex-wrap items-center gap-1 text-[11px] text-mu">
                <span className="rounded bg-bg px-2 py-0.5">{r.cat}</span>
                <span className="rounded bg-bg px-2 py-0.5">{r.level}</span>
                <span className="rounded bg-bg px-2 py-0.5">{r.lang === "ar" ? "عربي" : "EN"}</span>
                {r.top && <span title="موصى به">⭐</span>}
              </div>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold">
                {r.title} ↗
              </a>
              <p className="my-1 flex-1 text-sm text-mu">{r.desc}</p>
              <div className="mt-1 flex gap-2">
                <button className="chip" aria-pressed={m === "saved"} onClick={() => setProgress(`r:${r.id}`, m === "saved" ? null : "saved")}>
                  🔖 حفظ
                </button>
                <button className="chip" aria-pressed={m === "done"} onClick={() => setProgress(`r:${r.id}`, m === "done" ? null : "done")}>
                  ✅ أنجزته
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {list.length === 0 && <p className="text-center text-mu">لا نتائج مطابقة.</p>}
      <p className="mt-4 text-xs text-mu">
        روابط الفيديو تفتح بحث يوتيوب لأن القنوات تتغير، اختر الأحدث والأعلى مشاهدة. تحقق دائماً من أن المصدر يتبع منهج v4.0.
      </p>
    </>
  );
}
