import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).send('');
  }
  const data = await prisma.parent.findMany({});
  return res.json(data);
};

export default handler;
