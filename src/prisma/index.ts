// 1
const { PrismaClient } = require('@prisma/client');

// 2
const prisma = new PrismaClient();

// 3
async function main() {
  const allLinks = await prisma.link.findMany();
  console.log('Result from prisma/index.ts main: ', allLinks);
}

// 4
main()
  .catch(e => {
    throw e;
  })
  // 5
  .finally(async () => {
    await prisma.$disconnect();
  })
