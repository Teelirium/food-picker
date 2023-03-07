import { hash } from 'bcryptjs';

import { UserFormData, UserData } from 'types/UserData';
import prisma from 'utils/prismaClient';

import type { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST': {
      const { user } = req.body as { user: UserFormData };
      console.log('Registering user: ', user);
      const password = await hash(user.password, 12);

      const data: UserData = {
        name: user.name,
        surname: user.surname,
        middleName: user.middleName,
        username: user.username,
        password,
      };

      switch (user.role) {
        case 'PARENT':
          await prisma.parent.create({
            data,
          });
          break;
        case 'TEACHER':
          await prisma.teacher.create({
            data,
          });
          break;
        case 'WORKER':
        case 'ADMIN':
          await prisma.worker.create({
            data: {
              ...data,
              role: user.role,
            },
          });
          break;
        default:
          return res.status(422).send('Invalid role');
      }
      return res.send('OK');
    }

    default:
      return res.status(405).send('Method not allowed');
  }
};

export default handler;
