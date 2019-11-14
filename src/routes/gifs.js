import gifsController from '../controllers/gifsController';
import { checkToken } from '../middlewares/userMiddlewares';
import authorize from '../middlewares/authorizer';
import { canManipulateGifs } from '../middlewares/gifsMiddlewares';
import multerUploads from '../middlewares/multer';
import validate from '../middlewares/validator';
import uploadImage, { deleteImage } from '../middlewares/imageUploader';
import roles from '../utils/roles';
import { createGifSchema, deleteGifSchema } from '../validation/gifsSchema';

const { create, deleteGif } = gifsController;

const { EMPLOYEE } = roles;

const gifsRoute = (router) => {
  router
    .route('/gifs')
    /**
     * @swagger
     * components:
     *  schemas:
     *    Gif:
     *      properties:
     *        title:
     *          type: string
     *        image:
     *          type: string
     *          format: binary
     */

  /**
     * @swagger
     * /api/v1/gifs:
     *   post:
     *     tags:
     *       - Gifs
     *     description: Create a new gif
     *     produces:
     *       - application/json
     *     requestBody:
     *      description: Gif data object
     *      required: true
     *      content:
     *             multipart/form-data:
     *               schema:
     *                 type: object
     *                 properties:
     *                  title:
     *                    type: string
     *                  tagid:
     *                    type: number
     *                  image:
     *                    type: string
     *                    format: binary
     *               encoding:
     *                images:
     *                  contentType: image/*
     *     responses:
     *       201:
     *         description: Gif created successfully
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server error
     *     security:
     *       - bearerAuth: []
     */

    .post(
      checkToken,
      authorize(EMPLOYEE),
      multerUploads,
      validate(createGifSchema),
      uploadImage,
      create
    );

  router
    .route('/gifs/:gifId')
    /**
     * @swagger
     * /api/v1/gifs/{gifId}:
     *   delete:
     *     tags:
     *       - Gifs
     *     description: Delete gif
     *     parameters:
     *       - in: path
     *         name: gifId
     *         required: true
     *         schema:
     *          type: integer
     *         description: The Gif ID
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Gif deleted successfully
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server error
     *     security:
     *       - bearerAuth: []
     */

    .delete(
      checkToken,
      authorize(EMPLOYEE),
      validate(deleteGifSchema),
      canManipulateGifs,
      deleteImage,
      deleteGif
    );
};

export default gifsRoute;
