import { PrismaClient, type Conversation } from "@prisma/client"


export const prisma = new PrismaClient({
    log: ["error"]
});

export type { Conversation, PrismaClient };