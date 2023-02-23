import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  await prisma.link.create({
    data: {
      description: 'foo',
      url: 'test'
    }
  })
  const allLinks = await prisma.link.findMany()
  console.log(allLinks)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
