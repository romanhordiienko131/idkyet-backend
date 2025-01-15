import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from '../validation/users.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getCurrentUserController,
  getUsersCountController,
  logoutUserController,
  refreshUsersSessionController,
  registerUserController,
  updateUserController,
} from '../controllers/users.js';
import { loginUserController } from '../controllers/users.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', authenticate, ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshUsersSessionController));

router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

router.patch(
  '/update',
  authenticate,
  upload.single('avatar'),
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserController),
);

router.get('/count', ctrlWrapper(getUsersCountController));

export default router;
