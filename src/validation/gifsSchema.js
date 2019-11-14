import Joi from '@hapi/joi';
import JoiValidator from './JoiValidator';

const createGifSchema = Joi.object({
  title: JoiValidator.validateString()
    .min(10)
    .max(128)
    .required(),
  tagid: JoiValidator.validateNumber().required(),
  filename: JoiValidator.validateString().required()
});

const deleteGifSchema = Joi.object({
  gifId: JoiValidator.validateNumber().required(),
});

export { createGifSchema, deleteGifSchema };
