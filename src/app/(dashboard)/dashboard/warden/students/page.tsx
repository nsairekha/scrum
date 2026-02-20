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

  useEffect(() => {
    fetch("/api/warden/students")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load students");
        return res.json();
      })
      .then((data) => setStudents(data.students))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Students</h1>
        <p className="text-sm text-zinc-600">
          All hostel residents and their room assignments.
        </p>
      </div>

      {/* Add Student Form */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-medium text-zinc-800">Add Student</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-4">
          <input className="rounded-md border p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="rounded-md border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="rounded-md border p-2" placeholder="Roll No" value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} />
          <input className="rounded-md border p-2" placeholder="Parent Contact" value={form.parentContact} onChange={(e) => setForm({ ...form, parentContact: e.target.value })} />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            disabled={adding}
            onClick={async () => {
              setAdding(true);
              setError(null);
              try {
                const res = await fetch('/api/warden/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
                if (!res.ok) throw new Error('Failed to add student');
                const data = await res.json();
                setStudents((s) => [data.student, ...s]);
                setForm({ name: '', email: '', rollNo: '', parentContact: '', roomId: '' });
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Error');
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
        <p className="text-sm text-zinc-500">Loading students...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : students.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">No students found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-600">Name</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Email</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Roll No</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Room</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Parent Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {student.user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{student.user.email}</td>
                  <td className="px-4 py-3 text-zinc-600">{student.rollNo}</td>
                  <td className="px-4 py-3">
                    {student.room ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Room {student.room.roomNumber}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
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
