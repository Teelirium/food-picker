import { Prisma } from "@prisma/client";

export type Dish = Omit<Prisma.DishGetPayload<{}>, 'id'>;

export type PartialDish = Partial<Dish>;
