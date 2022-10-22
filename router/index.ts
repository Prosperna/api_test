import { Router } from 'express';
import userRouter  from './userRouter';
import prodcutRouter  from './productRouter';
import authRouter  from './authRouter';

const router = Router();

// register user/* endpoints
router.use('/user', userRouter);
router.use('/product', prodcutRouter);
router.use('/auth', authRouter);

export default router;
