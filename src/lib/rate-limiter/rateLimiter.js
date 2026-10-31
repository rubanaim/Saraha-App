import { rateLimit } from 'express-rate-limit';
import { toMs } from '../../pkg/utils/time.js';

export const loginLimiter = rateLimit({
    windowMs: toMs(3, 'minutes'),
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many login attempts. Try again later.'
    }
});

export const resetPasswordLimiter = rateLimit({
    windowMs: toMs(3, 'minutes'),
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many password reset requests. Try again later.'
    }
});