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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-black">Warden Dashboard</h1>
        <p className="text-sm text-black">
          Manage students, rooms, complaints, and leave requests.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-black">Total Students</p>
          <p className="mt-2 text-3xl font-bold text-black">
            {stats?.students ?? "—"}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-black">Open Complaints</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {stats?.complaints ?? "—"}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-black">Leave Requests</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {stats?.leaves ?? "—"}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="group rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <div className="text-2xl">{section.icon}</div>
            <h2 className="mt-3 text-lg font-semibold text-black group-hover:text-black">
              {section.title}
            </h2>
            <p className="mt-1 text-sm text-black">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
