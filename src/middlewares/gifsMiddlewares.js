import { getById } from '../services/dbServices';
import { errorResponse } from '../utils/response';
import message from '../utils/messages';

const { forbidden } = message;

const gifModel = 'gifs';

/**
 * @function canDeleteGif
 * @param {object} req request object
 * @param {object} res request object
 * @param {function} next next function
 * @returns {Object} response object
 * @description checks if the user is allowed to update article
 */
export const canManipulateGifs = async (req, res, next) => {
  try {
    const { decoded } = req;
    const { id: userId } = decoded;
    const { gifId } = req.params;
    const gif = await getById(gifModel, gifId);
    if (gif && userId === gif.authorid) {
      req.imageUrl = gif.imageurl;
      return next();
    }
    return errorResponse(res, 403, 'error', forbidden);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};
