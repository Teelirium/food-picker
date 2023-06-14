import { Grade, Prisma } from '@prisma/client';

type DishBrief = Prisma.DishGetPayload<{
  select: { id: true; weightGrams: true; name: true; type: true };
}>;
export type DishWithCount = DishBrief & { cost: number; count: number };
export type GradeOrders = {
  grade: Grade | null;
  dishes: Record<string, Record<string, DishWithCount>>;
};
export type TotalOrders = Record<string, GradeOrders>;
