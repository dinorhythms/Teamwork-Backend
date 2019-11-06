import '../../config/env';
import { query } from '../index';

/**
 * create queries
 */

const queryRole = `CREATE TABLE IF NOT EXISTS
roles(
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  description VARCHAR(256) NOT NULL,
  createdOn TIMESTAMP DEFAULT current_timestamp,
  updatedOn TIMESTAMP DEFAULT current_timestamp
)`;

const queryUser = `CREATE TABLE IF NOT EXISTS
users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(128) UNIQUE NOT NULL,
  password VARCHAR(128) NOT NULL,
  roleId INTEGER NOT NULL,
  gender VARCHAR(128) NOT NULL,
  firstName VARCHAR(128) NOT NULL,
  lastName VARCHAR(128) NOT NULL,
  department VARCHAR(128) NOT NULL,
  address VARCHAR(128) NOT NULL,
  jobRole VARCHAR(128) NOT NULL,
  createdOn TIMESTAMP DEFAULT current_timestamp,
  updatedOn TIMESTAMP DEFAULT current_timestamp,
  FOREIGN KEY (roleId) REFERENCES roles (id) ON DELETE CASCADE
)`;

const queryTag = `CREATE TABLE IF NOT EXISTS
tags(
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  description VARCHAR(256) NOT NULL,
  countTag INTEGER NOT NULL DEFAULT 0,
  createdOn TIMESTAMP DEFAULT current_timestamp,
  updatedOn TIMESTAMP DEFAULT current_timestamp
)`;

const queryArticle = `CREATE TABLE IF NOT EXISTS
articles(
  id SERIAL PRIMARY KEY,
  authorId INTEGER NOT NULL,
  tagId INTEGER NOT NULL,
  title VARCHAR(256) NOT NULL,
  article TEXT NOT NULL,
  flagged BOOLEAN NOT NULL DEFAULT FALSE,
  createdOn TIMESTAMP DEFAULT current_timestamp,
  updatedOn TIMESTAMP DEFAULT current_timestamp,
  FOREIGN KEY (authorId) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES tags (id) ON DELETE CASCADE
)`;

const queryGif = `CREATE TABLE IF NOT EXISTS
gifs(
  id SERIAL PRIMARY KEY,
  authorId INTEGER NOT NULL,
  tagId INTEGER NOT NULL,
  title VARCHAR(256) NOT NULL,
  imageUrl VARCHAR(256) NOT NULL,
  flagged BOOLEAN NOT NULL DEFAULT FALSE,
  createdOn TIMESTAMP DEFAULT current_timestamp,
  updatedOn TIMESTAMP DEFAULT current_timestamp,
  FOREIGN KEY (authorId) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES tags (id) ON DELETE CASCADE
)`;

const queryArticleComment = `CREATE TABLE IF NOT EXISTS
articleComments(
  id SERIAL PRIMARY KEY,
  authorId INTEGER NOT NULL,
  articleId INTEGER NOT NULL,
  title VARCHAR(256) NOT NULL,
  article TEXT NOT NULL,
  flagged BOOLEAN NOT NULL DEFAULT FALSE,
  createdOn TIMESTAMP DEFAULT current_timestamp,
  updatedOn TIMESTAMP DEFAULT current_timestamp,
  FOREIGN KEY (authorId) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (articleId) REFERENCES articles (id) ON DELETE CASCADE
)`;

const queryGifComment = `CREATE TABLE IF NOT EXISTS
gifComments(
  id SERIAL PRIMARY KEY,
  authorId INTEGER NOT NULL,
  gifId INTEGER NOT NULL,
  title VARCHAR(256) NOT NULL,
  article TEXT NOT NULL,
  flagged BOOLEAN NOT NULL DEFAULT FALSE,
  createdOn TIMESTAMP DEFAULT current_timestamp,
  updatedOn TIMESTAMP DEFAULT current_timestamp,
  FOREIGN KEY (authorId) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (gifId) REFERENCES gifs (id) ON DELETE CASCADE
)`;

/**
 * Create Tables
 */

const createTables = async () => {
  try {
    await query(queryRole);
    await query(queryUser);
    await query(queryTag);
    await query(queryArticle);
    await query(queryGif);
    await query(queryArticleComment);
    await query(queryGifComment);
  } catch (error) {
    console.log(error.toString());
  }
};

module.exports = {
  createTables
};

require('make-runnable');
