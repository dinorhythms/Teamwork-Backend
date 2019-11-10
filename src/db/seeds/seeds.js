import bcrypt from 'bcrypt';
import '../../config/env';
import { insertRecord } from '../../services/dbServices';
import { hashPassword } from '../../services/authServices';

const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS, 10));
const queryUser = `'user@gmail.com', '${hashPassword('password', salt)}', 2, 'male', 'nameuser', 'nameuser', 'reception', '10 oshodi street, lagos', 'receptionist'`;
const queryAdmin = `'admin@gmail.com', '${hashPassword('password', salt)}', 1, 'male', 'nameadmin', 'nameadmin', 'administrator', '10 oshodi street, lagos', 'IT Manager'`;

const queryTag = "'office', 'office category'";
const queryTag2 = "'public', 'public category'";

const queryRole = "'admin', 'admin user'";
const queryRole2 = "'employee', 'employee user'";

const seedTables = async () => {
  try {
    await insertRecord('roles', 'name, description', queryRole);
    await insertRecord('roles', 'name, description', queryRole2);
    await insertRecord('users', 'email, password, roleid, gender, firstname, lastname, department, address, jobrole', queryUser);
    await insertRecord('users', 'email, password, roleid, gender, firstname, lastname, department, address, jobrole', queryAdmin);
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
