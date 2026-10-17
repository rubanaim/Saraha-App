import {Router} from 'express';
import * as messageController from './controllers/message.controller.js';
import {authGuard} from '../../lib/auth/authGuard.js';
const messageRouter = Router();
messageRouter.post('/',messageController.sendMessage);
messageRouter.post('/public', authGuard, messageController.sendMessage);
messageRouter.get('/get-all-messages', authGuard, messageController.getAllMessages);

export default  messageRouter;
