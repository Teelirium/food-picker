import { DishType } from "@prisma/client";

const dishTypeMap: {[K in DishType | string]: string} = {
  PRIMARY: 'Первое',
  SIDE: 'Гарнир',
  SECONDARY: 'Второе',
  DRINK: 'Напиток',
  EXTRA: 'Дополнительно',
}

export default Object.freeze(dishTypeMap);