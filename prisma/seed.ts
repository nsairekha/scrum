import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash password: "password123"
  const passwordHash = await bcrypt.hash("password123", 12);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@hostel.com" },
    update: {},
    create: {
      email: "admin@hostel.com",
      name: "Admin User",
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create Block for Warden
  const block = await prisma.block.upsert({
    where: { id: "block-a" },
    update: {},
    create: {
      id: "block-a",
      name: "Block A",
    },
  });

  // Create Warden User
  const wardenUser = await prisma.user.upsert({
    where: { email: "warden@hostel.com" },
    update: {},
    create: {
      email: "warden@hostel.com",
      name: "Warden User",
      passwordHash,
      role: Role.WARDEN,
    },
  });

  const warden = await prisma.warden.upsert({
    where: { userId: wardenUser.id },
    update: {},
    create: {
      userId: wardenUser.id,
      blockId: block.id,
    },
  });
  console.log("✅ Warden created:", wardenUser.email);

  // Create Student User
  const studentUser = await prisma.user.upsert({
    where: { email: "student@hostel.com" },
    update: {},
    create: {
      email: "student@hostel.com",
      name: "Student User",
      passwordHash,
      role: Role.STUDENT,
    },
  });

  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      rollNo: "STU001",
      parentContact: "+1234567890",
    },
  });
  console.log("✅ Student created:", studentUser.email);

  // Create rooms for Block A
  console.log("🏢 Creating residential units for Block A...");
  for (let i = 1; i <= 10; i++) {
    const roomNumber = `A-${i.toString().padStart(3, '0')}`;
    await prisma.room.upsert({
      where: { blockId_roomNumber: { blockId: block.id, roomNumber } },
      update: {},
      create: {
        roomNumber,
        capacity: 4,
        occupied: 0,
        blockId: block.id,
      },
    });
  }
  console.log("✅ 10 rooms created for Block A");

  console.log("\n🎉 Seeding complete!\n");
  console.log("📋 Default Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin:   admin@hostel.com / password123");
  console.log("Warden:  warden@hostel.com / password123");
  console.log("Student: student@hostel.com / password123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
