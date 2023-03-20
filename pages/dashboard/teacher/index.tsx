import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import styles from 'styles/teacher.module.scss';
import { getServerSideSession } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import verifyRole from 'utils/verifyRole';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSideSession(ctx);

  if (!session || !verifyRole(session, ['TEACHER', 'ADMIN'])) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const teacherData = await prisma.teacher.findUnique({
    where: {
      id: +session.user.id,
    },
  });
  const teacherName = `${teacherData?.surname} ${teacherData?.name} ${teacherData?.middleName}`;

  return {
    props: {
      teacherName,
    },
  };
};

type Props = {
  teacherName: string;
};

const TeacherIndexPage: NextPage<Props> = ({ teacherName }) => {
  return (
    <>
      <Head>
        <title>Учитель</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.containerInner}>
          <Navibar />
        </div>
      </div>
    </>
  );
};

export default TeacherIndexPage;
