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
  gifId: JoiValidator.validateNumber().required()
});

const createGifCommentSchema = Joi.object({
  comment: JoiValidator.validateString()
    .min(2)
    .max(256)
    .required(),
  gifId: JoiValidator.validateString().required()
});

const getGifSchema = Joi.object({
  gifId: JoiValidator.validateString().required()
});

const flagGifCommentSchema = Joi.object({
  commentId: JoiValidator.validateString().required()
});

export {
  createGifSchema,
  deleteGifSchema,
  createGifCommentSchema,
  getGifSchema,
  flagGifCommentSchema
};
