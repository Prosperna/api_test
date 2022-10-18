import { Router } from 'express';
import { addUser, getAllUser, getUser, updateUser, deleteUser } from '../controller/userController'
import { validateAddedUser } from '../middleware/validateAddedUser';
import { validateUpdateUser } from '../middleware/validateUpdateUser';

const userRouter: Router = Router();

// register POST request for add user
userRouter.get('/',getAllUser);
userRouter.post('/',validateAddedUser,addUser);
userRouter.get('/:id',getUser);
userRouter.put('/:id',validateUpdateUser, updateUser);
userRouter.delete('/:id',deleteUser);

export default userRouter;