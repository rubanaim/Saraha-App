import { RequestModel } from "../models/request.model.js";

export async function createRequest(data) {
    return RequestModel.create(data);
}

export async function getAllRequests(receiverOfReq){
   return RequestModel.find({
       receiverOfReq : receiverOfReq
   })
       .populate("messageId")
       .populate("senderOfReq", "name")
       .sort({ createdAt: -1 });
}

export async function findRequestById(requestId) {
    return RequestModel.findById(requestId);
}

export async function updateRequestStatus(requestId, status) {
    return RequestModel.findByIdAndUpdate(
        requestId,
        { status },
        { new: true, runValidators: true }
    );
}

//new: true
// Returns the document after the update, not before it.
//runValidators: true
// Tells Mongoose to run your schema validation when updating.