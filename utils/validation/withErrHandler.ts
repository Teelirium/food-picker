import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';

import HttpError from 'utils/HttpError';

function withErrHandler(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (e) {
      console.error(e);
      if (e instanceof HttpError) return res.status(e.code).send(e.message);
      if (e instanceof ZodError) return res.status(400).send(e.message);
      throw e;
    }
  };
}

export default withErrHandler;
