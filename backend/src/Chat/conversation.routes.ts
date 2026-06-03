import { ConversationController} from "./conversation.controller.js";
import { ConversationService } from "./conversation.service.js";
import { PrismaConversationRepository } from "./prisma-conversation.repository.js";
import { ChatSessionRepository } from "./mongo-chat-session.repository.js";
import { AIClient } from "../AI/ai-client.js";
import { prisma } from "../prismaClient.js";
import authMiddleware from "../middleware/auth.middleware.js";
import Router from "express";

const conversationRepo = new PrismaConversationRepository(prisma);
const chatSessionRepo = new ChatSessionRepository();
const aiClient = new AIClient();

const conversationService = new ConversationService(conversationRepo, chatSessionRepo, aiClient);
const conversationController = new ConversationController(conversationService);

const router = Router();

router.post("/", authMiddleware, conversationController.createConversation);
router.post("/:conversationId/message", authMiddleware, conversationController.sendMessage);
router.put("/:conversationId/title", authMiddleware, conversationController.updateConversationTitle);

export default router;