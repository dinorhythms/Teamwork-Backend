import authController from '../controllers/authController';
import validate from '../middlewares/validator';
import {
  signInSchema
} from '../validation/userSchema';

const {
  signIn,
} = authController;

const authRoute = (router) => {
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
