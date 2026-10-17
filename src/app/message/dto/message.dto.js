import {z} from 'zod';
import {Types} from 'mongoose';
export const sendMessageDTO = z.object({
    content : z.string().trim().min(2).max(100),
    receiver : z.string().trim().refine((val)=>{
        //ObjectId function >> check if this value can be used to create valid objectId
        return Types.ObjectId.isValid(val); // return boolean  //check length == 24 and char 0-9|a-f
    })
})