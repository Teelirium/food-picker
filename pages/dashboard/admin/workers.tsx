import styles from 'styles/admin.module.css';
import { GetServerSideProps, NextPage } from 'next';
import verifyRole from 'utils/verifyRole';
import { PrismaClient } from '@prisma/client';
import { getServerSideSession } from 'utils/getServerSession';

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
  return <>${adminName}</>;
};

export default WorkersPage;
