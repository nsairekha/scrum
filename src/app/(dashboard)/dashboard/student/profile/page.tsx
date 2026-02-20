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
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-black">My Profile</h1>
        <p className="text-sm text-black">Basic student information.</p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-black">Name</dt>
            <dd className="text-sm font-medium text-black">
              {data.student.user.name ?? "Not set"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-black">Email</dt>
            <dd className="text-sm font-medium text-black">
              {data.student.user.email}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-black">Roll No</dt>
            <dd className="text-sm font-medium text-black">
              {data.student.rollNo}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-black">Parent Contact</dt>
            <dd className="text-sm font-medium text-black">
              {data.student.parentContact}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
