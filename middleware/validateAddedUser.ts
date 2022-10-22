import { NextFunction, Request, Response } from 'express';
import joi from 'joi';
export const validateAddedUser = async (req: Request, res: Response, next:NextFunction)=> {
try {

    // specify validation of form
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
        password_confirmation: joi.string().required().valid(joi.ref('password'))
    });

    const user = req.body;

    // validate form
    const result = await schema.validateAsync(user);
    
    if (result) {
        // if form is valid proceed to add user function
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