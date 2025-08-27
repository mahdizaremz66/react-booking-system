import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createProject = async (data) => {
  return prisma.project.create({ data });
};

export const getAllProjects = async () => {
  return prisma.project.findMany();
};

export const getProjectById = async (prjCode) => {
  return prisma.project.findUnique({ where: { prjCode } });
};

export const updateProject = async (prjCode, data) => {
  return prisma.project.update({ where: { prjCode }, data });
};

export const deleteProject = async (prjCode) => {
  return prisma.project.delete({ where: { prjCode } });
}; 