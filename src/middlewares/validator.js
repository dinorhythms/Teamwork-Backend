import Joi from '@hapi/joi';
import { errorResponse } from '../utils/response';

export default (schema) => (req, res, next) => {
  if (!schema) return next();

  const {
    body, params, query, file
  } = req;

  Joi.validate({
    ...body, ...params, ...query, ...file
  }, schema, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: true
  })
    .then(() => next())
    .catch((err) => {
      const errors = {};
      err.details.forEach((e) => {
        errors[
          e.message.split(' ', 1)[0].replace(/['"]/g, '')
        ] = e.message.replace(/['"]/g, '');
      });
      return errorResponse(res, 400, 'error', errors);
    });
};
