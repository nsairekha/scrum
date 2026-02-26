import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const wardens = await prisma.warden.findMany({
    include: { user: true, block: true }
  })
  console.log('Wardens:', JSON.stringify(wardens, null, 2))

  const rooms = await prisma.room.findMany({
    include: { block: true }
  })
  console.log('Rooms count:', rooms.length)
  console.log('Sample Rooms:', JSON.stringify(rooms.slice(0, 5), null, 2))

  const students = await prisma.student.findMany({
    where: { roomId: null },
    include: { user: true }
  })
  console.log('Unassigned students:', students.length)
}

main()
