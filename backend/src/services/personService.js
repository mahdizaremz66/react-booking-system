import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPerson = async (data) => {
  return prisma.person.create({ data });
};

export const getAllPersons = async () => {
  return prisma.person.findMany();
};

export const getPersonById = async (perCode) => {
  return prisma.person.findUnique({ where: { perCode } });
};

export const updatePerson = async (perCode, data) => {
  return prisma.person.update({ where: { perCode }, data });
};

export const deletePerson = async (perCode) => {
  return prisma.person.delete({ where: { perCode } });
}; 