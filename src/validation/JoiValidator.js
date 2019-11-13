import Joi from '@hapi/joi';

/** *
 *  Object that help to validate request details
 */
const JoiValidation = {

  validateString() {
    return Joi.string();
  },

  validateEmail() {
    return Joi.string().email();
  },

  validatePassword() {
    return Joi.string().min(8).strict()
      .required();
  },

  /**
   * number schema creator
   * @returns {Object} - number schema
  */
  validateNumber() {
    return Joi.number();
  },

};

export default JoiValidation;
