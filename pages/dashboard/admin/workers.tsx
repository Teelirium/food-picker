import { GetServerSideProps, NextPage } from 'next';
import { PrismaClient } from '@prisma/client';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import classNames from 'classnames';

import magnifierIcon from 'public/svg/magnifier.svg';
import LeftSideNavibar from 'components/SideNavibar';
import { getServerSideSession } from 'utils/getServerSession';
import verifyRole from 'utils/verifyRole';
import styles from 'styles/adminWorkers.module.scss';
import SetWorkerModal from 'components/AdminPage/SetWorkerModal';
import { trpc } from 'utils/trpc/client';

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

type TForm = {
  search: string;
};

const WorkersPage: NextPage<Props> = ({ adminName }) => {
  const router = useRouter();

  const [activeTab, setTab] = useState<'teachers' | 'workers'>('teachers');
  const title = activeTab === 'teachers' ? 'Список учителей' : 'Список поваров';

  const { register, control } = useForm<TForm>({
    defaultValues: { search: '' },
  });
  const search = useWatch({ control, name: 'search' });

  const { data: workers, refetch: refetchWorkers } = trpc.workers.getAllWorkers.useQuery();
  const { data: teachers, refetch: refetchTeachers } = trpc.teachers.getAll.useQuery();

  const filteredTeachers = (teachers || []).filter((worker) =>
    worker.surname.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredWorkers = (workers || []).filter((worker) =>
    worker.surname.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredPersons = activeTab === 'teachers' ? filteredTeachers : filteredWorkers;

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openedPerson, setOpenedPerson] =
    useState<NonNullable<typeof workers | typeof teachers>[number]>();

  const refetchAllData = () => {
    refetchTeachers();
    refetchWorkers();
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar activePage={0} workerName={adminName} />
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <div className={styles.title}>{title}</div>
            <div className={styles.workers}>
              <div className={styles.workersFilter}>
                <button
                  type="button"
                  className={classNames(
                    styles.roleButton,
                    activeTab === 'teachers' && styles.roleButtonActive,
                  )}
                  onClick={() => setTab('teachers')}
                >
                  Учителя
                </button>
                <button
                  type="button"
                  className={classNames(
                    styles.roleButton,
                    activeTab === 'workers' && styles.roleButtonActive,
                  )}
                  onClick={() => setTab('workers')}
                >
                  Повара
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

              <div className={styles.workersList}>
                {filteredPersons.map((person) => (
                  <div
                    className={styles.workersListItem}
                    key={person.id}
                    onClick={() => {
                      setOpenedPerson(person);
                      setIsOpenModal(true);
                    }}
                  >
                    {person.surname} {person.name} {person.middleName}
                  </div>
                ))}
              </div>

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

      {isOpenModal && (
        <SetWorkerModal
          close={() => setIsOpenModal(false)}
          method={openedPerson ? 'UPDATE' : 'POST'}
          personType={activeTab === 'teachers' ? 'teacher' : 'worker'}
          person={openedPerson}
          onChangeWorker={refetchAllData}
        />
      )}
    </>
  );
};

export default WorkersPage;
