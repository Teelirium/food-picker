import { Dish } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { z } from 'zod';

import DashboardHeader from 'components/Dashboard/Header';
import DashboardLayout from 'components/Dashboard/Layout';
import DishCard from 'components/WorkerPage/Dishes/DishCard';
import styles from 'styles/dishes.module.scss';
import dishTypeMap from 'utils/dishTypeMap';
import { getServerSideSession } from 'utils/getServerSession';
import isParentOf from 'utils/isParentOf';
import { useSetPreferenceMutation } from 'utils/mutations';
import prisma from 'utils/prismaClient';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';
import dishTypeSchema from 'utils/schemas/dishTypeSchema';
import idSchema from 'utils/schemas/idSchema';
import verifyRole from 'utils/verifyRole';

const paramSchema = z.object({
  type: dishTypeSchema,
  studentId: idSchema,
  day: dayOfWeekSchema,
});

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { type, studentId, day } = paramSchema.parse(ctx.query);
  const session = await getServerSideSession(ctx);

  if (
    !session ||
    !verifyRole(session, ['PARENT', 'ADMIN']) ||
    (!(await isParentOf(session, +studentId)) && session.user.role === 'PARENT')
  ) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  const dishes = await prisma.dish.findMany({
    where: {
      type,
    },
  });

  return {
    props: {
      dishes,
    },
  };
};

type Props = {
  dishes: Dish[];
};

export default function Dishes({ dishes }: Props) {
  const router = useRouter();
  const { type, studentId, day } = paramSchema.parse(router.query);
  const backUrl = `/dashboard/${studentId}?day=${day}`;

  const setPreferenceMutation = useSetPreferenceMutation(() => {
    router.push(backUrl);
  });

  return (
    <DashboardLayout>
      <DashboardHeader backUrl={backUrl}>
        <h1>{dishTypeMap[type].toUpperCase()}</h1>
      </DashboardHeader>
      <main className={styles.body}>
        {dishes.map((dish, idx) => (
          <div key={dish.id} tabIndex={idx}>
            <DishCard
              dish={dish}
              onClick={() =>
                router.push(`/dashboard/dishes/${dish.id}?studentId=${studentId}&day=${day}`)
              }
              onButtonClick={() => {
                setPreferenceMutation.mutate({ studentId, day, dishId: dish.id });
              }}
            />
          </div>
        ))}
      </main>
    </DashboardLayout>
  );
}
