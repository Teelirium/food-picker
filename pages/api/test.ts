import { PrismaClient } from "@prisma/client";
import type { NextApiHandler } from "next";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  const data = await prisma.student.findMany({
    where: {
      parentStudent: {
        every: {
          parentId: 5,
        },
      },
    },
  });
  return res.json(data);
};

export default handler;
