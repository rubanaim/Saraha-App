import express from 'express';
import {router} from './route.js'
import {config} from "dotenv";
import connectToDB from "./lib/db/mongoose.js";
import {logger} from "./pkg/logger/logger.js"
import cors from 'cors';
import {env} from "./lib/config/env.js"
import {globalErrorHandler} from "./lib/error/error.handler.js";
import {correlationId} from "./pkg/correlation/correlationId.js";
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import {toMs} from "./pkg/utils/time.js";
import {AppError} from "./lib/error/error.js";


export function createApp(){
    const app = express();

    // const limiter = rateLimit({
    //     windowMs: toMs(3,'minutes'), // 3 minutes
    //     limit: 5, // Limit each IP to 5 requests per `window` (here, per 3 minutes).
    //     standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    //     handler: function(req,res,next){
    //         next(new AppError(this.message,this.statusCode));
    //     }
    // })

// Apply the rate limiting middleware to all requests.
//     app.use(limiter);


//determine who can call the app
    app.use(cors({origin: 'http://localhost:4200'}));
//get static files
    app.use('/uploads',express.static('uploads'));
//parses the JSON text from the HTTP request body into a JavaScript object.
    app.use(express.json());
    app.use(cookieParser());
// Generate a correlation ID for every request
    app.use(correlationId);

    app.get('/health', (req,res,next)=>{
        console.log('Server is Hit');

        res.json('OK')
    });


//connect to DB
    connectToDB();

//routes
app.use('/api', router);

//global error handler
    app.use(globalErrorHandler);

   return app;
}


