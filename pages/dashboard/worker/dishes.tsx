import { Dish } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import LeftSideNavibar from 'components/SideNavibar';
import DishAboutModal from 'components/WorkerPage/DishAboutModal';
import Dishes from 'components/WorkerPage/Dishes';
import AddDishModal from 'components/WorkerPage/Dishes/AddDishModal';
import styles from 'styles/worker.module.css';
import { getServerSideSession } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import dishTypeSchema from 'utils/schemas/dishTypeSchema';
import idSchema from 'utils/schemas/idSchema';
import mealTimeSchema from 'utils/schemas/mealTimeSchema';
import { modalMethodSchema } from 'utils/schemas/modalMethodSchema';
import verifyRole from 'utils/verifyRole';

const querySchema = z.object({
  mealTime: mealTimeSchema.default('Breakfast'),
  dishType: dishTypeSchema.default('PRIMARY'),
  modalMethod: modalMethodSchema.optional(),
  dishId: idSchema.optional(),
});

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSideSession(ctx);

  if (!session || !verifyRole(session, ['WORKER', 'ADMIN'])) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const dishes = await prisma.dish.findMany();
  const workerData = await prisma.worker.findUnique({
    where: {
      id: +session.user.id,
    },
  });
  const workerName = `${workerData?.surname} ${workerData?.name} ${workerData?.middleName}`;
  const userRole = session.user.role;

  return {
    props: {
      dishes,
      workerName,
      userRole,
    },
  };
};

type Props = {
  dishes: Dish[];
  workerName: string;
  userRole: string;
};

const WorkerIndexPage: NextPage<Props> = ({ dishes, workerName, userRole }) => {
  const router = useRouter();
  const [currentDish, setCurrentDish] = useState<Dish | undefined>(undefined);

  const { mealTime, dishType, modalMethod, dishId } = querySchema.parse(router.query);

  useEffect(() => {
    if (dishId) setCurrentDish(dishes.find((e) => e.id === dishId));
  }, [dishId, dishes]);

  return (
    <>
      <Head>
        <title>{userRole}</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar activePage={userRole === 'WORKER' ? 0 : 4} workerName={workerName} />
        <Dishes dishes={dishes} mealTime={mealTime} dishType={dishType} />
      </div>
      {modalMethod === 'POST' || modalMethod === 'UPDATE' ? (
        <AddDishModal dish={currentDish} method={modalMethod} dishType={dishType} />
      ) : null}
      {modalMethod === 'GET' && dishId !== undefined && (
        <DishAboutModal dishId={dishId} allowEditing />
      )}
    </>
  );
};

export default WorkerIndexPage;
