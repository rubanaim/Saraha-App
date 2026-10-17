export class AppError extends Error {
    //message
    //stack
    //name
    //cause
    statusCode;
    isOperational;

    constructor(message, statusCode, isOperational = true ){
        super(message);
        this.statusCode =statusCode;
        this.isOperational = isOperational;
        //determine which line exactly the error, without it the stack returns wrong error place
        // (doesn't capture the error correctly ) returns that error in error.js in general.
        Error.captureStackTrace(this, this.constructor);
    }
}

