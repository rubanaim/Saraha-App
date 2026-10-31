import {Router} from 'express';
import * as authController from './controllers/auth.controller.js';
import {idempotency} from '../../lib/idempotency/idempotency.js'
import {
    loginLimiter,
    resetPasswordLimiter
} from '../../lib/rate-limiter/rateLimiter.js';
const authRoute = Router();

//naming convenient of url is kebab case
authRoute.post('/register', authController.register);
authRoute.patch('/verify-account',authController.verifyAccount);
authRoute.post('/login', loginLimiter,authController.login);
authRoute.post('/send-otp', authController.sendOTP);
authRoute.post('/reset-password',resetPasswordLimiter, authController.resetPassword);
authRoute.post('/login-with-google', authController.loginWithGoogle);
authRoute.patch('/enable-2-step-verification', authController.enableTwoStepVerification);
authRoute.post('/verify-to-login', authController.verifyToLogin);
authRoute.post('/refresh-token',authController.refreshToken);

export default authRoute;