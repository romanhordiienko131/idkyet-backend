import Joi from 'joi';

export const createWaterSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Date must be in the format YYYY-MM-DDTHH:mm',
    }),
  volume: Joi.number().min(50).max(5000).required(),
});

export const updateWaterSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    .messages({
      'string.pattern.base': 'Date must be in the format YYYY-MM-DDTHH:mm',
    }),
  volume: Joi.number().min(50).max(5000),
});
