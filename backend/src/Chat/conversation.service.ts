import { PrismaConversationRepository } from './prisma-conversation.repository.js';
import type { ChatSessionRepository } from './mongo-chat-session.repository.js';
import type { CreateConversationDTO } from './create-conversation.dto.js';
import type { AIClient } from '../AI/ai-client.js';
import type { chatDTO } from '../AI/ai-chat.dto.js';

export class ConversationService {
    constructor(
        private readonly conversationRepo: PrismaConversationRepository,
        private readonly chatSessionRepo: ChatSessionRepository,
        private readonly aiClient: AIClient
    ) {}

    async createConversation(data: CreateConversationDTO) {
        const conversation = await this.conversationRepo.create(data);
        await this.chatSessionRepo.createConversation(conversation.id);
        return conversation;
    }

    async sendMessage(conversationId: string, model: string, message: any) {
        const conversation = await this.conversationRepo.findById(conversationId);
        if (!conversation) {
            throw new Error("Conversation not found");
        }
        await this.chatSessionRepo.addMessage(conversation.id, {role: "user", content: message});
        const chatdto: chatDTO = { conversationId: conversation.id, model: model, message: [{role: "user", content: message}] };
        const response = await this.aiClient.sendChatMessage(chatdto);
        await this.chatSessionRepo.addMessage(conversation.id, {role: "assistant", content: response.response});
        return response;
    }

    async updateConversationTitle(conversationId: string, messages: string) {
        const conversation = await this.conversationRepo.findById(conversationId);
        if (!conversation) {
            throw new Error("Conversation not found");
        }
        const conversationTitle = await this.conversationRepo.getTitle(conversationId);
        if (conversationTitle === "New Conversation") {
            const title = await this.aiClient.createConversationTitle(messages);
            return this.conversationRepo.updateTitle(conversationId, title);
        }
        return conversationTitle;
    }
}