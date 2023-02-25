import axios from 'axios';
import jwt from 'jsonwebtoken';
import { NextApiHandler } from 'next';
import { getToken } from 'next-auth/jwt';

import { getServerSideSession } from 'utils/getServerSession';

const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSideSession({ req, res });
  const token = await getToken({ req });
  if (!session || !token) return res.status(401).send('');

  const tok = jwt.sign(session, process.env.NEXTAUTH_SECRET || '');
  console.log(process.env.NEXTAUTH_SECRET);
  console.log(token);
  console.log(session);

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const headers = { Authorization: `Bearer ${tok}` };
  console.log(headers);

  try {
    const resp = await axios.get('https://localhost:7218/api/dishes', {
      headers,
    });
    return res.json(resp.data);
  } catch (e) {
    return res.send(e);
  }
};

export default handler;
