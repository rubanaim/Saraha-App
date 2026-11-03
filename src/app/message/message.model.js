import {model,Schema} from "mongoose";

const messageSchema = new Schema({
    content :{
        type: String,
        required: true,
        minlength : 1,
        maxLength:  200,
        trim: true,
    },
    receiver :{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    type: {
            type: String,
            enum: ['anonymous', 'conversation'],
            default: 'anonymous'
        },
    conversation: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
        },
},
    {
        timestamps: true
    }
    );
//model
export const Message = model('Message', messageSchema);