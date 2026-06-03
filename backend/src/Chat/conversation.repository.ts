import type { Conversation } from "../prismaClient.js";
import type { CreateConversationDTO } from "./create-conversation.dto.js";

export interface IConversationRepository {
    create(
        data: CreateConversationDTO
    ): Promise<Conversation>;

    findById(
        id: string
    ): Promise<Conversation | null>;

    findByAccountId(
        accountId: string
    ): Promise<Conversation[]>;

    findByMongoChatId(
        mongoChatId: string
    ): Promise<Conversation | null>;

    updateTitle(
        id: string, 
        title: string
    ): Promise<Conversation>;

    attachMongoChat(
        conversationId: 
        string, mongoChatId: string
    ): Promise<Conversation>;

    delete(
        id: string
    ): Promise<void>;
}