import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

const authenticated = async (req: Request, res: Response, next:NextFunction) => {
    try {

       const token  = req.headers.authorization?.replace('Bearer ','');
    
       if ( token ) {

           const isAuthenticated = verifyToken(token||'');
           if (isAuthenticated) {
    
            next();
    
           } else {
    
            return res.status(400).send({
                message: 'Not authenticated',
            });
    
           }
       } else {
           return res.status(400).send({
               message: 'Not authenticated',
           });
       }


        
    } catch (error) {
        // return if there is unhandled error
        return res.status(500).send({
            message: 'Internal server error',
            error
        });
    }
};

export default authenticated