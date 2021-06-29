const Joi = require('joi');

const validateLoginDetails = async (req, res, next) => {
    try {
        const loginSchema = Joi.object({
            email: Joi.string().email().trim().required(),
            password: Joi.string().trim().required(),
        });
        let error = await joyValidate(loginSchema, req);
        if (error) return res.status(400).send(error);

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

    let error = await joyValidate(signUpSchema, req);
    if (error) return res.status(400).send(error);

    return next();
  } catch (error) {
      return next(error.message);
  }
}