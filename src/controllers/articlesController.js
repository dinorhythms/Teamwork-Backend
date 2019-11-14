import response, { errorResponse } from '../utils/response';
import messages from '../utils/messages';

import {
  getAllByOption, insertRecord, updateRecord, getById, deleteRecord, getSelectedByOption
} from '../services/dbServices';

const {
  articleExists, articleCreated, invalidTagId, articleUpdated, articleDeleted, articleNotFound
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

export default {
  create, update, deleteArticle, getArticle
};
