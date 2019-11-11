import bcrypt from 'bcrypt';
import { generateToken, comparePasswords, hashPassword } from '../services/authServices';
import response, { errorResponse } from '../utils/response';
import messages from '../utils/messages';

import { getAllByOption, insertRecord } from '../services/dbServices';
import roles from '../utils/roles';

const {
  incorrectPassword, userNotFound, emailExists, signUpSuccess
} = messages;
const userModel = 'users';

const { EMPLOYEE } = roles;
const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS, 10));

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
    const token = generateToken({ id: userId, roleId: data.roleid });
    return response(res, 200, 'success', { userId, ...data, token });
  } catch (error) {
    response(res, 500, 'error', { error: error.message });
  }
};

/**
 * user signup controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const signUp = async (req, res) => {
  try {
    const {
      firstname, lastname, email, password, gender, address, jobrole, department
    } = req.body;
    const exists = await getAllByOption(userModel, `email='${email}'`);
    if (exists) return response(res, 400, 'error', { message: emailExists });
    const column = 'email, password, roleid, gender, firstname, lastname, department, address, jobrole, createdon, updatedon';
    const user = `'${email}', '${hashPassword(password, salt)}', '${EMPLOYEE}', '${gender}', '${firstname}', '${lastname}', '${department}', '${address}', '${jobrole}', 'NOW()', 'NOW()'`;
    const createdUser = await insertRecord(userModel, column, user);
    const userData = {
      userId: createdUser.id,
      message: signUpSuccess,
      email: createdUser.email,
      firstName: createdUser.firstname,
      lastName: createdUser.lastname,
      token: generateToken({ id: createdUser.id, roleId: createdUser.roleid }),
    };
    return response(res, 200, 'success', userData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

export default {
  signIn, signUp
};
