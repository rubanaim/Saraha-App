import { validateBody } from "../../../lib/validation/validation.js";
import { conversationMessageDTO } from "../dto/conversation.dto.js";
import * as conversationService from "../services/conversation.service.js";

export async function sendConversationMessage(req, res, next) {
    try {
        const data = validateBody(
            conversationMessageDTO,
            req.body
        );

        const { conversationId } = req.params;
        const sender = req.user.sub;

        const message = await conversationService.sendConversationMessage(
            conversationId,
            data.content,
            sender
        );

        res.status(201).json({
            message: "Message sent successfully",
            success: true,
            data: message
        });

    } catch (error) {
        next(error);
    }
}