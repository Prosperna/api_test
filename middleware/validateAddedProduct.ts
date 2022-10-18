import { NextFunction, Request, Response } from 'express';
import joi from 'joi';

const validateAddedProduct = async (req: Request, res: Response, next:NextFunction) => {
    try {

        // specify validation of form
        const schema = joi.object({
            product_name: joi.string().required(),
            product_description: joi.string().required(),
            product_price: joi.number().min(1).required(),
            product_tag: joi.array().items(joi.string()).required(),
        });

        const product = req.body;

        // validate form
        const result = await schema.validateAsync(product);
        
        if (result) {
            // if form is valid proceed to add product function
            next();
        } else {
            // invalid form data
            return res.status(400).send({error: result});
        }

        
    } catch (error) {
        // return if there is unhandled error
        return res.status(500).send({
            message: 'Internal server error',
            error
        });
    }
};

export default validateAddedProduct