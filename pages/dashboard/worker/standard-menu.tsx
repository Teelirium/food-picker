import { PrismaClient } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import LeftSideNavibar from 'components/LeftSideNavibar';
import StandardMenu from 'components/WorkerPage/StandardMenu';
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

const StandardMenuPage: NextPage<Props> = ({ workerName }) => {
  return (
    <>
      <Head>
        <title>Стандартное питание</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar activePage={3} workerName={workerName} />
        <StandardMenu />
      </div>
    </>
  );
};

export default StandardMenuPage;
