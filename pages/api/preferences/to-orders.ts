import { Order, Preference } from '@prisma/client';
import { verifySignature } from '@upstash/qstash/nextjs';
import _ from 'lodash';
import { NextApiHandler } from 'next';

import { MAX_WEEKDAYS, WEEKDAYS } from 'app.config';
import { PreferenceWithDish } from 'types/Preference';
import { addDaysToDate, getNextMonday } from 'utils/dateHelpers';
import prisma from 'utils/prismaClient';
import stripTimeFromDate from 'utils/stripTimeFromDate';
import withErrHandler from 'utils/validation/withErrHandler';

const handler: NextApiHandler = async (req, res) => {
  const nextMonday = getNextMonday(stripTimeFromDate(new Date()));
  const nextEndOfWeek = addDaysToDate(nextMonday, MAX_WEEKDAYS - 1);
  console.log(
    `Generating orders from ${nextMonday.toLocaleDateString()} to ${nextEndOfWeek.toLocaleDateString()}`,
  );
  await prisma.order.deleteMany({
    where: {
      date: {
        gte: nextMonday,
        lte: nextEndOfWeek,
      },
    },
  });

  const defaults = await prisma.preference.findMany({
    where: {
      isDefault: true,
    },
    include: {
      Dish: true,
    },
  });
  const students = await prisma.student.findMany({});
  const preorderPromises = students.map((student) =>
    getPreorderForStudent(student.id, defaults, nextMonday),
  );
  const _ = await Promise.all(preorderPromises);
  res.send('Orders generated successfully');
};

// export default withErrHandler(handler);
export default verifySignature(withErrHandler(handler));

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
  await prisma.order.createMany({
    data: preferences.map((p) => ({
      dishId: p.Dish.id,
      cost: p.Dish.price,
      studentId,
      date,
    })),
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
