"use client";

import { useEffect, useState } from "react";

type Announcement = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  createdBy: { name: string | null; email: string };
};

export default function WardenAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const loadAnnouncements = async () => {
    try {
      const res = await fetch("/api/warden/announcements");
      if (!res.ok) throw new Error("Failed to load announcements");
      const data = await (await import('@/lib/safe-json')).safeJson(res);
      setAnnouncements(data?.announcements || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/warden/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), message: message.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to create announcement");
      }

      setTitle("");
      setMessage("");
      setSubmitSuccess("Announcement posted successfully!");
      await loadAnnouncements();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Institutional Announcements</h1>
        <p className="mt-1 text-sm text-muted">
          Broadcast institutional circulars and monitor residential communications.
        </p>
      </div>

      {/* Create Announcement Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-border bg-surface p-6 shadow-sm"
      >
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Broadcast New Circular</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/70" htmlFor="ann-title">
              Broadcast Title
            </label>
            <input
              id="ann-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-bespoke"
              placeholder="e.g. Annual Maintenance Schedule"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/70" htmlFor="ann-message">
              Broadcast Content
            </label>
            <textarea
              id="ann-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="input-bespoke min-h-[120px] resize-none"
              placeholder="Provide specific details for the announcement..."
            />
          </div>
        </div>
        {submitError && <p className="text-sm text-red-600 font-medium">{submitError}</p>}
        {submitSuccess && <p className="text-sm text-primary font-medium">{submitSuccess}</p>}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-bespoke px-8 py-3 text-sm font-semibold shadow-sm active:translate-y-0.5"
          >
            {isSubmitting ? "Broadcasting..." : "Broadcast Circular"}
          </button>
        </div>
      </form>

      {/* Announcements List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Communication Log</h2>
        {loading ? (
          <p className="text-sm text-muted">Syncing broadcast logs...</p>
        ) : error ? (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        ) : announcements.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-12 text-center">
            <p className="text-sm text-muted">No historical broadcasts found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="rounded-xl border border-border bg-surface p-6 shadow-sm group hover:border-primary/30 transition-colors"
              >
                <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{ann.title}</h2>
                <p className="mt-3 text-sm text-muted leading-relaxed">{ann.message}</p>
                <div className="mt-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted/60">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                    Issued By: {ann.createdBy.name ?? ann.createdBy.email}
                  </span>
                  <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
