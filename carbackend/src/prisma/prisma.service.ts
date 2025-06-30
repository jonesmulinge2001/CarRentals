/* eslint-disable prettier/prettier */
import { PrismaClient } from 'generated/prisma';

let prisma: PrismaClient;
export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: ['query', 'error', 'warn', 'info'],
    });
  }
  return prisma;
};
