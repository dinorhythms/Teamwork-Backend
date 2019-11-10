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

const signUpSchema = Joi.object({
  email: JoiValidator.validateEmail().required(),
  password: JoiValidator.validatePassword().required(),
  firstname: JoiValidator.validateString().required(),
  lastname: JoiValidator.validateString().required(),
  address: JoiValidator.validateString().required(),
  jobrole: JoiValidator.validateString().required(),
  gender: JoiValidator.validateString().required(),
  department: JoiValidator.validateString().required(),
});

export {
  signInSchema, emailSchema, passwordSchema, signUpSchema
};
