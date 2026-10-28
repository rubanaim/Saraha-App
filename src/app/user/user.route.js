import {Router} from 'express';
import * as userController from './controllers/user.controller.js';
import {uploadSingleFile} from '../../lib/media/multer.js';
import {fileValidation} from '../../lib/media/file.validation.js'
import {allowedFields} from '../../lib/media/file.validation.js'
import {authGuard} from "../../lib/auth/authGuard.js";
const userRouter = Router();

userRouter.post('/upload-profile-pic',
    authGuard,
    uploadSingleFile('pp',allowedFields.images),
    fileValidation(),
    userController.uploadProfilePic
);

export default userRouter;