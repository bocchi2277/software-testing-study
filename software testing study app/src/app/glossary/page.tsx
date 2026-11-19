"use client";

import { useMemo, useState } from "react";
import { CARDS } from "@/data/cards";
import { CHAPTERS } from "@/data/syllabus";
import { PageTitle } from "@/components/ui";

export default function GlossaryPage() {
  const [q, setQ] = useState("");
  const [ch, setCh] = useState(0);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return CARDS.filter((c) => (ch === 0 || c.ch === ch) && (!s || c.term.toLowerCase().includes(s) || c.def.includes(s))).sort((a, b) =>
      a.term.localeCompare(b.term),
    );
  }, [q, ch]);

  return (
    <>
      <PageTitle title="قاموس المصطلحات" sub={`${CARDS.length} مصطلحاً. المصدر الرسمي الكامل: glossary.istqb.org`} />
      <div className="mb-3 flex flex-wrap gap-2">
        <input
          className="min-w-52 flex-1"
          placeholder="ابحث بالإنجليزية أو العربية…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="بحث"
        />
        <select value={ch} onChange={(e) => setCh(Number(e.target.value))} aria-label="الفصل">
          <option value={0}>كل الفصول</option>
          {CHAPTERS.map((c) => (
            <option key={c.id} value={c.id}>
              الفصل {c.id}
            </option>
          ))}
        </select>
      </div>
      <div className="card">
        {list.length === 0 && <p className="m-0 text-mu">لا نتائج.</p>}
        {list.map((c) => (
          <div key={c.id} className="border-t border-ln py-2 first:border-t-0">
            <b className="ltr block text-ac">{c.term}</b>
            <span>{c.def}</span>
            <span className="ms-2 text-xs text-mu">(فصل {c.ch})</span>
          </div>
        ))}
      </div>
      <a className="mt-3 inline-block" href="https://glossary.istqb.org" target="_blank" rel="noopener noreferrer">
        القاموس الرسمي الكامل ↗
      </a>
    </>
  );
}
