import { prisma } from "../prismaClient.js";



export const findUserbyEmail = async (email: string) => {
    return await prisma.account.findUnique({
        where: { email }
    })
}

export const createUser = async (username: string, email: string, password: string) => {
    return await prisma.account.create({
        data: {
            username,
            email,
            password
        }
    })
}