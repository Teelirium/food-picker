import type { DishType } from '@prisma/client';

const dishTypeMap: Record<DishType, string> = {
  PRIMARY: 'Первое',
  SIDE: 'Гарнир',
  SECONDARY: 'Второе',
  DRINK: 'Напиток',
  EXTRA: 'Дополнительно',
} as const;

export default dishTypeMap;
