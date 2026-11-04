import { Router } from "express";
import * as conversationController from "../controllers/conversation.controller.js";
import { authGuard } from "../../../lib/auth/authGuard.js";

const conversationRouter = Router();

conversationRouter.post(
    "/:conversationId",
    authGuard,
    conversationController.sendConversationMessage
);

export default conversationRouter;