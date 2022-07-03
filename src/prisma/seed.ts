import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.link.upsert({
    update: {},
    where: {
      id: 1,
    },
    create: {
      description: 'Fullstack tutorial for GraphQL',
      url: 'www.howtographql.com',
    },
  });

  await prisma.link.upsert({
    update: {},
    where: {
      id: 2,
    },
    create: {
      url: 'https://css-tricks.com/',
      description: 'Website with tips and tricks related to CSS'
    },
  });
}

main()
  .catch((e) => {
    console.error('Seeding data error: ', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
