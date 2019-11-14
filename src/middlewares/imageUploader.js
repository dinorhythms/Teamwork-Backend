import { errorResponse } from '../utils/response';
import messages from '../utils/messages';
import slugify from '../utils/slugify';
import { uploader } from '../config/cloudinary';

const { gifDeleteError } = messages;
/**
 * a function that is used to upload the supplied image to the cloud
 * @param {Object} file - a proccessed file
 * @param {Object} filename - a proccessed filename
 * @param {Object} id - the user id
 * @returns {Object} - return the uploaded image url
 */
const uploadSingleFile = async (file, title, id) => {
  const filename = slugify(title);
  const { secure_url: imageUrl } = await uploader.upload(file, {
    public_id: `${id}-${filename}`,
    overwrite: true,
    folder: 'teamwork',
    transformation: [
      {
        width: 500,
        height: 250,
        crop: 'scale',
        quality: 'auto'
      }
    ],
    allowedFormats: ['gif']
  });

  return imageUrl;
};

/**
 * a middleware to upload image
 * @param {Object} req - request object
 * @param {Oject} res - response object
 * @param {Function} next - next function
 * @returns {Object} - Returns Object
 */
const uploadImage = async (req, res, next) => {
  try {
    const { file, decoded, body } = req;
    const { id } = decoded;
    const { title } = body;
    const imageUrl = await uploadSingleFile(file.path, title, id);
    req.imageUrl = imageUrl;

    return next();
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

/**
 * a middleware to delete image on cloudinary
 * @param {Object} req - request object
 * @param {Oject} res - response object
 * @param {Function} next - next function
 * @returns {Object} - Returns Object
 */
export const deleteImage = async (req, res, next) => {
  try {
    const { imageUrl } = req;
    const filename = imageUrl.split('\\').pop().split('/').pop();
    const publicId = filename.split('.').slice(0, -1).join('.');
    const result = await uploader.destroy(`teamwork/${publicId}`);
    if (result.result === 'ok') return next();
    return errorResponse(res, 500, 'error', gifDeleteError);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

export default uploadImage;
