import articlesController from '../controllers/articlesController';
import { checkToken } from '../middlewares/userMiddlewares';
import authorize from '../middlewares/authorizer';
import validate from '../middlewares/validator';
import roles from '../utils/roles';
import {
  createArticleSchema
} from '../validation/articlesSchema';

const {
  create
} = articlesController;

const { EMPLOYEE } = roles;

const articlesRoute = (router) => {
  router.route('/articles')
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

    .post(checkToken, authorize(EMPLOYEE), validate(createArticleSchema), create);
};

export default articlesRoute;
