import response, { errorResponse } from '../utils/response';
import messages from '../utils/messages';

import {
  insertRecord,
  updateRecord,
  getAllByOption,
  getById,
  deleteRecord
} from '../services/dbServices';

const {
  gifCreated, gifExists, invalidTagId, gifDeleted
} = messages;
const gifModel = 'gifs';
const tagModel = 'tags';

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

export default {
  create,
  deleteGif
};
