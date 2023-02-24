import { Dish, PrismaClient } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import Dishes from 'components/WorkerPage/Dishes';
import LeftSideNavibar from 'components/WorkerPage/LeftSideNavibar';
import styles from 'styles/worker.module.css';
import { getServerSideSession } from 'utils/getServerSession';
import verifyRole from 'utils/verifyRole';

const prisma = new PrismaClient();

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

  return {
    props: {
      dishes,
    },
  };
};

type Props = {
  dishes: Dish[];
};

const WorkerIndexPage: NextPage<Props> = ({ dishes }) => (
  <>
    <Head>
      <title>Блюда</title>
    </Head>
    <div className={styles.container}>
      <LeftSideNavibar activePage={1} />
      <Dishes dishes={dishes} />
    </div>
  </>
);

export default WorkerIndexPage;
