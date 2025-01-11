import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createWaterSchema, updateWaterSchema } from '../validation/water.js';
import {
  createWaterConsumptionController,
  deleteWaterConsumptionController,
  getWaterByDayController,
  getWaterByMonthController,
  updateWaterConsumptionController,
} from '../controllers/water.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.use(authenticate);

router.get('/day/:date', ctrlWrapper(getWaterByDayController));
router.get('/month/:date', ctrlWrapper(getWaterByMonthController));
router.post(
  '/',
  validateBody(createWaterSchema),
  ctrlWrapper(createWaterConsumptionController),
);
router.patch(
  '/:waterId',
  isValidId,
  validateBody(updateWaterSchema),
  ctrlWrapper(updateWaterConsumptionController),
);
router.delete(
  '/:waterId',
  isValidId,
  ctrlWrapper(deleteWaterConsumptionController),
);

export default router;
