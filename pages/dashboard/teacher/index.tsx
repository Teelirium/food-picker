import { Grade, Student, Teacher } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import Navibar from 'components/Teacher/Navibar';
import styles from 'styles/teacher.module.scss';
import { getServerSideSession } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import idSchema from 'utils/schemas/idSchema';
import verifyRole from 'utils/verifyRole';
import studentsListSchema from 'utils/schemas/studentsListSchema';
import axios from 'axios';

const querySchema = z.object({
  gradeID: idSchema,
  // attendance = присутствие, arrears = задолженности
  selectedList: studentsListSchema.default('attendance'),
});

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
      Grades: true,
    },
  });
  const teacherName = `${teacherData?.middleName}  ${teacherData?.name} ${teacherData?.surname}`;
  const teacherShortName = `${teacherData?.middleName} ${teacherData?.name[0]}. ${teacherData?.surname[0]}.`;
  const grades = teacherData?.Grades;

  const test = ctx.query.selectedList;

  if (!ctx.query.gradeID)
    return {
      redirect: {
        source: '/dashboard/teacher',
        destination: `/dashboard/teacher?gradeID=${
          grades !== undefined ? grades[0].id : console.log('Error')
        }`,
        permanent: false,
      },
    };

  const students = await prisma.student.findMany({
    where: {
      gradeId: +ctx.query.gradeID,
    },
  });

  return {
    props: {
      teacherName,
      teacherShortName,
      grades,
      students,
    },
  };
};

type Props = {
  teacherName: string;
  teacherShortName: string;
  grades: Grade[];
  students: Student[];
};

const TeacherIndexPage: NextPage<Props> = ({ teacherName, teacherShortName, grades, students }) => {
  const router = useRouter();
  const { gradeID, selectedList } = querySchema.parse(router.query);

  return (
    <>
      <Head>
        <title>{teacherShortName}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.containerInner}>{JSON.stringify(students)}</div>
      </div>
    </>
  );
};

export default TeacherIndexPage;
