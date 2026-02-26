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
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
        <p className="mt-1 text-sm text-muted">Latest institutional updates and circulars.</p>
      </div>
      <div className="space-y-6">
        {announcements.length === 0 ? (
          <p className="text-sm text-muted">No institutional announcements found.</p>
        ) : (
          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-xl border border-border bg-surface p-6 shadow-sm group hover:border-primary/30 transition-colors"
              >
                <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {announcement.title}
                </h2>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {announcement.message}
                </p>
                <div className="mt-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted/60">
                  <span>Issued By: {announcement.createdBy.name ?? announcement.createdBy.email}</span>
                  <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
