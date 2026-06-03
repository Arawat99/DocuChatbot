import { ConversationService } from "./conversation.service.js";
import type { CreateConversationDTO } from "./create-conversation.dto.js";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}

    createConversation = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const title = "New Conversation";
            const accountId = req.account?.id;
            if (!accountId) {
                return res.status(400).json({ error: "Account ID is required" });
            }
            console.log("Creating conversation for account ID:", accountId);
            const conversation = await this.conversationService.createConversation({ title, accountId });
            res.status(201).json(conversation);
        } catch (error) {
            res.status(500).json({ error: "Failed to create conversation" });
        }
    }

    sendMessage = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const { conversationId } = req.params;
            const { message, model } = req.body;
            if (typeof conversationId !== "string" || typeof message !== "string") {
                return res.status(400).json({ error: "Invalid conversation ID or message" });
            }
            const response = await this.conversationService.sendMessage(conversationId, model, message);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: "Failed to send message" });
        }
    }

    updateConversationTitle = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const { conversationId } = req.params;
            const { messages } = req.body;
            if (typeof conversationId !== "string" || typeof messages !== "string") {
                return res.status(400).json({ error: "Invalid conversation ID or messages" });
            }
            const title = await this.conversationService.updateConversationTitle(conversationId, messages);
            res.status(200).json({ title });
        } catch (error) {
            res.status(500).json({ error: "Failed to update conversation title" });
        }
    }
}