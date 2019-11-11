import Joi from '@hapi/joi';
import JoiValidator from './JoiValidator';

const createArticleSchema = Joi.object({
  title: JoiValidator.validateString().min(10).max(128).required(),
  article: JoiValidator.validateString().min(10).required(),
  tagid: JoiValidator.validateNumber().integer().required(),
});

export {
  createArticleSchema
};
