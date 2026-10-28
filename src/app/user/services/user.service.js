import * as userRepository from '../repositories/user.repository.js';
import {userNotExists} from "../error.js";
export const uploadProfilePicture = async(userId,file)=>{
    //get user old pic
    const user = await userRepository.findUSerById(userId);
    if(!user) throw userNotExists;
    //delete old pic from server
    if(user.prfilePicPath) {
        fs.unlinkSync(user.profilePicPath);
    }
    //update new pic
    await userRepository.updateUserByEmail(user.email, {profilePicPath: file.path});
}