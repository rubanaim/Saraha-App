import * as authRepository from '../repositories/auth.repository.js';
import * as otpRepository from '../repositories/otp.repository.js';
import * as useRepository from '../../user/repositories/user.repository.js'
import bcrypt from 'bcrypt';
import crypto from "node:crypto";
import jwt from 'jsonwebtoken';
import {toMs,toSeconds} from "../../../pkg/utils/time.js";
import {sendEmail} from "../../../lib/email/nodemailer.js";
import {senOtpTemplate, verifyAccountTemplate} from "../template/send-email.js";
import {generateOtp} from "../../../lib/utils/otp.js";
import {userAlreadyExists, userAlreadyVerified, userNotExists, userNotVerified} from "../../user/error.js";
import {invalidPassword, otpExpired,invalidCode} from "../error.js";
import {logger} from '../../../pkg/logger/logger.js'
import {generateToken, generateAccessToken, generateRefreshToken,verifyRefreshToken} from "../utils/token.js";
import{ hashPassword, comparePassword} from '../utils/hash.js'
import {verifyGoogleToken} from "../../../lib/utils/google-auth.js";
import {cacheProvider} from '../../../lib/cache/init.js';

async function createTokens(sub,name){
    //generate accessToken and refreshToken
    const jti = crypto.randomUUID();
    const accessToken = generateAccessToken({sub,name});
    const refreshToken = generateRefreshToken({ jti, sub, name});
    await cacheProvider.set(`refreshToken:${jti}`, jti, toSeconds(7, 'days') );

    //return tokens
    return {
        accessToken,
        refreshToken
    }
}

//base function
 async function baseFunction(email,code,factory){
    //1. check user existence
    const user = await authRepository.checkUserExistByEmail(email);
    if(!user) userNotExists;
    if(user.isVerified === true) userAlreadyVerified;
    //2. check otp expires or not
    const otp = await otpRepository.getOtpByEmail(email);
    if(!otp) otpExpired;
    //3. check valid otp
    if(otp.code !== code) invalidCode;
    //4. update account set isVerified = true
     const result = await factory(user);
    //5. delete otp from DB
    await otpRepository.deleteOtp(email);
    return result;
}

export async function register(userData){
    // 1. check user existence
    const user = await authRepository.checkUserExistByEmail(userData.email);
    // 2. if yes, throw an error
    if(user) throw userAlreadyExists;
    // 3. hash password
    userData.password = await hashPassword(userData.password);
    // 4. save user into DB
    const createdUser = await authRepository.createUser(userData);
    // 5. generate otp and save it into DB
    const code=generateOtp();
    logger.info(code);
    await otpRepository.createOtp({
        code: code,
        email: userData.email,
        expiredAt: Date.now() + toMs(5,'minutes'),
    })
    // 6. send otp in email
   await sendEmail(userData.email, 'verify account',
       verifyAccountTemplate(code)
       );
    // 7. return created user
    return createdUser;
}

export async function refreshToken(refreshToken){
    //jwt.verify() throws an error if the token is expired or invalid so we use try/catch
    try{
    //1.verify the refresh token
        const payload = verifyRefreshToken(refreshToken);
        //2. check the refresh token still exists in cache
        const storedJti = await cacheProvider.get(
            `refreshToken:${payload.jti}`
        );
        // console.log('Stored JTI:', storedJti);
        if(!storedJti || storedJti !== payload.jti){
            throw new Error('Invalid refresh token');
        }

        //3. generate a new access token
        const accessToken = generateAccessToken({
            sub: payload.sub,
            name: payload.name
        });
        return accessToken;
    }catch(err){
        //pass the error to the conroller's catch block
        throw err;
    }
}

// export async function verifyAccount(email,code){
//     //1. check user existence
//     const user = await authRepository.checkUserExistByEmail(email);
//     if(!user) userNotExists;
//     if(user.isVerified === true) userAlreadyVerified;
//     //2. check otp expires or not
//     const otp = await otpRepository.getOtpByEmail(email);
//     if(!otp) otpExpired;
//     //3. check valid otp
//     if(otp.code !== code) invalidCode;
//     //4. update account set isVerified = true
//     const updatedUser= await useRepository.updateUserByEmail(email,{isVerified:true});
//     //5. delete otp from DB
//     await otpRepository.deleteOtp(email);
//     //6. return updatedUser
//     return updatedUser;
//
// }

export async function verifyAccount(email,code){

    baseFunction(email,code,async ()=>{
        await useRepository.updateUserByEmail(email,{isVerified:true});
    });

}

export async function enableTwoStepVerification(email,code)  {

    // update account set twoStepVerification = true
    baseFunction(email,code,async ()=>{
        await useRepository.updateUserByEmail(email,{twoStepVerification:true});
    });

}

export async function login(email,password) {
    //1. check user existence
    const user = await authRepository.checkUserExistByEmail(email);
    if(!user) userNotExists;
    if(user.isVerified === false) userNotVerified;
    //2. check password
    const match = await comparePassword(password, user.password);
    if(!match) invalidPassword;

    if(user.twoStepVerification){
        const code = generateOtp();
        cacheProvider.set(`otp:${email}`, code, toSeconds(3,'minutes'));
        await sendEmail(email, 'Two Step Verification email code', `<h3>Your OTP Code To Login is ${code}</h3>`);
        return;
    }

    //3. return accessToken and refreshToken
    return await createTokens(user._id,user.name)

}


export async function verifyCodeToLogin(email,code){
    //1. check user existence
    const user = await authRepository.checkUserExistByEmail(email);
    if(!user) userNotExists;
    //2. check otp expires or not
    const otp = await cacheProvider.get(`otp:${email}`);
    if(!otp) otpExpired;
    //3. check valid otp
    if(otp.code !== code) invalidCode;
    //5. delete otp from DB
    await otpRepository.deleteOtp(email);


    //6. return tokens(access and refresh)
    return await createTokens(user._id,user.name)

}


// export async function verifyCodeToLogin(email,code){
//
//    return baseFunction(email, code,async(user)=>{
//        // return tokens(access and refresh)
//        return await createTokens(user._id,user.name)
//    })
//
// }

export async function sendOtp(email){
    //1. check user existence
    const user = await authRepository.checkUserExistByEmail(email);
    if(!user) userNotExists;
    //2. delete all old OTPS
    await otpRepository.deleteOtp(email);
    //3.generate OTP and save it into DB
    const code = generateOtp();
    await otpRepository.createOtp({
         code: code,
        email : email,
        expiredAt: Date.now() + toMs(5,'minutes'),
    })
    //4.send otp email
    await sendEmail(email, "Your Otp", senOtpTemplate(code));
}

export async function resetPassword(email, code,newPassword){
    //1. verify otp code
    const otp = otpRepository.getOtpByEmail(email) //{} / null
    if(!otp) otpExpired;
    if(otp.code !== code) invalidCode;
    //2. hash password
    const hashedPassword = await hashPassword(newPassword);
    //3. update your password
    await useRepository.updateUserByEmail(email, {password: hashedPassword});
    //4. delete otp
    await otpRepository.deleteOtp(email);

}

export async function loginWithGoogle(idToken){
    //1. verify idToken
    const payload = await verifyGoogleToken(idToken)
    //2. check user exists
    const user = await authRepository.checkUserExistByEmail(payload.email);
    //3. if exists >> generate token
    if(user) {
        return generateToken({
            id: user._id,
            email : user.email,
        })
    }
    //3. if not exist >> create user and generate token
   const createdUser = await authRepository.createUser({
        name: payload.name,
        email: payload.email,
        provider: 'google',
        isVerified: true,
    });

    //4. return accessToken and refreshToken
    return await createTokrns(createdUser._id,createdUser.name);
}