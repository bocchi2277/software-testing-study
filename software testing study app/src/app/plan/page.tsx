"use client";

import Link from "next/link";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { addDays, daysBetween, fmtMinutes, todayStr } from "@/lib/dates";
import { topicStatus } from "@/lib/stats";
import { WEEKS } from "@/data/career";
import { findTopic } from "@/data/syllabus";
import { PageTitle } from "@/components/ui";

const PARTS: { t: string; p: number; href: string }[] = [
  { t: "📖 قراءة موضوع جديد من المنهج", p: 0.45, href: "/syllabus" },
  { t: "📝 أسئلة تطبيقية", p: 0.25, href: "/practice" },
  { t: "🃏 مراجعة البطاقات والمصطلحات", p: 0.15, href: "/cards" },
  { t: "✍️ تلخيص وملاحظات", p: 0.15, href: "/notes" },
];

const fmt = (x: number) => `${String(Math.floor(x / 60) % 24).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`;

export default function PlanPage() {
  const { state, updateProfile, setProgress, addTask, toggleTask, deleteTask, deleteSession } = useApp();
  const today = todayStr();
  const [title, setTitle] = useState("");
  const [day, setDay] = useState(today);

  const total = Math.round(state.profile.dailyHours * 60);
  const [h, m] = state.profile.startTime.split(":").map(Number);
  let cur = h * 60 + m;
  const blocks = PARTS.map((p, i) => {
    const mins = Math.round((total * p.p) / 5) * 5;
    const s = cur;
    cur += mins;
    return { ...p, i, mins, s, e: cur, done: state.progress[`blk:${today}:${i}`] === "1" };
  });
  const doneMin = blocks.filter((b) => b.done).reduce((a, b) => a + b.mins, 0);

  const week = Math.floor(daysBetween(state.profile.startDate, today) / 7) + 1;
  const daysLeft = state.profile.examDate ? daysBetween(today, state.profile.examDate) : null;

  const tasks = state.tasks;
  const pending = tasks.filter((t) => !t.done && t.day <= today);
  const upcoming = tasks.filter((t) => t.day > today);
  const doneT = tasks.filter((t) => t.done && t.day <= today).slice(-5);
  const recent = state.sessions.slice(0, 8);

  return (
    <>
      <PageTitle title="الخطة والجدول" sub="جدول يومي ذكي، خطة 8 أسابيع، ومهامك." />

      {daysLeft !== null && (
        <div className={`mb-3 rounded-xl border p-3 text-sm ${daysLeft < 56 ? "border-warn bg-warnb" : "border-ok bg-okb"}`}>
          {daysLeft < 0
            ? "موعد الامتحان مضى. حدّث الموعد من الرئيسية."
            : daysLeft >= 56
              ? `متبقي ${daysLeft} يوماً: وقتك مريح. التزم بساعتين يومياً وستنهي الخطة مبكراً.`
              : `متبقي ${daysLeft} يوماً فقط (أقل من 8 أسابيع): ارفع ساعات المذاكرة اليومية إلى ${Math.min(4, Math.ceil((56 / Math.max(daysLeft, 7)) * state.profile.dailyHours * 2) / 2)} ساعة تقريباً.`}
        </div>
      )}

      <section className="card mb-4">
        <h2 className="mb-3 mt-0 text-lg font-bold">🗓️ جدول اليوم</h2>
        <div className="mb-3 flex flex-wrap gap-3">
          <label className="text-sm">
            ساعات المذاكرة
            <select
              className="ms-2"
              value={state.profile.dailyHours}
              onChange={(e) => updateProfile({ dailyHours: Number(e.target.value) })}
            >
              {[0.5, 1, 1.5, 2, 3, 4, 5].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            وقت البدء
            <input className="ms-2" type="time" value={state.profile.startTime} onChange={(e) => updateProfile({ startTime: e.target.value })} />
          </label>
        </div>
        {blocks.map((b) => (
          <div key={b.i} className="flex items-center gap-3 border-t border-ln py-2">
            <input
              type="checkbox"
              checked={b.done}
              onChange={() => setProgress(`blk:${today}:${b.i}`, b.done ? null : "1")}
              aria-label={`تم: ${b.t}`}
            />
            <b className="ltr min-w-28 text-sm">
              {fmt(b.s)}–{fmt(b.e)}
            </b>
            <Link href={b.href} className={`flex-1 text-tx no-underline ${b.done ? "text-mu line-through" : ""}`}>
              {b.t}
            </Link>
            <span className="text-xs text-mu">{b.mins} د</span>
          </div>
        ))}
        <p className="mb-0 mt-2 text-sm text-mu">
          أنجزت {fmtMinutes(doneMin)} من {fmtMinutes(total)}. استخدم Pomodoro: 25 دقيقة تركيز + 5 راحة. الأفضل أن تجعل الوقت ثابتاً كل يوم لتتكون العادة.
        </p>
      </section>

      <section className="card mb-4">
        <h2 className="mb-1 mt-0 text-lg font-bold">🧭 خطة 8 أسابيع</h2>
        <p className="mt-0 text-sm text-mu">
          تبدأ الخطة من {state.profile.startDate} {week >= 1 && week <= 8 ? `— أنت الآن في الأسبوع ${week}` : week > 8 ? "— تجاوزت 8 أسابيع، راجع وحاكِ الامتحان" : "— لم تبدأ بعد"}.
          يمكن تغيير تاريخ البداية من{" "}
          <Link href="/settings">الإعدادات</Link>.
        </p>
        {WEEKS.map((w) => {
          const ts = w.topics.map((id) => ({ id, t: findTopic(id), st: topicStatus(state, id) }));
          const dn = ts.filter((x) => x.st === "done").length;
          const isNow = week === w.n;
          return (
            <div key={w.n} className={`mb-2 rounded-xl border p-3 ${isNow ? "border-ac bg-bg" : "border-ln"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b>
                  الأسبوع {w.n}: {w.title}
                </b>
                <span className="text-xs text-mu">
                  {addDays(state.profile.startDate, (w.n - 1) * 7)} {ts.length ? `· ${dn}/${ts.length}` : ""}
                </span>
              </div>
              {ts.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ts.map((x) => (
                    <Link
                      key={x.id}
                      href={`/syllabus/${x.id}`}
                      className={`ltr rounded-md border px-2 py-0.5 text-xs no-underline ${
                        x.st === "done" ? "border-ok bg-okb text-ok" : x.st === "learning" ? "border-warn bg-warnb text-warn" : "border-ln text-mu"
                      }`}
                      title={x.t?.ar}
                    >
                      {x.id}
                    </Link>
                  ))}
                </div>
              )}
              <div className="mt-2 text-sm">🎯 {w.goal}</div>
            </div>
          );
        })}
      </section>

      <section className="card mb-4">
        <h2 className="mb-3 mt-0 text-lg font-bold">✅ المهام</h2>
        <form
          className="mb-3 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (title.trim()) {
              void addTask(title.trim(), day);
              setTitle("");
            }
          }}
        >
          <input className="min-w-48 flex-1" placeholder="مهمة جديدة…" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="مهمة" />
          <input type="date" value={day} onChange={(e) => setDay(e.target.value)} aria-label="التاريخ" />
          <button className="btn" type="submit">إضافة</button>
        </form>
        {[
          ["مستحقة / اليوم", pending],
          ["قادمة", upcoming],
          ["أُنجزت مؤخراً", doneT],
        ].map(([label, items]) => {
          const list = items as typeof tasks;
          if (!list.length) return null;
          return (
            <div key={label as string} className="mb-2">
              <div className="text-xs font-bold text-mu">{label as string}</div>
              {list.map((k) => (
                <div key={k.id} className="flex items-center gap-2 border-t border-ln py-1.5">
                  <input type="checkbox" checked={k.done} onChange={() => toggleTask(k.id)} aria-label={k.title} />
                  <span className={`flex-1 ${k.done ? "text-mu line-through" : ""}`}>{k.title}</span>
                  <span className="ltr text-xs text-mu">{k.day}</span>
                  <button className="cursor-pointer border-0 bg-transparent text-bad" onClick={() => deleteTask(k.id)} aria-label="حذف">✕</button>
                </div>
              ))}
            </div>
          );
        })}
        {tasks.length === 0 && <p className="m-0 text-sm text-mu">لا مهام. أضف أول مهمة.</p>}
      </section>

      <section className="card">
        <h2 className="mb-2 mt-0 text-lg font-bold">🕒 آخر جلسات الدراسة</h2>
        {recent.length === 0 && <p className="m-0 text-sm text-mu">لم تسجّل جلسات بعد.</p>}
        {recent.map((s) => (
          <div key={s.id} className="flex items-center gap-2 border-t border-ln py-1.5 text-sm first:border-t-0">
            <span className="ltr text-xs text-mu">{s.day}</span>
            <span className="flex-1">
              {s.kind === "manual" ? "تسجيل يدوي" : "جلسة تركيز"} {s.topic ? `· ${s.topic}` : ""}
            </span>
            <b>{s.minutes} د</b>
            <button className="cursor-pointer border-0 bg-transparent text-bad" onClick={() => deleteSession(s.id)} aria-label="حذف الجلسة">✕</button>
          </div>
        ))}
      </section>
    </>
  );
}
