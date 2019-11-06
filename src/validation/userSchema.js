import Joi from '@hapi/joi';
import JoiValidator from './JoiValidator';

const signInSchema = Joi.object({
  email: JoiValidator.validateEmail().required(),
  password: JoiValidator.validatePassword().required(),
});

const emailSchema = Joi.object({
  email: JoiValidator.validateEmail().required(),
});

const passwordSchema = Joi.object({
  password: JoiValidator.validatePassword().min(8).required(),
});

export {
  signInSchema, emailSchema, passwordSchema
};
