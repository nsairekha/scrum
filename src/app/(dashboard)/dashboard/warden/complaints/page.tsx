"use client";

import { useEffect, useState } from "react";

type Complaint = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  student: {
    rollNo: string;
    user: { name: string | null; email: string };
    room: { roomNumber: string } | null;
  };
};

const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-amber-50 text-amber-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  RESOLVED: "bg-green-50 text-green-700",
  CLOSED: "bg-zinc-100 text-black",
};

export default function WardenComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadComplaints = async () => {
    try {
      const res = await fetch("/api/warden/complaints");
      if (!res.ok) throw new Error("Failed to load complaints");
      const { safeJson } = await import("@/lib/safe-json");
      const data = await safeJson(res);
      setComplaints(data?.complaints || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/warden/complaints", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      await loadComplaints();
    } catch {
      setError("Failed to update complaint status");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Grievances</h1>
        <p className="mt-1 text-sm text-muted">
          Institutional review and resolution system for resident concerns.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Syncing grievance records...</p>
      ) : error ? (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      ) : complaints.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-sm text-muted">No active residential grievances found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="rounded-xl border border-border bg-surface p-6 shadow-sm group hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {complaint.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    {complaint.description}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-muted/60">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                      {complaint.student.user.name ?? complaint.student.user.email}
                    </span>
                    <span>•</span>
                    <span>Roll: {complaint.student.rollNo}</span>
                    {complaint.student.room && (
                      <>
                        <span>•</span>
                        <span>Unit {complaint.student.room.roomNumber}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>Logged {new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      complaint.status === 'RESOLVED' ? 'bg-primary/10 text-primary' :
                      complaint.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-700' :
                      complaint.status === 'OPEN' ? 'bg-amber-500/10 text-amber-700' :
                      'bg-muted/10 text-muted'
                    }`}
                  >
                    {complaint.status.replaceAll("_", " ")}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {complaint.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleStatusChange(complaint.id, 'RESOLVED')}
                        className="btn-bespoke px-3 py-1.5 text-[10px] font-bold uppercase"
                      >
                        Resolve
                      </button>
                    )}
                    <select
                      value={complaint.status}
                      onChange={(e) =>
                        handleStatusChange(complaint.id, e.target.value)
                      }
                      disabled={updating === complaint.id}
                      className="input-bespoke h-8 min-w-[120px] px-2 py-0 text-[10px] font-bold uppercase tracking-wider"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
