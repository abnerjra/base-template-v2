import { PrismaClient, Prisma } from "@prisma/client";

export const prisma = new PrismaClient();
export const { sql, raw, join } = Prisma;

export type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$use" | "$transaction" | "$extends">;