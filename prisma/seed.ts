import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';

import { createRefreshToken } from '../src/utils/jwt';

const prisma = new PrismaClient();

import 'dotenv/config';

const password = process.env.TEST_USER_PASSWORD || 'secretPassword';

const paths = {
  users: path.join('mocks', 'users.json'),
  links: path.join('mocks', 'links.json'),
  comments: path.join('mocks', 'comments.json'),
  votes: path.join('mocks', 'votes.json')
};

async function main() {
  console.log('Inside seed.ts script - generating example data');

  // Create users
  const usersContents = await fs.readFile(paths.users, 'utf8');
  const users = JSON.parse(usersContents);

  for (const userData of users) {
    const { profile, createdAt, ...userFields } = userData;

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const refreshToken = createRefreshToken(userData.id);

    await prisma.user.create({
      data: {
        ...userFields,
        password: hashedPassword,
        salt,
        refreshToken,
        createdAt: new Date(createdAt),
        profile: {
          create: profile
        }
      }
    });
  }

  console.log('Users added');

  // Add links
  const linksContents = await fs.readFile(paths.links, 'utf8');
  const links = JSON.parse(linksContents);

  for (const link of links) {
    await prisma.link.create({
      data: {
        ...link,
        createdAt: new Date(link.createdAt)
      }
    });
  }

  console.log('Links added');

  // Add comments
  const commentsContents = await fs.readFile(paths.comments, 'utf8');
  const comments = JSON.parse(commentsContents);

  for (const comment of comments) {
    await prisma.comment.create({
      data: {
        ...comment,
        createdAt: new Date(comment.createdAt)
      }
    });
  }

  console.log('Comments added');

  // Add votes
  const votesContents = await fs.readFile(paths.votes, 'utf8');
  const votes = JSON.parse(votesContents);

  for (const vote of votes) {
    await prisma.vote.create({
      data: {
        ...vote
      }
    });
  }

  console.log('Votes added');
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
