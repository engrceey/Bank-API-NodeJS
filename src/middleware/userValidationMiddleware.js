const Joi = require('joi');


const validateLoginDetails = async (req, res, next) => {
    try { 
        const loginSchema = Joi.object({
            email: Joi.string().email().trim().required(),
            password: Joi.string().trim().required(),
        });

        const {error} = loginSchema.validate(req.body);
        
        if (error) return res.status(422).send(error.message);

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
      phonenumber: Joi.string().trim().min(11).max(11).required()
    });

    let {error} = signUpSchema.validate(req.body);
    if (error) return res.status(422).send(error.message);

    return next();
  } catch (error) {
      return next(error.message);
  }
}


const validateUpdateDetails = async (req, res, next) => {
  try {
    const updateSchema = Joi.object({
      firstname: Joi.string().trim().required(),
      lastname: Joi.string().trim().required(),
      phonenumber: Joi.string().trim().min(11).max(11).required()
    });

    let {error} = updateSchema.validate(req.body);
    if (error) return res.status(422).send(error.message);

    return next();
  } catch (error) {
      return next(error.message);
  }
}




module.exports = {validateSignUpDetails, validateLoginDetails, validateUpdateDetails}