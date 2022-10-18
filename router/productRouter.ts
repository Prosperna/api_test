import { Router } from 'express';
import { getAllProduct } from '../controller/productController';

const userRouter: Router = Router();

// register POST request for add user
userRouter.get('/',getAllProduct);


export default userRouter;