import styles from 'styles/admin.module.scss';
import { GetServerSideProps, NextPage } from 'next';
import verifyRole from 'utils/verifyRole';
import { PrismaClient } from '@prisma/client';
import { getServerSideSession } from 'utils/getServerSession';
import Head from 'next/head';
import LeftSideNavibar from 'components/SideNavibar';

import { useRouter } from 'next/router';

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
        <LeftSideNavibar role="ADMIN" activePage={2} workerName={adminName} />
        <div className={styles.content}></div>
      </div>
    </>
  );
};

export default StudentsPage;
