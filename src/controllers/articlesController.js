import response, { errorResponse } from '../utils/response';
import messages from '../utils/messages';

import {
  getAllByOption, insertRecord, updateRecord, getById, deleteRecord, getSelectedByOption
} from '../services/dbServices';

const {
  articleExists, articleCreated, invalidTagId, articleUpdated, articleDeleted,
  articleNotFound, flaggedSuccess, commentNotFound, commentNotFlagged, commentdeleted,
  articleNotFlagged
} = messages;
const articleModel = 'articles';
const tagModel = 'tags';
const commentModel = ' articlecomments';

/**
 * article create controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const create = async (req, res) => {
  try {
    const {
      title, article, tagid
    } = req.body;
    const authorid = parseInt(req.decoded.id, 10);
    const exists = await getAllByOption(articleModel, `authorid='${authorid}' AND title='${title}'`);
    if (exists) return errorResponse(res, 400, 'error', articleExists);
    const tagExists = await getById(tagModel, `'${tagid}'`);
    if (!tagExists) return errorResponse(res, 400, 'error', invalidTagId);
    const column = 'title, article, authorid, tagid, createdon, updatedon';
    const where = `id=${tagid}`;
    const values = `'${title}', '${article}', '${authorid}', '${tagid}', 'NOW()', 'NOW()'`;
    const createdArticle = await insertRecord(articleModel, column, values);
    if (createdArticle) await updateRecord(tagModel, "counttag=counttag+1, updatedon='NOW()'", where);
    const articleData = {
      message: articleCreated,
      articleId: createdArticle.id,
      title: createdArticle.title,
      article: createdArticle.article,
      tagId: createdArticle.tagid,
      createdOn: createdArticle.createdon,
    };
    return response(res, 201, 'success', articleData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * article update controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const update = async (req, res) => {
  try {
    const {
      title, article
    } = req.body;
    const { articleId } = req.params;
    const authorid = parseInt(req.decoded.id, 10);
    const exists = await getAllByOption(articleModel, `authorid='${authorid}' AND id NOT IN ('${articleId}') AND title='${title}'`);
    if (exists) return errorResponse(res, 400, 'error', articleExists);
    const values = `title='${title}', article='${article}', updatedon='NOW()'`;
    const where = `id=${articleId}`;
    const updatedArticle = await updateRecord(articleModel, values, where);
    const articleData = {
      message: articleUpdated,
      articleId: updatedArticle.id,
      title: updatedArticle.title,
      article: updatedArticle.article,
      tagId: updatedArticle.tagid,
      createdOn: updatedArticle.createdon,
      updatedOn: updatedArticle.updatedon
    };
    return response(res, 201, 'success', articleData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * article delete controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const deleteArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const updatedArticle = await deleteRecord(articleModel, articleId);
    const articleData = {
      message: articleDeleted,
      articleId: updatedArticle.id,
      title: updatedArticle.title,
      article: updatedArticle.article,
      tagId: updatedArticle.tagid,
      createdOn: updatedArticle.createdon,
      updatedOn: updatedArticle.updatedon
    };
    return response(res, 201, 'success', articleData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * get article controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const getArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await getById(articleModel, articleId);
    const comments = await getSelectedByOption(commentModel, 'id AS commentId, comment, authorid', `WHERE articleid='${articleId}'`) || [];
    if (!article) return errorResponse(res, 400, 'error', articleNotFound);
    const articleData = {
      id: article.id,
      createdOn: article.createdon,
      title: article.title,
      article: article.article,
      comments
    };
    return response(res, 200, 'success', articleData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * get article by tag controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const getArticlesByTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const articles = await getSelectedByOption(articleModel, 'id, article, authorid, title', `WHERE tagid='${tagId}'`);
    if (!articles) return errorResponse(res, 400, 'error', articleNotFound);
    return response(res, 200, 'success', articles);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * flag article controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const flagArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const values = "flagged=true, updatedon='NOW()'";
    const where = `id=${articleId}`;
    const flagged = await updateRecord(articleModel, values, where);
    if (!flagged) return errorResponse(res, 400, 'error', articleNotFound);
    const article = {
      message: flaggedSuccess,
      articleId: flagged.id,
      title: flagged.title,
      article: flagged.article,
      tagId: flagged.tagid,
      flagged: flagged.flagged,
      createdOn: flagged.createdon,
      updatedOn: flagged.updatedon
    };
    return response(res, 200, 'success', article);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * flag article comment controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const flagComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const values = "flagged=true, updatedon='NOW()'";
    const where = `id=${commentId}`;
    const flagged = await updateRecord(commentModel, values, where);
    if (!flagged) return errorResponse(res, 400, 'error', commentNotFound);
    const comment = {
      message: flaggedSuccess,
      commentId: flagged.id,
      articleId: flagged.articleid,
      authorId: flagged.authorid,
      comment: flagged.title,
      flagged: flagged.flagged,
      createdOn: flagged.createdon,
      updatedOn: flagged.updatedon
    };
    return response(res, 200, 'success', comment);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * delete flag article comment controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const deleteFlagComment = async (req, res) => {
  try {
    const { articleId, commentId } = req.params;
    const article = await getById(articleModel, articleId);
    if (!article) return errorResponse(res, 400, 'error', articleNotFound);
    // check flag
    const flaggedComment = await getById(commentModel, commentId);
    if (!flaggedComment) return errorResponse(res, 400, 'error', commentNotFound);
    if (flaggedComment && !flaggedComment.flagged) return errorResponse(res, 400, 'error', commentNotFlagged);
    const comment = await deleteRecord(commentModel, commentId);
    const commentData = {
      message: commentdeleted,
      commentId: comment.id,
      articleId: comment.articleid,
      authorId: comment.authorid,
      comment: comment.title,
      flagged: comment.flagged,
      createdOn: comment.createdon,
      updatedOn: comment.updatedon
    };
    return response(res, 200, 'success', commentData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * delete flag article controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const deleteFlagArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await getById(articleModel, articleId);
    if (!article) return errorResponse(res, 400, 'error', articleNotFound);
    // check flag
    if (article && !article.flagged) return errorResponse(res, 400, 'error', articleNotFlagged);
    const deletedArticle = await deleteRecord(articleModel, articleId);
    const articleData = {
      message: articleDeleted,
      articleId: deletedArticle.articleid,
      authorId: deletedArticle.authorid,
      flagged: deletedArticle.flagged,
      createdOn: deletedArticle.createdon,
      updatedOn: deletedArticle.updatedon
    };
    return response(res, 200, 'success', articleData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

export default {
  create,
  update,
  deleteArticle,
  getArticle,
  getArticlesByTag,
  flagArticle,
  flagComment,
  deleteFlagComment,
  deleteFlagArticle
};
