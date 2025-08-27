import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createUnit = async (data) => {
  return prisma.unit.create({ data });
};

export const getAllUnits = async () => {
  return prisma.unit.findMany();
};

export const getUnitById = async (untPrjCode, untCode) => {
  return prisma.unit.findUnique({ where: { untPrjCode_untCode: { untPrjCode, untCode } } });
};

export const updateUnit = async (untPrjCode, untCode, data) => {
  return prisma.unit.update({ where: { untPrjCode_untCode: { untPrjCode, untCode } }, data });
};

export const deleteUnit = async (untPrjCode, untCode) => {
  return prisma.unit.delete({ where: { untPrjCode_untCode: { untPrjCode, untCode } } });
}; 