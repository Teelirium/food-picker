import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import LeftSideNavibar from 'components/SideNavibar';
import ThinButton from 'components/ThinButton';
import { ExcelIcon } from 'components/ui/Icons';
import styles from 'styles/admin.module.scss';
import { getServerSessionWithOpts } from 'utils/getServerSession';
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

type Props = {
  adminName: string;
};

const WorkersPage: NextPage<Props> = ({ adminName }) => {
  const router = useRouter();
  const [activeTab, setTab] = useState('Список учителей');

  const { register, handleSubmit } = useForm<{ csv: FileList }>();

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append('csv', data.csv[0]);
    axios
      .post('/api/workers/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      })
      .then((resp) => {
        const dlUrl = URL.createObjectURL(resp.data);
        const link = document.createElement('a');
        link.href = dlUrl;
        link.download = 'workers-resp.csv';
        link.click();
        setTimeout(() => URL.revokeObjectURL(dlUrl), 0);
      })
      .catch((err) => console.error(err));
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>{activeTab}</title>
      </Head>
      <LeftSideNavibar activePage={0} workerName={adminName} />
      <div className={styles.content}>
        <div style={{ margin: 'auto', height: 'max-content', color: 'white' }}>
          <form onSubmit={onSubmit}>
            <input type="file" {...register('csv')} />
            <ThinButton type="submit">
              <ExcelIcon size={30} />
              <span>Загрузить CSV</span>
            </ThinButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkersPage;
