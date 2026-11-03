import { RequestModel } from "../../../lib/db/request.js";

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