import { model , Schema } from 'mongoose';


const schema = new Schema({
    messageId: { type: Schema.Types.ObjectId, ref: "Message", required: true},
    senderOfReq: { type: Schema.Types.ObjectId, ref: "User", required: true},
    receiverOfReq: { type: Schema.Types.ObjectId, ref: "User",  required: true},
    status: {
        type: String,
        enum: ["pending", "accept", "reject"],
        default: "pending"
    }
},
    {
        timestamps: true
    });

// Prevent duplicate requests for the same message
schema.index(
    { messageId: 1, requester: 1 },
    { unique: true });

export const RequestModel = model('RequestModel', schema);

//flow
//decline:
//receiver-of-Req authorized
//update request-doc status to decline with its id.


//accept
//receiver-Of-Req authorized
//update request-doc to accept with its id
//create a conversation between sender and receiver