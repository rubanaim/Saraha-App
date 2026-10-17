import {OTP} from "../models/otp.model.js";

export async function createOtp(otpData){
    return await OTP.create(otpData);
}

export async function getOtpByEmail(email){
    return await OTP.findOne({email:email});
}

export async function deleteOtp(email){
    return await OTP.deleteOne({email:email});
}