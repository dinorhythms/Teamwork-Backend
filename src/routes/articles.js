import articlesController from '../controllers/articlesController';
import { checkToken } from '../middlewares/userMiddlewares';
import authorize from '../middlewares/authorizer';
import { canUpdateArticle } from '../middlewares/articlesMiddlewares';
import validate from '../middlewares/validator';
import roles from '../utils/roles';
import { createArticleSchema, updateArticleSchema } from '../validation/articlesSchema';

const { create, update } = articlesController;

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
     *     description: Create a new article
     *     parameters:
     *       - in: path
     *         name: articleId
     *         type: integer
     *         required: true
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
      canUpdateArticle,
      update
    );
};

export default articlesRoute;
