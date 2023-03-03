import { Dish } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Dishes from 'components/WorkerPage/Dishes';
import LeftSideNavibar from 'components/WorkerPage/LeftSideNavibar';
import styles from 'styles/worker.module.css';
import { getServerSideSession } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import verifyRole from 'utils/verifyRole';

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
    }
  });
  const workerName = `${workerData?.surname} ${workerData?.name} ${workerData?.middleName}`

  return {
    props: {
      dishes,
      workerName,
    },
  };
};

type Props = {
  dishes: Dish[];
  workerName: string;
};

const WorkerIndexPage: NextPage<Props> = ({ dishes, workerName }) => (
  <>
    <Head>
      <title>Блюда</title>
    </Head>
    <div className={styles.container}>
      <LeftSideNavibar activePage={1} workerName={workerName} />
      <Dishes dishes={dishes} />
    </div>
  </>
);

export default WorkerIndexPage;
