import Joi from 'joi';

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string(),
  gender: Joi.string().valid('woman', 'man'),
  weight: Joi.number(),
  activeTime: Joi.number(),
  dailyNorm: Joi.number(),
});
