import { Grade, Student, StudentPresence } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import AttendanceList from 'components/Teacher/AttendanceList';
import DebtList from 'components/Teacher/DebtList';
import Navibar from 'components/Teacher/Navibar';
import TeacherModal from 'components/Teacher/TeacherModal';

import styles from 'styles/teacher.module.scss';
import { getServerSideSession } from 'utils/getServerSession';
import { getFullName, getInitials } from 'utils/names';
import prisma from 'utils/prismaClient';
import idSchema from 'utils/schemas/idSchema';
import modalSchema from 'utils/schemas/modalSchema';
import teacherPage from 'utils/schemas/teacherPageSchema';
import verifyRole from 'utils/verifyRole';

const paramSchema = z.object({
  gradeId: idSchema,
  page: teacherPage.default('attendance'),
  isModalOpen: modalSchema.optional(),
});

const paramSchemaServerside = z.object({
  gradeId: idSchema.optional(),
  page: teacherPage.default('attendance'),
  isModalOpen: modalSchema.optional(),
});

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getServerSideSession(ctx);

  if (!session || !verifyRole(session, ['TEACHER'])) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const teacher = await prisma.teacher.findUniqueOrThrow({
    where: {
      id: +session.user.id,
    },
    include: {
      Grades: true,
    },
  });
  const teacherFullName = getFullName(teacher);
  const teacherInitials = getInitials(teacher);
  const grades = teacher.Grades;

  const { gradeId } = paramSchemaServerside.parse(ctx.query);

  if (gradeId === undefined) {
    if (grades.length === 0) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    return {
      redirect: {
        destination: `/dashboard/teacher?gradeId=${grades[0].id}`,
        permanent: false,
      },
    };
  }

  const students = await prisma.student.findMany({
    where: {
      gradeId,
    },
  });

  const presenceList = await prisma.studentPresence.findMany({
    where: {
      student: { gradeId },
      date: dayjs().utc().startOf('day').toDate(),
    },
  });

  return {
    props: {
      teacherFullName,
      teacherInitials,
      gradeId,
      grades,
      students,
      presenceList: JSON.parse(JSON.stringify(presenceList)),
    },
  };
};

type Props = {
  teacherFullName: string;
  teacherInitials: string;
  gradeId: number;
  grades: Grade[];
  students: Student[];
  presenceList: StudentPresence[];
};

const TeacherIndexPage: NextPage<Props> = ({
  teacherFullName,
  teacherInitials,
  gradeId,
  grades,
  students,
  presenceList,
}) => {
  const router = useRouter();
  const { page, isModalOpen } = paramSchema.parse(router.query);
  const grade = grades.find((grade) => grade.id === gradeId);
  const currentGrade = grade !== undefined ? `${grade.number} ${grade.letter}` : '';

  return (
    <>
      <Head>
        <title>{teacherInitials}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.containerInner}>
          <Navibar grade={currentGrade} selectedPage={page} teacherFio={teacherInitials} />

          {page === 'attendance' ? (
            <AttendanceList gradeId={gradeId} presenceList={presenceList} students={students} />
          ) : (
            <DebtList gradeId={gradeId} students={students} />
          )}
        </div>
      </div>
      {isModalOpen ? <TeacherModal gradeId={gradeId} grades={grades} /> : null}
    </>
  );
};

export default TeacherIndexPage;
