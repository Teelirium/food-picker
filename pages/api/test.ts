import { PrismaClient } from '@prisma/client';
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
    const data = await prisma.parent.findMany();
    return res.json(data);
}

export default handler;
