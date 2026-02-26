"use client";

import { useEffect, useState } from "react";

type Student = {
  id: string;
  rollNo: string;
  parentContact: string;
  user: { name: string | null; email: string };
  room: { roomNumber: string; blockId: string } | null;
};

export default function WardenStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", rollNo: "", parentContact: "", roomId: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/warden/students");
        if (!res.ok) throw new Error("Failed to load students");
        const { safeJson } = await import("@/lib/safe-json");
        const data = await safeJson(res);
        setStudents(data?.students || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load students");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Residents</h1>
        <p className="mt-1 text-sm text-muted">
          Comprehensive registry of institutional residents and residential allocations.
        </p>
      </div>

      {/* Add Student Form */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Register New Resident</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/70" htmlFor="name">Full Name</label>
            <input id="name" aria-label="Name" className="input-bespoke" placeholder="e.g. John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/70" htmlFor="email">Email Address</label>
            <input id="email" aria-label="Email" className="input-bespoke" placeholder="e.g. john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/70" htmlFor="rollNo">Roll Number</label>
            <input id="rollNo" aria-label="Roll No" className="input-bespoke" placeholder="e.g. CS2024001" value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/70" htmlFor="parentContact">Emergency Contact</label>
            <input id="parentContact" aria-label="Parent Contact" className="input-bespoke" placeholder="e.g. +91 9876543210" value={form.parentContact} onChange={(e) => setForm({ ...form, parentContact: e.target.value })} />
          </div>
        </div>
        {formError && <p className="text-sm text-red-600 mt-4 font-medium">{formError}</p>}
        {successMessage && <p className="text-sm text-primary mt-4 font-medium">{successMessage}</p>}
        <div className="mt-8">
          <button
            disabled={adding}
            onClick={async () => {
              // client-side validation
              setFormError(null);
              setSuccessMessage(null);
              if (!form.email || !form.rollNo) {
                setFormError('Email and Roll No are required');
                return;
              }
              // basic email check
              const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRe.test(form.email)) {
                setFormError('Enter a valid email');
                return;
              }

              setAdding(true);
              setError(null);
              try {
                const res = await fetch('/api/warden/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
                const { safeJson } = await import('@/lib/safe-json');
                const data = await safeJson(res);
                if (!res.ok) {
                  const message = data?.error ?? 'Failed to add student';
                  setFormError(message);
                  return;
                }
                setStudents((s) => [data.student, ...s]);
                setForm({ name: '', email: '', rollNo: '', parentContact: '', roomId: '' });
                setSuccessMessage('Resident successfully registered');
              } catch (err: unknown) {
                setFormError(err instanceof Error ? err.message : 'Registry error');
              } finally {
                setAdding(false);
              }
            }}
            className="btn-bespoke px-8 py-2.5 text-sm font-semibold shadow-sm active:translate-y-0.5"
          >
            {adding ? 'Processing Registry...' : 'Register resident'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Resident Registry</h2>
        {loading ? (
          <p className="text-sm text-muted">Syncing registry data...</p>
        ) : error ? (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        ) : students.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-12 text-center">
            <p className="text-sm text-muted">No institutional residents found in the registry.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-background/50 text-[10px] font-bold uppercase tracking-widest text-muted">
                  <tr>
                    <th className="px-6 py-4">Legal Name</th>
                    <th className="px-6 py-4">Institutional Email</th>
                    <th className="px-6 py-4">Roll Identifier</th>
                    <th className="px-6 py-4">Residential Allocation</th>
                    <th className="px-6 py-4">Parental Reach</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-background/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {student.user.name ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-muted">{student.user.email}</td>
                      <td className="px-6 py-4 text-muted">{student.rollNo}</td>
                      <td className="px-6 py-4">
                        {student.room ? (
                          <span className="inline-flex items-center rounded bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                            Room {student.room.roomNumber}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded bg-muted/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {student.parentContact || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
