/* eslint-disable no-script-url */
import { Dish } from '@prisma/client';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { z } from 'zod';

import DashboardLayout from 'components/Dashboard/Layout';
import styles from 'styles/dishInfo.module.scss';
import dishTypeMap from 'utils/dishTypeMap';
import { getServerSideSession } from 'utils/getServerSession';
import isParentOf from 'utils/isParentOf';
import prisma from 'utils/prismaClient';
import verifyRole from 'utils/verifyRole';

const querySchema = z.object({
  dishId: z.preprocess((id) => Number(z.string().parse(id)), z.number().min(0)),
  day: z.preprocess((day) => Number(z.string().parse(day)), z.number().min(0).max(6)).optional(),
  studentId: z.preprocess((id) => Number(z.string().parse(id)), z.number().min(0)).optional(),
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
      day: day === undefined ? null : day,
      studentId: studentId === undefined ? null : studentId,
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

  const handleChoose = () => {
    axios
      .post(`/api/preferences?studentId=${studentId}&day=${day}`, { dishId })
      .then(() => {
        router.replace('/dashboard').then(() => {
          router.push(`/dashboard/${studentId}?day=${day}`);
        });
      })
      .catch(alert);
  };

  return (
    <DashboardLayout>
      <header className={styles.header} style={{ backgroundImage: `url(${dish.imgURL})` }}>
        <Link
          href={
            studentId
              ? `/dashboard/dishes/?type=${dish.type}&studentId=${studentId}&day=${day}`
              : 'javascript:history.back()'
          }
        >
          <span className={styles.backBtn}>
            <b>&lt;</b>
          </span>
        </Link>
        <span className={styles.priceTag}>{dish.price} рублей</span>
      </header>
      <main className={styles.body}>
        <h1>{dish.name}</h1>
        <div>{dishTypeMap[dish.type]}</div>
        <div>Вес: {dish.weightGrams} г.</div>
        {day !== null && studentId !== null ? (
          <button className={styles.chooseBtn} onClick={handleChoose} type="button">
            Выбрать блюдо
          </button>
        ) : null}
        <div>Состав: {dish.ingredients}</div>
      </main>
    </DashboardLayout>
  );
};

export default DishInfo;
