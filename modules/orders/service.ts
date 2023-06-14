import { groupBy } from 'lodash';

import { stripTimeFromDate } from 'utils/dateHelpers';
import prisma from 'utils/prismaClient';

import { DishWithCount, TotalOrders } from './types';

export const OrderService = {
  async getTotal(from: Date, to: Date) {
    const fromStripped = stripTimeFromDate(from);
    const toStripped = stripTimeFromDate(to);
    const totals = await prisma.order.findMany({
      include: {
        Dish: { select: { id: true, weightGrams: true, name: true, type: true } },
        Student: { select: { grade: true } },
      },
      where: {
        date: { gte: fromStripped, lt: toStripped },
        isActive: true,
      },
    });

    const mapByGrades = groupBy(totals, (e) => e.Student.grade?.id);

    const final = Object.fromEntries(
      Object.entries(mapByGrades).map(([gradeId, entry]) => {
        const mapByDates = groupBy(entry, (e) => e.date.toISOString());

        const mapByDatesByDishes = Object.fromEntries(
          Object.entries(mapByDates).map(([date, entry]) => {
            const mapByDishes = entry.reduce((map, cur) => {
              if (!map[cur.Dish.id]) {
                map[cur.Dish.id] = { ...cur.Dish, count: 0, cost: cur.cost };
              }
              map[cur.Dish.id].count += 1;
              return map;
            }, {} as Record<string, DishWithCount>);

            return [date, mapByDishes];
          }),
        );

        return [gradeId, { grade: entry[0].Student.grade, dishes: mapByDatesByDishes }];
      }),
    ) satisfies TotalOrders;

    console.log(final);
    return final;
  },
};
