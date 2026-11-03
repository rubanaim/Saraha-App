import * as messageRepository from "../../message/repositories/message.repository.js";
import * as requestRepository from "../repositories/request.repository.js";
import * as conversationRepository from "../../conversation/repositories/conversation.repository.js"
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

export async function handleRequest(requestId, receiverOfReq, decision) {

    // 1. Find the identity request
    const request = await requestRepository.findRequestById(requestId);

    if (!request) {
        throw new AppError("Request not found", 404);
    }

    // 2. Only the original anonymous sender can decide
    if (request.receiverOfReq.toString() !== receiverOfReq.toString()) {
        throw new AppError("You are not authorized to handle this request", 403);
    }

    // 3. Prevent changing a decision that was already made
    if (request.status !== "pending") {
        throw new AppError("This request has already been handled", 400);
    }

    // 4. Validate the decision
    if (!["accept", "reject"].includes(decision)) {
        throw new AppError("Invalid decision", 400);
    }

    // 5. If accepted, create a conversation
    if (decision === "accepted") {
        await conversationRepository.createConversation({
            participants: [
                request.senderOfReq,
                request.receiverOfReq
            ],
            originalMessage: request.messageId,
            messages: []
        });
    }

    // 6. Update the request status
    return await requestRepository.updateRequestStatus(
        requestId,
        decision
    );
}
