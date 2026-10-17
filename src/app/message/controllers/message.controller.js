import {validateBody} from "../../../lib/validation/validation.js"
import {sendMessageDTO} from "../dto/message.dto.js"
import * as messageService from '../services/message.service.js';

export async function sendMessage(req,res,next){
    try{
        //validate data
        const data = validateBody(sendMessageDTO, req.body);
        const {content,receiver } = data;
        const sender = req.user?.id; //? may {} || null
       const createdMessage= await messageService.sendMessage(content, receiver, sender);
       res.status(201).json({
           message: 'Message Send Successfully',
           success : true,
           data: createdMessage
       })
    }catch(err){
        next(err);
    }
}
export async function getAllMessages(req,res,next){
    try{
        const messages = await messageService.getAllMessages(req.user.id);
        res.json({
            message : "OK",
            success : true,
            data : messages,
        });
    }catch(error){
        next(error);
    }
}