import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Wallet CRUD
export const createWallet = async (data) => {
  return prisma.wallet.create({ data });
};
export const getAllWallets = async () => {
  return prisma.wallet.findMany();
};
export const getWalletById = async (wltPerCode) => {
  return prisma.wallet.findUnique({ where: { wltPerCode } });
};
export const updateWallet = async (wltPerCode, data) => {
  return prisma.wallet.update({ where: { wltPerCode }, data });
};
export const deleteWallet = async (wltPerCode) => {
  return prisma.wallet.delete({ where: { wltPerCode } });
};

// WalletTransaction CRUD
export const createWalletTransaction = async (data) => {
  return prisma.walletTransaction.create({ data });
};
export const getAllWalletTransactions = async () => {
  return prisma.walletTransaction.findMany();
};
export const getWalletTransactionById = async (wtxId) => {
  return prisma.walletTransaction.findUnique({ where: { wtxId: Number(wtxId) } });
};
export const updateWalletTransaction = async (wtxId, data) => {
  return prisma.walletTransaction.update({ where: { wtxId: Number(wtxId) }, data });
};
export const deleteWalletTransaction = async (wtxId) => {
  return prisma.walletTransaction.delete({ where: { wtxId: Number(wtxId) } });
}; 