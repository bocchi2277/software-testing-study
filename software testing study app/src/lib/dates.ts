const pad = (n: number) => String(n).padStart(2, "0");

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parse(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function addDays(s: string, n: number): string {
  const d = parse(s);
  d.setUTCDate(d.getUTCDate() + n);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export function daysBetween(a: string, b: string): number {
  return Math.round((parse(b).getTime() - parse(a).getTime()) / 864e5);
}

export function lastNDays(n: number): string[] {
  const t = todayStr();
  return Array.from({ length: n }, (_, i) => addDays(t, i - (n - 1)));
}

export function dayLabel(s: string): string {
  return new Intl.DateTimeFormat("ar", { weekday: "short", timeZone: "UTC" }).format(parse(s));
}

export function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  return `${pad(m)}:${pad(sec % 60)}`;
}

export function fmtMinutes(min: number): string {
  if (min < 60) return `${min} د`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} س ${m} د` : `${h} س`;
}
