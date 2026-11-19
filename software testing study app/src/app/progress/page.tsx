"use client";

import { useApp } from "@/lib/store";
import { addDays, fmtMinutes, todayStr } from "@/lib/dates";
import {
  chapterAccuracy,
  chapterProgress,
  masteredCards,
  minutesByDay,
  readiness,
  streak,
  syllabusPct,
  totalAnswered,
  overallAccuracy,
} from "@/lib/stats";
import { ALL_TOPICS, CHAPTERS, chapterLabel } from "@/data/syllabus";
import { CARDS } from "@/data/cards";
import { Bar, PageTitle, Ring, Stat } from "@/components/ui";

export default function ProgressPage() {
  const { state } = useApp();
  const m = minutesByDay(state);
  const acc = chapterAccuracy(state);
  const today = todayStr();
  const totalMin = state.sessions.reduce((a, s) => a + s.minutes, 0);
  const weeks = 12;
  const days = Array.from({ length: weeks * 7 }, (_, i) => addDays(today, i - (weeks * 7 - 1)));
  const maxDay = Math.max(30, ...Object.values(m));
  const best = state.exams.length ? Math.max(...state.exams.map((e) => Math.round((e.score / e.total) * 100))) : 0;
  const topicsDone = ALL_TOPICS.filter((t) => state.progress[`t:${t.id}`] === "done").length;
  const ex = [...state.exams].reverse().slice(-10);

  const badges = [
    { n: "البداية", d: "سجّل أول جلسة دراسة", ok: state.sessions.length > 0, i: "🌱" },
    { n: "أسبوع متواصل", d: "7 أيام متتالية", ok: streak(state) >= 7, i: "🔥" },
    { n: "10 ساعات", d: "أكمل 10 ساعات دراسة", ok: totalMin >= 600, i: "⏳" },
    { n: "50 ساعة", d: "أكمل 50 ساعة دراسة", ok: totalMin >= 3000, i: "🏔️" },
    { n: "قارئ المنهج", d: "أتقن 10 مواضيع", ok: topicsDone >= 10, i: "📚" },
    { n: "ختمة المنهج", d: "أتقن كل المواضيع", ok: topicsDone === ALL_TOPICS.length, i: "🏆" },
    { n: "100 سؤال", d: "أجب عن 100 سؤال", ok: totalAnswered(state) >= 100, i: "💯" },
    { n: "حافظ المصطلحات", d: "أتقن 30 بطاقة", ok: masteredCards(state) >= 30, i: "🃏" },
    { n: "ناجح في المحاكاة", d: "65% أو أكثر في محاكاة", ok: best >= 65, i: "✅" },
    { n: "جاهز للامتحان", d: "90% أو أكثر في محاكاة", ok: best >= 90, i: "🎓" },
  ];

  return (
    <>
      <PageTitle title="التقدم والإنجازات 📈" sub="أرقامك الحقيقية: ما أنجزته وما ينقصك." />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={fmtMinutes(totalMin)} label="إجمالي وقت الدراسة" />
        <Stat value={`🔥 ${streak(state)}`} label="أيام متتالية" />
        <Stat value={totalAnswered(state)} label="سؤالاً أجبت" />
        <Stat value={`${overallAccuracy(state)}%`} label="دقتك العامة" tone={overallAccuracy(state) >= 65 ? "ok" : "bad"} />
      </div>

      <section className="card mb-4 flex flex-wrap items-center gap-5">
        <Ring pct={readiness(state)} size={130} sub="الجاهزية" />
        <div className="min-w-48 flex-1 text-sm">
          <p className="m-0">المنهج: <b>{syllabusPct(state)}%</b> ({topicsDone}/{ALL_TOPICS.length} موضوعاً)</p>
          <p className="m-0">البطاقات المتقنة: <b>{masteredCards(state)}/{CARDS.length}</b></p>
          <p className="m-0">أفضل نتيجة محاكاة: <b>{best}%</b></p>
          <p className="m-0 mt-2 text-xs text-mu">الجاهزية تُحسب من تقدمك في المنهج (35%) ودقتك في الأسئلة (65%) مرجّحة بأوزان الفصول في الامتحان.</p>
        </div>
      </section>

      <section className="card mb-4">
        <h2 className="mb-3 mt-0 text-lg font-bold">نشاطك آخر {weeks} أسبوعاً</h2>
        <div className="overflow-x-auto">
          <div className="grid grid-flow-col gap-1" dir="ltr" style={{ gridTemplateRows: "repeat(7, 14px)", gridAutoColumns: "14px" }}>
            {days.map((d) => {
              const v = m[d] ?? 0;
              const lvl = v === 0 ? 0 : Math.min(4, Math.ceil((v / maxDay) * 4));
              return (
                <div
                  key={d}
                  title={`${d}: ${v} دقيقة`}
                  className="rounded-sm"
                  style={{ background: lvl === 0 ? "var(--ln)" : "var(--ac)", opacity: lvl === 0 ? 0.5 : 0.25 + lvl * 0.19 }}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="card mb-4">
        <h2 className="mb-3 mt-0 text-lg font-bold">الجاهزية حسب الفصل</h2>
        <table className="tbl">
          <thead>
            <tr><th>الفصل</th><th>المنهج</th><th>دقة الأسئلة</th><th>وزنه</th></tr>
          </thead>
          <tbody>
            {CHAPTERS.map((c) => {
              const a = acc[c.id];
              return (
                <tr key={c.id}>
                  <td className="text-start">{chapterLabel(c)}</td>
                  <td>{chapterProgress(state, c.id)}%</td>
                  <td className={a.t ? (a.pct >= 65 ? "text-ok" : "text-bad") : "text-mu"}>{a.t ? `${a.pct}% (${a.c}/${a.t})` : "—"}</td>
                  <td>{c.examQ}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="card mb-4">
        <h2 className="mb-3 mt-0 text-lg font-bold">نتائج محاكاة الامتحان</h2>
        {ex.length === 0 ? (
          <p className="m-0 text-sm text-mu">لا محاكاة بعد. جرّب من صفحة «اختبارات».</p>
        ) : (
          <div className="relative flex h-36 items-end gap-2" dir="ltr">
            <div className="absolute inset-x-0 border-t border-dashed border-warn" style={{ bottom: "65%" }} />
            <span className="absolute right-0 translate-y-1/2 bg-surface px-1 text-[10px] text-warn" style={{ bottom: "65%" }}>65%</span>
            {ex.map((e) => {
              const p = Math.round((e.score / e.total) * 100);
              return (
                <div key={e.id} className="flex flex-1 flex-col items-center justify-end" style={{ height: "100%" }}>
                  <span className="text-[10px] text-mu">{p}%</span>
                  <div className="w-full rounded-t" style={{ height: `${p}%`, background: p >= 65 ? "var(--ok)" : "var(--bad)" }} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="mb-3 mt-0 text-lg font-bold">🏅 الإنجازات ({badges.filter((b) => b.ok).length}/{badges.length})</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {badges.map((b) => (
            <div key={b.n} className={`flex items-center gap-3 rounded-xl border p-3 ${b.ok ? "border-ok bg-okb" : "border-ln opacity-60"}`}>
              <span className="text-2xl">{b.ok ? b.i : "🔒"}</span>
              <div>
                <b>{b.n}</b>
                <div className="text-xs text-mu">{b.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3"><Bar pct={(badges.filter((b) => b.ok).length / badges.length) * 100} /></div>
      </section>
    </>
  );
}
