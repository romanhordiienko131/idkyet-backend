import { ONE_DAY } from '../constants/index.js';
import {
  getUsersCount,
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  updateUser,
} from '../services/users.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const registerUserController = async (req, res) => {
  const credentials = {
    email: req.body.email,
    password: req.body.password,
  };

  const user = await registerUser(credentials);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY * 30),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY * 30),
  });
};

export const loginUserController = async (req, res) => {
  const credentials = {
    email: req.body.email,
    password: req.body.password,
  };

  const { session, user } = await loginUser(credentials);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: {
      accessToken: session.accessToken,
      user,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const user = req.user;

  await logoutUser(user);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const refreshUsersSessionController = async (req, res) => {
  const cookies = {
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  };

  const session = await refreshUsersSession(cookies);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const getCurrentUserController = (req, res) => {
  const user = req.user;

  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved the current user!',
    data: user,
  });
};

export const updateUserController = async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const avatar = req.file;

  let avatarUrl;

  if (avatar) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      avatarUrl = await saveFileToCloudinary(avatar);
    } else {
      avatarUrl = await saveFileToUploadDir(avatar);
    }
  }

  const updatedUser = await updateUser(userId, {
    ...req.body,
    avatar: avatarUrl,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully updated a user!',
    data: updatedUser,
  });
};

export const getUsersCountController = async (req, res) => {
  const count = await getUsersCount();

  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved user count!',
    data: count,
  });
};
