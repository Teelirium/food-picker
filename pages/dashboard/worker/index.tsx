import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/dashboard/worker/dishes',
      permanent: true,
    },
  };
};

const Worker = () => {
  return null;
};

export default Worker;
