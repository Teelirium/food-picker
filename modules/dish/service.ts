import { DishType } from '@prisma/client';

import prisma from 'utils/prismaClient';

export const DishService = {
  async getAll(type?: DishType, includeHidden = false) {
    const isHidden = includeHidden ? undefined : false;
    const dishes = await prisma.dish.findMany({
      where: {
        type,
        isHidden,
      },
    });
    return dishes;
  },
  async getById(dishId: number) {
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
    });
    return dish;
  },
};
