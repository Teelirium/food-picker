import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";

const prisma = new PrismaClient();
/**
 * @swagger
 * /api/dishes/{dishId}:
 *  get:
 */
const handler: NextApiHandler = async (req, res) => {
  const { dishId } = req.query;

  switch (req.method) {
    case "GET":
      return res.send(dishId);

    default:
      return res.status(405).send("Method not allowed");
  }
};

export default handler;
