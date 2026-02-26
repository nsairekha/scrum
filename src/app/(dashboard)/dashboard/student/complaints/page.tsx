"use client";

import { useEffect, useState } from "react";

type Complaint = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
};

export default function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComplaints = async () => {
    const response = await fetch("/api/student/complaints");
    if (!response.ok) {
      setError("Unable to load complaints");
      return;
    }
    const payload = (await response.json()) as { complaints: Complaint[] };
    setComplaints(payload.complaints);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/student/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Unable to submit complaint");
      setIsSubmitting(false);
      return;
    }

    setTitle("");
    setDescription("");
    await loadComplaints();
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Complaints</h1>
        <p className="mt-1 text-sm text-muted">
          Formal institutional grievance submission and tracking system.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-border bg-surface p-6 shadow-sm"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/70" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="input-bespoke"
            placeholder="e.g. Water leakage in block B"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/70" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            rows={4}
            className="input-bespoke min-h-[120px] resize-none"
            placeholder="Provide comprehensive details about the grievance..."
          />
        </div>
        {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-bespoke px-8 py-3 text-sm font-semibold shadow-sm active:translate-y-0.5"
        >
          {isSubmitting ? "Processing..." : "Submit Grievance"}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Recent Submissions</h2>
        {complaints.length === 0 ? (
          <p className="text-sm text-muted">No formal grievances have been logged yet.</p>
        ) : (
          <div className="space-y-3">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="rounded-xl border border-border bg-surface p-6 shadow-sm group hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">
                    {complaint.title}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-2 py-1 bg-primary/5 rounded">
                    {complaint.status.replaceAll("_", " ")}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {complaint.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted/60">
                  <span>Logged ID: {complaint.id.slice(0, 8)}</span>
                  <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
