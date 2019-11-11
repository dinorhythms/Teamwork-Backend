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
   * object schema creator
   * @returns {Object} - object schema
  */
  validateBoolean() {
    return Joi.boolean();
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
