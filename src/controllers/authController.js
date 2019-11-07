import { generateToken, comparePasswords } from '../services/authServices';
import response from '../utils/response';
import messages from '../utils/messages';

import { getAllByOption } from '../services/dbServices';

const { incorrectPassword, userNotFound } = messages;
const userModel = 'users';

/**
 * user signin function in auth controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getAllByOption(userModel, `email='${email}'`);
    if (!user) return response(res, 404, 'error', { message: userNotFound });
    const { id: userId, password: hash, ...data } = user[0];
    const passwordsMatch = await comparePasswords(password, hash);
    if (!passwordsMatch) return response(res, 400, 'error', { message: incorrectPassword });
    const token = generateToken({ id: data.id, roleId: data.roleid });
    return response(res, 200, 'success', { userId, ...data, token });
  } catch (error) {
    response(res, 500, 'error', { error: error.message });
  }
};

export default {
  signIn
};
