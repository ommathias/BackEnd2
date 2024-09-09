import { PrismaClient } from "@prisma/client";

const banco = new PrismaClient();

export { banco }


//Apenas cria e exporta o prisma