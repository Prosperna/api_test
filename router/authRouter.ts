import { Router } from 'express';
import { login } from '../controller/authController'
import validateLoginParameters from '../middleware/validateLoginParameters';


const authRouter: Router = Router();

// register POST request for login

authRouter.post('/login',validateLoginParameters, login);

export default authRouter;