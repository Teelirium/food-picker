import { TRPCError } from '@trpc/server';
import { hash } from 'bcryptjs';

import { UserData, UserFormData } from 'types/UserData';
import withErrHandler from 'utils/errorUtils/withErrHandler';
import prisma from 'utils/prismaClient';

export default withErrHandler(async (req, res) => {
  switch (req.method) {
    case 'POST': {
      if (process.env.NODE_ENV !== 'production') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'низя' });
      }
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
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Неверная роль' });
      }
      return res.status(201).send('Created');
    }

    default:
      throw new TRPCError({ code: 'METHOD_NOT_SUPPORTED' });
  }
});
