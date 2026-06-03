import type { PrismaClient, Conversation } from "../prismaClient.js";
import type { IConversationRepository } from "./conversation.repository.js";
import type { CreateConversationDTO } from "./create-conversation.dto.js";



export class PrismaConversationRepository
    implements IConversationRepository {

    constructor(private readonly prisma: PrismaClient) {}

    async create(data: CreateConversationDTO): Promise<Conversation> {
        return this.prisma.conversation.create({ data });
    }

    async findById(id: string): Promise<Conversation | null> {
        return this.prisma.conversation.findUnique({where: { id },});
    }

    async findByAccountId(accountId: string): Promise<Conversation[]> {
        return this.prisma.conversation.findMany({
            where: { accountId },
            orderBy: { updatedAt: "desc" },
        });
    }

    async findByMongoChatId(mongoChatId: string): Promise<Conversation | null> {
        return this.prisma.conversation.findUnique({
            where: { mongoChatId },
        });
    }

    async updateTitle(id: string, title: string): Promise<Conversation> {
        return this.prisma.conversation.update({
            where: { id },
            data: { title },
        });
    }

    async getTitle(id: string): Promise<string> {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id },
            select: { title: true },
        });
        return conversation?.title || "Untitled Conversation";
    }

    async attachMongoChat(conversationId: string, mongoChatId: string): Promise<Conversation> {
        return this.prisma.conversation.update({
            where: { id: conversationId },
            data: { mongoChatId },
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.conversation.delete({
            where: { id },
        });
    }
}