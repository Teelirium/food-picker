import { PrismaClient } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import LeftSideNavibar from 'components/SideNavibar';
import styles from 'styles/adminClasses.module.scss';
import { getServerSideSession } from 'utils/getServerSession';
import verifyRole from 'utils/verifyRole';
import useModal from 'hooks/useModal';
import Table, { TColumn } from 'components/Table';
import Pagination, { usePagination } from 'components/Pagination';
import { trpc } from 'utils/trpc/client';
import { getFullName } from 'utils/names';
import SetClassModal from 'components/AdminPage/SetClassModal';

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

const ClassesPage: NextPage<Props> = ({ adminName }) => {
  const router = useRouter();

  const { data: grades, refetch: refetchGrades } = trpc.grades.getAll.useQuery({});
  const { data: students, refetch: refetchStudents } = trpc.students.getAll.useQuery({});
  const { data: teachers, refetch: refetchTeachers } = trpc.teachers.getAll.useQuery();

  console.log(grades);

  const classModal = useModal();
  const [openedClass, setOpenedClass] = useState<NonNullable<typeof grades>[number]>();

  const sortedGrades = (grades || []).sort((a, b) => {
    const classNumbersDifference = a.number - b.number;
    if (classNumbersDifference !== 0) return classNumbersDifference;

    const classLetterDifference = a.letter.localeCompare(b.letter);
    return classLetterDifference;
  });

  const tableColumns: TColumn<NonNullable<typeof grades>[number]>[] = [
    {
      key: 'grade',
      title: 'Класс',
      render: ({ record }) => `${record.number} ${record.letter}`,
    },
    {
      key: 'teacher',
      title: 'Учитель',
      render: ({ record }) => getFullName(record.teacher),
    },
    {
      key: 'childrenCount',
      title: 'Дети',
      render: ({ record }) =>
        students?.filter(({ gradeId }) => gradeId === record.id).length || '-',
    },
  ];

  const pagination = usePagination({ pageSize: 20, total: grades?.length });
  const { set: setPagination } = pagination;
  const filteredGradesPage = sortedGrades.slice(
    pagination.pageSize * (pagination.current - 1),
    pagination.pageSize * pagination.current,
  );

  useEffect(() => {
    setPagination({ total: sortedGrades.length });
  }, [sortedGrades.length, setPagination]);

  const refetchAllData = () => {
    refetchGrades();
    refetchStudents();
    refetchTeachers();
  };

  return (
    <>
      <Head>
        <title>Список классов</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar activePage={3} workerName={adminName} />
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <div className={styles.title}>Список классов</div>
            <div className={styles.classes}>
              <Table
                rowProps={{
                  onClick: (grade) => {
                    setOpenedClass(grade);
                    classModal.open();
                  },
                }}
                columns={tableColumns}
                className={styles.table}
                data={filteredGradesPage}
              />

              <Pagination pagination={pagination} />

              <div className={styles.footer}>
                <button
                  type="button"
                  className={styles.buttonAddUser}
                  onClick={() => {
                    setOpenedClass(undefined);
                    classModal.open();
                  }}
                >
                  Добавить класс
                </button>
                <button type="button" className={styles.buttonExportExcel}>
                  Выгрузить в Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {classModal.isOpen && (
        <SetClassModal
          close={classModal.close}
          method={openedClass ? 'UPDATE' : 'POST'}
          grade={openedClass}
          teachers={teachers || []}
          onChangeGrade={refetchAllData}
        />
      )}
    </>
  );
};

export default ClassesPage;
