import { GetServerSideProps, NextPage } from 'next';
import { Grade, PrismaClient, Student } from '@prisma/client';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import classNames from 'classnames';
import { groupBy } from 'lodash';

import magnifierIcon from 'public/svg/magnifier.svg';
import LeftSideNavibar from 'components/SideNavibar';
import { getServerSideSession } from 'utils/getServerSession';
import verifyRole from 'utils/verifyRole';
import styles from 'styles/adminStudents.module.scss';
import Table, { TColumn } from 'components/Table';
import Pagination, { usePagination } from 'components/Pagination';
import SetStudentModal from 'components/AdminPage/SetStudentModal';

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
  const students = await prisma.student.findMany();
  const grades = await prisma.grade.findMany();
  const adminName = `${adminData?.surname} ${adminData?.name} ${adminData?.middleName}`;

  return {
    props: {
      adminName,
      students,
      grades,
    },
  };
};

type Props = {
  adminName: string;
  students: Student[];
  grades: Grade[];
};

type TForm = {
  search: string;
};
const StudentsPage: NextPage<Props> = ({ adminName, students, grades }) => {
  const router = useRouter();

  const { register, control } = useForm<TForm>({
    defaultValues: { search: '' },
  });
  const search = useWatch({ control, name: 'search' });

  const groupedGradesDict = groupBy(grades, 'number');
  const groupedGrades = Object.entries(groupedGradesDict);

  const [currentGradeNumber, setCurrentGradeNumber] = useState<string>();
  const [currentGradeLetter, setCurrentGradeLetter] = useState<string>();

  const filteredStudents = students.filter((student) => {
    if (!student.surname.toLowerCase().includes(search.toLowerCase())) return false;
    const studentGrade = grades.find(({ id }) => id === student.gradeId);
    if (!studentGrade) return false;
    if (!currentGradeNumber) return true;
    if (studentGrade.number.toString() !== currentGradeNumber) return false;
    if (!currentGradeLetter) return true;
    return studentGrade.letter === currentGradeLetter;
  });

  console.log(filteredStudents);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openedPerson, setOpenedPerson] = useState<Student>();

  const tableColumns: TColumn<Student>[] = [
    {
      key: 'surname',
      title: 'Фамилия',
    },
    {
      key: 'name',
      title: 'Имя',
    },
    {
      key: 'middleName',
      title: 'Отчество',
    },
    {
      key: 'grade',
      title: 'Класс',
      render: ({ record: student }) => {
        const grade = grades.find(({ id }) => id === student.gradeId);
        return grade ? `${grade.number} ${grade.letter}` : null;
      },
    },
    {
      key: 'debt',
      title: 'Задолженность',
      render: ({ record: { debt } }) => `${debt} ₽`,
    },
  ];

  const pagination = usePagination({ pageSize: 3, total: filteredStudents.length });
  const { set: setPagination } = pagination;
  const filteredStudentsPage = filteredStudents.slice(
    pagination.pageSize * (pagination.current - 1),
    pagination.pageSize * pagination.current,
  );

  useEffect(() => {
    setPagination({ total: filteredStudents.length });
  }, [filteredStudents.length, setPagination]);

  const setGradeNumber = (number: string) => {
    setCurrentGradeNumber(number !== currentGradeNumber ? number : undefined);
    setCurrentGradeLetter(undefined);
    setPagination({ current: 1 });
  };

  const setGradeLetter = (letter: string) => {
    setCurrentGradeLetter(letter !== currentGradeLetter ? letter : undefined);
    setPagination({ current: 1 });
  };

  return (
    <>
      <Head>
        <title>Список учеников</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar role="ADMIN" activePage={2} workerName={adminName} />
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <div className={styles.title}>Список учеников</div>
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
            <div className={styles.students}>
              <div className={styles.grades}>
                <div className={styles.gradesTitle}>Класс</div>
                <div className={styles.gradesList}>
                  <div className={styles.gradesListCol}>
                    {groupedGrades.map(([gradeNumber]) => (
                      <button
                        className={classNames(
                          styles.gradeButton,
                          gradeNumber === currentGradeNumber && styles.gradeButtonActive,
                        )}
                        type="button"
                        onClick={() => setGradeNumber(gradeNumber)}
                        key={gradeNumber}
                      >
                        {gradeNumber}
                      </button>
                    ))}
                  </div>

                  <div className={styles.gradesListCol}>
                    {groupedGradesDict[currentGradeNumber as any]?.map((grade) => (
                      <button
                        className={classNames(
                          styles.gradeButton,
                          grade.letter === currentGradeLetter && styles.gradeButtonActive,
                        )}
                        type="button"
                        onClick={() => setGradeLetter(grade.letter)}
                        key={grade.id}
                      >
                        {grade.letter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.studentsList}>
                <Table
                  rowProps={{
                    onClick: (student) => {
                      setOpenedPerson(student);
                      setIsOpenModal(true);
                    },
                  }}
                  columns={tableColumns}
                  className={styles.table}
                  data={filteredStudentsPage}
                />

                <Pagination pagination={pagination} />

                <div className={styles.footer}>
                  <button
                    type="button"
                    className={styles.buttonAddUser}
                    onClick={() => {
                      setOpenedPerson(undefined);
                      setIsOpenModal(true);
                    }}
                  >
                    Добавить пользователя
                  </button>
                  <button type="button" className={styles.buttonExportExcel}>
                    Выгрузить в Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpenModal && (
        <SetStudentModal
          close={() => setIsOpenModal(false)}
          method={openedPerson ? 'UPDATE' : 'POST'}
          student={openedPerson}
          grades={grades}
        />
      )}
    </>
  );
};

export default StudentsPage;
