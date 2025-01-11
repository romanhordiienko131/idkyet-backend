export const calculateWaterPercentage = (dailyNorm, totalWaterPerDay) => {
  const percentage = (totalWaterPerDay / dailyNorm) * 100;
  return percentage.toFixed();
};
