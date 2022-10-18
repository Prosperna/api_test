import { Request, Response } from 'express';
import { User } from '../model/user';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';

let users: User[] = [];

// CREATE user
export const addUser = async (req:Request,res: Response)=>{
    try {
        
        // get post parameters
        const user: User = {
            email: req.body.email,
            password: req.body.password
        };

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // save user
        const savedUser: User= {
            ...user,
            password: hashedPassword,
            id: v4()
        }
        users = [...users, savedUser];

        // return response
        return res.status(200).send({
            message: 'User added successfully',
            data: savedUser
        });

    } catch (error) {
        return res.status(500).send({
            message: 'Failed to add user',
            description: error
        });
    }
}

// GET user list
export const getAllUser = async (req:Request,res: Response)=>{
    try {

        // return all users
        return res.status(200).send(users);

    } catch (error) {
        return res.status(500).send({
            message: 'Failed to get user list',
            description: error
        });
    }
}

// GET specific user using id
export const getUser = async (req:Request,res: Response)=>{
    try {

        const { id } = req.params;

        // get user
        const user = users.find(i => i.id === id);

        if (user) {

            // return specific user
            return res.status(200).send(user);

        } else {

            return res.status(404).send({message: "User not found"});

        }


    } catch (error) {
        return res.status(500).send({
            message: 'Failed to get user list',
            description: error
        });
    }
}
