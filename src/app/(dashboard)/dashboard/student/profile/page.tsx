"use client";

import { useEffect, useState } from "react";

type ProfileResponse = {
  student: {
    id: string;
    rollNo: string;
    parentContact: string;
    user: { id: string; email: string; name: string | null };
  };
};

export default function StudentProfilePage() {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/student/profile");
      if (!response.ok) {
        setError("Unable to load profile");
        return;
      }
      const { safeJson } = await import("@/lib/safe-json");
      const payload = (await safeJson(response)) as ProfileResponse | null;
      if (!payload) {
        setError("Unable to parse profile");
        return;
      }
      setData(payload);
    };

    load();
  }, []);

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!data) {
    return <p className="text-sm text-black">Loading profile...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-sm text-muted">Core institutional identity and contact records.</p>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-muted">Legal Name</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {data.student.user.name ?? "Not registered"}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-muted">Email Address</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {data.student.user.email}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-muted">Roll Number</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {data.student.rollNo}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-muted">Parental Contact</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {data.student.parentContact}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
