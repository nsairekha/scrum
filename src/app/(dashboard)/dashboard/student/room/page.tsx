"use client";

import { useEffect, useState } from "react";

type RoomResponse = {
  room: {
    id: string;
    roomNumber: string;
    capacity: number;
    occupied: number;
    block: string;
  } | null;
};

export default function StudentRoomPage() {
  const [data, setData] = useState<RoomResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/student/room");
      if (!response.ok) {
        setError("Unable to load room details");
        return;
      }
      const payload = (await response.json()) as RoomResponse;
      setData(payload);
    };

    load();
  }, []);

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!data) {
    return <p className="text-sm text-muted">Syncing room allocation...</p>;
  }

  if (!data.room) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Room</h1>
          <p className="mt-1 text-sm text-muted">No institutional room has been assigned to your profile yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Room</h1>
        <p className="mt-1 text-sm text-muted">Current residential allocation and block details.</p>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-muted">Residential Block</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {data.room.block}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-muted">Room Number</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {data.room.roomNumber}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-muted">Total Capacity</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {data.room.capacity} beds
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-muted">Current Occupancy</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {data.room.occupied} residents
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
