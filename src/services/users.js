import { randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { ONE_DAY, ONE_HOUR } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';

export const registerUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await UsersCollection.create({
    email,
    password: hashedPassword,
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + ONE_HOUR * 3);
  const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY * 30);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const isEqual = await bcrypt.compare(password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const session = createSession();

  const newSession = await SessionsCollection.create({
    userId: user._id,
    ...session,
  });

  return {
    session: newSession,
    user,
  };
};

export const logoutUser = async (user) => {
  await SessionsCollection.findOneAndDelete({ userId: user._id });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isRefreshTokenExpired = Date.now() > session.refreshTokenValidUntil;

  if (isRefreshTokenExpired) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const updateUser = async (userId, payload) => {
  const updatedUser = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    payload,
    {
      new: true,
    },
  );

  return updatedUser;
};

export const getUsersCount = async () => {
  return await UsersCollection.countDocuments();
};
