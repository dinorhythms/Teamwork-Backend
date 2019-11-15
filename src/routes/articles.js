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
  createArticleCommentSchema,
  getArticleSchema,
  getArticleByTagSchema,
  flagArticleCommentSchema,
  deleteFlagArticleCommentSchema
} from '../validation/articlesSchema';

const {
  create,
  update,
  deleteArticle,
  getArticle,
  getArticlesByTag,
  flagArticle,
  flagComment,
  deleteFlagComment,
  deleteFlagArticle
} = articlesController;
const { createArticleComment } = commentsController;

const { EMPLOYEE, ADMIN } = roles;

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
     *         description: comment created successfully
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
      validate(createArticleCommentSchema),
      createArticleComment
    );

  router
    .route('/articles/:articleId')
    /**
     * @swagger
     * /api/v1/articles/{articleId}:
     *   get:
     *     tags:
     *       - Articles
     *     description: Get article by Id
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
     *       200:
     *         description: Article received successfully
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server error
     *     security:
     *       - bearerAuth: []
     */

    .get(
      checkToken,
      authorize(EMPLOYEE),
      validate(getArticleSchema),
      getArticle
    );

  router
    .route('/articles/tag/:tagId')
    /**
     * @swagger
     * /api/v1/articles/tag/{tagId}:
     *   get:
     *     tags:
     *       - Articles
     *     description: Get articles by tagId
     *     parameters:
     *       - in: path
     *         name: tagId
     *         required: true
     *         schema:
     *          type: integer
     *         description: The Tag ID
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Article received successfully
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server error
     *     security:
     *       - bearerAuth: []
     */

    .get(
      checkToken,
      authorize(EMPLOYEE),
      validate(getArticleByTagSchema),
      getArticlesByTag
    );

  router
    .route('/articles/flag/:articleId')
    /**
     * @swagger
     * /api/v1/articles/flag/{articleId}:
     *   patch:
     *     tags:
     *       - Flags
     *     description: Flag articles
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
     *       200:
     *         description: Article flagged successfully
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
      validate(getArticleSchema),
      flagArticle
    );

  router
    .route('/articles/flag/comment/:commentId')
    /**
     * @swagger
     * /api/v1/articles/flag/comment/{commentId}:
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
     *         description: Article post comment flagged successfully
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
      validate(flagArticleCommentSchema),
      flagComment
    );

  router
    .route('/articles/:articleId/comment/:commentId')
    /**
     * @swagger
     * /api/v1/articles/{articleId}/comment/{commentId}:
     *   delete:
     *     tags:
     *       - Flags
     *     description: Delete flagged Article Comment
     *     parameters:
     *       - in: path
     *         name: articleId
     *         required: true
     *         schema:
     *          type: integer
     *         description: The Article ID
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
     *         description: Article post comment deleted successfully
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
      validate(deleteFlagArticleCommentSchema),
      deleteFlagComment
    );

  router
    .route('/articles/:articleId/admin')
    /**
     * @swagger
     * /api/v1/articles/{articleId}/admin:
     *   delete:
     *     tags:
     *       - Flags
     *     description: Delete flagged Article
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
     *       200:
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
      authorize(ADMIN),
      validate(getArticleSchema),
      deleteFlagArticle
    );
};

export default articlesRoute;
