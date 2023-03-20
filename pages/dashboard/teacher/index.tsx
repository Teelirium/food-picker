import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import Navibar from 'components/Teacher/Navibar';
import styles from 'styles/teacher.module.scss';
import { getServerSideSession } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import verifyRole from 'utils/verifyRole';
import { Teacher } from '@prisma/client';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSideSession(ctx);

  if (!session || !verifyRole(session, ['TEACHER'])) {
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

    include: {
      Grade: true,
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
  teacherData: Teacher | null;
  teacherName: string;
};

const TeacherIndexPage: NextPage<Props> = ({ teacherData, teacherName }) => {
  return (
    <>
      <Head>
        <title>Учитель</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.containerInner}></div>
      </div>
    </>
  );
};

export default TeacherIndexPage;
