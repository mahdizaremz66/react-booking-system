import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
 
export const getUserByUsername = async (username) => {
  return prisma.userAccount.findUnique({ where: { usrUsername: username } });
}; 