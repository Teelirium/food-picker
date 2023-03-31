import { Order, Preference } from '@prisma/client';
import { verifySignature } from '@upstash/qstash/nextjs';
import _ from 'lodash';
import { NextApiHandler } from 'next';

import { MAX_WEEKDAYS } from 'app.config';
import prisma from 'utils/prismaClient';

type OrderWithoutId = Omit<Order, 'id'>;

const handler: NextApiHandler = async (req, res) => {
  const defaults = await prisma.preference.findMany({
    where: {
      isDefault: true,
    },
  });
  const students = await prisma.student.findMany({});
  // const orders = await prisma.order.findMany({
  //   where: {},
  // });
  const orders = await getOrdersForStudent(students[0].id, defaults);
  const currentDate = new Date();
  res.send(currentDate.getDay());
};

export default handler;
// export default verifySignature(handler);

async function getOrdersForStudent(studentId: number, defaults: Preference[]) {
  const weekdays = _.range(0, MAX_WEEKDAYS);
  return;
}

export const config = {
  api: {
    bodyParser: false,
  },
};
