import response, { errorResponse } from '../utils/response';
import messages from '../utils/messages';

import { getSelectedByOption } from '../services/dbServices';

const { feedNotFound } = messages;
const articleModel = 'articles';
const gifModel = 'gifs';

/**
 * get feed controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const getFeed = async (req, res) => {
  try {
    let fd;
    const articles = await getSelectedByOption(
      articleModel,
      'id, createdon, title, article, authorid, flagged, tagid',
      ''
    );
    const gifs = await getSelectedByOption(
      gifModel,
      'id, createdon, title, imageurl as url, authorid, flagged, tagid',
      ''
    );
    if (gifs && articles) fd = [...articles, ...gifs];
    if (!gifs && articles) fd = [...articles];
    if (gifs && !articles) fd = [...gifs];
    if (!gifs && !articles) return errorResponse(res, 400, 'error', feedNotFound);
    // eslint-disable-next-line no-nested-ternary
    fd = fd.sort((b, a) => (a.createdon > b.createdon ? 1 : b.createdon > a.createdon ? -1 : 0));
    return response(res, 200, 'success', fd);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

export default {
  getFeed
};
