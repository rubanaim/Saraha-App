import {Router} from 'express';
import authRouter from  "./app/auth/auth.route.js";
import userRouter from  "./app/user/user.route.js";
import messageRouter from  "./app/message/routers/message.route.js";
import requestRouter from "./app/request/routes/request.route.js";
export const router = Router();

router.use('/auth',authRouter);
router.use('/user', userRouter);
router.use('/message', messageRouter);
router.use('/request', requestRouter);