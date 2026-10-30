import * as authService from '../services/auth.service.js';
import {toMs} from "../../../pkg/utils/time.js";
import {validateBody} from "../../../lib/validation/validation.js";
import {registerDTO,loginDTO,verifyAccountDTO,sendDTO,resetPasswordDTO} from "../dto/auth.dto.js";
import {setCookies} from '../utils/cookies.js';
export async function register(req,res,next){
    try{
        const data = validateBody(registerDTO, req.body)
        const createdUser = await authService.register(data);
        res.status(201).json({
            message: "user created successfully",
            success: true,
            data: createdUser
        });
    }catch(err){
        next(err);
    }
}

export async function refreshToken(req, res, next) {
    try {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({
                message: 'Refresh token is missing, you have to login',
                success: false
            });
        }
        const accessToken =
            await authService.refreshToken(refreshToken);

        setCookies(res,accessToken,refreshToken);

        return res.json({
            message: 'Access token refreshed successfully',
            success: true
        });
    } catch (err) {
        if (
            err.name === 'JsonWebTokenError' ||
            err.name === 'TokenExpiredError' ||
            err.message === 'Invalid refresh token'
        ) {
            return res.status(401).json({
                message: 'Invalid or expired refresh token',
                success: false
            });
        }

        next(err);
    }
}

export async function verifyAccount(req,res,next){
    try{
        const data  = validateBody(verifyAccountDTO, req.body);
         const {email,code} = data;
       const updatedUser=  await authService.verifyAccount(email,code);
       res.json({
           message: "user verified successfully",
           success: true,
           data: updatedUser
       })
    }catch(err){
        next(err);
    }
}

export async function login(req, res,next){
    try{
        const data = validateBody(loginDTO, req.body);
        const {email,password} = data;
        const tokens = await authService.login(email, password);
        if(!tokens){
            return res.json({
                message:"check your inbox, we sent OTP",
                success : true
            })
        }
        setCookies(res,tokens.accessToken,tokens.refreshToken);
        res.json({
            message: "user login successfully",
            success: true,

        })
    }catch(err){
      next(err);
    }
}

export async function verifyToLogin(req,res,next){
    try{
        const {email, code} = req.body;
        const tokens = await authService.verifyCodeToLogin(email,code);
        setCookies(res,tokens.accessToken,tokens.refreshToken);
        res.json({
            message : "login successfully", success: true
        })
    }catch(err){
        next(err);
    }
}

export async function sendOTP(req,res,next){
    try{
        const data = validateBody(sendDTO, req.body);
        const {email} = data;
        await authService.sendOtp(email);
        res.json({
            message: "new otp send, check your email",
            success: true,
        })
    }catch(err){
        next(err);
    }
}

export async function enableTwoStepVerification(req,res,next){
 try{
     const {email,code} = req.body;
     await authService.enableTwoStepVerification(email,code);
     res.json({message:"enable Two Step Verification successfully", success:true});
 }catch(err){
     next(err);
 }
}

export async function resetPassword(req,res,next){
    try{
        const data = validateBody(resetPasswordDTO, req.body)
        const {email, code, newPassword} = data;
        await authService.resetPassword(email,code,newPassword);
        res.json({
            message: "password reset successfully",
            success : true
        })
    }
    catch(err){
        next(err);
    }

}

export async function loginWithGoogle(req,res,next){
    try{
        const tokens = await authService.loginWithGoogle(req.body.idToken);
        setCookies(res,tokens.accessToken,tokens.refreshToken);
        res.json({message: "user login successfully", success: true});
    }catch(err){
        next(err);
    }
}
//JWT = the authentication token
// Cookie = a place the browser stores the token
//httpOnly means browser JavaScript cannot read the cookie using: document.cookie
//Browser, store this JWT as a cookie called access_token, and send it back to my server on future requests.