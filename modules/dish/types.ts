import { Dish } from '@prisma/client';

export type DishFormData = Omit<Dish, 'id'>;

export type PartialDish = Partial<DishFormData>;
