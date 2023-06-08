import { PrismaClient } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import LeftSideNavibar from 'components/SideNavibar';
import styles from 'styles/admin.module.scss';
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

const StudentsPage: NextPage<Props> = ({ adminName }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Список учеников</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar activePage={2} workerName={adminName} />
        <div className={styles.content} />
      </div>
    </>
  );
};

export default StudentsPage;
