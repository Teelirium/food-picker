import { TRPCError } from '@trpc/server';

import withErrHandler from 'utils/errorUtils/withErrHandler';

export default withErrHandler(async (req, res) => {
  if (process.env.NODE_ENV === 'production') throw new TRPCError({ code: 'FORBIDDEN' });
});
