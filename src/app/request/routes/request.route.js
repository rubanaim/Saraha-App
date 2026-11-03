import { Router } from "express";

import * as requestController from "../../request/controllers/request.controller.js";

import { authGuard } from "../../../lib/auth/authGuard.js";

const requestRouter = Router();

requestRouter.post(
    "/:messageId",
    authGuard,
    requestController.requestIdentity
);
requestRouter.get("/", authGuard, requestController.getAllRequests);


export default requestRouter;