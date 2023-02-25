import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import LeftSideNavibar from 'components/WorkerPage/LeftSideNavibar';
import StandardMenu from 'components/WorkerPage/StandardMenu';
import styles from 'styles/worker.module.css';
import { getServerSideSession } from 'utils/getServerSession';
import verifyRole from 'utils/verifyRole';

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

  return {
    props: {},
  };
};

const StandardMenuPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Стандартное питание</title>
      </Head>
      <div className={styles.container}>
        <LeftSideNavibar activePage={3} />
        <StandardMenu />
      </div>
    </>
  );
};

export default StandardMenuPage;
