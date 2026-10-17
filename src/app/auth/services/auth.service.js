import * as authRepository from '../repositories/auth.repository.js';
import * as otpRepository from '../repositories/otp.repository.js';
import * as useRepository from '../../user/repositories/user.repository.js'
import bcrypt from 'bcrypt';
import crypto from "node:crypto";
import jwt from 'jsonwebtoken';
import {toMs} from "../../../pkg/utils/time.js";
import {sendEmail} from "../../../lib/email/nodemailer.js";
import {senOtpTemplate, verifyAccountTemplate} from "../template/send-email.js";
import {generateOtp} from "../../../lib/utils/otp.js";
import {userAlreadyExists, userAlreadyVerified, userNotExists, userNotVerified} from "../../user/error.js";
import {invalidPassword, otpExpired,invalidCode} from "../error.js";
import {logger} from '../../../pkg/logger/logger.js'
import {generateToken} from "../utils/token.js";
import{ hashPassword, comparePassword} from '../utils/hash.js'
import {verifyGoogleToken} from "../../../lib/utils/google-auth.js";


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

export async function verifyAccount(email,code){
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
   const updatedUser= await useRepository.updateUserByEmail(email,{isVerified:true});
    //5. delete otp from DB
    await otpRepository.deleteOtp(email);
    //6. return updatedUser
    return updatedUser;

}

export async function login(email,password) {
    //1. check user existence
    const user = await authRepository.checkUserExistByEmail(email);
    if(!user) userNotExists;
    if(user.isVerified === false) userNotVerified;
    //2. check password
    const match = await comparePassword(password, user.password);
    if(!match) invalidPassword;
    //3. generate token
   const token= generateToken({id: user._id, name : user.name });
   //return token
    return token;
}

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
    return generateToken({
        id: createdUser._id,
        email : createdUser.email,
    })
}