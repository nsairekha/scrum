"use client";

import { useEffect, useState } from "react";

type LeaveRequest = {
  id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  createdAt: string;
  student: {
    rollNo: string;
    user: { name: string | null; email: string };
    room: { roomNumber: string } | null;
  };
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  CANCELLED: "bg-zinc-100 text-black",
};

export default function WardenLeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadRequests = async () => {
    try {
      const res = await fetch("/api/warden/leave-requests");
      if (!res.ok) throw new Error("Failed to load leave requests");
      const data = await res.json();
      setRequests(data.leaveRequests);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    setUpdating(id);
    try {
      const res = await fetch("/api/warden/leave-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      await loadRequests();
    } catch {
      setError("Failed to update leave request");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Absence Authorizations</h1>
        <p className="mt-1 text-sm text-muted">
          Institutional review and oversight for residential absence requests.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Syncing authorization records...</p>
      ) : error ? (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-sm text-muted">No pending absence authorizations found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border border-border bg-surface p-6 shadow-sm group hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-foreground">
                      {new Date(request.fromDate).toLocaleDateString()} — {new Date(request.toDate).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        request.status === 'APPROVED' ? 'bg-primary/10 text-primary' :
                        request.status === 'REJECTED' ? 'bg-red-500/10 text-red-700' :
                        request.status === 'PENDING' ? 'bg-amber-500/10 text-amber-700' :
                        'bg-muted/10 text-muted'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted leading-relaxed">{request.reason}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-muted/60">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                      {request.student.user.name ?? request.student.user.email}
                    </span>
                    <span>•</span>
                    <span>Roll Identifier: {request.student.rollNo}</span>
                    {request.student.room && (
                      <>
                        <span>•</span>
                        <span>Unit {request.student.room.roomNumber}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>Applied {new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {request.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(request.id, "APPROVED")}
                      disabled={updating === request.id}
                      className="btn-bespoke px-4 py-2 text-[10px] font-bold uppercase tracking-widest shadow-sm active:translate-y-0.5"
                    >
                      Authorize
                    </button>
                    <button
                      onClick={() => handleAction(request.id, "REJECTED")}
                      disabled={updating === request.id}
                      className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors active:translate-y-0.5"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
