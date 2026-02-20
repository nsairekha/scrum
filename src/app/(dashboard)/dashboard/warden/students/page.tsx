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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-black">Students</h1>
        <p className="text-sm text-black">
          All hostel residents and their room assignments.
        </p>
      </div>

      {/* Add Student Form */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-medium text-black">Add Student</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-4">
          <input aria-label="Name" className="rounded-md border p-2 text-black placeholder:text-black" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input aria-label="Email" className="rounded-md border p-2 text-black placeholder:text-black" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input aria-label="Roll No" className="rounded-md border p-2 text-black placeholder:text-black" placeholder="Roll No" value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} />
          <input aria-label="Parent Contact" className="rounded-md border p-2 text-black placeholder:text-black" placeholder="Parent Contact" value={form.parentContact} onChange={(e) => setForm({ ...form, parentContact: e.target.value })} />
        </div>
        {formError && <p className="text-sm text-red-600 mt-2">{formError}</p>}
        {successMessage && <p className="text-sm text-green-600 mt-2">{successMessage}</p>}
        <div className="mt-3 flex items-center gap-2">
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
                setSuccessMessage('Student added');
              } catch (err: unknown) {
                setFormError(err instanceof Error ? err.message : 'Error');
              } finally {
                setAdding(false);
              }
            }}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
          >
            {adding ? 'Adding...' : 'Add Student'}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-black">Loading students...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : students.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-black">No students found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-medium text-black">Name</th>
                <th className="px-4 py-3 font-medium text-black">Email</th>
                <th className="px-4 py-3 font-medium text-black">Roll No</th>
                <th className="px-4 py-3 font-medium text-black">Room</th>
                <th className="px-4 py-3 font-medium text-black">Parent Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-black">
                    {student.user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-black">{student.user.email}</td>
                  <td className="px-4 py-3 text-black">{student.rollNo}</td>
                  <td className="px-4 py-3">
                    {student.room ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Room {student.room.roomNumber}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-black">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-black">
                    {student.parentContact || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
