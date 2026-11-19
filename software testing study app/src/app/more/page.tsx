"use client";

import Link from "next/link";
import { NAV } from "@/components/Shell";
import { PageTitle } from "@/components/ui";

export default function MorePage() {
  return (
    <>
      <PageTitle title="كل الأقسام" />
      <div className="grid grid-cols-2 gap-3">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="card flex items-center gap-3 text-tx no-underline hover:border-ac">
            <span className="text-2xl">{n.icon}</span>
            <b>{n.label}</b>
          </Link>
        ))}
      </div>
    </>
  );
}
