import { errorResponse } from '../utils/response';
import { uploader } from '../config/cloudinary';

/**
 * a function that is used to upload the supplied image to the cloud
 * @param {Object} file - a proccessed file
 * @returns {Object} - return the uploaded image url
 */
const uploadSingleFile = async (file, filename, id) => {
  const { secure_url: imageUrl } = await uploader.upload(file, {
    public_id: `${id}-${filename.split('.').slice(0, -1).join('.')}`,
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
    const { file, decoded } = req;
    const { id } = decoded;
    const imageUrl = await uploadSingleFile(file.path, file.filename, id);
    req.imageUrl = imageUrl;

    return next();
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message);
  }
};

export default uploadImage;
