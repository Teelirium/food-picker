import { PrismaClient } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

import CSVForm from 'components/CSVForm';
import LeftSideNavibar from 'components/SideNavibar';
import styles from 'styles/admin.module.scss';
import { getServerSessionWithOpts } from 'utils/getServerSession';
import verifyRole from 'utils/verifyRole';

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSessionWithOpts(ctx);

  if (!session || !verifyRole(session, ['WORKER', 'ADMIN'])) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const adminData = await prisma.worker.findUnique({
    where: {
      id: +session.user.id,
    },
  });

  const adminName = `${adminData?.surname} ${adminData?.name} ${adminData?.middleName}`;

  return {
    props: {
      adminName,
    },
  };
};

type Props = {
  adminName: string;
};

const WorkersPage: NextPage<Props> = ({ adminName }) => {
  const router = useRouter();
  const [activeTab, setTab] = useState('Список учителей');

  return (
    <div className={styles.container}>
      <Head>
        <title>{activeTab}</title>
      </Head>
      <LeftSideNavibar activePage={0} workerName={adminName} />
      <div className={styles.content}>
        <CSVForm url="/api/workers/csv" fileName="workers-resp.csv" />
      </div>
    </div>
  );
};

export default WorkersPage;
