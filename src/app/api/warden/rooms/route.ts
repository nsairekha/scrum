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
    where: block ? { block } : undefined,
    include: { students: true },
    orderBy: [{ block: "asc" }, { roomNumber: "asc" }],
  });

  return NextResponse.json({ rooms });
}
