import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/dashboard/admin/workers',
      permanent: true,
    },
  };
};

const Admin = () => {
  return null;
};

export default Admin;
