import feedController from '../controllers/feedController';
import { checkToken } from '../middlewares/userMiddlewares';
import authorize from '../middlewares/authorizer';
import roles from '../utils/roles';

const { getFeed } = feedController;

const { EMPLOYEE } = roles;

const feedRoute = (router) => {
  router
    .route('/feed')
    /**
     * @swagger
     * components:
     *  schemas:
     *    Feed:
     *      properties:
     *        id:
     *          type: number
     *        createdOn:
     *          type: string
     *          format: date-time
     *        title:
     *          type: string
     *        article:
     *          type: string
     *        authorId:
     *          type: number
     */

  /**
     * @swagger
     * /api/v1/feed:
     *   get:
     *     tags:
     *       - Feeds
     *     description: Get feed
     *     responses:
     *       200:
     *         description: Feeds successfully
     *         content:
     *           application/json:
     *            schema:
     *              type: object
     *              properties:
     *                status:
     *                  type: string
     *                  example: success
     *                data:
     *                  type: array
     *                  description: array of feeds
     *                  items:
     *                    $ref: '#/components/schemas/Feed'
     *
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server error
     *     security:
     *       - bearerAuth: []
     */

    .get(checkToken, authorize(EMPLOYEE), getFeed);
};

export default feedRoute;
