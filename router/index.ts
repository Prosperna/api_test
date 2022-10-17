import { Router } from 'express';
import userRouter  from './userRouter';

const router = Router();

// register user/* endpoints
router.use('/user', userRouter);

export default router;
