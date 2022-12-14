import type { GetServerSideProps, NextPage } from 'next'

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
  return {
    redirect: {
      destination: '/login',
      permanent: true
    }
  }
}

const Home: NextPage = () => {
  return (
    <h1>Hi</h1>
  )
}

export default Home
