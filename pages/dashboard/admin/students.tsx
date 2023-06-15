import classNames from 'classnames';
import { groupBy } from 'lodash';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import SetStudentModal from 'components/AdminPage/SetStudentModal';
import Icon from 'components/Icon';
import Pagination, { usePagination } from 'components/Pagination';
import LeftSideNavibar from 'components/SideNavibar';
import Table, { TColumn } from 'components/Table';
import magnifierIcon from 'public/svg/magnifier.svg';
import styles from 'styles/adminStudents.module.scss';
import { getServerSessionWithOpts } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import { trpc } from 'utils/trpc/client';
import verifyRole from 'utils/verifyRole';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSessionWithOpts(ctx);

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

type TForm = {
  search: string;
};
const StudentsPage: NextPage<Props> = ({ adminName }) => {
  const router = useRouter();

  const { register, control } = useForm<TForm>({
    defaultValues: { search: '' },
  });
  const search = useWatch({ control, name: 'search' });

  const { data: students, refetch: refetchStudents } = trpc.students.getAll.useQuery({});
  const { data: grades, refetch: refetchGrades } = trpc.grades.getAll.useQuery({});

  const sortedGrades = (grades || []).sort((a, b) => {
    const classNumbersDifference = a.number - b.number;
    if (classNumbersDifference !== 0) return classNumbersDifference;

    const classLetterDifference = a.letter.localeCompare(b.letter);
    return classLetterDifference;
  });

  const groupedGradesDict = groupBy(sortedGrades, 'number');
  const groupedGrades = Object.entries(groupedGradesDict);

  const [currentGradeNumber, setCurrentGradeNumber] = useState<string>();
  const [currentGradeLetter, setCurrentGradeLetter] = useState<string>();

  const filteredStudents = (students || []).filter((student) => {
    if (!student.surname.toLowerCase().includes(search.toLowerCase())) return false;
    if (!currentGradeNumber) return true;
    if (student.grade?.number.toString() !== currentGradeNumber) return false;
    if (!currentGradeLetter) return true;
    return student.grade?.letter === currentGradeLetter;
  });

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openedStudent, setOpenedPerson] = useState<NonNullable<typeof students>[number]>();

  const tableColumns: TColumn<NonNullable<typeof students>[number]>[] = [
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
      render: ({ record: student }) => `${student.grade?.number} ${student.grade?.letter}`,
    },
    {
      key: 'debt',
      title: 'Задолженность',
      render: ({ record: { debt } }) => `${debt} ₽`,
    },
  ];

  const pagination = usePagination({ pageSize: 20, total: filteredStudents.length });
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

  const refetchAllData = () => {
    refetchStudents();
    refetchGrades();
  };

  return (
    <>
      <Head>
        <title>Список учеников</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar activePage={2} workerName={adminName} />
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
                    <Icon.Plus />
                    Добавить ученика
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
          method={openedStudent ? 'UPDATE' : 'POST'}
          student={openedStudent}
          grades={grades || []}
          onChangeStudent={refetchAllData}
        />
      )}
    </>
  );
};

export default StudentsPage;
