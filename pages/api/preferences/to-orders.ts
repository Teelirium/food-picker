import { Order, Preference } from '@prisma/client';
import { verifySignature } from '@upstash/qstash/nextjs';
import _ from 'lodash';
import { NextApiHandler } from 'next';

import { WEEKDAYS } from 'app.config';
import { PreferenceWithDish } from 'types/Preference';
import getNextMonday from 'utils/getNextMonday';
import prisma from 'utils/prismaClient';
import withErrHandler from 'utils/validation/withErrHandler';

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

  const preorderPromises = students.map((student) => getPreorderForStudent(student.id, defaults));
  const orders = await Promise.all(preorderPromises);
  const nextMonday = getNextMonday(new Date());
  res.send(orders);
};

export default withErrHandler(handler);
// export default verifySignature(withErrHandler(handler));

async function getPreorderForStudent(studentId: number, defaults: PreferenceWithDish[]) {
  const promises = WEEKDAYS.map((weekday) =>
    getPreferencesWithDefaults(studentId, weekday, defaults),
  );
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

// async function createOrders(
//   studentId: number,
//   preferences: PreferenceWithDish[],
//   mondayDate: Date,
// ) {

// }

export const config = {
  api: {
    bodyParser: false,
  },
};
