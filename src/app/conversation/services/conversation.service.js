import * as conversationRepository from "../repositories/conversation.repository.js";
import * as messageRepository from "../../message/repositories/message.repository.js";
import { AppError } from "../../../lib/error/error.js";

export async function sendConversationMessage(conversationId, content, sender) {
    // 1. Find the conversation
    const conversation =
        await conversationRepository.findConversationById(conversationId);

    if (!conversation) {
        throw new AppError("Conversation not found", 404);
    }

    // 2. Check whether the logged-in user is a participant
    //.some() is a JavaScript array method. It checks whether at least one element in an array satisfies a
    const isParticipant = conversation.participants.some(
        participant => participant.toString() === sender.toString()
    );

    if (!isParticipant) {
        throw new AppError("You are not authorized to access this conversation", 403);
    }

    // 3. Find the other participant
    const receiver = conversation.participants.find(
        participant => participant.toString() !== sender.toString()
    );

    // 4. Create the actual message
    const newMessage = await messageRepository.createMessage(
        content,
        receiver,
        sender
    );

    // 5. Add its ID and sender to the conversation
    await conversationRepository.addMessageToConversation(
        conversationId,
        newMessage._id,
        sender
    );

    return newMessage;
}