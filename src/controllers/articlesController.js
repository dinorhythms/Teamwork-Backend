import response, { errorResponse } from '../utils/response';
import messages from '../utils/messages';

import {
  getAllByOption, insertRecord, updateRecord, getById
} from '../services/dbServices';

const {
  articleExists, articleCreated, invalidTagId
} = messages;
const articleModel = 'articles';
const tagModel = 'tags';

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
    const user = `'${title}', '${article}', '${authorid}', '${tagid}', 'NOW()', 'NOW()'`;
    const createdArticle = await insertRecord(articleModel, column, user);
    if (createdArticle) await updateRecord(tagModel, "counttag=counttag+1, updatedon='NOW()'", where);
    const articleData = {
      message: articleCreated,
      articleId: createdArticle.id,
      title: createdArticle.title,
      article: createdArticle.article,
      tagId: createdArticle.tagid,
      createdon: createdArticle.createdon,
    };
    return response(res, 201, 'success', articleData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

export default {
  create
};
