import { Order, Preference } from '@prisma/client';
import { verifySignature } from '@upstash/qstash/nextjs';
import _ from 'lodash';
import { NextApiHandler } from 'next';

import { MAX_WEEKDAYS } from 'app.config';
import prisma from 'utils/prismaClient';
import { PreferenceWithDish } from 'types/Preference';

type OrderWithoutId = Omit<Order, 'id'>;

const handler: NextApiHandler = async (req, res) => {
  const defaults = await prisma.preference.findMany({
    where: {
      isDefault: true,
    },
    include: {
      Dish: true,
    },
  });
  const students = await prisma.student.findMany({});
  // const orders = await prisma.order.findMany({
  //   where: {},
  // });
  const orders = await getOrdersForStudent(students[0].id, defaults);
  const currentDate = new Date();
  res.send(orders);
};

export default handler;
// export default verifySignature(handler);

async function getOrdersForStudent(studentId: number, defaults: PreferenceWithDish[]) {
  const weekdays = _.range(0, MAX_WEEKDAYS);
  return getPreferencesForDay(studentId, weekdays[0], defaults);
}

async function getPreferencesForDay(
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
  return _.uniqBy([...prefs, ...defaults], 'Dish.type');
}

export const config = {
  api: {
    bodyParser: false,
  },
};
