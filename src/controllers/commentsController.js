import response, { errorResponse } from '../utils/response';
import messages from '../utils/messages';

import {
  insertRecord,
  getById,
} from '../services/dbServices';

const {
  articleNotFound, commentCreated
} = messages;
const articleModel = 'articles';
const articleCommentModel = 'articlecomments';

/**
 * article create comment controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const createdArticleComment = async (req, res) => {
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
      articleId: createdComment.id,
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

export default {
  createdArticleComment,
};
