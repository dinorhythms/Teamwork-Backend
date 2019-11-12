import { getById } from '../services/dbServices';
import { errorResponse } from '../utils/response';
import message from '../utils/messages';

const { forbidden, serverError } = message;

const articleModel = 'articles';

/**
 * @function canUpdateArticle
 * @param {object} req request object
 * @param {object} res request object
 * @param {function} next next function
 * @returns {Object} response object
 * @description checks if the user is allowed to update article
 */
export const canManipulateArticle = async (req, res, next) => {
  try {
    const { decoded } = req;
    const { id: userId } = decoded;
    const { articleId } = req.params;
    const article = await getById(articleModel, articleId);
    if (article && userId === article.authorid) {
      return next();
    }
    return errorResponse(res, 403, 'error', forbidden);
  } catch (error) {
    return errorResponse(res, 500, 'error', serverError);
  }
};
