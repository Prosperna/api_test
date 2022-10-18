import { Router } from 'express';
import userRouter  from './userRouter';
import prodcutRouter  from './productRouter';

const router = Router();

// register user/* endpoints
router.use('/user', userRouter);
router.use('/product', prodcutRouter);

export default router;
