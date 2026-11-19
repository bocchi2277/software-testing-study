"use client";

import type { ReactNode } from "react";

export function PageTitle({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="m-0 text-2xl font-bold leading-tight">{title}</h1>
        {sub && <p className="m-0 mt-1 text-sm text-mu">{sub}</p>}
      </div>
      {children}
    </header>
  );
}

export function Bar({ pct, color }: { pct: number; color?: string }) {
  return (
    <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
    </div>
  );
}

export function Ring({
  pct,
  size = 120,
  label,
  sub,
}: {
  pct: number;
  size?: number;
  label?: string;
  sub?: string;
}) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.min(100, Math.max(0, pct));
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ln)" strokeWidth={10} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--ac)"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          style={{ transition: "stroke-dashoffset .4s" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <b className="text-2xl leading-none">{label ?? `${Math.round(v)}%`}</b>
        {sub && <span className="mt-1 text-xs text-mu">{sub}</span>}
      </div>
    </div>
  );
}

export function Stat({ value, label, tone }: { value: ReactNode; label: string; tone?: "ok" | "bad" | "ac" }) {
  const color = tone === "ok" ? "text-ok" : tone === "bad" ? "text-bad" : "text-ac";
  return (
    <div className="card text-center">
      <div className={`text-3xl font-bold leading-tight ${color}`}>{value}</div>
      <div className="text-xs text-mu">{label}</div>
    </div>
  );
}

export function Loading() {
  return <p className="py-10 text-center text-mu">جارٍ التحميل…</p>;
}
