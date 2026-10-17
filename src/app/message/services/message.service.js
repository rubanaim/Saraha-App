import * as userRepository from '../../user/repositories/user.repository.js'
import {userNotExists}  from '../../user/error.js';
import * as messageRepository from '../repositories/message.repository.js';
import {AppError} from "../../../lib/error/error.js";
export async function sendMessage (content, receiver,sender ){
    //1. check receiver exists
     const user = await userRepository.findUSerById(receiver);
     if(!user) throw userNotExists;
    //2. save message into db
     return await messageRepository.createMessage(content,receiver,sender);
}

export async function getAllMessages(userId){
     const messages = messageRepository.getAllMessages(userId);
     if(messages.length === 0) throw new AppError('No messages found',404);
     return messages;
}