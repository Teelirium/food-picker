import { Prisma } from "@prisma/client";

export type DishFormData = Omit<Prisma.DishGetPayload<{}>, 'id'>;

export type PartialDish = Partial<DishFormData>;
