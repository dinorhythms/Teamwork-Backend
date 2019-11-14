import response, { errorResponse } from '../utils/response';
import messages from '../utils/messages';

import {
  insertRecord,
  getById,
} from '../services/dbServices';

const {
  articleNotFound, commentCreated, gifNotFound
} = messages;
const articleModel = 'articles';
const gifModel = 'gifs';
const articleCommentModel = 'articlecomments';
const gifCommentModel = 'gifcomments';

/**
 * article create comment controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const createArticleComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { articleId } = req.params;
    const authorid = parseInt(req.decoded.id, 10);
    const article = await getById(
      articleModel,
      articleId
    );
    if (!article) return errorResponse(res, 400, 'error', articleNotFound);
    const column = 'comment, articleid, authorid, createdon, updatedon';
    const values = `'${comment}', '${articleId}', '${authorid}', 'NOW()', 'NOW()'`;
    const createdComment = await insertRecord(articleCommentModel, column, values);
    const commentData = {
      message: commentCreated,
      commentId: createdComment.id,
      articleTitle: article.title,
      article: article.article,
      comment: createdComment.comment,
      authorId: createdComment.authorid,
      createdOn: createdComment.createdon
    };
    return response(res, 201, 'success', commentData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * article create comment controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const createGifComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { gifId } = req.params;
    const authorid = parseInt(req.decoded.id, 10);
    const gif = await getById(
      gifModel,
      gifId
    );
    if (!gif) return errorResponse(res, 400, 'error', gifNotFound);
    const column = 'comment, gifid, authorid, createdon, updatedon';
    const values = `'${comment}', '${gifId}', '${authorid}', 'NOW()', 'NOW()'`;
    const createdComment = await insertRecord(gifCommentModel, column, values);
    const commentData = {
      message: commentCreated,
      commentId: createdComment.id,
      gifTitle: gif.title,
      article: gif.article,
      comment: createdComment.comment,
      authorId: createdComment.authorid,
      createdOn: createdComment.createdon
    };
    return response(res, 201, 'success', commentData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

export default {
  createArticleComment, createGifComment
};
