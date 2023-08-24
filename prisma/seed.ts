import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

console.log('Inside seed.ts script - generating example data');

async function main() {
  const alicePassword = await bcrypt.hash('password123', 10);
  console.log('Creating user...');
  const alice = await prisma.user.upsert({
    where: { email: 'alice@fakeapp.com' },
    update: {},
    create: {
      name: 'Alice',
      email: 'alice@fakeapp.com',
      password: alicePassword
    }
  });

  console.log('Creating first link...');
  await prisma.link.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      url: 'https://css-tricks.com/',
      description: 'CSS-Tricks - Tips, Tricks, and Techniques on using Cascading Style Sheets.',
      postedById: alice.id
    }
  });

  console.log('Creating second link...');
  await prisma.link.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      url: 'https://frontendmasters.com/',
      description:
        'Frontend Masters — Learn JavaScript, React, Vue & Angular from Masters of Front-End Development',
      postedById: alice.id
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Data generated successfully');
  })
  .catch(async (error) => {
    console.log('There was an error while seeding db with data: ', error);
    await prisma.$disconnect();
    process.exit(1);
  });
