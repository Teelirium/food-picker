import { Dish, Preference } from '@prisma/client';
import { uniqBy } from 'lodash';

import { PreferenceWithDish } from 'modules/preference/types';
import prisma from 'utils/prismaClient';

import { unflattenDish } from './util';

export async function getPreferencesWithDefaults(studentId: number, dayOfWeek: number) {
  const prefs: (Preference & Dish)[] = await prisma.$queryRaw`SELECT p.*, 
    d.name, d.imgURL, d.price, d.proteins, 
    d.carbs, d.fats, d.weightGrams, d.ingredients, d.calories, d.type FROM 
    Preference AS p JOIN Dish AS d ON p.dishId=d.id 
    WHERE studentId=${studentId} AND dayOfWeek=${dayOfWeek}
    UNION
    SELECT p.*, 
    d.name, d.imgURL, d.price, d.proteins, 
    d.carbs, d.fats, d.weightGrams, d.ingredients, d.calories, d.type FROM 
    Preference AS p JOIN Dish AS d ON p.dishId=d.id 
    WHERE isDefault=true AND dayOfWeek=${dayOfWeek}
    ORDER BY type;`;

  const unique = uniqBy(prefs, 'type');
  for (const entry of unique) {
    entry.isDefault = !!entry.isDefault;
  }
  const unflattened = unique.map(unflattenDish);
  return unflattened;
}

export async function old_getPreferencesWithDefaults(
  studentId: number,
  dayOfWeek: number,
  defaults: PreferenceWithDish[],
) {
  const prefs = await prisma.preference.findMany({
    where: {
      studentId,
      dayOfWeek,
      isDefault: false,
    },
    include: { Dish: true },
  });
  return uniqBy(prefs.concat(defaults), 'Dish.type');
}
