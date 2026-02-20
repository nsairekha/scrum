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
    return <p className="text-sm text-black">Loading room details...</p>;
  }

  if (!data.room) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-black">My Room</h1>
        <p className="text-sm text-black">No room assigned yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-black">My Room</h1>
        <p className="text-sm text-black">Current room allocation.</p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-black">Block</dt>
            <dd className="text-sm font-medium text-black">
              {data.room.block}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-black">Room Number</dt>
            <dd className="text-sm font-medium text-black">
              {data.room.roomNumber}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-black">Capacity</dt>
            <dd className="text-sm font-medium text-black">
              {data.room.capacity}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-black">Occupied</dt>
            <dd className="text-sm font-medium text-black">
              {data.room.occupied}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
