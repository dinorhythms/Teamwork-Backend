import authController from '../controllers/authController';
import { checkToken } from '../middlewares/userMiddlewares';
import authorize from '../middlewares/authorizer';
import validate from '../middlewares/validator';
import roles from '../utils/roles';
import {
  signInSchema, signUpSchema
} from '../validation/userSchema';

const {
  signIn, signUp
} = authController;

const { ADMIN } = roles;

const authRoute = (router) => {
  router.route('/auth/signup')
  /**
     * @swagger
     * components:
     *  schemas:
     *    User:
     *      properties:
     *        email:
     *          type: string
     *        password:
     *          type: string
     *        firstname:
     *          type: string
     *        lastname:
     *         type: string
     *        gender:
     *          type: string
     *        department:
     *          type: string
     *        address:
     *         type: string
     *        jobrole:
     *          type: string
     */

  /**
     * @swagger
     * /api/v1/auth/signup:
     *   post:
     *     tags:
     *       - Users
     *     description: Create a new user account
     *     produces:
     *       - application/json
     *     requestBody:
     *      description: User data object
     *      required: true
     *      content:
     *       application/json:
     *          schema:
     *            $ref: '#/components/schemas/User'
     *     responses:
     *       201:
     *         description: User created successfully
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server error
     *     security:
     *       - bearerAuth: []
     */

    .post(checkToken, authorize(ADMIN), validate(signUpSchema), signUp);

  router.route('/auth/signin')
  /**
       * @swagger
       * components:
       *  schemas:
       *    SignIn:
       *      properties:
       *        email:
       *          type: string
       *        password:
       *          type: string
       */

  /**
       * @swagger
       * /api/v1/auth/signin:
       *   post:
       *     tags:
       *       - Users
       *     description: Authenticate a user with email and password
       *     produces:
       *       - application/json
       *     requestBody:
       *      description: User data object
       *      required: true
       *      content:
       *       application/json:
       *          schema:
       *            $ref: '#/components/schemas/SignIn'
       *     responses:
       *       200:
       *         description: Authenticated user and generated a token
       *       500:
       *         description: Internal Server error
      */

    .post(validate(signInSchema), signIn);
};

export default authRoute;
