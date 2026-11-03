import { ConversationModel } from "../models/conversation.model.js";

export async function createConversation(data) {
    return ConversationModel.create(data);
}