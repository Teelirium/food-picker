import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";
import { PartialDish } from "types/Dish";
import verifyRoleServerSide from "utils/verifyRoleServerSide";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/dishes/{dishId}:
 *  get:
 *    summary: Получает блюдо по id
 *    responses:
 *      200:
 *        description: Возвращает найденное блюдо
 *      404:
 *        description: Блюдо не найдено
 *  put:
 *    summary: Обновляет блюдо с новыми данными
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              partialDish:
 *                type: object
 *    responses:
 *      201:
 *        description: Возвращает обновлённое блюдо
 *  delete:
 *    summary: Удаляет блюдо
 */
const handler: NextApiHandler = async (req, res) => {
  const { dishId } = req.query;

  if (!dishId) {
    return res.status(404).send("");
  }

  const isWorkerOrAdmin = await verifyRoleServerSide(req, res, [
    "WORKER",
    "ADMIN",
  ]);

  switch (req.method) {
    case "GET":
      const dish = await prisma.dish.findUnique({
        where: {
          id: +dishId,
        },
      });
      if (!dish) {
        return res.status(404).send("Dish not found");
      }
      return res.send(dish);

    case "PUT":
      if (!isWorkerOrAdmin) {
        return res.status(403).send("");
      }

      const { partialDish } = req.body as { partialDish: PartialDish };
      try {
        const newDish = await prisma.dish.update({
          where: { id: +dishId },
          data: partialDish,
        });
        return res.status(201).send(newDish);
      } catch (err) {
        console.error(err);
        return res.status(500).send(err);
      }

    case "DELETE":
      if (!isWorkerOrAdmin) {
        return res.status(403).send("");
      }
      try {
        await prisma.dish.delete({
          where: {
            id: +dishId,
          },
        });
        return res.send("OK");
      } catch (err) {
        console.error(err);
        return res.status(500).send(err);
      }

    default:
      return res.status(405).send("Method not allowed");
  }
};

export default handler;
