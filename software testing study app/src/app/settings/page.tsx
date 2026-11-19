"use client";

import { useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { PageTitle } from "@/components/ui";

export default function SettingsPage() {
  const { state, updateProfile, resetAll, clearAttempts, importState } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const p = state.profile;

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qa-path-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (f: File) => {
    try {
      const data: unknown = JSON.parse(await f.text());
      if (!data || typeof data !== "object" || Array.isArray(data) || !("profile" in data)) {
        setMsg("الملف ليس نسخة احتياطية صالحة من هذا التطبيق.");
        return;
      }
      if (!confirm("سيتم استبدال بياناتك الحالية بمحتوى الملف. متأكد؟")) return;
      setMsg((await importState(data)) ? "تم استيراد البيانات بنجاح." : "فشل الاستيراد، تحقق من الاتصال بالخادم.");
    } catch {
      setMsg("تعذّر قراءة الملف: ليس JSON صالحاً.");
    }
  };

  return (
    <>
      <PageTitle title="الإعدادات ⚙️" />

      <section className="card mb-4">
        <h2 className="mb-3 mt-0 text-lg font-bold">المظهر</h2>
        <div className="flex gap-2">
          {([["auto", "تلقائي"], ["light", "فاتح"], ["dark", "داكن"]] as const).map(([k, l]) => (
            <button key={k} className="chip" aria-pressed={p.theme === k} onClick={() => updateProfile({ theme: k })}>
              {l}
            </button>
          ))}
        </div>
      </section>

      <section className="card mb-4">
        <h2 className="mb-3 mt-0 text-lg font-bold">الدراسة</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">موعد الامتحان
            <input type="date" className="mt-1 block w-full" value={p.examDate ?? ""} onChange={(e) => updateProfile({ examDate: e.target.value || null })} />
          </label>
          <label className="text-sm">تاريخ بداية الخطة
            <input type="date" className="mt-1 block w-full" value={p.startDate} onChange={(e) => e.target.value && updateProfile({ startDate: e.target.value })} />
          </label>
          <label className="text-sm">ساعات المذاكرة يومياً
            <input type="number" min={0.5} max={12} step={0.5} className="mt-1 block w-full" value={p.dailyHours} onChange={(e) => e.target.value && updateProfile({ dailyHours: Number(e.target.value) })} />
          </label>
          <label className="text-sm">وقت البدء المعتاد
            <input type="time" className="mt-1 block w-full" value={p.startTime} onChange={(e) => e.target.value && updateProfile({ startTime: e.target.value })} />
          </label>
          <label className="text-sm">مدة التركيز (دقيقة)
            <select className="mt-1 block w-full" value={p.focusMin} onChange={(e) => updateProfile({ focusMin: Number(e.target.value) })}>
              {[15, 25, 30, 45, 50, 60, 90].map((x) => (<option key={x} value={x}>{x}</option>))}
            </select>
          </label>
          <label className="text-sm">مدة الراحة (دقيقة)
            <select className="mt-1 block w-full" value={p.breakMin} onChange={(e) => updateProfile({ breakMin: Number(e.target.value) })}>
              {[3, 5, 10, 15].map((x) => (<option key={x} value={x}>{x}</option>))}
            </select>
          </label>
        </div>
      </section>

      <section className="card">
        <h2 className="mb-3 mt-0 text-lg font-bold">بياناتك</h2>
        <p className="mt-0 text-sm text-mu">بياناتك محفوظة على الخادم وتُربط بهذا المتصفح. احتفظ بنسخة احتياطية دورياً.</p>
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={exportData}>⬇️ تصدير نسخة JSON</button>
          <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>⬆️ استيراد نسخة JSON</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) void importData(f);
            }}
          />
          <button
            className="btn btn-danger"
            onClick={() => confirm("سيتم حذف سجل إجاباتك على الأسئلة. متأكد؟") && clearAttempts()}
          >
            مسح سجل الأسئلة
          </button>
          <button
            className="btn btn-danger"
            onClick={() => confirm("سيتم حذف كل بياناتك (تقدم، جلسات، بطاقات، ملاحظات). لا رجعة فيه. متأكد؟") && void resetAll()}
          >
            حذف كل البيانات
          </button>
        </div>
        {msg && <p className="mb-0 mt-3 text-sm" role="status">{msg}</p>}
      </section>
    </>
  );
}
