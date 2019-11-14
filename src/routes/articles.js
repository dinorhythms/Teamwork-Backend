import articlesController from '../controllers/articlesController';
import commentsController from '../controllers/commentsController';
import { checkToken } from '../middlewares/userMiddlewares';
import authorize from '../middlewares/authorizer';
import { canManipulateArticle } from '../middlewares/articlesMiddlewares';
import validate from '../middlewares/validator';
import roles from '../utils/roles';
import {
  createArticleSchema,
  updateArticleSchema,
  deleteArticleSchema,
  createArticlecommentSchema
} from '../validation/articlesSchema';

const { create, update, deleteArticle } = articlesController;
const { createdArticleComment } = commentsController;

const { EMPLOYEE } = roles;

const articlesRoute = (router) => {
  router
    .route('/articles')
    /**
     * @swagger
     * components:
     *  schemas:
     *    Article:
     *      properties:
     *        title:
     *          type: string
     *        article:
     *          type: string
     *        tagid:
     *          type: number
     */

  /**
     * @swagger
     * /api/v1/articles:
     *   post:
     *     tags:
     *       - Articles
     *     description: Create a new article
     *     produces:
     *       - application/json
     *     requestBody:
     *      description: Article data object
     *      required: true
     *      content:
     *       application/json:
     *          schema:
     *            $ref: '#/components/schemas/Article'
     *     responses:
     *       201:
     *         description: Article created successfully
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
      validate(createArticleSchema),
      create
    );

  router
    .route('/articles/:articleId')
    /**
     * @swagger
     * components:
     *  schemas:
     *    ArticleUpdate:
     *      properties:
     *        title:
     *          type: string
     *        article:
     *          type: string
     */

  /**
     * @swagger
     * /api/v1/articles/{articleId}:
     *   patch:
     *     tags:
     *       - Articles
     *     description: Update article
     *     parameters:
     *       - in: path
     *         name: articleId
     *         required: true
     *         schema:
     *          type: integer
     *         description: The Article ID
     *     produces:
     *       - application/json
     *     requestBody:
     *      description: Article data object
     *      required: true
     *      content:
     *       application/json:
     *          schema:
     *            $ref: '#/components/schemas/ArticleUpdate'
     *     responses:
     *       201:
     *         description: Article updated successfully
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server error
     *     security:
     *       - bearerAuth: []
     */

    .patch(
      checkToken,
      authorize(EMPLOYEE),
      validate(updateArticleSchema),
      canManipulateArticle,
      update
    );

  router
    .route('/articles/:articleId')
    /**
     * @swagger
     * /api/v1/articles/{articleId}:
     *   delete:
     *     tags:
     *       - Articles
     *     description: Delete article
     *     parameters:
     *       - in: path
     *         name: articleId
     *         required: true
     *         schema:
     *          type: integer
     *         description: The Article ID
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Article deleted successfully
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
      validate(deleteArticleSchema),
      canManipulateArticle,
      deleteArticle
    );

  router
    .route('/articles/:articleId/comment')
    /**
     * @swagger
     * components:
     *  schemas:
     *    ArticleComment:
     *      properties:
     *        comment:
     *          type: string
     */

  /**
     * @swagger
     * /api/v1/articles/{articleId}/comment:
     *   post:
     *     tags:
     *       - Comments
     *     description: Create a new article comment
     *     parameters:
     *       - in: path
     *         name: articleId
     *         required: true
     *         schema:
     *          type: integer
     *         description: The Article ID
     *     produces:
     *       - application/json
     *     requestBody:
     *      description: Comment data object
     *      required: true
     *      content:
     *       application/json:
     *          schema:
     *            $ref: '#/components/schemas/ArticleComment'
     *     responses:
     *       201:
     *         description: Article created successfully
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
      validate(createArticlecommentSchema),
      createdArticleComment
    );
};

export default articlesRoute;
