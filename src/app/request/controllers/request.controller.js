import * as requestService from "../services/request.service.js";

export async function requestIdentity(req, res, next) {
    try {

        // 1. Get messageId from URL
        const { messageId } = req.params;

        // 2. Get requester from authenticated user
        const requester = req.user.sub;
        console.log("REQ.USER:", req.user);
        console.log("USER ID:", req.user?.sub);
        console.log("USER _ID:", req.user?.sub);
        // 3. Call service
        const createdRequest = await requestService.requestIdentity(
            messageId,
            requester
        );

        // 4. Send response
        res.status(201).json({
            message: "Identity request sent successfully",
            success: true,
            data: createdRequest
        });

    } catch (error) {
        next(error);
    }
}

export async function getAllRequests(req, res, next) {
    try {
        const receiverOfReq = req.user.sub;

        const requests = await requestService.getAllRequests(receiverOfReq);

        res.status(200).json({
            message: "Requests retrieved successfully",
            success: true,
            data: requests
        });
    } catch (error) {
        next(error);
    }
}

export async function handleRequest(req, res, next) {
    try {
        const { requestId } = req.params;
        const { decision } = req.body;

        const receiverOfReq = req.user.sub;

        const updatedRequest = await requestService.handleRequest(
            requestId,
            receiverOfReq,
            decision
        );

        res.status(200).json({
            message: `Request ${decision} successfully`,
            success: true,
            data: updatedRequest
        });

    } catch (error) {
        next(error);
    }
}