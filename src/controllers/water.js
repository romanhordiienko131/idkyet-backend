import createHttpError from 'http-errors';
import {
  createWaterConsumption,
  deleteWaterConsumption,
  getWaterByDay,
  updateWaterConsumption,
} from '../services/water.js';
import { calculateWaterPercentage } from '../utils/calculateWaterPercentage.js';

export const getWaterByDayController = async (req, res, next) => {
  const { date } = req.params;
  const { _id: userId } = req.user;
  const dailyNorm = req.user.dailyNorm;

  const water = await getWaterByDay(date, userId);

  const totalWaterPerDay = water.reduce((acc, item) => acc + item.volume, 0);

  const waterPercentage = calculateWaterPercentage(dailyNorm, totalWaterPerDay);

  if (!water) {
    next(createHttpError(404, 'Water consumption by day not found'));
  }

  res.send({
    status: 200,
    message: 'Successfully found a water consumption by day!',
    data: water,
    totalWaterPerDay,
    waterPercentage,
  });
};

export const getWaterByMonthController = async (req, res) => {
  const { date } = req.params;
  const { _id: userId } = req.user;

  const water = await getWaterByDay(date, userId);

  if (!water) {
    throw createHttpError(404, 'Water consumption by month not found');
  }

  res.send({
    status: 200,
    message: 'Successfully found a water consumption by month!',
    data: water,
  });
};

export const createWaterConsumptionController = async (req, res) => {
  const water = await createWaterConsumption({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).send({
    status: 201,
    message: 'Successfully created a water consumption!',
    data: water,
  });
};

export const updateWaterConsumptionController = async (req, res, next) => {
  const { waterId } = req.params;

  const result = await updateWaterConsumption(waterId, req.body, req.user._id);

  if (!result) {
    next(createHttpError(404, 'Water consumption not found'));
    return;
  }

  res.send({
    status: 200,
    message: 'Successfully updated a water consumption!',
    data: result,
  });
};

export const deleteWaterConsumptionController = async (req, res, next) => {
  const { waterId } = req.params;

  const result = await deleteWaterConsumption(waterId, req.user._id);

  if (!result) {
    next(createHttpError(404, 'Water consumption not found'));
    return;
  }

  res.status(204).send();
};
