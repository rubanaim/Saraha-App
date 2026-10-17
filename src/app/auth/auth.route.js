import {Router} from 'express';
import * as authController from './controllers/auth.controller.js';
import {idempotency} from '../../lib/idempotency/idempotency.js'

const authRoute = Router();

//naming convenient of url is kebab case
authRoute.post('/register', authController.register);
authRoute.patch('/verify-account',authController.verifyAccount);
authRoute.post('/login', authController.login);
authRoute.post('/send-otp', authController.sendOTP);
authRoute.post('/reset-password', idempotency(), authController.resetPassword);
authRoute.post('/login-with-google', authController.loginWithGoogle);
export default authRoute;