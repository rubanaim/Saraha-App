import * as userService from '../services/user.service.js';
export const uploadProfilePic = async(req,res,next)=>{
    try{
        await userService.uploadProfilePicture(req.user.id, req.file);
        res.json({message: "upload profile successfully", success: true})
    }catch(err){
        next(err);
    }
}