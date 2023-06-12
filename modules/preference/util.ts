import { Dish, Preference } from '@prisma/client';

import { PreferenceWithDish } from './types';

export function unflattenDish(prefAndDish: Preference & Dish): PreferenceWithDish {
  const prefWithDish = {
    id: prefAndDish.id,
    isDefault: prefAndDish.isDefault,
    dayOfWeek: prefAndDish.dayOfWeek,
    dishId: prefAndDish.dishId,
    studentId: prefAndDish.studentId,
    Dish: {
      id: prefAndDish.dishId,
      name: prefAndDish.name,
      imgURL: prefAndDish.imgURL,
      price: prefAndDish.price,
      proteins: prefAndDish.proteins,
      carbs: prefAndDish.carbs,
      fats: prefAndDish.fats,
      weightGrams: prefAndDish.weightGrams,
      ingredients: prefAndDish.ingredients,
      type: prefAndDish.type,
      calories: prefAndDish.calories,
      isHidden: prefAndDish.isHidden,
    },
  } satisfies PreferenceWithDish;

  return prefWithDish;
}
