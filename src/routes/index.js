import messages from '../utils/messages';
import response from '../utils/response';
import authRoute from './auth';
import articlesRoute from './articles';
import gifsRoute from './gifs';
import feedRoute from './feed';

const routes = (router) => {
  router
    .route('/')
    /**
     * @swagger
     * /api/v1:
     *   get:
     *     tags:
     *      - name: Welcome Message Endpoint
     *     summary: Welcome message endpoint
     *     description: Endpoint returns welcome message
     *     responses:
     *      200:
     *        description: Successful operation
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/welcomeResponse'
     * components:
     *   schemas:
     *     welcomeResponse:
     *       type: object
     *       properties:
     *         status:
     *           type: string
     *         data:
     *           type: object
     *           properties:
     *             message:
     *               type: string
     */
    .get((req, res) => response(res, 200, 'success', {
      message: messages.apiV1Welcome,
    }));

  // auth routes
  authRoute(router);

  // articles routes
  articlesRoute(router);

  // gifs routes
  gifsRoute(router);

  // feed routes
  feedRoute(router);
};

export default routes;
