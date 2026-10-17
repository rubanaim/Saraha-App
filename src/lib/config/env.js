//schema >> validate data process.env
//1. errors with missed files
//2. transform data in process.env
import {z} from 'zod';
import {config} from 'dotenv';

config();
const schema = z.object({
    PORT : z.string().default('8000'),

    MONGODB_URL: z.string(),

    SMTP_USER : z.string().trim().toLowerCase(),
    SMTP_PASS : z.string(),
    SECRET_KEY : z.string(),
    GOOGLE_WEB_AUTH_CLIENT_ID : z.string(),

    //using default a lot make silence error
    REDIS_PORT : z.string().default('6379'),
    REDIS_HOST: z.string(),
    REDIS_PASSWORD: z.string(),

});

const parsed = schema.parse(process.env);

export const env = {
    port: Number(parsed.PORT),
    db:{
        url: parsed.MONGODB_URL,
    },
    google: {
        webClientId : parsed.GOOGLE_WEB_AUTH_CLIENT_ID,
        iosClientId: parsed.GOOGLE_IOS_AUT_CLIENT_ID,
    },
    redis: {
        host : parsed.REDIS_HOST,
        port: Number(parsed.REDIS_PORT),
        password: parsed.REDIS_PASSWORD,
    },
   nodemailer:{
        user: parsed.SMTP_USER,
        password : parsed.SMTP_PASS,
   },
    jwt : {
        secret: parsed.SECRET_KEY
    },
    payments: {},
    aws:{}
}