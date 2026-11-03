import * as userRepository from '../../user/repositories/user.repository.js'
import {userNotExists}  from '../../user/error.js';
import * as messageRepository from '../repositories/message.repository.js';
import {AppError} from "../../../lib/error/error.js";
export async function sendMessage (content, receiver,sender ){
    //1. check receiver exists
     const user = await userRepository.findUSerById(receiver);
     if(!user) throw userNotExists;
    //save message into db
     // 2. Create anonymous message
     return await messageRepository.createMessage(
         content,
         receiver,
         sender,
         "anonymous"
     );

}

export async function getAllMessages(userId){
     const messages = await messageRepository.getAllMessages(userId);
     if(messages.length === 0) throw new AppError('No messages found',404);
     return messages;
}