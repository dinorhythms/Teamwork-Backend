import { Pool } from 'pg';

let DATABASE_URL = null;

switch (process.env.NODE_ENV) {
  case 'development':
    DATABASE_URL = process.env.DEV_DATABASE_URL;
    break;
  case 'production':
    DATABASE_URL = process.env.DATABASE_URL;
    break;
  case 'test':
    DATABASE_URL = process.env.TEST_DATABASE_URL;
    break;
  default:
    DATABASE_URL = process.env.DEV_DATABASE_URL;
    break;
}

const pool = new Pool({
  connectionString: DATABASE_URL
});

// a generic query, that executes all queries you send to it
const query = async (text) => new Promise((resolve, reject) => {
  pool
    .query(text)
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
});

export { query };
