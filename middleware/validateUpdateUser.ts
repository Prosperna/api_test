import { NextFunction, Request, Response } from 'express';
import joi from 'joi';
import { decodeToken, verifyToken } from '../utils/jwt';

export const validateUpdateUser = async (req: Request, res: Response, next:NextFunction)=> {
try {

    // specify validation of form
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    });

    const user = req.body;

    const token  = req.headers.authorization?.replace('Bearer ','');
    
    if (token) {

        const isAuthenticated = verifyToken(token||'');
        if (isAuthenticated) {

         res.locals = decodeToken(token)?.data;
 
        }
        
    }

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