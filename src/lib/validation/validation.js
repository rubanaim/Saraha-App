//function
//get 2 params
//DTO VS body
import {z} from 'zod';
import {AppError} from '../../lib/error/error.js'
export function validateBody(dto, body){
    // z.parse(dto, body); //throw new Error()- doesn't throw error but return it as object result
    const result=z.safeParse(dto, body); //return {success : false, errors : [], data:}
    if(result.success===false){
        //handle error
         const errMessages = result.error.issues.map(issue => `${issue.path[0]} : ${issue.message}`)
         throw new AppError(errMessages.join(', '),400)

    }
    return result.data; //body
}

//result.error.issues
//[{message : "is required", path:['email']},
// {message : "must be >=8", path:['password']}]
//-----after map------
//{
// 'email: is required',
// 'password  : must be >=8'
// }
//------after join------
//"'email: is required','password  : must be >=8'"