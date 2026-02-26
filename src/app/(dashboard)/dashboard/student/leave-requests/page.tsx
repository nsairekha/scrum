"use client";

import { useEffect, useState } from "react";

type LeaveRequest = {
  id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  createdAt: string;
};

export default function StudentLeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = async () => {
    const response = await fetch("/api/student/leave-requests");
    if (!response.ok) {
      setError("Unable to load leave requests");
      return;
    }
    const payload = (await response.json()) as { leaveRequests: LeaveRequest[] };
    setRequests(payload.leaveRequests);
  };

  useEffect(() => {
    (async () => {
      await loadRequests();
    })();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/student/leave-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromDate, toDate, reason }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Unable to submit leave request");
      setIsSubmitting(false);
      return;
    }

    setFromDate("");
    setToDate("");
    setReason("");
    await loadRequests();
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leave Requests</h1>
        <p className="mt-1 text-sm text-muted">
          Formal institutional absence authorization system.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-border bg-surface p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70" htmlFor="fromDate">
              Start Date
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              required
              className="input-bespoke"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70" htmlFor="toDate">
              End Date
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              required
              className="input-bespoke"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/70" htmlFor="reason">
            Authorization Reason
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            required
            rows={3}
            className="input-bespoke min-h-[100px] resize-none"
            placeholder="Provide specific justification for leave..."
          />
        </div>
        {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-bespoke px-8 py-3 text-sm font-semibold shadow-sm active:translate-y-0.5"
        >
          {isSubmitting ? "Processing..." : "Submit Authorization Request"}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Request History</h2>
        {requests.length === 0 ? (
          <p className="text-sm text-muted">No historical leave authorizations found.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-xl border border-border bg-surface p-6 shadow-sm group hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-foreground">
                    {new Date(request.fromDate).toLocaleDateString()} — {new Date(request.toDate).toLocaleDateString()}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-2 py-1 bg-primary/5 rounded">
                    {request.status.replaceAll("_", " ")}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {request.reason}
                </p>
                <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted/60">
                  <span>Record ID: {request.id.slice(0, 8)}</span>
                  <span>Submitted {new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
