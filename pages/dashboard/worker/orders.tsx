import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

import DishAboutModal from 'components/WorkerPage/DishAboutModal';
import LeftSideNavibar from 'components/WorkerPage/LeftSideNavibar';
import Orders from 'components/WorkerPage/Orders';
import { GradeInfo } from 'pages/api/grades/total-orders';
import styles from 'styles/worker.module.css';
import { getServerSideSession } from 'utils/getServerSession';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';
import idSchema from 'utils/schemas/idSchema';
import verifyRole from 'utils/verifyRole';

const prisma = new PrismaClient();

const querySchema = z.object({
  day: dayOfWeekSchema.default(0),
  dishId: idSchema.optional(),
  breakIndex: z.coerce.number().min(0).max(7).default(0),
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

  const workerData = await prisma.worker.findUnique({
    where: {
      id: +session.user.id,
    },
  });
  const workerName = `${workerData?.surname} ${workerData?.name} ${workerData?.middleName}`;

  return {
    props: {
      workerName,
    },
  };
};

type Props = {
  workerName: string;
};

const OrdersPage: NextPage<Props> = ({ workerName }) => {
  const router = useRouter();
  const [orders, setOrders] = useState<GradeInfo>();
  const { day, dishId } = querySchema.parse(router.query);

  useEffect(() => {
    axios
      .get(`/api/grades/total-orders?day=${day}`)
      .then((response) => setOrders(response.data))
      .catch((err) => console.error(err.message));
  }, [day]);

  return (
    <>
      <Head>
        <title>Заказы</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar activePage={2} workerName={workerName} />
        <Orders orders={orders} weekDay={day} />
      </div>
      {dishId !== undefined ? <DishAboutModal dishId={dishId} /> : null}
    </>
  );
};

export default OrdersPage;
