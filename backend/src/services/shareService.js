import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Shareholding CRUD
export const createShareholding = async (data) => {
  return prisma.shareholding.create({ data });
};
export const getAllShareholdings = async () => {
  return prisma.shareholding.findMany();
};
export const getShareholdingById = async (shrId) => {
  return prisma.shareholding.findUnique({ where: { shrId: Number(shrId) } });
};
export const updateShareholding = async (shrId, data) => {
  return prisma.shareholding.update({ where: { shrId: Number(shrId) }, data });
};
export const deleteShareholding = async (shrId) => {
  return prisma.shareholding.delete({ where: { shrId: Number(shrId) } });
};

// ShareTransfer CRUD
export const createShareTransfer = async (data) => {
  return prisma.shareTransfer.create({ data });
};
export const getAllShareTransfers = async () => {
  return prisma.shareTransfer.findMany();
};
export const getShareTransferById = async (stfId) => {
  return prisma.shareTransfer.findUnique({ where: { stfId: Number(stfId) } });
};
export const updateShareTransfer = async (stfId, data) => {
  return prisma.shareTransfer.update({ where: { stfId: Number(stfId) }, data });
};
export const deleteShareTransfer = async (stfId) => {
  return prisma.shareTransfer.delete({ where: { stfId: Number(stfId) } });
};

// ShareProfit CRUD
export const createShareProfit = async (data) => {
  return prisma.shareProfit.create({ data });
};
export const getAllShareProfits = async () => {
  return prisma.shareProfit.findMany();
};
export const getShareProfitById = async (sptId) => {
  return prisma.shareProfit.findUnique({ where: { sptId: Number(sptId) } });
};
export const updateShareProfit = async (sptId, data) => {
  return prisma.shareProfit.update({ where: { sptId: Number(sptId) }, data });
};
export const deleteShareProfit = async (sptId) => {
  return prisma.shareProfit.delete({ where: { sptId: Number(sptId) } });
}; 