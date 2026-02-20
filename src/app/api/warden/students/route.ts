import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWardenContext } from "@/lib/warden-auth";

export async function GET() {
  const context = await getWardenContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const block = context.warden?.block ?? null;

  const students = await prisma.student.findMany({
    where: block
      ? {
          OR: [{ room: { block } }, { roomId: null }],
        }
      : undefined,
    include: {
      user: { select: { name: true, email: true } },
      room: true,
    },
    orderBy: { rollNo: "asc" },
  });

  return NextResponse.json({ students });
}

export async function POST(request: Request) {
  const context = await getWardenContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.email !== "string" ||
    typeof body.rollNo !== "string" ||
    typeof body.parentContact !== "string"
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Create a basic user and student. Password will be a temporary random string —
  // real apps should send an invite to set password.
  const tempPassword = Math.random().toString(36).slice(2, 10);

  const createdUser = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name ?? null,
      // store a placeholder hash; in production use proper hashing
      passwordHash: tempPassword,
      role: "STUDENT",
    },
  });

  const student = await prisma.student.create({
    data: {
      userId: createdUser.id,
      rollNo: body.rollNo,
      parentContact: body.parentContact,
      roomId: body.roomId ?? null,
    },
    include: { user: { select: { name: true, email: true } }, room: true },
  });

  return NextResponse.json({ student });
}
