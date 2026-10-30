
import jwt from 'jsonwebtoken';
import {toMs} from '../../../pkg/utils/time.js'
import {env} from '../../../lib/config/env.js';

// Generate Access Token
export function generateAccessToken(payload) {
    return jwt.sign(
        payload,
        env.jwt.secret,
        { expiresIn: '15m' }
    );
}

// Generate Refresh Token
export function generateRefreshToken(payload) {
    return jwt.sign(
        payload,
        env.jwt.refreshSecret,
        { expiresIn: '7d' }
    );
}

// Keep your existing function
export function generateToken(payload) {
    return jwt.sign(
        payload,
        env.jwt.secret,
        { expiresIn: toMs(1, 'hours') }
    );
}

// Verify Refresh Token
export function verifyRefreshToken(token) {
    return jwt.verify(token, env.jwt.refreshSecret);
}