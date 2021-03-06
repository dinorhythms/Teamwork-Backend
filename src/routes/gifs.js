import gifsController from '../controllers/gifsController';
import commentsController from '../controllers/commentsController';
import { checkToken } from '../middlewares/userMiddlewares';
import authorize from '../middlewares/authorizer';
import { canManipulateGifs } from '../middlewares/gifsMiddlewares';
import multerUploads from '../middlewares/multer';
import validate from '../middlewares/validator';
import uploadImage, { deleteImage } from '../middlewares/imageUploader';
import roles from '../utils/roles';
import {
  createGifSchema,
  deleteGifSchema,
  createGifCommentSchema,
  getGifSchema,
  flagGifCommentSchema,
  deleteFlagGifCommentSchema
} from '../validation/gifsSchema';

const {
  create, deleteGif, getGif, flagGif, flagComment, deleteFlagComment, deleteFlagGif
} = gifsController;
const { createGifComment } = commentsController;

const { EMPLOYEE, ADMIN } = roles;

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

  router
    .route('/gifs/:gifId/comment')
    /**
     * @swagger
     * components:
     *  schemas:
     *    GifComment:
     *      properties:
     *        comment:
     *          type: string
     */

  /**
     * @swagger
     * /api/v1/gifs/{gifId}/comment:
     *   post:
     *     tags:
     *       - Comments
     *     description: Create a new gif comment
     *     parameters:
     *       - in: path
     *         name: gifId
     *         required: true
     *         schema:
     *          type: integer
     *         description: The Gif ID
     *     produces:
     *       - application/json
     *     requestBody:
     *      description: Comment data object
     *      required: true
     *      content:
     *       application/json:
     *          schema:
     *            $ref: '#/components/schemas/GifComment'
     *     responses:
     *       201:
     *         description: Comment created successfully
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
      validate(createGifCommentSchema),
      createGifComment
    );

  router
    .route('/gifs/:gifId')
    /**
     * @swagger
     * /api/v1/gifs/{gifId}:
     *   get:
     *     tags:
     *       - Gifs
     *     description: Get gif post by Id
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
     *       200:
     *         description: Gif post received successfully
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server error
     *     security:
     *       - bearerAuth: []
     */

    .get(checkToken, authorize(EMPLOYEE), validate(getGifSchema), getGif);

  router
    .route('/gifs/flag/:gifId')
    /**
     * @swagger
     * /api/v1/gifs/flag/{gifId}:
     *   patch:
     *     tags:
     *       - Flags
     *     description: Flag Gif post
     *     parameters:
     *       - in: path
     *         name: gifId
     *         required: true
     *         schema:
     *          type: integer
     *         description: The Gif post ID
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Gif post flagged successfully
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server error
     *     security:
     *       - bearerAuth: []
     */

    .patch(checkToken, authorize(EMPLOYEE), validate(getGifSchema), flagGif);

  router
    .route('/gifs/flag/comment/:commentId')
    /**
     * @swagger
     * /api/v1/gifs/flag/comment/{commentId}:
     *   patch:
     *     tags:
     *       - Flags
     *     description: Flag comment
     *     parameters:
     *       - in: path
     *         name: commentId
     *         required: true
     *         schema:
     *          type: integer
     *         description: The Comment ID
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Gif post comment flagged successfully
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server error
     *     security:
     *       - bearerAuth: []
     */

    .patch(checkToken, authorize(EMPLOYEE), validate(flagGifCommentSchema), flagComment);

  router
    .route('/gifs/:gifId/comment/:commentId')
    /**
     * @swagger
     * /api/v1/gifs/{gifId}/comment/{commentId}:
     *   delete:
     *     tags:
     *       - Flags
     *     description: Delete flagged Gif post Comment
     *     parameters:
     *       - in: path
     *         name: gifId
     *         required: true
     *         schema:
     *          type: integer
     *         description: The Gif ID
     *       - in: path
     *         name: commentId
     *         required: true
     *         schema:
     *          type: integer
     *         description: The Comment ID
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Gif post comment deleted successfully
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server error
     *     security:
     *       - bearerAuth: []
     */

    .delete(
      checkToken,
      authorize(ADMIN),
      validate(deleteFlagGifCommentSchema),
      deleteFlagComment
    );

  router
    .route('/gifs/:gifId/admin')
    /**
     * @swagger
     * /api/v1/gifs/{gifId}/admin:
     *   delete:
     *     tags:
     *       - Flags
     *     description: Delete flagged Gif Post
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
     *       200:
     *         description: Gif post deleted successfully
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server error
     *     security:
     *       - bearerAuth: []
     */

    .delete(
      checkToken,
      authorize(ADMIN),
      validate(getGifSchema),
      deleteFlagGif
    );
};

export default gifsRoute;
