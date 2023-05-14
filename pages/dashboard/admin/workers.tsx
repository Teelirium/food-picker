import styles from 'styles/admin.module.scss';
import { GetServerSideProps, NextPage } from 'next';
import verifyRole from 'utils/verifyRole';
import { PrismaClient } from '@prisma/client';
import { getServerSideSession } from 'utils/getServerSession';
import Head from 'next/head';
import LeftSideNavibar from 'components/LeftSideNavibar';

import { useRouter } from 'next/router';
import { useState } from 'react';

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
    <>
      <Head>
        <title>{activeTab}</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar activePage={1} workerName={adminName} />
        <div className={styles.content}></div>
      </div>
    </>
  );
};

export default WorkersPage;
