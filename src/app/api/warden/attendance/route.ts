import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWardenContext } from "@/lib/warden-auth";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export async function GET() {
  const context = await getWardenContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const block = context.warden?.block ?? null;

  const today = startOfDay(new Date());

  const records = await prisma.attendance.findMany({
    where: block ? { student: { room: { block } }, date: { gte: today } } : { date: { gte: today } },
    include: { student: { include: { user: { select: { name: true, email: true } }, room: true } } },
  });

  return NextResponse.json({ attendance: records });
}

export async function POST(request: Request) {
  const context = await getWardenContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.entries)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const created: any[] = [];

  for (const e of body.entries) {
    if (typeof e.studentId !== "string" || typeof e.present !== "boolean") continue;
    const rec = await prisma.attendance.create({ data: { studentId: e.studentId, present: e.present } });
    created.push(rec);
  }

  return NextResponse.json({ created });
}
