import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth";
import { options } from "pages/api/auth/[...nextauth]";
import { Dish } from "types/Dish";
import verifyRoleServerSide from "utils/verifyRoleServerSide";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/dishes:
 *  get:
 *    summary: Получает список доступных блюд
 *    responses:
 *      200:
 *        description: Возвращает список доступных блюд
 *  post:
 *    summary: Добавляет блюдо в базу данных
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              dish:
 *                type: object
 *    responses:
 *      201:
 *        description: Возвращает добавленное блюдо
 */
const handler: NextApiHandler = async (req, res) => { 

  switch (req.method) {
    case "GET":
      const dishes = await prisma.dish.findMany({});
      return res.json(dishes);

    case "POST":
      const authorized = await verifyRoleServerSide(req, res, ['WORKER', 'ADMIN']);
      if (!authorized) {
        return res.status(403).send('')
      }

      const { dish } = req.body as { dish: Dish };
      console.log(dish);
      try {
        const result = await prisma.dish.create({
          data: { ...dish, preferences: {}, Orders: {} },
        });
        return res.status(201).json(result);
      } catch (err) {
        console.error(err);
        return res.status(500).send("Creating dish failed");
      }

    default:
      return res.status(405).send("Method not allowed");
  }
};

export default handler;
