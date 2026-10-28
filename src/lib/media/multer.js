import multer from 'multer';
import crypto from 'node:crypto';
import {AppError} from "../error/error.js";
import {allowedFields} from './file.validation.js'
//storage
//1. desk [hdd]
//    folder>>
//    filename >>
//2. memory [ram]

function fileUpload(allowedType = allowedFields.images){
    return multer({
        fileFilter: function (req, file, cb){
            if(!allowedType.includes(file.mimetype)){
                return cb(new AppError('invalid file format', 400), false);
            }
            cb(null, true);
        }
        ,storage: multer.diskStorage({
            destination: 'uploads',
            filename: function(req, file, cb){
                cb(null, `${crypto.randomUUID()}-${file.originalname}`);
            }
        })
    })
}
export function uploadSingleFile(fieldName, allowedType = allowedFields.images  ){
    return fileUpload(allowedType).single(fieldName);
}

export function uploadArrayOfFiles(fieldName, maxCount){
    return fileUpload().array(fieldName, maxCount);
}

export function uploadFields(fields){
    return fileUpload().fields(fields);
}


