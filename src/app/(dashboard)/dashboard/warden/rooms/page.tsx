"use client";

import { useEffect, useState } from "react";

type Room = {
  id: string;
  roomNumber: string;
  capacity: number;
  occupied: number;
  block: { id: string; name: string };
  students: { id: string }[];
};

type UnassignedStudent = {
  id: string;
  rollNo: string;
  user: { name: string | null; email: string };
  room: null;
};

export default function WardenRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [unassigned, setUnassigned] = useState<UnassignedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignStudentId, setAssignStudentId] = useState("");
  const [assignRoomId, setAssignRoomId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newCapacity, setNewCapacity] = useState(4);
  const [addingRoom, setAddingRoom] = useState(false);
  const [addRoomError, setAddRoomError] = useState<string | null>(null);
  const [addRoomSuccess, setAddRoomSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [roomsRes, studentsRes] = await Promise.all([
        fetch("/api/warden/rooms"),
        fetch("/api/warden/students"),
      ]);
      if (!roomsRes.ok || !studentsRes.ok) throw new Error("Failed to load data");
      const { safeJson } = await import("@/lib/safe-json");
      const roomsData = await safeJson(roomsRes);
      const studentsData = await safeJson(studentsRes);
      setRooms(roomsData?.rooms || []);
      setUnassigned(
        (studentsData?.students || []).filter((s: { room: unknown }) => s.room === null)
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignError(null);
    setAssignSuccess(null);
    setAssigning(true);

    try {
      const res = await fetch("/api/warden/rooms/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: assignStudentId, roomId: assignRoomId }),
      });
      if (!res.ok) {
        const { safeJson } = await import("@/lib/safe-json");
        const data = await safeJson(res);
        throw new Error(data?.error ?? "Assignment failed");
      }
      setAssignSuccess("Student assigned to room successfully!");
      setAssignStudentId("");
      setAssignRoomId("");
      setLoading(true);
      await loadData();
    } catch (err: unknown) {
      setAssignError(err instanceof Error ? err.message : "Assignment failed");
    } finally {
      setAssigning(false);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddRoomError(null);
    setAddRoomSuccess(null);
    setAddingRoom(true);

    try {
      const res = await fetch("/api/warden/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomNumber: newRoomNumber, capacity: newCapacity }),
      });
      if (!res.ok) {
        const { safeJson } = await import("@/lib/safe-json");
        const data = await safeJson(res);
        throw new Error(data?.error ?? "Failed to create unit");
      }
      setAddRoomSuccess("Residential unit added to inventory!");
      setNewRoomNumber("");
      setNewCapacity(4);
      setLoading(true);
      await loadData();
    } catch (err: unknown) {
      setAddRoomError(err instanceof Error ? err.message : "Failed to create unit");
    } finally {
      setAddingRoom(false);
    }
  };

  const availableRooms = rooms.filter((r) => r.occupied < r.capacity);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Infrastructure</h1>
        <p className="mt-1 text-sm text-muted">
          Residential capacity monitoring and institutional room assignments.
        </p>
      </div>

      {/* Room Assignment Form */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted mb-6">Assign Resident to Room</h2>
        
        {unassigned.length === 0 ? (
          <div className="py-4 text-center border border-dashed border-border rounded-lg bg-background/30">
            <p className="text-sm text-muted italic">All active residents have been assigned to units.</p>
          </div>
        ) : availableRooms.length === 0 ? (
          <div className="py-4 text-center border border-dashed border-border rounded-lg bg-background/30">
            <p className="text-sm text-muted italic">No vacancy available in institutional blocks.</p>
          </div>
        ) : (
          <form onSubmit={handleAssign} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/70" htmlFor="student-select">
                  Resident Profile
                </label>
                <select
                  id="student-select"
                  value={assignStudentId}
                  onChange={(e) => setAssignStudentId(e.target.value)}
                  required
                  className="input-bespoke"
                >
                  <option value="">Select individual for assignment...</option>
                  {unassigned.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.user.name ?? s.user.email} (Roll: {s.rollNo})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/70" htmlFor="room-select">
                  Available Unit
                </label>
                <select
                  id="room-select"
                  value={assignRoomId}
                  onChange={(e) => setAssignRoomId(e.target.value)}
                  required
                  className="input-bespoke"
                >
                  <option value="">Select target residential unit...</option>
                  {availableRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.block.name} · Unit {r.roomNumber} ({r.occupied}/{r.capacity} Occupancy)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {assignError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-600 font-bold uppercase tracking-wider">Assignment Error: {assignError}</p>
              </div>
            )}
            {assignSuccess && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-xs text-primary font-bold uppercase tracking-wider">{assignSuccess}</p>
              </div>
            )}
            <div className="pt-2">
              <button
                type="submit"
                disabled={assigning}
                className="btn-bespoke px-8 py-3 text-sm font-semibold shadow-sm active:translate-y-0.5"
              >
                {assigning ? "Finalizing Assignment..." : "Authorize Unit Assignment"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Add Room and Inventory Sections */}
      <div className="grid gap-10 lg:grid-cols-3">
        {/* Add Room Form */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleAddRoom}
            className="space-y-6 rounded-xl border border-border bg-surface p-6 shadow-sm sticky top-6"
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Expand Infrastructure</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/70" htmlFor="room-number">
                  Unit Identifier
                </label>
                <input
                  id="room-number"
                  type="text"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  placeholder="e.g. A-101"
                  required
                  className="input-bespoke"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/70" htmlFor="capacity">
                  Authorized Capacity
                </label>
                <input
                  id="capacity"
                  type="number"
                  min="1"
                  max="10"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(parseInt(e.target.value))}
                  required
                  className="input-bespoke"
                />
              </div>
            </div>
            {addRoomError && <p className="text-xs text-red-600 font-medium">{addRoomError}</p>}
            {addRoomSuccess && <p className="text-xs text-primary font-medium">{addRoomSuccess}</p>}
            <button
              type="submit"
              disabled={addingRoom}
              className="btn-bespoke w-full py-3 text-sm font-semibold shadow-sm active:translate-y-0.5"
            >
              {addingRoom ? "Registering unit..." : "Register unit"}
            </button>
          </form>
        </div>

        {/* Room List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Residential Inventory</h2>
          {loading ? (
            <p className="text-sm text-muted">Syncing inventory data...</p>
          ) : error ? (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          ) : rooms.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface p-12 text-center">
              <p className="text-sm text-muted">No residential units configured in the system.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-background/50 text-[10px] font-bold uppercase tracking-widest text-muted">
                    <tr>
                      <th className="px-6 py-4">Block identifier</th>
                      <th className="px-6 py-4">Unit identifier</th>
                      <th className="px-6 py-4">Total Capacity</th>
                      <th className="px-6 py-4">Current Load</th>
                      <th className="px-6 py-4">Operational Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-background/40 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground">
                          {room.block.name}
                        </td>
                        <td className="px-6 py-4 text-muted">{room.roomNumber}</td>
                        <td className="px-6 py-4 text-muted">{room.capacity} beds</td>
                        <td className="px-6 py-4 text-muted">{room.occupied} residents</td>
                        <td className="px-6 py-4">
                          {room.occupied >= room.capacity ? (
                            <span className="inline-flex items-center rounded bg-red-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700">
                              Maximum Capacity
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                              Operational ({room.capacity - room.occupied} available)
                            </span>
                          )}
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
    </div>
  );
}
