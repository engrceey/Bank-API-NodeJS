const Joi = require('joi');


const validateLoginDetails = async (req, res, next) => {
    try {
        const loginSchema = Joi.object({
            email: Joi.string().email().trim().required(),
            password: Joi.string().trim().required(),
        });
        let error = await loginSchema.validate(loginSchema, req.body);
        if (error) return res.status(422).send(error);

        return next();
    } catch (error) {
        return next(error.message);
    }
}

const validateSignUpDetails = async (req, res, next) => {
  try {
    const signUpSchema = Joi.object({
      firstname: Joi.string().trim().required(),
      lastname: Joi.string().trim().required(),
      email: Joi.string().email().trim().required(),
      password: Joi.string().trim().required(),
      role: Joi.string().trim().required(),
    });

    let error = await signUpSchema.validate(signUpSchema, req.body);
    if (error) return res.status(422).send(error);

    return next();
  } catch (error) {
      return next(error.message);
  }
}

module.exports = {validateSignUpDetails, validateLoginDetails}