import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const complaints = await prisma.complaint.findMany({
    include: {
      student: {
        include: { user: true, room: { include: { block: true } } }
      }
    }
  })
  console.log('Total Complaints:', complaints.length)
  console.log('Complaints Data:', JSON.stringify(complaints, null, 2))
}

main()
