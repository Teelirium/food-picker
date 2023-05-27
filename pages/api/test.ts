import { Dish, Preference } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { uniqBy } from 'lodash';

import withErrHandler from 'utils/errorUtils/withErrHandler';
import prisma from 'utils/prismaClient';

export default withErrHandler(async (req, res) => {
  if (process.env.NODE_ENV === 'production') throw new TRPCError({ code: 'FORBIDDEN' });
});
