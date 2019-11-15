import Joi from '@hapi/joi';
import JoiValidator from './JoiValidator';

const createArticleSchema = Joi.object({
  title: JoiValidator.validateString()
    .min(10)
    .max(128)
    .required(),
  article: JoiValidator.validateString()
    .min(10)
    .required(),
  tagid: JoiValidator.validateNumber()
    .integer()
    .required()
});

const updateArticleSchema = Joi.object({
  title: JoiValidator.validateString()
    .min(10)
    .max(128)
    .required(),
  article: JoiValidator.validateString()
    .min(10)
    .required(),
  articleId: JoiValidator.validateString().required()
});

const deleteArticleSchema = Joi.object({
  articleId: JoiValidator.validateString().required()
});

const createArticleCommentSchema = Joi.object({
  comment: JoiValidator.validateString()
    .min(2)
    .max(256)
    .required(),
  articleId: JoiValidator.validateString().required()
});

const getArticleSchema = Joi.object({
  articleId: JoiValidator.validateString().required()
});

const getArticleByTagSchema = Joi.object({
  tagId: JoiValidator.validateString().required()
});

const flagArticleCommentSchema = Joi.object({
  commentId: JoiValidator.validateString().required()
});

export {
  createArticleSchema,
  updateArticleSchema,
  deleteArticleSchema,
  createArticleCommentSchema,
  getArticleSchema,
  getArticleByTagSchema,
  flagArticleCommentSchema
};
