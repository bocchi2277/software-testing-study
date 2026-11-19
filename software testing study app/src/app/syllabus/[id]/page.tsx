"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { useTimer } from "@/lib/timer";
import { topicStatus } from "@/lib/stats";
import { ALL_TOPICS, CHAPTERS, findTopic } from "@/data/syllabus";
import { RESOURCES } from "@/data/resources";
import { PageTitle } from "@/components/ui";
import { STATUS_LABEL } from "@/lib/status";

export default function TopicPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const topic = findTopic(id);
  const { state, setProgress, saveNote } = useApp();
  const timer = useTimer();
  const note = state.notes.find((n) => n.topic === id);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setText(note?.body ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, note?.id]);

  if (!topic) {
    return (
      <div className="card">
        <p>الموضوع غير موجود.</p>
        <Link href="/syllabus">العودة للمنهج</Link>
      </div>
    );
  }

  const idx = ALL_TOPICS.findIndex((t) => t.id === id);
  const prev = ALL_TOPICS[idx - 1];
  const nxt = ALL_TOPICS[idx + 1];
  const chapter = CHAPTERS.find((c) => c.id === topic.chapter)!;
  const st = topicStatus(state, id);
  const related = RESOURCES.filter((r) => r.ch?.includes(topic.chapter)).slice(0, 5);

  const persist = async () => {
    await saveNote({ id: note?.id, title: `ملاحظات ${topic.id} — ${topic.ar}`, body: text, topic: id });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <>
      <p className="m-0 mb-2 text-sm">
        <Link href="/syllabus">← المنهج</Link> / الفصل {chapter.id}: {chapter.ar}
      </p>
      <PageTitle title={`${topic.id} — ${topic.ar}`}>
        <span className="text-xs text-mu">≈ {topic.minutes} دقيقة</span>
      </PageTitle>

      <div className="card mb-3">
        <div className="mb-2 text-sm font-bold">حالتك في هذا الموضوع</div>
        <div className="flex flex-wrap gap-2">
          {(["", "learning", "done", "review"] as const).map((k) => (
            <button
              key={k}
              className="chip"
              aria-pressed={st === k}
              onClick={() => setProgress(`t:${id}`, k || null)}
            >
              {STATUS_LABEL[k].t}
            </button>
          ))}
          <button
            className="btn btn-sm ms-auto"
            onClick={() => {
              timer.setTopic(id);
              timer.start();
            }}
          >
            🎯 ابدأ جلسة تركيز على هذا الموضوع
          </button>
        </div>
      </div>

      <section className="card mb-3">
        <h2 className="mb-2 mt-0 text-lg font-bold">الملخص</h2>
        <ul className="m-0 ps-5">
          {topic.points.map((p, i) => (
            <li key={i} className="mb-2">{p}</li>
          ))}
        </ul>
      </section>

      <section className="card mb-3">
        <h2 className="mb-2 mt-0 text-lg font-bold">الأهداف التعليمية (Learning objectives)</h2>
        <ul className="m-0 ps-5">
          {topic.objectives.map((o, i) => (
            <li key={i} className="mb-1">{o}</li>
          ))}
        </ul>
        <p className="mb-0 mt-2 text-xs text-mu">K1 تذكّر · K2 فهم · K3 تطبيق. أسئلة K3 غالباً حسابات وتقنيات.</p>
      </section>

      {topic.tip && (
        <div className="mb-3 rounded-xl border border-warn bg-warnb p-3 text-sm">
          <b>⚠️ نقطة امتحان:</b> {topic.tip}
        </div>
      )}

      <section className="card mb-3">
        <h2 className="mb-2 mt-0 text-lg font-bold">اختبر نفسك</h2>
        <div className="flex flex-wrap gap-2">
          <Link className="btn" href={`/practice?ch=${topic.chapter}`}>أسئلة الفصل {topic.chapter}</Link>
          <Link className="btn btn-ghost" href="/cards">بطاقات المصطلحات</Link>
          {topic.chapter === 4 || topic.id === "5.1" ? (
            <Link className="btn btn-ghost" href="/lab">🧪 جرّب المختبر التفاعلي</Link>
          ) : null}
        </div>
      </section>

      <section className="card mb-3">
        <h2 className="mb-2 mt-0 text-lg font-bold">ملاحظاتي على هذا الموضوع</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب بكلماتك: ما الذي فهمته؟ ما الذي ما زال غامضاً؟"
        />
        <div className="mt-2 flex items-center gap-2">
          <button className="btn btn-sm" onClick={persist} disabled={!text.trim() && !note}>حفظ</button>
          {saved && <span className="text-sm text-ok">تم الحفظ ✓</span>}
        </div>
      </section>

      {related.length > 0 && (
        <section className="card mb-3">
          <h2 className="mb-2 mt-0 text-lg font-bold">مصادر مجانية مرتبطة</h2>
          {related.map((r) => (
            <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className="block border-t border-ln py-2 text-tx no-underline first:border-t-0">
              <b className="text-ac">{r.title}</b>
              <div className="text-xs text-mu">{r.desc}</div>
            </a>
          ))}
          <Link href="/resources" className="text-sm">كل المصادر ←</Link>
        </section>
      )}

      <div className="flex justify-between gap-2">
        {prev ? <Link className="btn btn-ghost" href={`/syllabus/${prev.id}`}>→ {prev.id}</Link> : <span />}
        {nxt ? <Link className="btn btn-ghost" href={`/syllabus/${nxt.id}`}>{nxt.id} ←</Link> : <span />}
      </div>
    </>
  );
}
