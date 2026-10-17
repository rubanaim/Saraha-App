import {OAuth2Client} from "google-auth-library";
import {AppError} from "../../lib/error/error.js";
import {env} from '../config/env.js';

const client = new OAuth2Client();

export async function verifyGoogleToken(idToken){
    try{
        const ticket=await client.verifyIdToken({
            idToken: idToken,
            audience : [env.google.webClientId, env.google.iosClientId],
        });
        //verifyIdToken returns ticket but if error happens it throws error that why we use try catch
        return ticket.getPayload(); // payload>> {id,name,email,profile-picture} >> from google
    }catch(err){
        throw new AppError('invalid google token', 403);
    }
}