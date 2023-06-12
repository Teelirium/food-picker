import { verifySignature } from '@upstash/qstash/nextjs';
import { NextApiHandler } from 'next';
import { z } from 'zod';

import { MAX_WEEKDAYS, WEEKDAYS } from 'app.config';
import { PreferenceService } from 'modules/preference/service';
import { PreferenceWithDish } from 'modules/preference/types';
import { addDays, getNextMonday, stripTimeFromDate } from 'utils/dateHelpers';
import withErrHandler from 'utils/errorUtils/withErrHandler';
import prisma from 'utils/prismaClient';

// at least this is O(n)
const handler: NextApiHandler = async (req, res) => {
  const nextMonday = getNextMonday(stripTimeFromDate(new Date()));
  const nextEndOfWeek = addDays(nextMonday, MAX_WEEKDAYS - 1);
  console.log(
    `Generating orders from ${nextMonday.toLocaleDateString()} to ${nextEndOfWeek.toLocaleDateString()}`,
  );

  const students = await prisma.student.findMany({ select: { id: true } });

  await prisma.order.deleteMany({
    where: {
      date: {
        gte: nextMonday,
        lte: nextEndOfWeek,
      },
    },
  });
  // await resetDebt();

  const start = new Date();
  const preorders: PreferenceWithDish[][][] = await Promise.all(
    WEEKDAYS.map((day) => getPreordersForDay(day, students, nextMonday)),
  );
  const allDebts = await Promise.all(
    students.map((student) => addDebt(student.id, nextMonday, nextEndOfWeek)),
  );
  console.log('Took', Date.now() - start.getTime(), 'ms in total');
  res.send('Orders and debts generated successfully');
};

// export default withErrHandler(handler);
export default verifySignature(withErrHandler(handler));

async function getPreordersForDay(dayOfWeek: number, students: { id: number }[], nextMonday: Date) {
  // const defaults = await prisma.preference.findMany({
  //   where: {
  //     dayOfWeek,
  //     isDefault: true,
  //   },
  //   include: {
  //     Dish: true,
  //   },
  // });
  const targetDate = addDays(nextMonday, dayOfWeek);
  const preorders: PreferenceWithDish[][] = await Promise.all(
    students.map(async (student) => {
      const preorder = await PreferenceService.getWithDefaults(student.id, dayOfWeek);
      await createOrders(student.id, preorder, targetDate);
      return preorder;
    }),
  );
  return preorders;
}

async function createOrders(studentId: number, preferences: PreferenceWithDish[], date: Date) {
  const addOrders = prisma.order.createMany({
    data: preferences.map((p) => ({
      dishId: p.Dish.id,
      cost: p.Dish.price,
      studentId,
      date,
    })),
  });
  await prisma.$transaction([addOrders]);
}

async function resetDebt() {
  await prisma.student.updateMany({
    where: {
      debt: {
        gt: 0,
      },
    },
    data: {
      debt: 0,
    },
  });
}

async function addDebt(studentId: number, dateFrom: Date, dateTo: Date) {
  const total = await getTotalOrderCost(studentId, dateFrom, dateTo);
  await prisma.student.update({
    where: { id: studentId },
    data: { debt: { increment: total } },
  });
  return [studentId, total];
}

const totalOrderCostSchema = z.object({ total: z.coerce.number() }).array();

async function getTotalOrderCost(studentId: number, dateFrom: Date, dateTo: Date) {
  const result = await prisma.$queryRaw`select sum(cost) as total 
    from \`Order\` where date between ${dateFrom} and ${dateTo} and studentId=${studentId}`;
  const [{ total }] = totalOrderCostSchema.parse(result);
  return total;
}

export const config = {
  api: {
    bodyParser: false,
  },
};
