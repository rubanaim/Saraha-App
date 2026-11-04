import { ConversationModel } from "../models/conversation.model.js";

export async function createConversation(data) {
    return ConversationModel.create(data);
}

export async function findConversationById(conversationId) {
    return ConversationModel.findById(conversationId);
}

export async function addMessageToConversation(conversationId, msgId, sender) {
    return ConversationModel.findByIdAndUpdate(
        conversationId,
        {
//$push is a MongoDB update operator. It is used to add a new element to an array without deleting the existing elements.
            $push: {
                message: {
                    msgId,
                    sender
                }
            }
        },
        { new: true, runValidators: true }
    );
}