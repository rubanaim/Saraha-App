import {AppError} from "../../lib/error/error.js";

export const userNotExists = new AppError('User Not Exists',404);
export const userAlreadyExists = new AppError('User Already Exists',409);
export const userAlreadyVerified = new AppError('User Already Verified',400);
export const userNotVerified = new AppError('User Not Verified',403)