"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { ALL_TOPICS } from "@/data/syllabus";
import { PageTitle } from "@/components/ui";

export default function NotesPage() {
  const { state, saveNote, deleteNote } = useApp();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState("");
  const [msg, setMsg] = useState("");

  const list = state.notes.filter((n) => {
    const s = q.trim().toLowerCase();
    return !s || n.title.toLowerCase().includes(s) || n.body.toLowerCase().includes(s);
  });

  const open = (id: number | "new") => {
    setEditing(id);
    setMsg("");
    if (id === "new") {
      setTitle("");
      setBody("");
      setTopic("");
    } else {
      const n = state.notes.find((x) => x.id === id);
      if (n) {
        setTitle(n.title);
        setBody(n.body);
        setTopic(n.topic ?? "");
      }
    }
  };

  const save = async () => {
    const res = await saveNote({
      id: editing === "new" || editing === null ? undefined : editing,
      title: title.trim() || "بدون عنوان",
      body,
      topic: topic || null,
    });
    if (res) {
      setEditing(res.id);
      setMsg("تم الحفظ ✓");
      setTimeout(() => setMsg(""), 1500);
    }
  };

  return (
    <>
      <PageTitle title="ملاحظاتي 🗒️" sub="دوّن المصطلحات الصعبة وأخطاءك ودروسك.">
        <button className="btn" onClick={() => open("new")}>+ ملاحظة جديدة</button>
      </PageTitle>

      {editing !== null && (
        <section className="card mb-4">
          <input className="mb-2 w-full font-bold" placeholder="العنوان" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="العنوان" />
          <select className="mb-2 w-full" value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="الموضوع المرتبط">
            <option value="">غير مرتبطة بموضوع</option>
            {ALL_TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id} — {t.ar}
              </option>
            ))}
          </select>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="اكتب هنا…" style={{ minHeight: 200 }} aria-label="النص" />
          <div className="mt-2 flex items-center gap-2">
            <button className="btn" onClick={save}>حفظ</button>
            <button className="btn btn-ghost" onClick={() => setEditing(null)}>إغلاق</button>
            {editing !== "new" && (
              <button
                className="btn btn-danger ms-auto"
                onClick={() => {
                  if (confirm("حذف هذه الملاحظة؟")) {
                    deleteNote(editing as number);
                    setEditing(null);
                  }
                }}
              >
                حذف
              </button>
            )}
            {msg && <span className="text-sm text-ok">{msg}</span>}
          </div>
        </section>
      )}

      <input className="mb-3 w-full" placeholder="بحث في الملاحظات…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="بحث" />
      {list.length === 0 && <p className="text-center text-mu">لا ملاحظات بعد.</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((n) => (
          <button key={n.id} onClick={() => open(n.id)} className="card cursor-pointer text-start">
            <b className="block">{n.title}</b>
            <span className="line-clamp-3 text-sm text-mu">{n.body || "—"}</span>
            <span className="mt-1 block text-xs text-mu">
              {n.topic ? `الموضوع ${n.topic} · ` : ""}
              {new Date(n.updatedAt).toLocaleDateString("ar")}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
