import { Router } from 'express';
import { addUser } from '../controller/userController'
import { validateAddedUser } from '../middleware/validateAddedUser';

const userRouter: Router = Router();

// register POST request for add user
userRouter.post('/',validateAddedUser,addUser);

export default userRouter;