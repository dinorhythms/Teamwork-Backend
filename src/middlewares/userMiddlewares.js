// import models from '../models';
import { getById } from '../services/dbServices';
import { errorResponse } from '../utils/response';
import messages from '../utils/messages';
import { verifyToken } from '../services/authServices';
import stripBearerToken from '../utils/stripBearerToken';

const userModel = 'users';

const {
  invalidToken, noToken
} = messages;

/**
 * @method checkToken
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {Object} response object
 */
export const checkToken = async (req, res, next) => {
  let token = req.headers.authorization;
  token = stripBearerToken(token);
  try {
    if (token) {
      const decoded = await verifyToken(token);
      const user = await getById(userModel, decoded.id);
      if (!user) {
        return errorResponse(res, 401, 'error', invalidToken);
      }
      req.decoded = decoded;
      return next();
    }
    return errorResponse(res, 401, 'error', noToken);
  } catch (error) {
    return errorResponse(res, 500, 'error', error);
  }
};
