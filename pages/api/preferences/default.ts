import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getServerSideSession } from "utils/getServerSession";
import prisma from "utils/prismaClient";
import idSchema from "utils/schemas/idSchema";
import verifyRole from "utils/verifyRole";
import { z } from "zod";

const bodySchema = z.object({
  dishId: idSchema,
});

/**
 * @swagger
 * /api/preferences/default:
 *  get:
 *    summary: Получает список стандартного питания
 *  post:
 *    summary: Добавляет блюдо в стандартное меню
 */
const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSideSession({ req, res });
  if (!session) {
    return res.status(401).send("");
  }
  if (!verifyRole(session, ["ADMIN", "WORKER"])) {
    return res.status(403).send("");
  }

  switch (req.method) {
    case "GET": {
      return await getHandler(req, res);
    }
    case "POST": {
      return await postHandler(req, res);
    }
    default:
      return res.status(405).send("Method not allowed");
  }
};

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const dishes = await prisma.preference.findMany({
    where: {
      isDefault: true
    },
    include: {
      Dish: true
    }
  });
  return res.json(dishes);
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { dishId } = bodySchema.parse(req.body);

  const dishType = await prisma.dish.findUnique({
    where: {
      id: dishId,
    },
    select: {
      type: true,
    },
  });
  if (!dishType) return res.status(404).send("Dish not found");

  const existingPref = await prisma.preference.findFirst({
    where: {
      isDefault: true,
      Dish: {
        type: dishType.type,
      },
    },
  });

  existingPref
    ? await prisma.preference.update({
        where: {
          id: existingPref.id,
        },
        data: {
          dishId,
        },
        include: { Dish: true },
      })
    : await prisma.preference.create({
        data: {
          isDefault: true,
          dayOfWeek: 0,
          dishId,
        },
        include: { Dish: true },
      });

  return res.status(201).send("OK");
}

export default handler;
