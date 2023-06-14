import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { z } from 'zod';

import LeftSideNavibar from 'components/SideNavibar';
import DishAboutModal from 'components/WorkerPage/DishAboutModal';
import Orders from 'components/WorkerPage/Orders';
import styles from 'styles/worker.module.css';
import { getServerSideSession } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';
import idSchema from 'utils/schemas/idSchema';
import verifyRole from 'utils/verifyRole';

const paramSchema = z.object({
  day: dayOfWeekSchema.default(0),
  dishId: idSchema.optional(),
  breakIndex: z.coerce.number().min(0).max(7).default(0),
});

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
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
  const userRole = session.user.role;

  return {
    props: {
      userRole,
      workerName,
    },
  };
};

type Props = {
  userRole: string;
  workerName: string;
};

const OrdersPage: NextPage<Props> = ({ userRole, workerName }) => {
  const router = useRouter();
  const { day, dishId } = paramSchema.parse(router.query);

  return (
    <div className={styles.container}>
      <Head>
        <title>Заказы</title>
      </Head>
      <LeftSideNavibar activePage={userRole === 'WORKER' ? 1 : 5} workerName={workerName} />
      <Orders weekDay={day} />
      {dishId !== undefined && <DishAboutModal dishId={dishId} />}
    </div>
  );
};

export default OrdersPage;
