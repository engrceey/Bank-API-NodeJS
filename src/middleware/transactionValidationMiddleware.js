const Joi = require('joi');

const validateTransferDetails = async (req, res, next) => {
    try { 
        const loginSchema = Joi.object({
            transactionType: Joi.string().trim().required(),
            pin: Joi.string().trim().max(4).min(4).required(),
            currency: Joi.string().trim().required(),
            receiversAccountNumber: Joi.string().trim().required(),
            amount: Joi.string().trim().number().required(),
        });

        const {error} = loginSchema.validate(req.body);
        
        if (error) return res.status(422).send(error.message);

        return next();
    } catch (error) {
        return next(error.message);
    }
}


const validateTransferDetails = async (req, res, next) => {
    try { 
        const loginSchema = Joi.object({
            transactionType: Joi.string().trim().required(),
            pin: Joi.string().trim().max(4).min(4).required(),
            currency: Joi.string().trim().required(),
            receiversAccountNumber: Joi.string().trim().required(),
            amount: Joi.string().trim().number().required(),
        });

        const {error} = loginSchema.validate(req.body);
  
        if (error) return res.status(422).send(error.message);

        return next();
    } catch (error) {
        return next(error.message);
    }
}


