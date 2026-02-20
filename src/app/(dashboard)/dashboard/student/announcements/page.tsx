"use client";

import { useEffect, useState } from "react";

type Announcement = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  createdBy: { name: string | null; email: string };
};

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/student/announcements");
      if (!response.ok) {
        setError("Unable to load announcements");
        return;
      }
      const payload = (await response.json()) as { announcements: Announcement[] };
      setAnnouncements(payload.announcements);
    };

    load();
  }, []);

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-black">Announcements</h1>
        <p className="text-sm text-black">Latest hostel updates.</p>
      </div>
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-sm text-black">No announcements yet.</p>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="rounded-xl border border-zinc-200 bg-white p-4"
            >
              <h2 className="text-sm font-semibold text-black">
                {announcement.title}
              </h2>
              <p className="mt-2 text-sm text-black">
                {announcement.message}
              </p>
              <p className="mt-3 text-xs text-black">
                {announcement.createdBy.name ?? announcement.createdBy.email} ·{" "}
                {new Date(announcement.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
