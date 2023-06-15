import { PrismaClient } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import SetParentModal from 'components/AdminPage/SetParentModal';
import Icon from 'components/Icon';
import Pagination, { usePagination } from 'components/Pagination';
import LeftSideNavibar from 'components/SideNavibar';
import Table, { TColumn } from 'components/Table';
import useModal from 'hooks/useModal';
import magnifierIcon from 'public/svg/magnifier.svg';
import styles from 'styles/adminParents.module.scss';
import { getServerSessionWithOpts } from 'utils/getServerSession';
import { trpc } from 'utils/trpc/client';
import verifyRole from 'utils/verifyRole';

const prisma = new PrismaClient();

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

type PageProps = {
  adminName: string;
};

type TForm = {
  search: string;
};

const ParentsPage: NextPage<PageProps> = ({ adminName }) => {
  const router = useRouter();

  const { register, control } = useForm<TForm>({
    defaultValues: { search: '' },
  });
  const search = useWatch({ control, name: 'search' });

  const { data: parents, refetch: refetchParents } = trpc.parents.getAll.useQuery();
  const { data: students, refetch: refetchStudents } = trpc.students.getAll.useQuery({});

  const filteredParents = (parents || []).filter((parent) =>
    parent.surname.toLowerCase().includes(search.toLowerCase()),
  );

  const parentModal = useModal();
  const [openedPerson, setOpenedPerson] = useState<NonNullable<typeof parents>[number]>();

  const tableColumns: TColumn<NonNullable<typeof parents>[number]>[] = [
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
      key: 'childrenCount',
      title: 'Дети',
      render: ({ record }) => record.parentStudent.length || '-',
    },
  ];

  const pagination = usePagination({ pageSize: 20, total: filteredParents.length });
  const { set: setPagination } = pagination;
  const filteredParentsPage = filteredParents.slice(
    pagination.pageSize * (pagination.current - 1),
    pagination.pageSize * pagination.current,
  );

  useEffect(() => {
    setPagination({ total: filteredParents.length });
  }, [filteredParents.length, setPagination]);

  const refetchAllData = () => {
    refetchParents();
    refetchStudents();
  };

  return (
    <>
      <Head>
        <title>Список родителей</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar activePage={1} workerName={adminName} />
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <div className={styles.title}>Список родителей</div>
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
            <div className={styles.parents}>
              <Table
                rowProps={{
                  onClick: (parent) => {
                    setOpenedPerson(parent);
                    parentModal.open();
                  },
                }}
                columns={tableColumns}
                className={styles.table}
                data={filteredParentsPage}
              />

              <Pagination pagination={pagination} />

              <div className={styles.footer}>
                <button
                  type="button"
                  className={styles.buttonAddUser}
                  onClick={() => {
                    setOpenedPerson(undefined);
                    parentModal.open();
                  }}
                >
                  <Icon.Plus />
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

      {parentModal.isOpen && (
        <SetParentModal
          close={parentModal.close}
          method={openedPerson ? 'UPDATE' : 'POST'}
          parent={openedPerson}
          students={students || []}
          onChangeParent={refetchAllData}
        />
      )}
    </>
  );
};

export default ParentsPage;
