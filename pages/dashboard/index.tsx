import { GetServerSideProps, NextPage } from 'next';
import ParentPage from 'components/ParentPage';
import { getServerSideSession } from 'utils/getServerSession';
import verifyRole from 'utils/verifyRole';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSideSession(ctx);
  if (!session || !verifyRole(session, ['PARENT'])) {
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

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Выбор ребёнка и дня недели</title>
      </Head>
      <ParentPage />
    </>
  );
};

export default Index;
