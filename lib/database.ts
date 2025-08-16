import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.prisma;
}

export default prisma;

// Utility functions (examples)
export const getMentions = async (where = {}, take = 100) => {
  return prisma.mention.findMany({ where, take, orderBy: { timestamp: 'desc' } });
};

export const createMention = async (data: any) => {
  return prisma.mention.create({ data });
};

export const getAlerts = async (where = {}, take = 50) => {
  return prisma.alert.findMany({ where, take, orderBy: { triggeredAt: 'desc' } });
};

export const createAlert = async (data: any) => {
  return prisma.alert.create({ data });
};

export const getReports = async (where = {}, take = 10) => {
  return prisma.report.findMany({ where, take, orderBy: { generatedAt: 'desc' } });
};

export const createReport = async (data: any) => {
  return prisma.report.create({ data });
};
