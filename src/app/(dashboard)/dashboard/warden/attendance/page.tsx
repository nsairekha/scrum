"use client";

import { useEffect, useState } from "react";

type Student = { id: string; user: { name: string | null; email: string }; rollNo: string; room?: { roomNumber: string } | null };

export default function WardenAttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/warden/students')
      .then((r) => r.json())
      .then((d) => {
        setStudents(d.students || []);
        const map: Record<string, boolean> = {};
        (d.students || []).forEach((s: Student) => (map[s.id] = true));
        setChecked(map);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  const save = async () => {
    setSaving(true);
    const entries = Object.keys(checked).map((studentId) => ({ studentId, present: !!checked[studentId] }));
    await fetch('/api/warden/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entries }) });
    setSaving(false);
  };

  if (loading) return <p className="text-sm text-zinc-500">Loading students...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Mark Attendance</h1>
  <p className="text-sm text-zinc-600">Toggle presence for students and save today&apos;s attendance.</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="space-y-2">
          {students.map((s) => (
            <label key={s.id} className="flex items-center justify-between rounded-md border p-2">
              <div>
                <div className="font-medium text-zinc-900">{s.user.name ?? s.user.email}</div>
                <div className="text-sm text-zinc-600">Roll: {s.rollNo} {s.room && `• Room ${s.room.roomNumber}`}</div>
              </div>
              <input type="checkbox" checked={!!checked[s.id]} onChange={() => toggle(s.id)} />
            </label>
          ))}
        </div>

        <div className="mt-4">
          <button onClick={save} disabled={saving} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
}
