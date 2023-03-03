import { Dish, DishType } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

import DashboardHeader from 'components/Dashboard/Header';
import DashboardLayout from 'components/Dashboard/Layout';
import DishCardSmall from 'components/DishCardSmall';
import styles from 'styles/dishes.module.scss';
import dishTypeMap from 'utils/dishTypeMap';
import { getServerSideSession } from 'utils/getServerSession';
import isParentOf from 'utils/isParentOf';
import isValidDay from 'utils/isValidDay';
import prisma from 'utils/prismaClient';
import verifyRole from 'utils/verifyRole';

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { type } = ctx.query;
  const studentId = ctx.query.studentId ? +ctx.query.studentId : undefined;
  const day = ctx.query.day ? +ctx.query.day : undefined;
  const session = await getServerSideSession(ctx);

  if (
    !type ||
    studentId === undefined ||
    day === undefined ||
    !isValidDay(day) ||
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
      type: type as DishType,
    },
  });
  return {
    props: {
      dishes,
      type: type as DishType,
      studentId,
      day,
    },
  };
};

type Props = {
  dishes: Dish[];
  type: DishType;
  studentId: number;
  day: number;
};

const Dishes: NextPage<Props> = ({ dishes, type, studentId, day }) => (
  <DashboardLayout>
    <DashboardHeader backUrl={`/dashboard/${studentId}?day=${day}`}>
      <h1>{dishTypeMap[type].toUpperCase()}</h1>
    </DashboardHeader>
    <main className={styles.body}>
      {dishes.map((dish) => (
        <Link
          key={dish.id}
          href={`/dashboard/dishes/${dish.id}?studentId=${studentId}&day=${day}`}
          passHref
          legacyBehavior
        >
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>
            <DishCardSmall dish={dish} />
          </a>
        </Link>
      ))}
    </main>
  </DashboardLayout>
);

export default Dishes;
