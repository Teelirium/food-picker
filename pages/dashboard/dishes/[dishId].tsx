import { Dish } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { z } from 'zod';

import DashboardLayout from 'components/Dashboard/Layout';
import { ChevronLeftIcon } from 'components/ui/Icons';
import styles from 'styles/dishInfo.module.scss';
import dishTypeMap from 'utils/dishTypeMap';
import { getServerSideSession } from 'utils/getServerSession';
import isParentOf from 'utils/isParentOf';
import { toRubles } from 'utils/localisation';
import { useSetPreferenceMutation } from 'utils/mutations';
import prisma from 'utils/prismaClient';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';
import idSchema from 'utils/schemas/idSchema';
import verifyRole from 'utils/verifyRole';

const querySchema = z.object({
  dishId: idSchema,
  day: dayOfWeekSchema.optional(),
  studentId: idSchema.optional(),
});

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { dishId, day, studentId } = querySchema.parse(ctx.query);
  const session = await getServerSideSession(ctx);

  if (
    !session ||
    !verifyRole(session, ['PARENT', 'ADMIN']) ||
    (studentId !== undefined &&
      !(await isParentOf(session, studentId)) &&
      session.user.role === 'PARENT')
  ) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  const dish = await prisma.dish.findUniqueOrThrow({
    where: {
      id: dishId,
    },
  });

  return {
    props: {
      dish,
      dishId,
      day: day ?? null,
      studentId: studentId ?? null,
    },
  };
};

type Props = {
  dish: Dish;
  dishId: number;
  day: number | null;
  studentId: number | null;
};

const DishInfo: NextPage<Props> = ({ dish, day, studentId, dishId }) => {
  const router = useRouter();

  const setPreferenceMutation = useSetPreferenceMutation(() =>
    router.replace('/dashboard').then(() => {
      router.push(`/dashboard/${studentId}?day=${day}`);
    }),
  );

  function handleChoose() {
    if (studentId === null || day === null) return;

    setPreferenceMutation.mutate({ studentId, day, dishId });
  }

  return (
    <DashboardLayout>
      <header className={styles.header} style={{ backgroundImage: `url(${dish.imgURL})` }}>
        <button
          type="button"
          tabIndex={0}
          onClick={() => {
            if (studentId !== null) {
              return router.push(
                `/dashboard/dishes/?type=${dish.type}&studentId=${studentId}&day=${day}`,
              );
            }
            router.back();
          }}
        >
          <span className={styles.backBtn}>
            <ChevronLeftIcon />
          </span>
        </button>
        <span className={styles.priceTag}>{toRubles(dish.price)}</span>
      </header>
      <main className={styles.body}>
        <h1>{dish.name}</h1>
        <div>{dishTypeMap[dish.type]}</div>
        <div>Вес: {dish.weightGrams} г.</div>
        {day !== null && studentId !== null && (
          <button className={styles.chooseBtn} onClick={handleChoose} type="button">
            Выбрать блюдо
          </button>
        )}
        <div>Состав: {dish.ingredients}</div>
      </main>
    </DashboardLayout>
  );
};

export default DishInfo;
