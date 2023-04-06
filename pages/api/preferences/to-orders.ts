import { verifySignature } from '@upstash/qstash/nextjs';
import _ from 'lodash';
import { NextApiHandler } from 'next';

import { MAX_WEEKDAYS, WEEKDAYS } from 'app.config';
import { PreferenceWithDish } from 'types/Preference';
import { addDaysToDate, getNextMonday, stripTimeFromDate } from 'utils/dateHelpers';
import prisma from 'utils/prismaClient';
import withErrHandler from 'utils/validation/withErrHandler';
import { z } from 'zod';

const handler: NextApiHandler = async (req, res) => {
  const nextMonday = getNextMonday(stripTimeFromDate(new Date()));
  const nextEndOfWeek = addDaysToDate(nextMonday, MAX_WEEKDAYS - 1);
  console.log(
    `Generating orders from ${nextMonday.toLocaleDateString()} to ${nextEndOfWeek.toLocaleDateString()}`,
  );
  const defaults = await prisma.preference.findMany({
    where: {
      isDefault: true,
    },
    include: {
      Dish: true,
    },
  });
  const students = await prisma.student.findMany({});
  const studentIds = students.map((s) => s.id);

  // await prisma.order.deleteMany({
  //   where: {
  //     date: {
  //       gte: nextMonday,
  //       lte: nextEndOfWeek,
  //     },
  //   },
  // });
  await resetDebt();

  // const preorderPromises = students.map((student) =>
  //   getPreorderForStudent(student.id, defaults, nextMonday),
  // );
  // const allOrders = await Promise.all(preorderPromises);
  const allDebts = await addDebt(studentIds, nextMonday, nextEndOfWeek);
  res.send('Orders generated successfully');
};

export default withErrHandler(handler);
// export default verifySignature(withErrHandler(handler));

async function getPreorderForStudent(
  studentId: number,
  defaults: PreferenceWithDish[],
  mondayDate: Date,
) {
  const promises = WEEKDAYS.map(async (weekday) => {
    const preorder = await getPreferencesWithDefaults(studentId, weekday, defaults);
    await createOrders(studentId, preorder, addDaysToDate(mondayDate, weekday));
    return preorder;
  });
  return Promise.all(promises);
}

async function getPreferencesWithDefaults(
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
  return _.uniqBy(prefs.concat(defaults), 'Dish.type');
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

async function addDebt(studentIds: number[], dateFrom: Date, dateTo: Date) {
  const promises = studentIds.map(async (id) => {
    const total = await getTotalOrderCost(id, dateFrom, dateTo);
    await prisma.student.update({
      where: { id },
      data: { debt: { increment: total } },
    });
    return [id, total];
  });
  return Promise.all(promises);
}

async function getTotalOrderCost(studentId: number, dateFrom: Date, dateTo: Date) {
  const schema = z.object({ total: z.coerce.number() }).array();
  const result =
    await prisma.$queryRaw`select sum(cost) as total from \`Order\` where date between ${dateFrom} and ${dateTo} and studentId=${studentId}`;
  return schema.parse(result)[0].total;
}

export const config = {
  api: {
    bodyParser: false,
  },
};
