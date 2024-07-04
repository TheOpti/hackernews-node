import jwt, { JwtPayload } from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'defaultAccessToken';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'defaultRefreshToken';

export const createAccessToken = (userId: number) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

export const createRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

export const getUserId = (req: any) => {
  const authHeader = req.headers.authorization;

  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    throw new Error('No token found');
  }

  const { userId }: any = verifyAccessToken(token);
  return parseInt(userId, 10);
};
