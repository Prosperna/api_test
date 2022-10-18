import { Router } from 'express';
import { addUser, getAllUser, getUser } from '../controller/userController'
import { validateAddedUser } from '../middleware/validateAddedUser';

const userRouter: Router = Router();

// register POST request for add user
userRouter.get('/',getAllUser);
userRouter.post('/',validateAddedUser,addUser);
userRouter.get('/:id',getUser);

export default userRouter;