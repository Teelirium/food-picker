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
    <></>
  )
}

export default Home
