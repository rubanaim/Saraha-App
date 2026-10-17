import {AppError} from "../error/error.js";
import jwt from 'jsonwebtoken';
import {env} from '../config/env.js';
export function authGuard(req, res, next){
    try{
        //logic of check token
        const token = req.cookies.access_token;
        if(!token) throw new AppError('No token provided', 403);
        //so I can get the user data and use it for example to get user profile
        req.user = jwt.verify(token, env.jwt.secret);
        //req.user = payload
        next();
    }catch(err){
        next(err);
    }
}