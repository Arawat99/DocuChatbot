import { ChatSession } from "../model/chat_session.js";


export class ChatSessionRepository {

    async createConversation(conversationId: string, model = "tinyllama") {
        return ChatSession.create({
            conversationId,
            model,
            messages: [],
        });
    }

    async findByConversationId(conversationId: string) {
        return ChatSession.findOne({
            conversationId,
        });
    }

    async addMessage(conversationId: string, message: any) {
        const chatSession = await ChatSession.findOne({ conversationId });
        if (!chatSession) {
            throw new Error("Chat session not found");
        }
        const nextSequence = chatSession.messages.length + 1;
        const messageWithSequence = {
            ...message,
            sequence: nextSequence,
        };
        chatSession.messages.push(messageWithSequence);
        return chatSession.save();
    }

    async deleteConversation(conversationId: string) {
        await ChatSession.deleteOne({
            conversationId,
        });
    }
}