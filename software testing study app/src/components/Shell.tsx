"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { StoreProvider, useApp } from "@/lib/store";
import { TimerProvider, useTimer } from "@/lib/timer";
import { fmtTime } from "@/lib/dates";

export const NAV: { href: string; label: string; icon: string }[] = [
  { href: "/", label: "الرئيسية", icon: "🏠" },
  { href: "/syllabus", label: "المنهج", icon: "📚" },
  { href: "/plan", label: "الخطة والجدول", icon: "🗓️" },
  { href: "/practice", label: "اختبارات", icon: "📝" },
  { href: "/cards", label: "البطاقات", icon: "🃏" },
  { href: "/resources", label: "المصادر", icon: "🔗" },
  { href: "/lab", label: "المختبر التفاعلي", icon: "🧪" },
  { href: "/skills", label: "المهارات العملية", icon: "🛠️" },
  { href: "/certificate", label: "شهادة ISTQB", icon: "🎓" },
  { href: "/career", label: "المسار المهني", icon: "🚀" },
  { href: "/glossary", label: "القاموس", icon: "📖" },
  { href: "/notes", label: "ملاحظاتي", icon: "🗒️" },
  { href: "/progress", label: "التقدم والإنجازات", icon: "📈" },
  { href: "/settings", label: "الإعدادات", icon: "⚙️" },
];

const MOBILE = ["/", "/syllabus", "/practice", "/cards"];

function active(path: string, href: string) {
  return href === "/" ? path === "/" : path.startsWith(href);
}

function TimerPill() {
  const t = useTimer();
  const path = usePathname();
  if (!t.running || path === "/") return null;
  return (
    <Link
      href="/"
      className="fixed bottom-20 left-3 z-30 rounded-full bg-ac px-4 py-2 text-sm font-bold text-acfg no-underline shadow-lg lg:bottom-5"
      aria-label="المؤقت يعمل"
    >
      <span className="ltr inline-block">{t.mode === "focus" ? "🎯" : "☕"} {fmtTime(t.left)}</span>
    </Link>
  );
}

function Inner({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { error, ready } = useApp();
  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-60 shrink-0 bg-sidebar p-4 text-white lg:block">
        <div className="sticky top-4">
          <Link href="/" className="mb-5 block text-white no-underline">
            <div className="text-xl font-bold">🧭 مسار QA</div>
            <div className="text-xs opacity-70">الطريق إلى ISTQB وما بعده</div>
          </Link>
          <nav className="flex flex-col gap-1" aria-label="التنقل الرئيسي">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active(path, n.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm text-white no-underline ${
                  active(path, n.href) ? "bg-white/20 font-bold" : "opacity-80 hover:bg-white/10"
                }`}
              >
                <span className="ms-0 me-2">{n.icon}</span>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-28 pt-5 lg:pb-10">
        {error && (
          <div className="mb-3 rounded-lg border border-bad bg-badb p-3 text-sm text-bad" role="alert">
            تعذّر الاتصال بالخادم. قد لا تُحفظ تغييراتك. حدّث الصفحة وحاول مجدداً.
          </div>
        )}
        {!ready ? <p className="py-20 text-center text-mu">جارٍ تحميل بياناتك…</p> : children}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-20 flex border-t border-ln bg-surface lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="التنقل"
      >
        {NAV.filter((n) => MOBILE.includes(n.href)).map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active(path, n.href) ? "page" : undefined}
            className={`flex flex-1 flex-col items-center py-2 text-xs no-underline ${
              active(path, n.href) ? "font-bold text-ac" : "text-mu"
            }`}
          >
            <span className="text-lg leading-none">{n.icon}</span>
            {n.label}
          </Link>
        ))}
        <Link
          href="/more"
          className={`flex flex-1 flex-col items-center py-2 text-xs no-underline ${
            path === "/more" ? "font-bold text-ac" : "text-mu"
          }`}
        >
          <span className="text-lg leading-none">☰</span>
          المزيد
        </Link>
      </nav>
      <TimerPill />
    </div>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <TimerProvider>
        <Inner>{children}</Inner>
      </TimerProvider>
    </StoreProvider>
  );
}
