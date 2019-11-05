import '../../config/env';
import { query } from '../index';

/**
 * Drop Tables
 */
const dropTables = async () => {
  try {
    const queryRun = 'DROP TABLE IF EXISTS users, articles, gifs, articleComments, gifComments, tags';
    await query(queryRun);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  dropTables
};

require('make-runnable');
