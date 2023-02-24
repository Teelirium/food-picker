import type { GetServerSideProps, NextPage } from 'next';

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/login',
    permanent: true,
  },
});

const Home: NextPage = () => <h1>Hi</h1>;

export default Home;
