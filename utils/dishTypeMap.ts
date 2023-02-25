import type { DishType } from '@prisma/client';

const dishTypeMap: { [K in DishType]: string } = {
  PRIMARY: 'Первое',
  SIDE: 'Гарнир',
  SECONDARY: 'Второе',
  DRINK: 'Напиток',
  EXTRA: 'Дополнительно',
} as const;

export default dishTypeMap;
