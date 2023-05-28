import { PrismaClient } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import LeftSideNavibar from 'components/SideNavibar';
import StandardMenu from 'components/WorkerPage/StandardMenu';
import styles from 'styles/worker.module.css';
import { getServerSideSession } from 'utils/getServerSession';
import verifyRole from 'utils/verifyRole';

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
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

type PageProps = {
  userRole: string;
  workerName: string;
};

const StandardMenuPage: NextPage<PageProps> = ({ userRole, workerName }) => {
  return (
    <>
      <Head>
        <title>Стандартное питание</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar activePage={userRole === 'WORKER' ? 2 : 6} workerName={workerName} />
        <StandardMenu />
      </div>
    </>
  );
};

export default StandardMenuPage;
