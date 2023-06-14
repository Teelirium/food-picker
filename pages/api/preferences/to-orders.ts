import { verifySignature } from '@upstash/qstash/nextjs';
import { NextApiHandler } from 'next';
import { z } from 'zod';

import { MAX_WEEKDAYS, WEEKDAYS } from 'app.config';
import { PreferenceService } from 'modules/preference/service';
import { PreferenceWithDish } from 'modules/preference/types';
import { addDays, getNextMonday, stripTimeFromDate } from 'utils/dateHelpers';
import withErrHandler from 'utils/errorUtils/withErrHandler';
import prisma from 'utils/prismaClient';

export const config = {
  api: {
    bodyParser: false,
  },
};

// n+1 alert
const handler: NextApiHandler = async (req, res) => {
  const now = new Date();
  const today = stripTimeFromDate(now);
  const nextMonday = getNextMonday(today);
  const prevMonday = addDays(nextMonday, -7);
  const nextEndOfWeek = addDays(nextMonday, MAX_WEEKDAYS - 1);
  console.log(
    `Generating orders from ${nextMonday.toLocaleDateString()} to ${nextEndOfWeek.toLocaleDateString()}`,
  );

  const students = await prisma.student.findMany({ select: { id: true } });

  const start = new Date();
  // await resetOrders(nextMonday, nextEndOfWeek);
  const preorders: PreferenceWithDish[][][] = await Promise.all(
    WEEKDAYS.map((day) => getPreordersForDay(day, students, nextMonday)),
  );

  const debtMap = await getDebtMap(prevMonday, nextMonday);
  // await resetDebt();
  const newStudents = await createDebts(debtMap);
  res.send(debtMap);
  console.log('Took', Date.now() - start.getTime(), 'ms in total');
};

// export default withErrHandler(handler);
export default verifySignature(withErrHandler(handler));

async function createDebts(debtMap: Record<number, number>) {
  const actions = Object.entries(debtMap).map(([studentId, debt]) => {
    return prisma.student.update({
      where: {
        id: +studentId,
      },
      data: {
        debt: {
          increment: debt,
        },
      },
    });
  });
  return prisma.$transaction(actions);
}

async function getDebtMap(from: Date, to: Date) {
  const orders = await prisma.order.findMany({
    where: {
      isActive: true,
      date: {
        gte: from,
        lt: to,
      },
    },
    select: {
      studentId: true,
      cost: true,
    },
  });
  const map = orders.reduce((prev, cur) => {
    if (!prev[cur.studentId]) prev[cur.studentId] = 0;
    prev[cur.studentId] += cur.cost;
    return prev;
  }, {} as Record<number, number>);
  return map;
}

async function getPreordersForDay(dayOfWeek: number, students: { id: number }[], nextMonday: Date) {
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
  return prisma.student.updateMany({
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

async function resetOrders(from: Date, to: Date) {
  return prisma.order.deleteMany({
    where: {
      date: {
        gte: from,
        lte: to,
      },
    },
  });
}

const totalOrderCostSchema = z.object({ total: z.coerce.number() }).array();
async function getTotalOrderCost(studentId: number, dateFrom: Date, dateTo: Date) {
  const result = await prisma.$queryRaw`select sum(cost) as total 
    from \`Order\` where date between ${dateFrom} and ${dateTo} and studentId=${studentId}`;
  const [{ total }] = totalOrderCostSchema.parse(result);
  return total;
}
