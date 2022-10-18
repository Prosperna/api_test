import { Request, Response } from 'express';
import { User } from '../model/user';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';

export let users: User[] = [];

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


// DELETE specific user using id
export const deleteUser = async (req:Request,res: Response)=>{
    try {

        const { id } = req.params;

        // get user to be delete user
        const user = users.find(i => i.id === id);

        if (user) {

            const userList = users.filter(i => i.id !== id);

            // update user list
            users = [...userList];

            // return deleted user
            return res.status(200).send({
                message: "User deleted successfully",
                data: user
            });

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


// UPDATE specific user
export const updateUser = async (req:Request,res: Response)=>{
    try {

        const { id } = req.params;

        const { email, password, old_password } = req.body;

        // get user to be updated user
        const user = users.find(i => i.id === id);

        if (user) {

            const userList = users.filter(i => i.id !== id);

            const salt = await bcrypt.genSalt(10);

            // verify old password
            const matched = bcrypt.compareSync(old_password, user.password);

            if (matched) {
                const hashedPassword = await bcrypt.hash(password, salt);

                const updatedUser = {
                    ...user,
                    email,
                    password: hashedPassword
                }
    
                // update user list
                users = [ ...userList, updatedUser ];
    
                // return updated user
                return res.status(200).send({
                    message: "User updated successfully",
                    data: updatedUser
                });

            } else {
                // return error
                return res.status(400).send({
                    message: "Old password not matched",
                });
            }


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

