import messages from '../utils/messages';
import response from '../utils/response';

const routes = (router) => {
  router
    .route('/')
    .get((req, res) => response(res, 200, 'success', {
      message: messages.apiV1Welcome,
    }));
};

export default routes;
