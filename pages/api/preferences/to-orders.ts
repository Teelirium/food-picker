import { verifySignature } from '@upstash/qstash/nextjs';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = (req, res) => {
  return res.send('hi');
};

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
