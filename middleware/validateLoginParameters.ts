import { NextFunction, Request, Response } from 'express';
import joi from 'joi';

const validateLoginParameters = async (req: Request, res: Response, next:NextFunction)=> {
    try {

        // specify validation of form
        const schema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required(),
        });

        const user = req.body;

        // validate form
        const result = await schema.validateAsync(user);
        
        if (result) {
            // if form is valid proceed to login function
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

export default validateLoginParameters;