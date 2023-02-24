/* eslint-disable @typescript-eslint/ban-types */
import { Prisma } from '@prisma/client';

export type DishFormData = Omit<Prisma.DishGetPayload<{}>, 'id'>;

export type PartialDish = Partial<DishFormData>;

export type DishType = 'PRIMARY' | 'SIDE' | 'SECONDARY' | 'DRINK' | 'EXTRA';
