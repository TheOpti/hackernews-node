import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

enum Users {
  ALICE = 'Alice',
  BOB = 'Bob',
  ARTHUR = 'Arthur',
  DOMINIC = 'Dominic'
}

const users = [
  { name: Users.ALICE, email: 'alice@fakeapp.com', id: 0 },
  { name: Users.BOB, email: 'bob_kovalsky@greatcompany.com', id: 0 },
  { name: Users.ARTHUR, email: 'arthur.mcdonald@google.com', id: 0 },
  { name: Users.DOMINIC, email: 'd123@yahoo.com', id: 0 }
];

const links = [
  {
    url: 'https://css-tricks.com/',
    description: 'CSS-Tricks - Tips, Tricks, and Techniques on using Cascading Style Sheets.'
  },
  {
    url: 'https://frontendmasters.com/',
    description:
      'Frontend Masters — Learn JavaScript, React, Vue & Angular from Masters of Front-End Development'
  },
  {
    url: 'https://jeanhsu.substack.com/p/ask-vs-guess-culture',
    description: 'Ask vs guess culture'
  },
  {
    url: 'https://www.freecodecamp.org/news/agile-software-development-handbook/',
    description: 'Agile Software Development Handbook'
  },
  {
    url: 'https://web.dev/ta-code-coverage/',
    description: 'Four common types of code coverage'
  },
  {
    url: 'https://blog.openreplay.com/prefetching-preloading-and-prerendering-in-html/',
    description: 'Prefetching, Preloading, And Prerendering In HTML'
  },
  {
    url: 'https://www.postman.com/state-of-api/',
    description: '2023 State of the API Report'
  },
  {
    url: 'https://ruurtjan.medium.com/understanding-kafka-with-factorio-74e8fc9bf181',
    description: 'Understanding Kafka with Factorio'
  },
  {
    url: 'https://www.youtube.com/watch?v=r-GSGH2RxJs',
    description: 'htmx in 100 seconds'
  },
  {
    url: 'https://themer.dev/blog/the-single-most-important-factor-that-differentiates-front-end-frameworks',
    description: 'The single most important factor that differentiates front-end frameworks'
  },
  {
    url: 'https://github.com/dabeaz-course/python-mastery',
    description: 'Advanced Python Mastery'
  },
  {
    url: 'https://www.freecodecamp.org/news/git-rebase-handbook/',
    description: 'The Git Rebase Handbook – A Definitive Guide to Rebasing'
  },
  {
    url: 'https://www.databasestar.com/database-normalization/',
    description: 'Database Normalization: A Step-By-Step-Guide With Examples'
  },
  {
    url: 'https://stytch.com/blog/jwts-vs-sessions-which-is-right-for-you/',
    description: 'JWTs vs. sessions: which authentication approach is right for you?'
  }
];

async function main() {
  console.log('Inside seed.ts script - generating example data');
  const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);

  // Generate users
  for (const user of users) {
    console.log(`Creating user ${user.name}...`);
    const { id } = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: randomPassword
      }
    });

    user.id = id;
  }

  // Generate links
  let addedLinks = 1;
  for (const link of links) {
    console.log(`Creating ${link.url}...`);
    const { id } = users[Math.floor(Math.random() * users.length)];

    await prisma.link.upsert({
      where: { id: addedLinks },
      update: {},
      create: {
        id: addedLinks,
        url: link.url,
        description: link.description,
        postedById: id
      }
    });

    addedLinks = addedLinks + 1;
  }
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
