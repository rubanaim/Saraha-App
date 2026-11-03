import * as messageRepository from "../../message/repositories/message.repository.js";
import * as requestRepository from "../repositories/request.repository.js";

import { AppError } from "../../../lib/error/error.js";

export async function requestIdentity(messageId, senderOfReq) {

    // 1. Find the original anonymous message
    const message = await messageRepository.findMessageById(messageId);
    console.log(message)
    if (!message) {
        throw new AppError("Message not found", 404);
    }

    // 2. Check if the message is anonymous
    if (message.type !== "anonymous") {
        throw new AppError("This is not an anonymous message", 400);
    }

    // 3. Check if the message belongs to the logged-in user
    if (message.receiver.toString() !== senderOfReq.toString()) {
        throw new AppError("You are not authorized to request this identity", 403);
    }

    // 4. Check if the message is deleted
    if (message.isDeleted) {
        throw new AppError("Message has been deleted", 400);
    }

    // 5. Create the identity request
    return await requestRepository.createRequest({
        messageId: message._id,
        senderOfReq: senderOfReq,
        receiverOfReq: message.sender,
        status: "pending"
    });
}

export async function getAllRequests(receiverOfReq) {
    const requests = await requestRepository.getAllRequests(receiverOfReq);

    if (requests.length === 0) {
        throw new AppError("No requests found", 404);
    }

    return requests;
}