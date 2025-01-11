import { WaterCollection } from '../db/models/water.js';

export const getWaterByDay = async (date, userId) => {
  const day = date.split('T')[0];

  const waterByDay = await WaterCollection.aggregate([
    {
      $match: {
        date: { $regex: `^${day}` },
        userId,
      },
    },
  ]);

  return waterByDay;
};

export const getWaterByMonth = async (date, userId) => {
  const waterByMonth = await WaterCollection.find({
    date: { $regex: `^${date}` },
    userId,
  });

  return waterByMonth;
};

export const createWaterConsumption = async (payload) => {
  const water = await WaterCollection.create(payload);
  return water;
};

export const updateWaterConsumption = async (waterId, payload, userId) => {
  const result = await WaterCollection.findOneAndUpdate(
    {
      _id: waterId,
      userId,
    },
    payload,
    { new: true },
  );
  return result;
};

export const deleteWaterConsumption = async (waterId, userId) => {
  const result = await WaterCollection.findOneAndDelete({
    _id: waterId,
    userId,
  });
  return result;
};
