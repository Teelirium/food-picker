import { GetServerSideProps, NextPage } from 'next';

import ParentPage from 'components/ParentPage';
import { getServerSideSession } from 'utils/getServerSession';
import verifyRole from 'utils/verifyRole';

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

const Index: NextPage = () => <ParentPage />;

export default Index;
