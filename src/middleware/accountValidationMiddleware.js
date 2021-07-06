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