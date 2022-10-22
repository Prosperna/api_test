import { Router } from 'express';
import { authUser, login } from '../controller/authController'
import authenticated from '../middleware/authenticated';
import validateLoginParameters from '../middleware/validateLoginParameters';


const authRouter: Router = Router();

// register POST request for login

authRouter.post('/login',validateLoginParameters, login);
authRouter.get('/user', authenticated, authUser);

export default authRouter;