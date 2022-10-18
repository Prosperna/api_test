import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { users } from './userController'
import { generateToken } from '../utils/jwt';

// CREATE login function
export const login = async (req:Request,res: Response)=>{
    try {
        
        // get post parameters email and password
        const {
            email,
            password
        } = req.body;

        // find user from the user list
        const user = users.find(i => i.email === email);

        if (user) {
            const isMatch = bcrypt.compareSync(password, user.password);

            if (isMatch) {
                const { password, ...authUser } = user;

                // generate access token
                const token = generateToken(authUser)

                // return auth token
                return res.status(200).send({
                    message: 'Login successfully',
                    data: token
                });
            } else {
                // return error response
                return res.status(400).send({
                    message: 'Invalid username or password',
                });
            }
        } else {
            // return error response
            return res.status(400).send({
                message: 'Invalid username or password',
            });
        }

    } catch (error) {
        return res.status(500).send({
            message: 'Failed to authenticate user',
            description: error
        });
    }
}





