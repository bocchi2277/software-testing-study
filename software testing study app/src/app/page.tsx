"use client";

import Link from "next/link";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { useTimer } from "@/lib/timer";
import { dayLabel, daysBetween, fmtMinutes, fmtTime, todayStr } from "@/lib/dates";
import {
  dueCards,
  mistakeIds,
  minutesByDay,
  nextTopic,
  readiness,
  streak,
  syllabusPct,
  weakestChapter,
  weekMinutes,
} from "@/lib/stats";
import { ALL_TOPICS, CHAPTERS } from "@/data/syllabus";
import { Bar, PageTitle, Ring, Stat } from "@/components/ui";

const TIPS = [
  "راجع مصطلحات الـ Glossary 10 دقائق يومياً: أسئلة كثيرة تُحسم بالتعريف الدقيق.",
  "لا تحفظ فقط، اشرح المبدأ بصوت عالٍ كأنك تعلّمه لزميل (طريقة فاينمان).",
  "أسئلة K3 (الحسابات) هي أسهل نقاط تُكسب إن تدربت عليها. حلّ 3 منها يومياً.",
  "المراجعة المتباعدة أقوى من القراءة المتكررة: استخدم البطاقات يومياً.",
  "بعد كل سؤال خاطئ، اكتب لماذا أخطأت: معلومة ناقصة أم قراءة متسرعة؟",
  "جرّب تطبيق ما تعلمته على موقع حقيقي: اكتب حالات اختبار لصفحة تسجيل الدخول.",
  "النوم الجيد قبل الامتحان أهم من ساعة مراجعة إضافية.",
  "ابدأ الجلسة بأصعب موضوع عندما يكون تركيزك في أعلى مستوى.",
  "اقرأ المنهج الرسمي مرة كاملة: الامتحان مبني عليه حرفياً.",
  "كل 25 دقيقة تركيز تتبعها 5 دقائق راحة بلا هاتف.",
];

export default function Dashboard() {
  const app = useApp();
  const { state, updateProfile, addSession, toggleTask, addTask } = app;
  const t = useTimer();
  const today = todayStr();
  const [manual, setManual] = useState(30);
  const [newTask, setNewTask] = useState("");

  const minsToday = minutesByDay(state)[today] ?? 0;
  const goal = Math.round(state.profile.dailyHours * 60);
  const daysLeft = state.profile.examDate ? daysBetween(today, state.profile.examDate) : null;
  const week = weekMinutes(state);
  const maxW = Math.max(60, ...week.map((w) => w.min));
  const next = nextTopic(state);
  const due = dueCards(state).length;
  const mistakes = mistakeIds(state).length;
  const weak = weakestChapter(state);
  const todayTasks = state.tasks.filter((x) => x.day === today);
  const tip = TIPS[Math.floor(new Date().getTime() / 864e5) % TIPS.length];
  const weekTotal = week.reduce((a, b) => a + b.min, 0);

  return (
    <>
      <PageTitle title="مرحباً بك في مسارك نحو ISTQB 👋" sub="خطوة صغيرة كل يوم، والشهادة في النهاية." />

      <div className="card mb-3 border-ac">
        <b className="text-sm">💡 نصيحة اليوم</b>
        <p className="m-0">{tip}</p>
      </div>

      <div className="mb-3 grid gap-3 sm:grid-cols-3">
        <div className="card flex items-center justify-between gap-3 sm:col-span-1">
          <div>
            <div className="text-4xl font-bold text-ac">{daysLeft === null ? "—" : Math.max(daysLeft, 0)}</div>
            <div className="text-xs text-mu">{daysLeft !== null && daysLeft < 0 ? "انتهى الموعد" : "يوم حتى الامتحان"}</div>
          </div>
          <label className="text-xs text-mu">
            موعد الامتحان
            <input
              type="date"
              className="mt-1 block w-full"
              value={state.profile.examDate ?? ""}
              onChange={(e) => updateProfile({ examDate: e.target.value || null })}
            />
          </label>
        </div>
        <div className="card flex items-center gap-4 sm:col-span-2">
          <Ring pct={readiness(state)} label={`${readiness(state)}%`} sub="الجاهزية" size={110} />
          <div className="flex-1">
            <div className="mb-1 flex justify-between text-sm">
              <b>تقدم المنهج</b>
              <span>{syllabusPct(state)}%</span>
            </div>
            <Bar pct={syllabusPct(state)} />
            <div className="mb-1 mt-3 flex justify-between text-sm">
              <b>هدف اليوم</b>
              <span>
                {fmtMinutes(minsToday)} / {fmtMinutes(goal)}
              </span>
            </div>
            <Bar pct={(minsToday / goal) * 100} color="var(--ac)" />
          </div>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-3">
        <Stat value={`🔥 ${streak(state)}`} label="أيام متتالية" />
        <Stat value={fmtMinutes(weekTotal)} label="هذا الأسبوع" />
        <Stat value={state.exams.length} label="محاكاة امتحان" />
      </div>

      <section className="card mb-3">
        <h2 className="mb-2 mt-0 text-lg font-bold">🎯 خطتك الذكية اليوم</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {next && (
            <Link href={`/syllabus/${next.id}`} className="rounded-lg border border-ln p-3 text-tx no-underline hover:border-ac">
              <div className="text-xs text-mu">1) تعلّم موضوعاً</div>
              <b>
                {next.id} — {next.ar}
              </b>
              <div className="text-xs text-mu">≈ {next.minutes} دقيقة</div>
            </Link>
          )}
          <Link href="/cards" className="rounded-lg border border-ln p-3 text-tx no-underline hover:border-ac">
            <div className="text-xs text-mu">2) راجع البطاقات</div>
            <b>{due ? `${due} بطاقة مستحقة` : "لا بطاقات مستحقة 🎉"}</b>
            <div className="text-xs text-mu">مراجعة متباعدة (Leitner)</div>
          </Link>
          <Link href={`/practice?ch=${weak}`} className="rounded-lg border border-ln p-3 text-tx no-underline hover:border-ac">
            <div className="text-xs text-mu">3) تدرب على نقطة ضعفك</div>
            <b>الفصل {weak}: {CHAPTERS.find((c) => c.id === weak)?.ar}</b>
            <div className="text-xs text-mu">10 أسئلة</div>
          </Link>
          <Link href="/practice?mode=mistakes" className="rounded-lg border border-ln p-3 text-tx no-underline hover:border-ac">
            <div className="text-xs text-mu">4) راجع أخطاءك</div>
            <b>{mistakes ? `${mistakes} سؤال أخطأت فيه` : "لا أخطاء مسجلة"}</b>
          </Link>
        </div>
      </section>

      <section className="card mb-3 text-center">
        <div className="text-sm text-mu">{t.mode === "focus" ? "🎯 جلسة تركيز (Pomodoro)" : "☕ وقت راحة"}</div>
        <div className="ltr my-1 text-center text-6xl font-bold tabular-nums" aria-live="off">
          {fmtTime(t.left)}
        </div>
        {t.mode === "focus" && (
          <select
            value={t.topic}
            onChange={(e) => t.setTopic(e.target.value)}
            className="mb-3 max-w-full"
            aria-label="الموضوع الذي تدرسه"
          >
            <option value="">بدون موضوع محدد</option>
            {ALL_TOPICS.map((x) => (
              <option key={x.id} value={x.id}>
                {x.id} — {x.ar}
              </option>
            ))}
          </select>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          <button className="btn" onClick={t.running ? t.pause : t.start}>
            {t.running ? "إيقاف مؤقت" : "ابدأ"}
          </button>
          <button className="btn btn-ghost" onClick={t.reset}>إعادة</button>
          <button className="btn btn-ghost" onClick={t.skip}>
            {t.mode === "focus" ? "تخطي للراحة" : "تخطي للتركيز"}
          </button>
        </div>
        <p className="mb-0 mt-3 text-xs text-mu">
          جلسات مكتملة اليوم عبر المؤقت: {t.completedToday}. تُسجَّل الدقائق تلقائياً عند اكتمال جلسة التركيز ({state.profile.focusMin} د).
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 border-t border-ln pt-3 text-sm">
          <span className="text-mu">درست خارج التطبيق؟ سجّل</span>
          <input
            type="number"
            min={5}
            max={300}
            step={5}
            value={manual}
            onChange={(e) => setManual(Number(e.target.value))}
            className="w-20"
            aria-label="دقائق"
          />
          <span className="text-mu">دقيقة</span>
          <button className="btn btn-sm" onClick={() => manual > 0 && addSession(manual, "manual")}>
            تسجيل
          </button>
        </div>
      </section>

      <section className="card mb-3">
        <h2 className="mb-3 mt-0 text-lg font-bold">آخر 7 أيام</h2>
        <div className="flex h-32 items-end gap-2" dir="ltr">
          {week.map((w) => (
            <div key={w.day} className="flex flex-1 flex-col items-center justify-end gap-1" style={{ height: "100%" }}>
              <span className="text-[10px] text-mu">{w.min || ""}</span>
              <div
                className="w-full rounded-t bg-ac"
                style={{ height: `${(w.min / maxW) * 80}%`, minHeight: w.min ? 4 : 2, opacity: w.min ? 1 : 0.2 }}
                title={`${w.min} دقيقة`}
              />
              <span className="text-[11px] text-mu">{dayLabel(w.day)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="mb-2 mt-0 text-lg font-bold">✅ مهام اليوم</h2>
        {todayTasks.length === 0 && <p className="m-0 text-sm text-mu">لا مهام بعد. أضف مهمة صغيرة قابلة للإنجاز.</p>}
        {todayTasks.map((k) => (
          <label key={k.id} className="flex items-center gap-2 border-t border-ln py-2 first:border-t-0">
            <input type="checkbox" checked={k.done} onChange={() => toggleTask(k.id)} />
            <span className={k.done ? "text-mu line-through" : ""}>{k.title}</span>
          </label>
        ))}
        <form
          className="mt-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (newTask.trim()) {
              void addTask(newTask.trim(), today);
              setNewTask("");
            }
          }}
        >
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="مثال: اكتب 5 حالات اختبار لصفحة التسجيل"
            className="flex-1"
            aria-label="مهمة جديدة"
          />
          <button className="btn" type="submit">إضافة</button>
        </form>
      </section>
    </>
  );
}
