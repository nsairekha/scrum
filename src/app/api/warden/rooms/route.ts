import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWardenContext } from "@/lib/warden-auth";

export async function GET() {
  const context = await getWardenContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const block = context.warden?.block ?? null;

  const rooms = await prisma.room.findMany({
    where: block ? { blockId: block.id } : undefined,
    include: { students: true, block: true },
    orderBy: [{ roomNumber: "asc" }],
  });

  return NextResponse.json({ rooms });
}

export async function POST(request: Request) {
  const context = await getWardenContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const block = context.warden?.block ?? null;
  if (!block) {
    return NextResponse.json({ error: "Warden must be assigned to a block to manage infrastructure" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.roomNumber !== "string" ||
    typeof body.capacity !== "number" ||
    body.capacity <= 0
  ) {
    return NextResponse.json({ error: "Invalid infrastructure data" }, { status: 400 });
  }

  try {
    const room = await prisma.room.create({
      data: {
        roomNumber: body.roomNumber,
        capacity: body.capacity,
        occupied: 0,
        blockId: block.id,
      },
      include: { block: true, students: true },
    });
    return NextResponse.json({ room });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: "This unit identifier already exists within this block" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create residential unit" }, { status: 500 });
  }
}
