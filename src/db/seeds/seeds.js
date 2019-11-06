import bcrypt from 'bcrypt';
import '../../config/env';
import { insertRecord } from '../../services/dbServices';
import { hashPassword } from '../../services/authServices';

const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS, 10));
const queryUser = `'user@gmail.com', '${hashPassword('password', salt)}', 'male', 'nameuser', 'nameuser', 'reception', '10 oshodi street, lagos', 'employee'`;
const queryAdmin = `'admin@gmail.com', '${hashPassword('password', salt)}', 'male', 'nameadmin', 'nameadmin', 'administrator', '10 oshodi street, lagos', 'admin'`;

const queryTag = "'office', 'office category'";
const queryTag2 = "'public', 'public category'";

const seedTables = async () => {
  try {
    await insertRecord('users', 'email, password, gender, firstname, lastname, department, address, jobrole', queryUser);
    await insertRecord('users', 'email, password, gender, firstname, lastname, department, address, jobrole', queryAdmin);
    await insertRecord('tags', 'name, description', queryTag);
    await insertRecord('tags', 'name, description', queryTag2);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  seedTables
};

require('make-runnable');