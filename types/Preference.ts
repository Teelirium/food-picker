import { Prisma } from '@prisma/client';

export type PreferenceWithDish = Prisma.PreferenceGetPayload<{ include: { Dish: true } }>;
