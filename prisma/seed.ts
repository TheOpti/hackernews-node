import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

require('dotenv').config();

const password = process.env.TEST_USER_PASSWORD || 'secretPassword';

const users = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@techcorp.com',
    password,
    profile: { bio: 'Software developer at TechCorp and tech enthusiast' },
    createdAt: 1711278079368
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@webworks.io',
    password,
    profile: { bio: 'Full-stack developer at WebWorks and tech writer' },
    createdAt: 1712044406368
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie.brown@designhub.com',
    password,
    profile: { bio: 'Frontend developer and designer at DesignHub' },
    createdAt: 1711745428368
  },
  {
    id: 4,
    name: 'Dave Wilson',
    email: 'dave.wilson@backend.io',
    password,
    profile: { bio: 'Backend developer and database expert at Backend.io' },
    createdAt: 1712043416368
  },
  {
    id: 5,
    name: 'Eve Davis',
    email: 'eve.davis@cloudtech.io',
    password,
    profile: { bio: 'DevOps engineer and cloud enthusiast at CloudTech' },
    createdAt: 1712043416368
  },
  {
    id: 6,
    name: 'Frank Thompson',
    email: 'frank.thompson@jsdevs.com',
    password,
    profile: { bio: 'JavaScript developer and blogger at JSDevs' },
    createdAt: 1712137610368
  },
  {
    id: 7,
    name: 'Grace Lee',
    email: 'grace.lee@opensource.com',
    password,
    profile: { bio: 'Tech lead and open source contributor at OpenSource' },
    createdAt: 1711039671368
  },
  {
    id: 8,
    name: 'Heidi Miller',
    email: 'heidi.miller@uiuxstudio.com',
    password,
    profile: { bio: 'UI/UX designer and frontend developer at UIUX Studio' },
    createdAt: 1710660016368
  },
  {
    id: 9,
    name: 'Ivan Anderson',
    email: 'ivan.anderson@appdevs.com',
    password,
    profile: { bio: 'Mobile app developer and Flutter enthusiast at AppDevs' },
    createdAt: 1711811135368
  },
  {
    id: 10,
    name: 'Judy Taylor',
    email: 'judy.taylor@datainsights.com',
    password,
    profile: { bio: 'Machine learning engineer and data scientist at DataInsights' },
    createdAt: 1711219618368
  }
];

const links = [
  {
    id: 1,
    url: 'https://css-tricks.com/',
    title: 'css-tricks',
    description: 'CSS-Tricks - Tips, Tricks, and Techniques on using Cascading Style Sheets.',
    createdAt: 1719080400368,
    postedById: 1
  },
  {
    id: 2,
    url: 'https://frontendmasters.com/',
    title: 'Your Path to Senior Developer and Beyond',
    description:
      'Frontend Masters — Learn JavaScript, React, Vue & Angular from Masters of Front-End Development',
    createdAt: 1715228548000,
    postedById: 1
  },
  {
    id: 3,
    url: 'https://jeanhsu.substack.com/p/ask-vs-guess-culture',
    title: 'Ask vs guess culture',
    description:
      'When unreasonable requests are followed up with "but you could have just said no!" Exploring the clashes of ask culture and guess culture, at home and at work.',
    createdAt: 1718355059368,
    postedById: 2
  },
  {
    id: 4,
    url: 'https://www.freecodecamp.org/news/agile-software-development-handbook/',
    title: 'Agile Software Development Handbook',
    description:
      "In the fast-paced and ever-evolving world of software development, there's always a need for flexibility, adaptability, and responsiveness.",
    createdAt: 1719464784368,
    postedById: 3
  },
  {
    id: 5,
    url: 'https://web.dev/ta-code-coverage/',
    title: 'Four common types of code coverage',
    description: 'Learn what code coverage is and discover four common ways to measure it.',
    createdAt: 1715524887684,
    postedById: 3
  },
  {
    id: 6,
    url: 'https://blog.openreplay.com/prefetching-preloading-and-prerendering-in-html/',
    title: 'Prefetching, Preloading, And Prerendering In HTML',
    description:
      'Optimizing page load times is very important, and this article will explain three techniques —prefetching, preloading, and prerendering— that can help you squeeze higher performance out of your web pages.',
    createdAt: 1712336484368,
    postedById: 4
  },
  {
    id: 7,
    url: 'https://www.postman.com/state-of-api/',
    title: '2023 State of the API Report',
    description:
      "For the fifth year, the State of the API is the world's largest and most comprehensive survey and report on APIs. More than 40,000 developers and API professionals have shared their thoughts on development priorities, their API tools, and where they see APIs going.",
    createdAt: 1714168828211,
    postedById: 1
  },
  {
    id: 8,
    url: 'https://ruurtjan.medium.com/understanding-kafka-with-factorio-74e8fc9bf181',
    title: 'Understanding Kafka with Factorio',
    description: 'Understanding Kafka with Factorio',
    createdAt: 1716285760368,
    postedById: 2
  },
  {
    id: 9,
    url: 'https://www.youtube.com/watch?v=r-GSGH2RxJs',
    title: 'htmx in 100 seconds',
    description:
      'Learn the basics of htmx - an HTML-focused UI library that can handle data fetching and rendering in web applications without complex JavaScript code or frameworks. ',
    createdAt: 1716073133000,
    postedById: 5
  },
  {
    id: 10,
    url: 'https://themer.dev/blog/the-single-most-important-factor-that-differentiates-front-end-frameworks',
    title: 'The single most important factor that differentiates front-end frameworks',
    description:
      'There are tons of blog posts on the internet about how frameworks differ and which one to pick for your next web project. Usually they cover a few aspects of the framework like syntax, development setup, and community size.',
    createdAt: 1715393710368,
    postedById: 6
  },
  {
    id: 11,
    url: 'https://github.com/dabeaz-course/python-mastery',
    title: 'Advanced Python Mastery',
    description:
      'An exercise-driven course on Advanced Python Programming that was battle-tested several hundred times on the corporate-training circuit for more than a decade.',
    createdAt: 1719699584000,
    postedById: 7
  },
  {
    id: 12,
    url: 'https://www.freecodecamp.org/news/git-rebase-handbook/',
    title: 'The Git Rebase Handbook – A Definitive Guide to Rebasing',
    createdAt: 1718571856368,
    postedById: 8
  },
  {
    id: 13,
    url: 'https://www.databasestar.com/database-normalization/',
    title: 'Database Normalization: A Step-By-Step-Guide With Examples',
    description:
      'One of the most powerful tools a developer can have in their toolbox is git rebase. Yet it is notorious for being complex and misunderstood.',
    createdAt: 1718958187008,
    postedById: 9
  },
  {
    id: 14,
    url: 'https://stytch.com/blog/jwts-vs-sessions-which-is-right-for-you/',
    title: 'JWTs vs. sessions: which authentication approach is right for you?',
    description:
      'Your application just received a login request, and the credentials passed successfully to prove the identity of a user in your system. Wonderful, you have a high degree of confidence in who this user is and what they should be able to access!',
    createdAt: 1714541248068,
    postedById: 10
  },
  {
    id: 15,
    url: 'https://dev.to/stripe/common-design-patterns-at-stripe-1hb4',
    title: 'Common design patterns at Stripe',
    description:
      'You might disagree with how the Stripe API is designed, and the design you end up with is likely going to be different than what we use.',
    createdAt: 1715994862368,
    postedById: 5
  },
  {
    id: 16,
    url: 'https://blog.curiosity.ai/10-hottest-new-productivity-apps-may-2024-4ced554c337c',
    title: '10 Hottest New Productivity Apps - May 2024',
    description: 'Meet the 10 most upvoted apps in May — via ProductHunt.',
    createdAt: 1715000412360,
    postedById: 5
  },
  {
    id: 17,
    url: 'https://hybridhacker.email/p/thoughts-on-code-reviews',
    title: 'Thoughts on Code Reviews',
    description: 'Why so many teams mess them up, and a modest proposal to do them better.',
    createdAt: 1716890640322,
    postedById: 6
  },
  {
    id: 18,
    url: 'https://weekendprogrammer.substack.com/p/technical-debt-101-a-short-quick',
    title: 'Technical Debt 101: A Short Quick Guide',
    description: 'Learn the origins, causes and tips to reduce technical debt in your project',
    createdAt: 1719476668399,
    postedById: 7
  },
  {
    id: 19,
    url: 'https://yekta.dev/posts/dont-microservice-do-module/',
    title: "Don't Microservice, Do Module",
    description:
      'The excessive use of microservices is still widespread, and this is bad for the earth! I assumed it was common knowledge by now, but I was very wrong. This article aims to clearly explain why you should minimize or eliminate the use of microservices and opt for properly structured modular systems (or any better alternative) instead.',
    createdAt: 1719614680368,
    postedById: 4
  },
  {
    id: 20,
    url: 'https://blog.google/technology/ai/google-io-2024-100-announcements/',
    title: '100 things we announced at I/O 2024',
    description:
      'A lot happened at I/O 2024! Whether you were most into the latest Gemini app updates, felt especially excited about what’s coming for developers or can’t wait to try the latest generative AI tools, there was something for just about everyone. Don’t believe us? Below, we rounded up 100 things we announced over the last two days.',
    createdAt: 1713829307368,
    postedById: 8
  }
];

const comments = [
  {
    id: 1,
    content: 'I learned a lot, thanks!',
    linkId: 1,
    authorId: 5,
    createdAt: 1673559000000
  },
  {
    id: 2,
    content: 'My favourite website with tutorials',
    linkId: 2,
    authorId: 3,
    createdAt: 1674248600000
  },
  {
    id: 3,
    content: 'Thanks for sharing!',
    linkId: 2,
    authorId: 8,
    createdAt: 1673871900000
  },
  {
    id: 4,
    content: 'This is amazing',
    linkId: 3,
    authorId: 9,
    createdAt: 1673446200000
  },
  {
    id: 5,
    content:
      "Wow, this is me! I'm 53 years old and I didn't know I was this person... a guess person. Being an Asian American, this makes so much sense right now-- it feels life-changing!",
    linkId: 3,
    authorId: 10,
    createdAt: 1673087400000
  },
  {
    id: 6,
    content: 'This was confusing at first, but now I get it.',
    linkId: 3,
    authorId: 1,
    createdAt: 1674955800000
  },
  {
    id: 7,
    content:
      'For those wanting to get better at hearing no, I heard of a guy that invented a rejection game to play with himself. To desensitize himself to the fear of rejection (hearing "no"), he started asking people for things they would definitely say no to in low stakes scenarios. For example, asking a stranger to borrow their car or if they want a bite of his sandwich he already took a bite out of. Ask the person at the deli counter if you can slice your own meat, go to the register to buy a pair of shoes and ask the cashier if they can be free today. There are decks of cards with suggestions if you want to look into it but I think relying on your own creativity is free and easy enough ;)',
    linkId: 3,
    authorId: 2,
    createdAt: 1673845600000
  },
  {
    id: 8,
    content:
      'I would say the difference here is more one of insecurity. The "guess culture" is one of insecure people – afraid to refuse anyone else and afraid to be refused. I see many people with an almost pathological need to hide their desires, in a way it is closing yourself off from the world. In expressing your true feelings you create a degree of intimacy with the other person. Being truthful gives others a kind of power over you and many try their hardest to avoid such vulnerable states.',
    linkId: 3,
    authorId: 7,
    createdAt: 1674551400000
  },
  {
    id: 9,
    content: 'Great article',
    linkId: 5,
    authorId: 6,
    createdAt: 1674593400000
  },
  {
    id: 10,
    content: 'Does anyone have more resources on this?',
    linkId: 5,
    authorId: 5,
    createdAt: 1673394000000
  }
];

async function main() {
  console.log('Inside seed.ts script - generating example data');

  // Create users
  for (const userData of users) {
    const { profile, createdAt, ...userFields } = userData;

    const createdUser = await prisma.user.create({
      data: {
        ...userFields,
        createdAt: new Date(createdAt),
        profile: {
          create: profile
        }
      }
    });

    console.log(`Created user with email: ${createdUser.email}`);
  }

  // Create links
  for (const link of links) {
    const { createdAt, ...linkFields } = link;

    const createdLink = await prisma.link.create({
      data: {
        ...linkFields,
        createdAt: new Date(createdAt)
      }
    });

    console.log(`Created link: ${createdLink.url}`);
  }

  // Create comments
  for (const comment of comments) {
    const { createdAt, ...commentFields } = comment;

    const createdComment = await prisma.comment.create({
      data: {
        ...commentFields,
        createdAt: new Date(createdAt)
      }
    });

    console.log(`Created comment: ${createdComment.id}`);
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
