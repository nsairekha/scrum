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
      .then(async (r) => {
        const d = await (await import('@/lib/safe-json')).safeJson(r);
        setStudents(d?.students || []);
        const map: Record<string, boolean> = {};
        (d?.students || []).forEach((s: Student) => (map[s.id] = true));
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

  if (loading) return <p className="text-sm text-black">Loading students...</p>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Operational Verification</h1>
        <p className="mt-1 text-sm text-muted">
          Formal daily residential presence audit and verification system.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Daily Presence Log</h2>
        <div className="mt-6 grid gap-3">
          {students.map((s) => (
            <label
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-border/50 p-4 transition-all hover:border-primary/30 hover:bg-background/40 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs ring-4 ring-primary/5 transition-transform group-hover:scale-105">
                  {s.user.name?.[0]?.toUpperCase() ?? "R"}
                </div>
                <div>
                  <div className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                    {s.user.name ?? s.user.email}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted/70 mt-0.5">
                    Roll: {s.rollNo} {s.room && `• Unit ${s.room.roomNumber}`}
                  </div>
                </div>
              </div>
              <div className="relative inline-flex items-center h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-muted/20 has-[:checked]:bg-primary">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={!!checked[s.id]}
                  onChange={() => toggle(s.id)}
                />
                <span
                  className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                    checked[s.id] ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </label>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <button
            onClick={save}
            disabled={saving}
            className="btn-bespoke px-8 py-3 text-sm font-semibold shadow-sm active:translate-y-0.5"
          >
            {saving ? "Finalizing Audit..." : "Finalize presence audit"}
          </button>
        </div>
      </div>
    </div>
  );
}
