"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Stats = {
  students: number;
  complaints: number;
  leaves: number;
};

const SECTIONS = [
  { title: "Students", href: "/dashboard/warden/students", description: "View and manage hostel residents.", icon: "👥" },
  { title: "Rooms", href: "/dashboard/warden/rooms", description: "Room allocation and availability.", icon: "🏠" },
  { title: "Complaints", href: "/dashboard/warden/complaints", description: "Review and resolve student complaints.", icon: "📋" },
  { title: "Leave Requests", href: "/dashboard/warden/leave-requests", description: "Approve or reject leave applications.", icon: "📅" },
  { title: "Announcements", href: "/dashboard/warden/announcements", description: "Post notices for hostel residents.", icon: "📢" },
  { title: "Attendance", href: "/dashboard/warden/attendance", description: "Mark daily attendance for students.", icon: "📝" },
];

export default function WardenDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/warden/stats");
        const d = await (await import('@/lib/safe-json')).safeJson(res);
        setStats(d?.stats ?? null);
      } catch {
        // ignore
      }
    })();
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Warden Dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          Institutional oversight across residents, infrastructure, and administrative requests.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Total Residents</p>
          <p className="mt-3 text-3xl font-bold text-foreground">
            {stats?.students ?? "—"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Pending Grievances</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">
            {stats?.complaints ?? "—"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Leave Authorizations</p>
          <p className="mt-3 text-3xl font-bold text-primary">
            {stats?.leaves ?? "—"}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.98]"
          >
            <div>
              <div className="text-3xl transition-transform group-hover:scale-110 group-hover:rotate-3">{section.icon}</div>
              <h2 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {section.description}
              </p>
            </div>
            <div className="mt-6 flex items-center text-[10px] font-bold uppercase tracking-widest text-primary/0 group-hover:text-primary transition-all">
              Manage Module <span className="ml-2">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
