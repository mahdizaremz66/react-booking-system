import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createReservation = async (data) => {
  return prisma.reservation.create({ data });
};

export const getAllReservations = async () => {
  return prisma.reservation.findMany();
};

export const getReservationById = async (resId) => {
  return prisma.reservation.findUnique({ where: { resId: Number(resId) } });
};

export const updateReservation = async (resId, data) => {
  return prisma.reservation.update({ where: { resId: Number(resId) }, data });
};

export const deleteReservation = async (resId) => {
  return prisma.reservation.delete({ where: { resId: Number(resId) } });
}; 