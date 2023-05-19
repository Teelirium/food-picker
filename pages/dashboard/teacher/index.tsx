import { Grade, Student, StudentPresence } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Checkbox from 'components/Checkbox';
import Navibar from 'components/Teacher/Navibar';
import TeacherModal from 'components/Teacher/TeacherModal';
import useWindowSize from 'hooks/useWindowSize';
import magnifierIcon from 'public/svg/magnifier.svg';
import personsIcon from 'public/svg/persons.svg';
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

type TForm = {
  search: string;
  presence: Record<number, boolean>;
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
  const date = dayjs();

  const defaultPresenceSet = new Set(presenceList.map(({ studentId }) => studentId));
  const defaultPresence = students.reduce((acc: Record<number, boolean>, { id }) => {
    acc[id] = defaultPresenceSet.has(id);
    return acc;
  }, {});

  const { register, handleSubmit, setValue, watch } = useForm<TForm>({
    defaultValues: { presence: defaultPresence },
  });
  const search = watch('search') || '';
  const presence = watch('presence') || {};

  const presenceCount = Object.entries(presence)
    .map(([, isPresent]) => isPresent)
    .reduce((acc, isPresent) => (isPresent ? acc + 1 : acc), 0);

  const filteredStudents = students.filter((student) =>
    student.surname.toLowerCase().includes(search.toLowerCase()),
  );

  const onSubmit = (data: TForm) => {
    saveMutation.mutate(data.presence);
  };

  const selectAll = () => {
    students.forEach(({ id }) => {
      setValue(`presence.${id}` as any, true);
    });
  };

  const windowSize = useWindowSize();

  const saveMutation = useMutation({
    mutationFn: (updatedPresence: Record<number, boolean>) => {
      const studentPresentList = Object.entries(updatedPresence)
        .filter(([, isPresent]) => isPresent)
        .map(([id]) => +id);
      return axios.put(
        '/api/students/presence',
        { students: studentPresentList },
        { params: { gradeId, date: date.toDate() } },
      );
    },
  });

  return (
    <>
      <Head>
        <title>{teacherInitials}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.containerInner}>
          <Navibar grade={currentGrade} selectedPage={page} teacherFio={teacherInitials} />

          <form className={styles.content} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formActions}>
              <button type="button" className={styles.selectAllButton} onClick={selectAll}>
                Выбрать всё
              </button>
              <label className={styles.searchLineWrapper}>
                <input
                  type="text"
                  className={styles.searchLineInput}
                  placeholder="Поиск (по фамилии)"
                  {...register('search')}
                />
                <div className={styles.searchLineIcon}>
                  <Image src={magnifierIcon} alt="" />
                </div>
              </label>
            </div>

            <div className={styles.studentList}>
              {filteredStudents.map((student) => (
                <Checkbox
                  className={styles.checkbox}
                  {...register(`presence.${student.id}` as any)}
                  key={student.id}
                >
                  {(windowSize.width || 0) < 450 ? getInitials(student) : getFullName(student)}
                </Checkbox>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.date}>{date.format('DD.MM.YYYY')}</div>
              <button type="submit" className={styles.saveButton}>
                <span>Сохранить</span>
                <span>–</span>
                <span className={styles.saveButtonNumber}>
                  {presenceCount}
                  <Image className={styles.saveButtonSvg} src={personsIcon} alt="" />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
      {isModalOpen ? <TeacherModal gradeId={gradeId} grades={grades} /> : null}
    </>
  );
};

export default TeacherIndexPage;
