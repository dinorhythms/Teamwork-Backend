import response, { errorResponse } from '../utils/response';
import messages from '../utils/messages';

import {
  insertRecord,
  updateRecord,
  getAllByOption,
  getById,
  deleteRecord,
  getSelectedByOption
} from '../services/dbServices';

const {
  gifCreated, gifExists, invalidTagId, gifDeleted, gifNotFound,
  flaggedSuccess, commentNotFound, commentNotFlagged, commentdeleted, gifNotFlagged
} = messages;
const gifModel = 'gifs';
const tagModel = 'tags';
const commentModel = ' gifcomments';

/**
 * gifs create controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const create = async (req, res) => {
  try {
    const { title, tagid } = req.body;
    const { imageUrl } = req;
    const authorid = parseInt(req.decoded.id, 10);
    const exists = await getAllByOption(
      gifModel,
      `authorid='${authorid}' AND title='${title}'`
    );
    if (exists) return errorResponse(res, 400, 'error', gifExists);
    const tagExists = await getById(tagModel, `'${tagid}'`);
    if (!tagExists) return errorResponse(res, 400, 'error', invalidTagId);
    const column = 'title, imageUrl, authorid, tagid, createdon, updatedon';
    const where = `id=${tagid}`;
    const values = `'${title}', '${imageUrl}', '${authorid}', '${tagid}', 'NOW()', 'NOW()'`;
    const createdGif = await insertRecord(gifModel, column, values);
    if (createdGif) {
      await updateRecord(
        tagModel,
        "counttag=counttag+1, updatedon='NOW()'",
        where
      );
    }
    const gifData = {
      message: gifCreated,
      gifId: createdGif.id,
      title: createdGif.title,
      imageUrl: createdGif.imageurl,
      tagId: createdGif.tagid,
      createdOn: createdGif.createdon
    };
    return response(res, 201, 'success', gifData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * article delete controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const deleteGif = async (req, res) => {
  try {
    const { gifId } = req.params;
    const deletedGif = await deleteRecord(gifModel, gifId);
    const deletedGifData = {
      message: gifDeleted,
      gifId: deletedGif.id,
      title: deletedGif.title,
      imageurl: deletedGif.imageurl,
      tagId: deletedGif.tagid,
      createdOn: deletedGif.createdon,
      updatedOn: deletedGif.updatedon
    };
    return response(res, 201, 'success', deletedGifData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * get article controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const getGif = async (req, res) => {
  try {
    const { gifId } = req.params;
    const gif = await getById(gifModel, gifId);
    const comments = await getSelectedByOption(commentModel, 'id AS commentId, comment, authorid', `WHERE gifid='${gifId}'`) || [];
    if (!gif) return errorResponse(res, 400, 'error', gifNotFound);
    const gifData = {
      id: gif.id,
      createdOn: gif.createdon,
      title: gif.title,
      url: gif.imageurl,
      comments
    };
    return response(res, 200, 'success', gifData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * flag gif post controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const flagGif = async (req, res) => {
  try {
    const { gifId } = req.params;
    const values = "flagged=true, updatedon='NOW()'";
    const where = `id=${gifId}`;
    const flagged = await updateRecord(gifModel, values, where);
    if (!flagged) return errorResponse(res, 400, 'error', gifNotFound);
    const gif = {
      message: flaggedSuccess,
      articleId: flagged.id,
      title: flagged.title,
      url: flagged.imageurl,
      tagId: flagged.tagid,
      flagged: flagged.flagged,
      createdOn: flagged.createdon,
      updatedOn: flagged.updatedon
    };
    return response(res, 200, 'success', gif);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * flag gif post comment controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const flagComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const values = "flagged=true, updatedon='NOW()'";
    const where = `id=${commentId}`;
    const flagged = await updateRecord(commentModel, values, where);
    if (!flagged) return errorResponse(res, 400, 'error', commentNotFound);
    const comment = {
      message: flaggedSuccess,
      commentId: flagged.id,
      authorId: flagged.authorid,
      comment: flagged.title,
      flagged: flagged.flagged,
      createdOn: flagged.createdon,
      updatedOn: flagged.updatedon
    };
    return response(res, 200, 'success', comment);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * delete flag article comment controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const deleteFlagComment = async (req, res) => {
  try {
    const { gifId, commentId } = req.params;
    const gif = await getById(gifModel, gifId);
    if (!gif) return errorResponse(res, 400, 'error', gifNotFound);
    // check flag
    const flaggedComment = await getById(commentModel, commentId);
    if (!flaggedComment) return errorResponse(res, 400, 'error', commentNotFound);
    if (flaggedComment && !flaggedComment.flagged) return errorResponse(res, 400, 'error', commentNotFlagged);
    const comment = await deleteRecord(commentModel, commentId);
    const commentData = {
      message: commentdeleted,
      commentId: comment.id,
      gifId: comment.gifid,
      authorId: comment.authorid,
      comment: comment.title,
      flagged: comment.flagged,
      createdOn: comment.createdon,
      updatedOn: comment.updatedon
    };
    return response(res, 200, 'success', commentData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * delete flag gif post controller
 * @param {Object} req - server request
 * @param {Object} res - server response
 * @returns {Object} - custom response
 */
const deleteFlagGif = async (req, res) => {
  try {
    const { gifId } = req.params;
    const gif = await getById(gifModel, gifId);
    if (!gif) return errorResponse(res, 400, 'error', gifNotFound);
    // check flag
    if (gif && !gif.flagged) return errorResponse(res, 400, 'error', gifNotFlagged);
    const deletedGif = await deleteRecord(gifModel, gifId);
    const gifData = {
      message: gifDeleted,
      articleId: deletedGif.articleid,
      authorId: deletedGif.authorid,
      flagged: deletedGif.flagged,
      createdOn: deletedGif.createdon,
      updatedOn: deletedGif.updatedon
    };
    return response(res, 200, 'success', gifData);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

export default {
  create,
  deleteGif,
  getGif,
  flagGif,
  flagComment,
  deleteFlagComment,
  deleteFlagGif
};
