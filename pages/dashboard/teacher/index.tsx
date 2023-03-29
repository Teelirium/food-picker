import { Grade, Student, Teacher } from '@prisma/client';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import styles from 'styles/teacher.module.scss';
import { getServerSideSession } from 'utils/getServerSession';
import { getFullName, getInitials } from 'utils/names';
import prisma from 'utils/prismaClient';
import idSchema from 'utils/schemas/idSchema';
import teacherPage from 'utils/schemas/teacherPageSchema';
import verifyRole from 'utils/verifyRole';

const paramSchema = z.object({
  gradeId: idSchema,
  page: teacherPage.default('attendance'),
});

const paramSchemaServerside = z.object({
  gradeId: idSchema.optional(),
  page: teacherPage.default('attendance'),
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

  return {
    props: {
      teacherFullName,
      teacherInitials,
      gradeId,
      grades,
      students,
    },
  };
};

type Props = {
  teacherFullName: string;
  teacherInitials: string;
  gradeId: number;
  grades: Grade[];
  students: Student[];
};

const TeacherIndexPage: NextPage<Props> = ({
  teacherFullName,
  teacherInitials,
  gradeId,
  grades,
  students,
}) => {
  const router = useRouter();
  const { page } = paramSchema.parse(router.query);

  return (
    <>
      <Head>
        <title>{teacherInitials}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.containerInner}>{JSON.stringify(students)}</div>
      </div>
    </>
  );
};

export default TeacherIndexPage;
